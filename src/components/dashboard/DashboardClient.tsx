"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import type { Application } from "@/types/aplications";
import type { Status } from "@/types/status";
import Modal from "@/components/ui/Modal";



interface DashboardClientProps {
  initialApplications: Application[];
}

export default function DashboardClient({ initialApplications }: DashboardClientProps) {
  const supabase = createClientComponentClient();
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedNotes, setSelectedNotes] = useState<{ notes: string; company: string; position: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra candidaturas por busca e status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });



  const handleDelete = async (appId: string) => {
    if (confirm("Tem certeza que deseja excluir esta candidatura?")) {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", appId);
      
      if (error) {
        console.error("Erro ao deletar:", error);
        toast.error("Erro ao excluir candidatura");
      } else {
        setApplications(applications.filter(a => a.id !== appId));
        toast.success("Candidatura excluída com sucesso!");
      }
    }
  };

  return (
    <main className="flex-1 p-6 max-w-7xl mx-auto h-screen flex flex-col">
      {/* Header compacto */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Dashboard
        </h1>
        
        {/* Cards de estatísticas compactos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-medium">Total</p>
                <p className="text-xl font-bold">{applications.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs font-medium">Aplicadas</p>
                <p className="text-xl font-bold">{applications.filter(a => a.status === "Applied").length}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs font-medium">Entrevistas</p>
                <p className="text-xl font-bold">{applications.filter(a => a.status === "Interview").length}</p>
              </div>
              <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs font-medium">Ofertas</p>
                <p className="text-xl font-bold">{applications.filter(a => a.status === "Offer").length}</p>
              </div>
              <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎉</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de busca e filtro compacta */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              aria-label="Buscar candidaturas"
              placeholder="Buscar por empresa ou cargo..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            aria-label="Filtrar por status"
            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Nenhuma candidatura */}
      {filteredApplications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <div className="mb-3">
              <svg
                className="mx-auto h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Nenhuma candidatura encontrada
            </h3>
            <p className="text-gray-500 text-xs mb-4">
              {applications.length === 0 
                ? "Comece adicionando sua primeira candidatura!"
                : "Tente ajustar os filtros de busca."
              }
            </p>
            {applications.length === 0 && (
              <Link href="/add">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-sm px-4 py-2">
                  ➕ Adicionar Primeira Candidatura
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
                <div className="flex-1">
          {/* Tabela com scroll */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Candidaturas Recentes</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Notas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredApplications.map((app) => (
                    <React.Fragment key={app.id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{app.company}</div>
                            {app.link && (
                              <a
                                href={app.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors"
                              >
                                Ver vaga →
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">{app.position}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              app.status === "Applied"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "Interview"
                                ? "bg-blue-100 text-blue-800"
                                : app.status === "Offer"
                                ? "bg-green-100 text-green-800"
                                : app.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {app.status === "Applied" && "📝"}
                            {app.status === "Interview" && "🎯"}
                            {app.status === "Offer" && "🎉"}
                            {app.status === "Rejected" && "❌"}
                            {" "}{app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {app.notes ? (
                            <button
                              onClick={() => {
                                setSelectedNotes({
                                  notes: app.notes!,
                                  company: app.company,
                                  position: app.position
                                });
                                setIsModalOpen(true);
                              }}
                              className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
                            >
                              📝 Ver notas
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">Sem notas</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {new Date(app.created_at).toLocaleDateString("pt-BR", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link href={`/edit/${app.id}`}>
                              <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs transition-colors cursor-pointer">
                                ✏️ Editar
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="text-red-600 hover:text-red-800 font-medium text-xs transition-colors cursor-pointer"
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para exibir notas */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedNotes ? `${selectedNotes.company} - ${selectedNotes.position}` : "Notas da Vaga"}
      >
        {selectedNotes && (
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedNotes.notes}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
} 