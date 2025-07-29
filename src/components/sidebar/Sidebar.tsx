"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react";

export default function Sidebar() {
  const session = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    interviews: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchStats(session.user.id);
    } else {
      setStats({ total: 0, interviews: 0 });
    }
  }, [session]);

  const fetchStats = async (userId: string) => {
    try {
      setLoading(true);
      // Usar o cliente do contexto
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
      const supabase = createClientComponentClient();
      
      const { data: applications, error } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", userId);

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return;
      }

      const total = applications?.length || 0;
      const interviews = applications?.filter(app => app.status === "Interview").length || 0;

      setStats({ total, interviews });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
      const supabase = createClientComponentClient();
      
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
      // Força o redirecionamento mesmo com erro
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex flex-col justify-between shadow-2xl border-r border-slate-700 backdrop-blur-sm">
      {/* Header com Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">JT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Job Tracker
            </h1>
            <p className="text-xs text-slate-400">Sua carreira, organizada</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            {session?.user?.user_metadata?.avatar_url ? (
              <Image
                src={session.user.user_metadata.avatar_url}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-blue-500/20"
                onError={(e) => {
                  // Se a imagem falhar, esconder e mostrar o fallback
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
                <span className="text-white font-semibold text-sm">
                  {session?.user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            
            {/* Fallback avatar que aparece se a imagem falhar */}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-500/20 hidden">
              <span className="text-white font-semibold text-sm">
                {session?.user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">
                {session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Usuário"}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-500" 
              style={{ width: `${stats.total > 0 ? Math.min((stats.interviews / stats.total) * 100, 100) : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/add">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">+</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Adicionar Vaga</p>
                <p className="text-xs text-slate-400">Nova candidatura</p>
              </div>
            </div>
          </Link>

          <Link href="/profile">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Meu Perfil</p>
                <p className="text-xs text-slate-400">Configurações</p>
              </div>
            </div>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-3">
        {/* Quick Stats */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300">
          <p className="text-xs text-slate-400 mb-2">Resumo</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-400">
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  stats.total
                )}
              </p>
              <p className="text-xs text-slate-400">Candidaturas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  stats.interviews
                )}
              </p>
              <p className="text-xs text-slate-400">Entrevistas</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-all duration-200 group cursor-pointer border border-transparent hover:border-red-500/30"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white text-sm">🚪</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">Sair</p>
            <p className="text-xs text-slate-400">Fazer logout</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
