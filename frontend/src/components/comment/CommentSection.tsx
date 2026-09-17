import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useArticleComments, useAddComment, useDeleteComment } from '../../hooks/useComments';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Pagination } from '../common/Pagination';
import { ErrorState } from '../common/ErrorState';
import { formatRelativeTime } from '../../utils/formatDate';
import type { CommentResponse } from '../../types/comment.types';

const commentSchema = z.object({
  content: z.string().min(3, 'Nội dung quá ngắn').max(1000, 'Nội dung không được vượt quá 1000 ký tự'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentItemProps {
  comment: CommentResponse;
  articleId: number;
  depth?: number;
  currentUserEmail?: string;
  onDelete: (commentId: number) => void;
  onReply: (parentId: number) => void;
}

function CommentItem({ comment, depth = 0, currentUserEmail, onDelete, onReply }: CommentItemProps) {
  return (
    <div className={depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}>
      <div className="bg-white border border-border rounded-2xl p-4 mb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
              {comment.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-medium text-text-dark text-sm">{comment.userName}</span>
              <span className="text-xs text-gray-400 ml-2">{formatRelativeTime(comment.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {depth === 0 && (
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs text-secondary hover:text-primary transition-colors"
              >
                Trả lời
              </button>
            )}
            {currentUserEmail && comment.userName === currentUserEmail && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Xóa
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={0}
              depth={depth + 1}
              currentUserEmail={currentUserEmail}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentSectionProps {
  articleId: number;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [page, setPage] = useState(0);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useArticleComments(articleId, page);
  const addComment = useAddComment(articleId);
  const deleteComment = useDeleteComment(articleId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({ resolver: zodResolver(commentSchema) });

  const onSubmit = async (formData: CommentFormData) => {
    await addComment.mutateAsync({
      content: formData.content,
      parentId: replyingTo ?? undefined,
    });
    reset();
    setReplyingTo(null);
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  const comments = data?.content ?? [];

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-text-dark mb-6">
        Bình luận {data ? `(${data.totalElements})` : ''}
      </h2>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <span>Đang trả lời bình luận #{replyingTo}</span>
              <button type="button" onClick={() => setReplyingTo(null)} className="text-primary hover:underline">
                Hủy
              </button>
            </div>
          )}
          <textarea
            {...register('content')}
            rows={3}
            placeholder="Chia sẻ suy nghĩ của bạn..."
            className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          <div className="mt-3 flex justify-end">
            <Button type="submit" loading={addComment.isPending}>
              Gửi bình luận
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-surface rounded-2xl p-4 text-center text-sm text-gray-500">
          <a href="/login" className="text-primary font-medium hover:underline">Đăng nhập</a> để bình luận.
        </div>
      )}

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-20" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Chưa có bình luận nào.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              currentUserEmail={user?.email}
              onDelete={(id) => deleteComment.mutate(id)}
              onReply={(parentId) => setReplyingTo(parentId)}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 0} onPageChange={setPage} />
    </div>
  );
}
