import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Vote,
  FileText,
  CreditCard,
  Bell,
  BarChart3,
  Shield,
  UserPlus,
  Trophy
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const menuItems = {
  super_admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Shield, label: 'System Management', path: '/admin/system' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Trophy, label: 'Club Management', path: '/admin/clubs' },
    { icon: Calendar, label: 'Event Oversight', path: '/admin/events' },
    { icon: Vote, label: 'Elections', path: '/admin/elections' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
  club_admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'My Clubs', path: '/clubs' },
    { icon: UserPlus, label: 'Members', path: '/members' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Vote, label: 'Elections', path: '/elections' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
  member: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Trophy, label: 'My Clubs', path: '/clubs' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Vote, label: 'Elections', path: '/elections' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ],
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emu-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">EMU Clubs</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emu-50 text-emu-700 border-r-2 border-emu-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx(
                    'w-5 h-5',
                    isActive ? 'text-emu-600' : 'text-gray-400'
                  )} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 w-1 h-8 bg-emu-600 rounded-l-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};