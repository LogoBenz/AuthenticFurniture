import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setValue,
    clearErrors
  } = useForm<LoginFormData>({
    mode: 'onSubmit', // Only validate on submit, not on change
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  // Helper function to fill demo credentials
  const fillDemoCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    clearErrors();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 mt-2">Sign in to your EMU Clubs account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-emu-600 focus:ring-emu-500" 
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button 
            type="button" 
            className="text-sm text-emu-600 hover:text-emu-700 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >
          Sign in
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-emu-600 hover:text-emu-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin@emu.edu.tr', 'password')}
              className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              <strong className="text-emu-600">Super Admin:</strong> admin@emu.edu.tr / password
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('club@emu.edu.tr', 'password')}
              className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              <strong className="text-green-600">Club Admin:</strong> club@emu.edu.tr / password
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('member@emu.edu.tr', 'password')}
              className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              <strong className="text-blue-600">Member:</strong> member@emu.edu.tr / password
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Click any demo account to auto-fill credentials</p>
        </div>
      </form>
    </motion.div>
  );
};