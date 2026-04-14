"use client";

import { useState, useEffect } from "react";
import { Activity, Wifi, WifiOff, Clock, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface HealthStatus {
  url: string;
  status: number;
  isUp: boolean;
  responseTime: number;
  checkedAt: string;
  error?: string;
}

interface HealthMonitorProps {
  toolUrl: string;
  toolName: string;
}

export function HealthMonitor({ toolUrl, toolName }: HealthMonitorProps) {
  const { t } = useI18n();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HealthStatus[]>([]);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/health?url=${encodeURIComponent(toolUrl)}`);
      const data: HealthStatus = await res.json();
      setHealth(data);

      setHistory((prev) => [data, ...prev].slice(0, 10));

      const storageKey = `health-${toolUrl}`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updated = [data, ...stored].slice(0, 30);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      setHealth({
        url: toolUrl,
        status: 0,
        isUp: false,
        responseTime: 0,
        checkedAt: new Date().toISOString(),
        error: "check failed",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const storageKey = `health-${toolUrl}`;
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (stored.length > 0) {
      setHistory(stored.slice(0, 10));
      setHealth(stored[0]);
    }
  }, [toolUrl]);

  const uptimePercentage =
    history.length > 0
      ? Math.round(
          (history.filter((h) => h.isUp).length / history.length) * 100,
        )
      : null;

  const avgResponseTime =
    history.length > 0
      ? Math.round(
          history
            .filter((h) => h.isUp)
            .reduce((sum, h) => sum + h.responseTime, 0) /
            Math.max(history.filter((h) => h.isUp).length, 1),
        )
      : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-foreground/70" />
          <h3 className="text-sm font-semibold text-foreground">
            {t("health.title")}
          </h3>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {loading ? t("health.checking") : t("health.checkNow")}
        </button>
      </div>

      {health ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                health.isUp
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {health.isUp ? (
                <Wifi className="h-3.5 w-3.5" />
              ) : (
                <WifiOff className="h-3.5 w-3.5" />
              )}
              {health.isUp ? t("health.online") : t("health.offline")}
            </div>
            {health.isUp && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {health.responseTime}ms
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground">HTTP</div>
              <div className="font-mono text-sm text-foreground">
                {health.status || "—"}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground">
                {t("health.uptime")}
              </div>
              <div className="font-mono text-sm text-foreground">
                {uptimePercentage !== null ? `${uptimePercentage}%` : "—"}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground">
                {t("health.avgSpeed")}
              </div>
              <div className="font-mono text-sm text-foreground">
                {avgResponseTime !== null ? `${avgResponseTime}ms` : "—"}
              </div>
            </div>
          </div>

          {history.length > 1 && (
            <div>
              <div className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">
                {t("health.recentChecks")}
              </div>
              <div className="flex gap-0.5">
                {history
                  .slice(0, 10)
                  .reverse()
                  .map((h, i) => (
                    <div
                      key={`${h.checkedAt}-${i}`}
                      className={`flex-1 h-5 rounded-sm ${
                        h.isUp ? "bg-green-500/60" : "bg-red-500/60"
                      }`}
                      title={`${h.isUp ? "Up" : "Down"} - ${h.responseTime}ms - ${new Date(h.checkedAt).toLocaleTimeString()}`}
                    />
                  ))}
              </div>
            </div>
          )}

          <div className="text-[10px] text-muted-foreground/60">
            {t("health.lastChecked")}:{" "}
            {new Date(health.checkedAt).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            {t("health.clickToCheck")}
          </p>
        </div>
      )}
    </div>
  );
}
