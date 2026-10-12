'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
  honeypot: z.string().max(0, 'Bot detected').optional().or(z.literal('')), // Honeypot field
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check
    if (data.honeypot) {
      return; // Silent fail for bots
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccessMessage('Tin nhắn của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm nhất.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {successMessage && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Honeypot - hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <input type="text" {...register('honeypot')} tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <input
          type="text"
          placeholder="Họ tên"
          {...register('name')}
          className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary ${
            errors.name ? 'border-red-500' : 'border-border'
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary ${
            errors.email ? 'border-red-500' : 'border-border'
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          rows={5}
          placeholder="Tin nhắn"
          {...register('message')}
          className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none ${
            errors.message ? 'border-red-500' : 'border-border'
          }`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi'}
      </button>
    </form>
  );
}
