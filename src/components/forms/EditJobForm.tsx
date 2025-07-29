"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import type { Application } from "@/types/aplications";

interface EditJobFormProps {
  application: Application;
}

export default function EditJobForm({ application }: EditJobFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company: application.company,
    position: application.position,
    status: application.status,
    link: application.link || "",
    notes: application.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("applications")
        .update({
          company: formData.company.trim(),
          position: formData.position.trim(),
          status: formData.status,
          link: formData.link.trim() || null,
          notes: formData.notes.trim() || null,
        })
        .eq("id", application.id);

      if (error) {
        console.error("Erro ao atualizar candidatura:", error);
        toast.error("Erro ao atualizar candidatura");
        return;
      }

      toast.success("Candidatura atualizada com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado");
    } finally {
      setSaving(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Link da Vaga */}
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
          Link da Vaga (opcional)
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="https://..."
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="Observações sobre a candidatura, requisitos, salário, etc..."
        />
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={saving}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {saving ? (
            <div className="flex items-center gap-2">
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
              Salvando...
            </div>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
        
        <Link href="/">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
} 