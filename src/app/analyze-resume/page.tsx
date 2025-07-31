import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileNav from "@/components/sidebar/MobileNav";
import ResumeAnalysisForm from '@/components/forms/ResumeAnalysisForm';
import { Brain } from 'lucide-react';

export default async function AnalyzeResumePage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - oculta em mobile */}
      <div className="hidden md:block h-screen flex-shrink-0">
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
      <div className="flex-1 md:ml-0 pt-16 md:pt-0 h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
            {/* Header centralizado */}
            <div className="mb-8 flex justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-8 mb-4 ">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Análise de Currículo com IA
                    </h1>
                    <p className="text-gray-600">
                      IA + Compatibilidade
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Faça upload do seu currículo e informe a URL da vaga. Nossa IA irá analisar 
                  a compatibilidade e sugerir melhorias para aumentar suas chances de conseguir a vaga.
                </p>
              </div>
            </div>

            <ResumeAnalysisForm />
          </div>
        </div>
      </div>
    </div>
  );
} 