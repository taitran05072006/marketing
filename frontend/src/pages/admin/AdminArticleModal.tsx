import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import { useCreateArticle, useUpdateArticle } from '../../hooks/useArticles';
import { useArticleCategories } from '../../hooks/useCategories';
import { uploadApi } from '../../api/uploadApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

const articleSchema = z.object({
  title: z.string().min(2, 'Vui lòng nhập tiêu đề'),
  slug: z.string().min(2, 'Vui lòng nhập slug'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Nội dung quá ngắn'),
  categoryId: z.number().min(1, 'Vui lòng chọn danh mục'),
  status: z.enum(['PUBLISHED', 'DRAFT']),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface Props {
  article: any | null; // using any for now or ArticleDetailResponse
  onClose: () => void;
}

export function AdminArticleModal({ article, onClose }: Props) {
  const isEditing = !!article;
  const { data: categories } = useArticleCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [thumbnailUrl, setThumbnailUrl] = useState<string>(article?.thumbnailUrl || '');
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      excerpt: article?.excerpt || '',
      content: article?.content || '',
      categoryId: categories?.find(c => c.name === article?.categoryName)?.id || 0,
      status: article?.status || 'DRAFT',
    }
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!isEditing) {
      const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadApi.uploadFile(file);
      setThumbnailUrl(url);
    } catch (err) {
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const payload = { ...data, thumbnailUrl, thumbnailAlt: data.title };
      if (isEditing) {
        await updateArticle.mutateAsync({ id: article.id, data: payload });
      } else {
        await createArticle.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu bài viết');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-text-dark">{isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Input label="Tiêu đề bài viết" required {...register('title')} onChange={handleTitleChange} error={errors.title?.message} />
              <Input label="Đường dẫn (Slug)" required {...register('slug')} error={errors.slug?.message} />
              
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Mô tả ngắn (Excerpt)</label>
                <textarea {...register('excerpt')} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Nội dung <span className="text-red-500">*</span></label>
                <textarea {...register('content')} rows={10} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono" placeholder="Nhập HTML hoặc nội dung chi tiết..." />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Trạng thái</label>
                <select {...register('status')} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Xuất bản</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Danh mục <span className="text-red-500">*</span></label>
                <select {...register('categoryId', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value={0}>Chọn danh mục</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Ảnh đại diện (Thumbnail)</label>
                {thumbnailUrl ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border group mb-3">
                    <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setThumbnailUrl('')} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <label className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-surface transition-colors mb-3">
                    {uploading ? <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" /> : (
                      <>
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-sm">Tải ảnh lên</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
            <Button type="submit" loading={createArticle.isPending || updateArticle.isPending}>Lưu bài viết</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
