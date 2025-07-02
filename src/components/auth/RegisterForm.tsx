import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, Hash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onToggleForm: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        studentId: data.studentId,
        password: data.password,
      });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Join EMU Clubs</h2>
        <p className="text-gray-600 mt-2">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            icon={<User className="w-4 h-4" />}
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
              }
            })}
          />

          <Input
            label="Last Name"
            icon={<User className="w-4 h-4" />}
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
              }
            })}
          />
        </div>

        <Input
          label="Student ID"
          placeholder="EMU2024001"
          icon={<Hash className="w-4 h-4" />}
          error={errors.studentId?.message}
          {...register('studentId', {
            required: 'Student ID is required',
            pattern: {
              value: /^EMU\d{7}$/,
              message: 'Student ID must be in format EMU2024001'
            }
          })}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="student@emu.edu.tr"
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
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number'
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'Passwords do not match'
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-emu-600 focus:ring-emu-500"
            {...register('terms', { required: 'You must agree to the terms' })}
          />
          <label className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-emu-600 hover:text-emu-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-emu-600 hover:text-emu-700">Privacy Policy</a>
          </label>
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >
          Create Account
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-emu-600 hover:text-emu-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};