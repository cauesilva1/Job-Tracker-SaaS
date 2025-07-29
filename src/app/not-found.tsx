import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h1>
          <p className="text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              🏠 Voltar ao Dashboard
            </Button>
          </Link>
          
          <Link href="/add">
            <Button variant="outline" className="w-full">
              ➕ Adicionar Nova Candidatura
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Se você acredita que isso é um erro, entre em contato conosco.</p>
        </div>
      </div>
    </div>
  );
} 