import { useState } from 'react';
import { CouponProvider } from './context/CouponContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Coupons from './pages/Coupons';
import Offers from './pages/Offers';
import Analytics from './pages/Analytics';
import './App.css';

function Layout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard />;
      case 'coupons':    return <Coupons />;
      case 'offers':     return <Offers />;
      case 'analytics':  return <Analytics />;
      default:           return <Dashboard />;
    }
  };

  const pageLabels = {
    dashboard: 'Dashboard',
    coupons:   'Coupons',
    offers:    'Offers',
    analytics: 'Analytics',
  };

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="app-content">
        <Topbar pageTitle={pageLabels[activeTab]} />
        <main className="page-main" id="main-content">
          {renderPage()}
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CouponProvider>
      <Layout />
    </CouponProvider>
  );
}
