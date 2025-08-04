import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { StatsGrid } from '../dashboard/StatsGrid';
import { ApiKeysList } from '../dashboard/ApiKeysList';
import { UsageAnalytics } from '../dashboard/UsageAnalytics';
import { SecurityStatus } from '../dashboard/SecurityStatus';
import { RecentActivity } from '../dashboard/RecentActivity';
import { QuickActions } from '../dashboard/QuickActions';
import { AddKeyModal } from '../modals/AddKeyModal';
import { EditKeyModal } from '../modals/EditKeyModal';
import { SecurityScanModal } from '../modals/SecurityScanModal';

export function Dashboard() {
  const [showAddKeyModal, setShowAddKeyModal] = React.useState(false);
  const [showEditKeyModal, setShowEditKeyModal] = React.useState(false);
  const [showSecurityScanModal, setShowSecurityScanModal] = React.useState(false);
  const [selectedKey, setSelectedKey] = React.useState<any>(null);

  const handleEditKey = (apiKey: any) => {
    setSelectedKey({
      id: apiKey.id,
      name: apiKey.name,
      description: `${apiKey.provider} API key`,
      rateLimit: 1000,
      scopes: [],
      isActive: apiKey.status === 'active'
    });
    setShowEditKeyModal(true);
  };

  const handleViewUsage = (apiKey: any) => {
    toast.info(`Viewing detailed usage for ${apiKey.name}`);
    // In a real app, this would navigate to a detailed analytics page
  };

  const handleSecurityScan = () => {
    setShowSecurityScanModal(true);
  };

  const handleModalSuccess = () => {
    // Refresh data in a real app
    toast.success('Data refreshed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
            <p className="text-slate-400">Monitor and manage your API keys with advanced security controls</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="md" icon={Shield}>
              <span onClick={handleSecurityScan}>Security Scan</span>
            </Button>
            <Button variant="primary" size="md" icon={Plus} onClick={() => setShowAddKeyModal(true)}>
              Add Key
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8">
          <StatsGrid />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - API Keys */}
          <div className="lg:col-span-2 space-y-8">
            <ApiKeysList onEditKey={handleEditKey} onViewUsage={handleViewUsage} />
            <UsageAnalytics />
          </div>

          {/* Right Column - Security & Activity */}
          <div className="space-y-8">
            <SecurityStatus />
            <RecentActivity />
            <QuickActions onAddKey={() => setShowAddKeyModal(true)} onSecurityScan={handleSecurityScan} />
          </div>
        </div>

        {/* Modals */}
        <AddKeyModal 
          isOpen={showAddKeyModal} 
          onClose={() => setShowAddKeyModal(false)}
          onSuccess={handleModalSuccess}
        />
        
        <EditKeyModal 
          isOpen={showEditKeyModal} 
          onClose={() => setShowEditKeyModal(false)}
          onSuccess={handleModalSuccess}
          keyData={selectedKey}
        />
        
        <SecurityScanModal 
          isOpen={showSecurityScanModal} 
          onClose={() => setShowSecurityScanModal(false)}
        />
      </div>
    </div>
  );
}