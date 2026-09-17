import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });
      setSuccess(true);
      // Automatically redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-surface">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-border text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h2>
          <p className="text-gray-500 mb-8">
            Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập để bắt đầu mua sắm.
          </p>
          <Button onClick={() => navigate('/login')} fullWidth>
            Đến trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-border">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Đăng ký</h2>
          <p className="text-gray-500">Tạo tài khoản để trải nghiệm tốt hơn</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Họ và tên"
            placeholder="Nhập họ tên của bạn"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="nam@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Số điện thoại (tùy chọn)"
            type="tel"
            placeholder="0912345678"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="pt-2">
            <Button type="submit" fullWidth size="lg" loading={isLoading}>
              Đăng ký
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
