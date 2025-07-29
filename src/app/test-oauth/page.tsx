"use client";

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function TestOAuthPage() {
  const supabase = useSupabaseClient();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testGoogleOAuth = async () => {
    try {
      addLog("Iniciando teste do Google OAuth...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        addLog(`Erro: ${error.message}`);
      } else {
        addLog(`Sucesso! URL: ${data.url}`);
        addLog("Redirecionando...");
        window.location.href = data.url;
      }
    } catch (err) {
      addLog(`Erro inesperado: ${err}`);
    }
  };

  const testServerOAuth = async () => {
    try {
      addLog("Testando rota server-side...");
      window.location.href = '/auth/google';
    } catch (err) {
      addLog(`Erro: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Teste OAuth</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Teste Cliente</h2>
            <button
              onClick={testGoogleOAuth}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Testar Google OAuth (Cliente)
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Teste Servidor</h2>
            <button
              onClick={testServerOAuth}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Testar Google OAuth (Servidor)
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Logs</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Nenhum log ainda...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Verificações Importantes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Verifique se o Google OAuth está habilitado no Supabase</li>
            <li>• Verifique se o redirect URL está configurado corretamente</li>
            <li>• Verifique se o Client ID e Secret estão corretos</li>
            <li>• Verifique o console do navegador para erros</li>
            <li>• Verifique os logs do servidor</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 