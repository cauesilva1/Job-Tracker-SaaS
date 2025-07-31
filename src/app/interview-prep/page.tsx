import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileNav from "@/components/sidebar/MobileNav";
import InterviewChat from "@/components/chat/InterviewChat";
import { MessageCircle } from 'lucide-react';

export default async function InterviewPrepPage() {
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
          <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
            {/* Header centralizado */}
            <div className="mb-8 flex justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Preparação para Entrevistas
                    </h1>
                    <p className="text-gray-600">
                      IA + Simulação Realista
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Pratique entrevistas com nossa IA especializada. Escolha o tipo de entrevista, 
                  nível de dificuldade e receba feedback em tempo real para melhorar suas respostas.
                </p>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <InterviewChat userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 