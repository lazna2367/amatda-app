import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export const GEOFENCING_TASK = 'amatda-geofencing';
const META_KEY = 'amatda_trigger_meta';

type TriggerMeta = {
  packName: string;
  packEmoji: string;
  triggerType: 'departure' | 'arrival';
  items: string[];
};

// Must be at module level — registers the background task handler
if (Platform.OS !== 'web') {
  TaskManager.defineTask(GEOFENCING_TASK, async ({ data, error }: TaskManager.TaskManagerTaskBody) => {
    if (error) return;

    const { eventType, region } = data as {
      eventType: Location.GeofencingEventType;
      region: Location.LocationRegion;
    };

    const metaMapStr = await AsyncStorage.getItem(META_KEY);
    if (!metaMapStr) return;

    const metaMap: Record<string, TriggerMeta> = JSON.parse(metaMapStr);
    const meta = metaMap[region.identifier];
    if (!meta) return;

    const isExiting = eventType === Location.GeofencingEventType.Exit;
    const isEntering = eventType === Location.GeofencingEventType.Enter;
    const isDepartureEvent = isExiting && meta.triggerType === 'departure';
    const isArrivalEvent = isEntering && meta.triggerType === 'arrival';

    if (!isDepartureEvent && !isArrivalEvent) return;

    const previewItems = meta.items.slice(0, 3).join(', ');
    const body = meta.triggerType === 'departure'
      ? previewItems ? `챙기셨나요? ${previewItems}` : '챙길 것을 확인해보세요!'
      : previewItems ? `도착했어요! ${previewItems}` : '챙길 것을 확인해보세요.';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${meta.packEmoji} ${meta.packName}`,
        body,
        data: { triggerId: region.identifier },
        categoryIdentifier: 'checklist',
      },
      trigger: null,
    });
  });
}

type ActiveTrigger = {
  id: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  triggerType: 'departure' | 'arrival';
  packName: string;
  packEmoji: string;
  items: string[];
};

async function startGeofencing(triggers: ActiveTrigger[]) {
  const metaMap: Record<string, TriggerMeta> = {};
  triggers.forEach((t) => {
    metaMap[t.id] = {
      packName: t.packName,
      packEmoji: t.packEmoji,
      triggerType: t.triggerType,
      items: t.items,
    };
  });
  await AsyncStorage.setItem(META_KEY, JSON.stringify(metaMap));

  const regions: Location.LocationRegion[] = triggers.map((t) => ({
    identifier: t.id,
    latitude: t.lat,
    longitude: t.lng,
    radius: t.radiusMeters,
    notifyOnEnter: t.triggerType === 'arrival',
    notifyOnExit: t.triggerType === 'departure',
  }));

  await Location.startGeofencingAsync(GEOFENCING_TASK, regions);
}

async function stopGeofencing() {
  const running = await Location.hasStartedGeofencingAsync(GEOFENCING_TASK);
  if (running) await Location.stopGeofencingAsync(GEOFENCING_TASK);
}

// Fetch active triggers from Supabase and restart geofencing
export async function syncGeofencing(userId: string) {
  if (Platform.OS === 'web') return;

  const { status } = await Location.getBackgroundPermissionsAsync();
  if (status !== 'granted') return;

  await stopGeofencing();

  const { data } = await supabase
    .from('triggers')
    .select(`
      id, type, lat, lng, radius_meters,
      items ( name ),
      packs!inner ( name, emoji, user_id )
    `)
    .eq('is_active', true)
    .not('lat', 'is', null)
    .eq('packs.user_id', userId);

  if (!data || data.length === 0) return;

  const triggers: ActiveTrigger[] = (data as any[]).map((t) => ({
    id: t.id,
    lat: t.lat,
    lng: t.lng,
    radiusMeters: t.radius_meters,
    triggerType: t.type as 'departure' | 'arrival',
    packName: t.packs?.name ?? '가방',
    packEmoji: t.packs?.emoji ?? '💼',
    items: (t.items ?? []).map((i: { name: string }) => i.name),
  }));

  await startGeofencing(triggers);
}

export async function requestBackgroundLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: fg } = await Location.getForegroundPermissionsAsync();
  if (fg !== 'granted') return false;
  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  return bg === 'granted';
}
