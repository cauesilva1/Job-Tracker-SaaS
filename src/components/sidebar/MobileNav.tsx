"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "@supabase/auth-helpers-react";

export default function MobileNav() {
  const session = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
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
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Profile */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
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
            <nav className="space-y-2 mb-6">

            <Link href="/profile" onClick={() => setIsOpen(false)}>
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

              <Link href="/" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Dashboard</p>
                    <p className="text-xs text-slate-400">Visão geral</p>
                  </div>
                </div>
              </Link>

              <Link href="/add" onClick={() => setIsOpen(false)}>
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

              <Link href="/analyze-resume" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-sm">📄</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Análise de Currículo</p>
                    <p className="text-xs text-slate-400">IA + Compatibilidade</p>
                  </div>
                </div>
              </Link>

              <Link href="/interview-prep" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-700/50">
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

            {/* Logout Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
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
        </div>
      )}
    </>
  );
} 