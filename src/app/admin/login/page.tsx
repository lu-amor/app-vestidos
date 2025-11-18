import {getOrCreateCsrfToken} from "@/lib/CsrfSessionManagement";
import Link from "next/link";

export default async function AdminLogin() {
  const csrf = await getOrCreateCsrfToken();
  
  return (
    <div className="min-h-screen bg-900 flex items-center justify-center px-4">
      <Link
        href="/"
        className="absolute top-6 left-6 bg-800 text-200 px-4 py-2 rounded-lg border border-gray-700 transition flex items-center gap-2"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </Link>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-400 mt-2">Acceso solo para personal autorizado</p>
        </div>
        
        <div className="border border-gray-700 rounded-lg shadow-lg p-6">
          <form action="/api/admin/login" method="POST" className="space-y-4">
            <input type="hidden" name="csrf" value={csrf} />
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-300 mb-2">
                Usuario
              </label>
              <input 
                id="username"
                name="username" 
                placeholder="Nombre de usuario" 
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800 placeholder-gray-400"
                autoComplete="username"
                defaultValue="admin"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text--300 mb-2">
                Contraseña
              </label>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Contraseña" 
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-800 text-white placeholder-gray-400"
                autoComplete="current-password"
                defaultValue="admin123"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
            <p className="text-blue-100 text-sm font-semibold mb-2">🔧 Credenciales de Desarrollo:</p>
            <div className="text-blue-200 text-sm space-y-1">
              <p><span className="font-medium">Usuario:</span> admin</p>
              <p><span className="font-medium">Contraseña:</span> admin123</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Área protegida. Solo personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
}
