import { DashboardLayout } from '../layouts/DashboardLayout';
import { UploadDashboard } from '../../features/upload/components/UploadDashboard';

export function AppRouter() {
  return (
    <DashboardLayout>
      <UploadDashboard />
    </DashboardLayout>
  );
}
