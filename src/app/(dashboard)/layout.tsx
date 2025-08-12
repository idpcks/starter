import DashboardLayout from '@/components/layout/DashboardLayout';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}