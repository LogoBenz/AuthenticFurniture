import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Award } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: Trophy,
      title: 'Join Clubs',
      description: 'Discover and join up to 3 clubs that match your interests'
    },
    {
      icon: Calendar,
      title: 'Attend Events',
      description: 'Register for exciting events and activities throughout the year'
    },
    {
      icon: Users,
      title: 'Connect',
      description: 'Meet like-minded students and build lasting friendships'
    },
    {
      icon: Award,
      title: 'Lead',
      description: 'Run for club positions and make a difference in your community'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emu-50 via-white to-emu-100 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-emu-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EMU Clubs</h1>
              <p className="text-gray-600">Management System</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Connect, Engage, and Lead at EMU
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join the vibrant community of Eastern Mediterranean University clubs. 
            Discover your passions, develop leadership skills, and create lasting memories.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
              >
                <feature.icon className="w-8 h-8 text-emu-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 lg:flex-none lg:w-96 xl:w-1/3 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};