"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import type { Application } from "@/types/aplications";

interface UserStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  successRate: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    created_at: string;
    last_sign_in_at?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
    app_metadata?: {
      provider?: string;
    };
  } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session?.user) {
          toast.error("Usuário não autenticado");
          router.push("/login");
          return;
        }

        setUser(session.user);

        // Buscar candidaturas do usuário
        const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
        const supabase = createClientComponentClient();
        
        const { data: applicationsData, error } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar candidaturas:", error);
          return;
        }

        setApplications(applicationsData || []);

        // Calcular estatísticas
        const total = applicationsData?.length || 0;
        const applied = applicationsData?.filter(app => app.status === "Applied").length || 0;
        const interview = applicationsData?.filter(app => app.status === "Interview").length || 0;
        const offer = applicationsData?.filter(app => app.status === "Offer").length || 0;
        const rejected = applicationsData?.filter(app => app.status === "Rejected").length || 0;
        
        const successRate = total > 0 ? ((offer + interview) / total) * 100 : 0;

        setStats({
          total,
          applied,
          interview,
          offer,
          rejected,
          successRate: Math.round(successRate),
        });

      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    // Buscar dados quando a sessão mudar
    if (session) {
      fetchUserData();
    } else {
      setUser(null);
      setApplications([]);
      setStats({
        total: 0,
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        successRate: 0,
      });
      setLoading(false);
    }
  }, [session, router]);

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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Usuário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  {user?.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Avatar do usuário"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ${user?.user_metadata?.avatar_url ? 'hidden' : ''}`}>
                    <span className="text-2xl font-bold text-white">
                      {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Usuário"}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status da conta</span>
                  <span className="text-sm font-medium text-green-600">
                    Ativa
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Método de login</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.app_metadata?.provider === 'google' ? 'Google' : 
                     user?.app_metadata?.provider === 'email' ? 'Email/Senha' : 
                     user?.app_metadata?.provider || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">ID do usuário</span>
                  <span className="text-sm font-medium text-gray-900 font-mono text-xs">
                    {user?.id?.substring(0, 8)}...
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  🚪 Fazer Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Estatísticas</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.applied}</div>
                  <div className="text-sm text-yellow-600">Aplicadas</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.offer}</div>
                  <div className="text-sm text-green-600">Ofertas</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-red-600">Rejeitadas</div>
                </div>
              </div>

              {/* Taxa de Sucesso */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Taxa de Sucesso</span>
                  <span className="text-sm font-bold text-gray-900">{stats.successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.successRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Baseado em entrevistas e ofertas recebidas
                </p>
              </div>

              {/* Candidaturas Recentes */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Candidaturas Recentes</h4>
                {applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{app.company}</div>
                          <div className="text-sm text-gray-600">{app.position}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              app.status === "Applied"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "Interview"
                                ? "bg-blue-100 text-blue-800"
                                : app.status === "Offer"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status}
                          </span>
                          <Link href={`/edit/${app.id}`}>
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Nenhuma candidatura encontrada
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
