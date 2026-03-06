import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext'; // Added ThemeProvider import
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Sidebar from './components/Sidebar';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Team = React.lazy(() => import('./pages/Team'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Documents = React.lazy(() => import('./pages/Documents'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const MyRequests = React.lazy(() => import('./pages/employee/MyRequests'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Help = React.lazy(() => import('./pages/Help'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

import Header from './components/Header';
import AddTaskModal from './components/modals/AddTaskModal';
import NotificationPanel from './components/NotificationPanel';

import CommandPalette from './components/ui/CommandPalette';

const Layout = ({ children }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const { user } = useAuth(); // Use useAuth instead of useApp

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col">
        <Header
          onNewTask={() => setIsTaskModalOpen(true)}
          onOpenNotifications={() => setIsNotifPanelOpen(true)}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
        />
        <div className="max-w-[1600px] mx-auto p-8 w-full">
          {children}
        </div>
      </main>
      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} defaultType="Task" />
      <NotificationPanel isOpen={isNotifPanelOpen} onClose={() => setIsNotifPanelOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} user={user} />
    </div>
  );
};

import Login from './pages/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminPerformance from './pages/admin/AdminPerformance';
import AdminRoles from './pages/admin/AdminRoles';

import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeePerformance from './pages/employee/EmployeePerformance';




function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<Navigate to="/login" replace />} />

                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={
                          <ProtectedRoute allowedRoles={['employee', 'admin']}>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={<Navigate to="/" replace />} />
                        <Route path="/team" element={
                          <ProtectedRoute allowedRoles={['employee', 'admin']}>
                            <Team />
                          </ProtectedRoute>
                        } />
                        <Route path="/schedule" element={
                          <ProtectedRoute allowedRoles={['employee', 'admin']}>
                            <Schedule />
                          </ProtectedRoute>
                        } />
                        <Route path="/documents" element={
                          <ProtectedRoute>
                            <Documents />
                          </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                          <ProtectedRoute>
                            <Analytics />
                          </ProtectedRoute>
                        } />
                        <Route path="/notifications" element={
                          <ProtectedRoute>
                            <Notifications />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                        <Route path="/requests" element={
                          <ProtectedRoute allowedRoles={['employee', 'admin']}>
                            <MyRequests />
                          </ProtectedRoute>
                        } />
                        <Route path="/help" element={
                          <ProtectedRoute>
                            <Help />
                          </ProtectedRoute>
                        } />

                        <Route path="/employee/attendance" element={
                          <ProtectedRoute>
                            <EmployeeAttendance />
                          </ProtectedRoute>
                        } />
                        <Route path="/employee/performance" element={
                          <ProtectedRoute>
                            <EmployeePerformance />
                          </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/requests" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminRequests />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/schedule" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminSchedule />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/attendance" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminAttendance />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/performance" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPerformance />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/roles" element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminRoles />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
              </Suspense>
            </Router>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
