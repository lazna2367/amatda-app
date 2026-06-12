export type Pack = {
  id: string;
  user_id: string;
  name: string;
  emoji: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Trigger = {
  id: string;
  pack_id: string;
  type: 'departure' | 'arrival';
  lat: number | null;
  lng: number | null;
  radius_meters: number;
  label: string | null;
  reminder_note: string | null;
  is_active: boolean;
  created_at: string;
};

export type Item = {
  id: string;
  trigger_id: string;
  name: string;
  emoji: string | null;
  sort_order: number;
  created_at: string;
};

export type TriggerWithItems = Trigger & { items: Item[] };
export type PackWithTriggers = Pack & { triggers: TriggerWithItems[] };
