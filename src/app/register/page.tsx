  'use client'

  import { useState } from 'react'
  import { useSupabaseClient } from '@supabase/auth-helpers-react'

  import Link from 'next/link'
  import toast from 'react-hot-toast'

  export default function RegisterPage() {
    const supabase = useSupabaseClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
      setError(null)
      if (password !== confirmPassword) {
        toast.error('As senhas não coincidem.')
        return
      }
      
      setLoading(true)
      
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
          toast.error("Erro no cadastro: " + error.message)
        } else {
          toast.success('Cadastro realizado! Verifique seu email para confirmar.')
        }
      } catch (err) {
        console.error("Erro inesperado:", err)
        setError("Erro inesperado. Tente novamente.")
        toast.error("Erro inesperado. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

        const handleGoogleSignIn = async () => {
      try {
        // Usar a rota server-side para maior confiabilidade
        window.location.href = '/auth/google'
      } catch (err) {
        console.error("Erro inesperado no Google Sign-In:", err)
        toast.error("Erro inesperado. Tente novamente.")
      }
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
            Registrar no Job Tracker
          </h1>

          <form
            onSubmit={e => {
              e.preventDefault()
              handleRegister()
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="rounded border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              className="rounded border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <input
              type="password"
              placeholder="Confirmar Senha"
              className="rounded border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && (
              <p className="text-center text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm font-semibold text-gray-500">ou</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
            type="button"
          >
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M23.64 12.204c0-.788-.07-1.546-.202-2.276H12v4.31h6.49a5.548 5.548 0 01-2.4 3.64v3.02h3.88c2.273-2.093 3.58-5.172 3.58-8.69z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.074 7.95-2.92l-3.88-3.02c-1.08.726-2.46 1.157-4.07 1.157-3.13 0-5.78-2.113-6.73-4.95H1.29v3.107A11.996 11.996 0 0012 24z"
              />
              <path
                fill="#4A90E2"
                d="M5.27 14.267a7.21 7.21 0 010-4.534V6.626H1.29a11.99 11.99 0 000 10.747l3.98-3.106z"
              />
              <path
                fill="#FBBC05"
                d="M12 4.77c1.763 0 3.34.607 4.58 1.798l3.44-3.44C17.953 1.36 15.234 0 12 0 7.292 0 3.072 2.574 1.29 6.626l3.98 3.106c.91-2.84 3.58-4.962 6.73-4.962z"
              />
            </svg>
            Registrar com Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    )
  }
