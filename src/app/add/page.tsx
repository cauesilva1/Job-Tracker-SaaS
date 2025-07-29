import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddJobForm from "@/components/forms/AddJobForm";

export default async function AddJobPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Adicionar Nova Candidatura</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Registre uma nova candidatura de emprego
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <AddJobForm userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
