"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScan, toggleScanPause, stopScan, type ScanStatus } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import LandingTopNav from "@/components/layout/LandingTopNav";
import TerminalLog from "@/components/scan/TerminalLog";
import DataStream from "@/components/scan/DataStream";
import Link from "next/link";

const POLL_INTERVAL_MS = 3_000;

export default function ScanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [scan, setScan] = useState<ScanStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [controlling, setControlling] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  const fetchScan = useCallback(async () => {
    try {
      const data = await getScan(id);
      setScan(data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // 404 means the scan is still being initialised — not a fatal error
      if (msg.includes("404")) {
        setScan(null);
        setError(null);
      } else {
        setError(msg);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchScan();
  }, [fetchScan]);

  useEffect(() => {
    if (scan?.status === "complete" || scan?.status === "stopped") return;
    const timer = setInterval(fetchScan, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [scan?.status, fetchScan]);

  const handlePauseResume = async () => {
    if (!scan || controlling) return;
    setControlling(true);
    try {
      await toggleScanPause(id, scan.status === "scanning");
      await fetchScan();
    } catch {
      // ignore
    } finally {
      setControlling(false);
    }
  };

  const handleStop = async () => {
    if (!scan || controlling) return;
    setControlling(true);
    try {
      await stopScan(id);
      await fetchScan();
    } catch {
      // ignore
    } finally {
      setControlling(false);
    }
  };

  // ── Loading / initialising state ─────────────────────────────────────────

  if (error) {
    return (
      <>
        <LandingTopNav />
        <main className="mt-[60px] p-6 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-secondary">error</span>
            <p className="font-headline text-sm text-secondary tracking-widest uppercase">Scan Error</p>
            <p className="font-mono text-xs text-on-surface-variant">{error}</p>
            <Link href="/">
              <button className="mt-4 px-6 py-3 bg-primary-container text-on-primary font-headline text-xs font-bold tracking-widest uppercase">
                New Investigation
              </button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!scan) {
    return (
      <>
        <LandingTopNav />
        <main className="mt-[60px] p-6 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
            <p className="font-headline text-sm text-primary tracking-widest uppercase">Initialising Investigation…</p>
            <p className="font-mono text-xs text-on-surface-variant opacity-50">Scan ID: {id}</p>
          </div>
        </main>
      </>
    );
  }

  // ── Main scan dashboard ───────────────────────────────────────────────────

  return (
    <>
      <LandingTopNav />

      <main className="mt-[60px] p-6 min-h-screen">
        {/* Dashboard header */}
        <div className="flex justify-between items-end mb-8 border-b border-[#524533]/10 pb-6">
          <div>
            <p className="font-headline text-[10px] text-primary font-bold tracking-[0.3em] mb-2">
              OPERATIONAL OVERVIEW
            </p>
            <h2 className="font-headline text-4xl font-bold text-on-surface tracking-tighter">
              Live Web Crawl{" "}
              <span className="text-primary-fixed-dim">ID-{scan.id}</span>
            </h2>
          </div>

          {/* Progress + action buttons */}
          <div className="flex items-end gap-6">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-[10px] font-headline text-on-surface-variant tracking-widest">
                  {scan.status === "complete" ? "SCAN COMPLETE" : scan.status === "stopped" ? "SCAN STOPPED" : "SCAN PROGRESS"}
                </span>
                <span className="text-lg font-headline font-bold text-primary">
                  {scan.progressPercent}%
                </span>
              </div>
              <div className="w-64 h-1 bg-surface-container-highest relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary-container transition-all duration-500"
                  style={{ width: `${scan.progressPercent}%` }}
                />
                <div
                  className="absolute top-0 left-0 h-full bg-primary opacity-50 blur-sm transition-all duration-500"
                  style={{ width: `${scan.progressPercent * 0.4}%` }}
                />
              </div>
            </div>

            <div className="flex items-end gap-2">
              {(scan.status === "scanning" || scan.status === "paused") && (
                <>
                  <button
                    onClick={handlePauseResume}
                    disabled={controlling}
                    className="bg-surface-container text-on-surface-variant text-[10px] font-headline font-bold px-4 py-3 tracking-widest uppercase hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {scan.status === "paused" ? "play_arrow" : "pause"}
                    </span>
                    {scan.status === "paused" ? "RESUME" : "PAUSE"}
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={controlling}
                    className="bg-error-container text-on-error-container text-[10px] font-headline font-bold px-4 py-3 tracking-widest uppercase hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">stop</span>
                    STOP
                  </button>
                </>
              )}
              <Link href={`/report/${scan.id}`}>
                <button className="bg-primary-container text-on-primary text-[10px] font-headline font-bold px-4 py-3 tracking-widest uppercase hover:brightness-110 transition flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">assignment</span>
                  VIEW REPORT
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-6">
          <TerminalLog logs={scan.logs} />
          <DataStream items={scan.stream} />
        </div>

      </main>
    </>
  );
}
