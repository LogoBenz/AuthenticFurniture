import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClubProvider } from './contexts/ClubContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { ClubsPage } from './pages/ClubsPage';
import { ClubDetailsPage } from './pages/ClubDetailsPage';
import { EventsPage } from './pages/EventsPage';
import { ElectionsPage } from './pages/ElectionsPage';
import { ElectionDetailsPage } from './pages/ElectionDetailsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { Layout } from './components/layout/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emu-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emu-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ClubProvider>
              <Layout />
            </ClubProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clubs" element={<ClubsPage />} />
        <Route path="clubs/:clubId" element={<ClubDetailsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="elections" element={<ElectionsPage />} />
        <Route path="elections/:electionId" element={<ElectionDetailsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        
        {/* Placeholder routes - will be implemented in future iterations */}
        <Route path="payments" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Payments</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="documents" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Documents</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Analytics</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Settings</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        
        {/* Admin routes */}
        <Route path="admin/system" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">System Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="admin/users" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">User Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="admin/clubs" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Club Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="admin/events" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Event Oversight</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="admin/elections" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Elections Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="admin/analytics" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">System Analytics</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="admin/reports" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Reports</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        
        <Route path="members" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Members Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;