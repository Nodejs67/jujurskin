"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Check, Clock, Sun, Moon } from "lucide-react";

type ReminderSettings = {
  am_enabled: boolean;
  am_time: string;
  pm_enabled: boolean;
  pm_time: string;
};

const DEFAULT: ReminderSettings = {
  am_enabled: false,
  am_time: "07:00",
  pm_enabled: false,
  pm_time: "21:00",
};

const STORAGE_KEY = "jujurskin_reminders";

function saveSettings(s: ReminderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function loadSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function ReminderSetup() {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSettings(loadSettings());
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  if (!mounted) return null;

  const notifSupported = "Notification" in window;

  async function requestPermission() {
    if (!notifSupported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  function update(patch: Partial<ReminderSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    scheduleChecks(settings);
    setTimeout(() => setSaved(false), 2500);
  }

  // Fire test notification immediately
  function testNotif(label: string) {
    if (permission !== "granted") return;
    new Notification(`JujurSkin — ${label}`, {
      body: `Saatnya rutinitas ${label} kamu! 🌿`,
      icon: "/favicon.ico",
    });
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold">Pengingat Rutinitas</p>
        </div>
        {!notifSupported && (
          <span className="text-xs text-muted-foreground">Browser tidak support notifikasi</span>
        )}
        {notifSupported && permission === "denied" && (
          <span className="text-xs text-red-400">Notifikasi diblokir di browser</span>
        )}
        {notifSupported && permission === "default" && (
          <button
            onClick={requestPermission}
            className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
          >
            Izinkan Notifikasi
          </button>
        )}
        {notifSupported && permission === "granted" && (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <Check className="w-3 h-3" /> Aktif
          </span>
        )}
      </div>

      {/* AM */}
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <p className="text-sm font-medium">Rutinitas Pagi (AM)</p>
          </div>
          <button
            onClick={() => update({ am_enabled: !settings.am_enabled })}
            className={`w-10 h-5 rounded-full transition-colors relative ${settings.am_enabled ? "bg-primary" : "bg-border"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.am_enabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
        {settings.am_enabled && (
          <div className="flex items-center gap-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="time"
              value={settings.am_time}
              onChange={(e) => update({ am_time: e.target.value })}
              className="text-sm bg-transparent border-b border-border focus:border-primary outline-none text-foreground"
            />
            {permission === "granted" && (
              <button
                onClick={() => testNotif("Pagi")}
                className="text-xs text-muted-foreground hover:text-foreground ml-auto transition-colors"
              >
                Test notifikasi
              </button>
            )}
          </div>
        )}
      </div>

      {/* PM */}
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <p className="text-sm font-medium">Rutinitas Malam (PM)</p>
          </div>
          <button
            onClick={() => update({ pm_enabled: !settings.pm_enabled })}
            className={`w-10 h-5 rounded-full transition-colors relative ${settings.pm_enabled ? "bg-primary" : "bg-border"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.pm_enabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
        {settings.pm_enabled && (
          <div className="flex items-center gap-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="time"
              value={settings.pm_time}
              onChange={(e) => update({ pm_time: e.target.value })}
              className="text-sm bg-transparent border-b border-border focus:border-primary outline-none text-foreground"
            />
            {permission === "granted" && (
              <button
                onClick={() => testNotif("Malam")}
                className="text-xs text-muted-foreground hover:text-foreground ml-auto transition-colors"
              >
                Test notifikasi
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
          saved
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {saved ? "✓ Tersimpan!" : "Simpan Pengingat"}
      </button>

      <p className="text-xs text-muted-foreground/60 text-center">
        Notifikasi hanya muncul saat browser terbuka. Untuk pengingat background, tambah JujurSkin ke home screen.
      </p>
    </div>
  );
}

// Poll setiap menit untuk cek apakah waktunya reminder — dipanggil dari rutinitas page
export function scheduleChecks(settings?: ReminderSettings) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const s = settings ?? loadSettings();

  const check = () => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (s.am_enabled && hhmm === s.am_time) {
      new Notification("JujurSkin — Rutinitas Pagi 🌅", {
        body: "Saatnya rutinitas skincare pagi kamu! Mulai dengan sunscreen.",
        icon: "/favicon.ico",
      });
    }
    if (s.pm_enabled && hhmm === s.pm_time) {
      new Notification("JujurSkin — Rutinitas Malam 🌙", {
        body: "Saatnya rutinitas skincare malam kamu! Jangan skip double cleansing.",
        icon: "/favicon.ico",
      });
    }
  };

  check();
  const interval = setInterval(check, 60000);
  return () => clearInterval(interval);
}
