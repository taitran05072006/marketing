import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductReviews, useAddReview, useDeleteReview } from '../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { StarRating } from './StarRating';
import { Button } from '../common/Button';
import { Pagination } from '../common/Pagination';
import { ErrorState } from '../common/ErrorState';
import { formatRelativeTime } from '../../utils/formatDate';
import type { ReviewCreateRequest } from '../../types/review.types';
import type { OrderItemResponse } from '../../types/order.types';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự').max(1000),
  orderItemId: z.number(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  productId: number;
  purchasedOrderItems?: OrderItemResponse[]; // order items for this product the user has bought
}

export function ReviewSection({ productId, purchasedOrderItems = [] }: ReviewSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [page, setPage] = useState(0);
  const [ratingValue, setRatingValue] = useState(5);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, refetch } = useProductReviews(productId, page);
  const addReview = useAddReview(productId);
  const deleteReview = useDeleteReview(productId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, orderItemId: purchasedOrderItems[0]?.id ?? 0 },
  });

  const onSubmit = async (data: ReviewFormData) => {
    const payload: ReviewCreateRequest = {
      productId,
      orderItemId: data.orderItemId,
      rating: ratingValue,
      content: data.content,
    };
    await addReview.mutateAsync(payload);
    reset();
    setShowForm(false);
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  const reviews = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  // Compute average rating from current page (approximate)
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-dark">Đánh giá sản phẩm</h2>
          {data && (
            <p className="text-sm text-gray-500 mt-1">
              {data.totalElements} đánh giá
              {avgRating > 0 && ` • Trung bình ${avgRating.toFixed(1)}/5`}
            </p>
          )}
        </div>
        {isAuthenticated && purchasedOrderItems.length > 0 && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl p-6 mb-8 border border-border">
          <h3 className="font-medium text-text-dark mb-4">Đánh giá của bạn</h3>

          {/* Rating stars */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Đánh giá sao</label>
            <StarRating
              rating={ratingValue}
              size="lg"
              interactive
              onRate={(r) => {
                setRatingValue(r);
                setValue('rating', r);
              }}
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
          </div>

          {/* Order item select if multiple */}
          {purchasedOrderItems.length > 1 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">Đơn hàng</label>
              <select
                {...register('orderItemId', { valueAsNumber: true })}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {purchasedOrderItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    Đơn #{item.id} - {item.productName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Content */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Nội dung đánh giá</label>
            <textarea
              {...register('content')}
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex gap-3">
            <Button type="submit" loading={addReview.isPending}>
              Gửi đánh giá
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Hủy
            </Button>
          </div>
        </form>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-text-dark text-sm">{review.userName}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{formatRelativeTime(review.createdAt)}</span>
                  {user && review.userName === user.email && (
                    <button
                      onClick={() => deleteReview.mutate(review.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
