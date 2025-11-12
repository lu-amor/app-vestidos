import AdminDashboardClient from './AdminDashboardClient';

export default function AdminPage() {
  // Si llegamos aquí, el middleware ya verificó la autenticación
  console.log('AdminPage: Rendering dashboard (auth verified by middleware)');
  return <AdminDashboardClient />;
}