import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileNav from "@/components/sidebar/MobileNav";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Buscar candidaturas do usuário
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar aplicações:", error);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - oculta em mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JT</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Job Tracker</span>
          </div>
          <MobileNav />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-0 pt-16 md:pt-0">
        <DashboardClient 
          initialApplications={applications || []} 
        />
      </div>
    </div>
  );
}
