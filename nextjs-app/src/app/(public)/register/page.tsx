'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setIsLoading(true);
      const res = await apiClient.post('/auth/register', data);
      login(res.data.accessToken, res.data.user);
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface/50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-500 text-sm">Trở thành thành viên của YLAN</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Họ và tên</label>
            <input
              type="text"
              {...register('name')}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Số điện thoại</label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="0912345678"
              className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm text-text-dark transition-colors"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60 mt-2"
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
