"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { isValidJobUrl } from "@/lib/job-scraper";
import type { Status } from "@/types/status";

interface AddJobFormProps {
  userId: string;
}

export default function AddJobForm({ userId }: AddJobFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "Applied",
    link: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("applications").insert({
        user_id: userId,
        company: formData.company.trim(),
        position: formData.position.trim(),
        status: formData.status as Status,
        link: formData.link.trim() || null,
        notes: formData.notes.trim() || null,
      });

      if (error) {
        console.error("Erro ao adicionar candidatura:", error);
        toast.error("Erro ao adicionar candidatura");
        return;
      }

      toast.success("Candidatura adicionada com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtractJobInfo = async () => {
    if (!formData.link.trim()) {
      toast.error("Por favor, insira o link da vaga primeiro");
      return;
    }

    if (!isValidJobUrl(formData.link)) {
      toast.error("Link de vaga inválido. Suportamos LinkedIn, Indeed, Glassdoor e outros sites de emprego");
      return;
    }

    setExtracting(true);
    try {
      // Chamar a API route em vez de usar o scraper diretamente
      const response = await fetch('/api/extract-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formData.link }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jobInfo = await response.json();
      
      if (jobInfo.error) {
        throw new Error(jobInfo.error);
      }
      
      if (jobInfo.company || jobInfo.position) {
        setFormData(prev => ({
          ...prev,
          company: jobInfo.company || prev.company,
          position: jobInfo.position || prev.position,
          notes: jobInfo.description ? `${prev.notes}\n\n${jobInfo.description}`.trim() : prev.notes,
        }));
        
        toast.success("Informações extraídas com sucesso!");
      } else {
        toast.error("Não foi possível extrair informações desta vaga");
      }
    } catch (error) {
      console.error("Erro ao extrair informações:", error);
      toast.error("Erro ao extrair informações da vaga");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Empresa */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Empresa *
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base"
          placeholder="Ex: Google, Microsoft, Apple..."
        />
      </div>

      {/* Cargo */}
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
          Cargo *
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base"
          placeholder="Ex: Desenvolvedor Frontend, Product Manager..."
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base"
        >
          <option value="Applied">📝 Applied</option>
          <option value="Interview">🎯 Interview</option>
          <option value="Offer">🎉 Offer</option>
          <option value="Rejected">❌ Rejected</option>
        </select>
      </div>

      {/* Link da Vaga */}
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
          Link da Vaga (opcional)
        </label>
        <div className="space-y-2">
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base"
            placeholder="https://linkedin.com/jobs/..."
          />
          <Button
            type="button"
            onClick={handleExtractJobInfo}
            disabled={extracting || !formData.link.trim()}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg md:rounded-md transition disabled:opacity-50 text-sm md:text-base"
          >
            {extracting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Extraindo...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🔍</span>
                Extrair Info
              </div>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Cole o link da vaga e clique em &quot;Extrair Info&quot; para preencher automaticamente
        </p>
      </div>

      {/* Notas */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notas (opcional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm md:text-base"
          placeholder="Observações sobre a candidatura, requisitos, salário, etc..."
        />
      </div>

      {/* Botões */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg md:rounded-xl py-2 md:py-3 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adicionando...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>➕</span>
              Adicionar Candidatura
            </div>
          )}
        </Button>
        
        <Link href="/" className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full"
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
} 