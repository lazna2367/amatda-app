#!/usr/bin/env bash
# Claude Code 알림 hook — OS 감지 후 비프 + 토스트.
# 호출: bash .claude/hooks/notify.sh <event>
#   event: notification (입력 대기) | stop (응답 완료)
#
# 정책: Notification은 비프 + 시각 토스트 (자리 비웠을 때 놓치지 않게)
#       Stop도 비프 + 시각 토스트 — 알림센터 도배가 거슬리면 stop 분기의
#       토스트 호출만 다시 제거
#
# Windows: 추가 설치 없이 동작 (WinRT API 직접 호출).
#          단, "시스템 → 알림" 토글이 ON이어야 토스트가 화면에 표시됨.
# macOS:   osascript 내장 명령 — 추가 설치 없이 동작.
# Linux:   paplay / notify-send (있으면 사용, 없으면 터미널 벨).

event="${1:-notification}"

case "$(uname -s)" in
  Darwin)
    if [ "$event" = "notification" ]; then
      osascript -e 'beep 2'
      osascript -e 'display notification "입력을 기다리고 있어요" with title "Claude Code"'
    else
      osascript -e 'beep 1'
      osascript -e 'display notification "응답 완료" with title "Claude Code"'
    fi
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    if [ "$event" = "notification" ]; then
      powershell -NoProfile -Command "[console]::beep(880, 200); Start-Sleep -Milliseconds 80; [console]::beep(1108, 200)" >/dev/null 2>&1
      # WinRT 토스트 — BurntToast 같은 외부 모듈 불필요. AppId는 시스템 등록된
      # 'Microsoft.Windows.Shell.RunDialog'를 빌려써서 알림센터 기록까지 남김.
      powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "
        [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null;
        [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null;
        \$xml = New-Object Windows.Data.Xml.Dom.XmlDocument;
        \$xml.LoadXml('<toast><visual><binding template=\"ToastGeneric\"><text>Claude Code</text><text>입력을 기다리고 있어요</text></binding></visual></toast>');
        \$t = [Windows.UI.Notifications.ToastNotification]::new(\$xml);
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Microsoft.Windows.Shell.RunDialog').Show(\$t)
      " >/dev/null 2>&1 &
    else
      powershell -NoProfile -Command "[console]::beep(660, 250)" >/dev/null 2>&1
      powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "
        [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null;
        [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null;
        \$xml = New-Object Windows.Data.Xml.Dom.XmlDocument;
        \$xml.LoadXml('<toast><visual><binding template=\"ToastGeneric\"><text>Claude Code</text><text>응답 완료</text></binding></visual></toast>');
        \$t = [Windows.UI.Notifications.ToastNotification]::new(\$xml);
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Microsoft.Windows.Shell.RunDialog').Show(\$t)
      " >/dev/null 2>&1 &
    fi
    ;;
  Linux*)
    if [ "$event" = "notification" ]; then
      if command -v paplay >/dev/null 2>&1; then
        paplay /usr/share/sounds/freedesktop/stereo/message.oga 2>/dev/null
      else
        printf '\a'
      fi
      if command -v notify-send >/dev/null 2>&1; then
        notify-send "Claude Code" "입력을 기다리고 있어요" 2>/dev/null
      fi
    else
      if command -v paplay >/dev/null 2>&1; then
        paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null
      else
        printf '\a'
      fi
      if command -v notify-send >/dev/null 2>&1; then
        notify-send "Claude Code" "응답 완료" 2>/dev/null
      fi
    fi
    ;;
esac

exit 0
