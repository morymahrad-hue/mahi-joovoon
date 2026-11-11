import React, { useState } from 'react';
import { ServerProvider, useServer } from './context/ServerContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SimulationBanner } from './components/SimulationBanner';
import { DashboardView } from './components/DashboardView';
import { ConfigGeneratorView } from './components/ConfigGeneratorView';
import { ConfigsManagementView } from './components/ConfigsManagementView';
import { UserManagementView } from './components/UserManagementView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { MultiNodeServersView } from './components/MultiNodeServersView';
import { PaymentsBillingView } from './components/PaymentsBillingView';
import { SupportTicketsView } from './components/SupportTicketsView';
import { AnalyticsSalesView } from './components/AnalyticsSalesView';
import { TerminalView } from './components/TerminalView';
import { FileManagerView } from './components/FileManagerView';
import { ProjectsView } from './components/ProjectsView';
import { BaleBotView } from './components/BaleBotView';
import { ServerStatusView } from './components/ServerStatusView';
import { SettingsView } from './components/SettingsView';
import { RebootModal } from './components/RebootModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab, language } = useServer();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isRtl = language === 'fa';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Top Header */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Active View Router */}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'vpn-generator' && <ConfigGeneratorView />}
          {activeTab === 'vpn-configs' && <ConfigsManagementView />}
          {activeTab === 'vpn-users' && <UserManagementView />}
          {activeTab === 'vpn-subscriptions' && <SubscriptionsView />}
          {activeTab === 'vpn-servers' && <MultiNodeServersView />}
          {activeTab === 'vpn-payments' && <PaymentsBillingView />}
          {activeTab === 'vpn-support' && <SupportTicketsView />}
          {activeTab === 'vpn-analytics' && <AnalyticsSalesView />}

          {/* Linux Hosting & VPS Tooling */}
          {activeTab === 'terminal' && <TerminalView />}
          {activeTab === 'files' && <FileManagerView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'bale-bot' && <BaleBotView />}
          {activeTab === 'status' && <ServerStatusView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <RebootModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ServerProvider>
      <MainLayout />
    </ServerProvider>
  );
}
