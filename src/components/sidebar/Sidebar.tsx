"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react";

export default function Sidebar() {
  const session = useSession();
  const router = useRouter();



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
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex flex-col shadow-2xl border-r border-slate-700 backdrop-blur-sm overflow-hidden justify-between">
      {/* Header com Logo */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center gap-3 mb-6">
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
        <div className="flex-shrink-0 bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300">
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto space-y-1 min-h-0">
          <Link href="/">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Dashboard</p>
                <p className="text-xs text-slate-400">Visão geral</p>
              </div>
            </div>
          </Link>

          <Link href="/add">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
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
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Meu Perfil</p>
                <p className="text-xs text-slate-400">Configurações</p>
              </div>
            </div>
          </Link>

          <Link href="/analyze-resume">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">📄</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Análise de Currículo</p>
                <p className="text-xs text-slate-400">IA + Compatibilidade</p>
              </div>
            </div>
          </Link>

          <Link href="/interview-prep">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Preparar Entrevista</p>
                <p className="text-xs text-slate-400">IA + Simulação</p>
              </div>
            </div>
          </Link>
        </nav>
      </div>

            {/* Footer */}
      <div className="flex-shrink-0 mt-4">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 transition-all duration-200 group cursor-pointer border border-transparent hover:border-red-500/30"
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
