"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function AuthDebug() {
  const session = useSession();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog(`Session changed: ${session ? 'Logged in' : 'Not logged in'}`);
    if (session) {
      addLog(`User ID: ${session.user?.id}`);
      addLog(`User email: ${session.user?.email}`);
      addLog(`Provider: ${session.user?.app_metadata?.provider}`);
    }
  }, [session]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Auth Debug:</div>
      <div>Session: {session ? "✅" : "❌"}</div>
      <div>User ID: {session?.user?.id || "N/A"}</div>
      <div>Email: {session?.user?.email || "N/A"}</div>
      <div>Provider: {session?.user?.app_metadata?.provider || "N/A"}</div>
      <div className="mt-2 text-xs text-gray-300">
        <div>Logs:</div>
        {logs.slice(-3).map((log, index) => (
          <div key={index} className="text-xs">{log}</div>
        ))}
      </div>
    </div>
  );
} 