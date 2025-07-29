import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import DashboardClient from "@/components/dashboard/DashboardClient";
import AuthDebug from "@/components/AuthDebug";

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
      <Sidebar />
      <DashboardClient 
        initialApplications={applications || []} 
      />
      <AuthDebug />
    </div>
  );
}
