import {getOrCreateCsrfToken} from "@/lib/CsrfSessionManagement";
import Link from "next/link";

export default async function AdminLogin() {
  const csrf = await getOrCreateCsrfToken();
  
  console.log("credenciales para desarrollo: admin / admin123");
  return (
    <div className="min-h-screen bg-[#f4f3ee] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        </div>
        
        <div className="border border-gray-700 rounded-4xl shadow-lg p-6">
          <form action="/api/admin/login" method="POST" className="space-y-4">
            <input type="hidden" name="csrf" value={csrf} />
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-300 mb-1 text-gray-900">
                Usuario
              </label>
              <input 
                id="username"
                name="username" 
                placeholder="Nombre de usuario" 
                className="w-full px-4 py-3 border border-gray-600 rounded-full focus:ring-2 focus:ring-[#463f3a] focus:border-[#463f3a] bg-800 placeholder-gray-400 text-gray-900"
                autoComplete="username"
                defaultValue="admin"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text--300 mb-1 text-gray-900">
                Contraseña
              </label>
              <input 
                id="password"
                name="password" 
                type="password" 
                placeholder="Contraseña" 
                className="w-full px-4 py-3 border border-gray-600 rounded-full focus:ring-2 focus:ring-[#463f3a] focus:border-[#463f3a] bg-800 placeholder-gray-400 text-gray-900"
                autoComplete="password"
                defaultValue="admin123"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#e0afa0] hover:bg-[#c18f87] text-[#463f3a] px-4 py-3 rounded-full font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            Área protegida. Solo personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
}
