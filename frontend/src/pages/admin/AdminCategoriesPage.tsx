import { useState } from 'react';
import { useProductCategories, useArticleCategories, useCreateProductCategory, useDeleteProductCategory, useCreateArticleCategory, useDeleteArticleCategory } from '../../hooks/useCategories';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/common/Input';

const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function AdminCategoriesPage() {
  const { data: productCats, isLoading: loadingProducts } = useProductCategories();
  const { data: articleCats, isLoading: loadingArticles } = useArticleCategories();
  
  const createProductCat = useCreateProductCategory();
  const deleteProductCat = useDeleteProductCategory();
  
  const createArticleCat = useCreateArticleCategory();
  const deleteArticleCat = useDeleteArticleCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'product' | 'article'>('product');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema)
  });

  const openModal = (type: 'product' | 'article') => {
    setModalType(type);
    reset({ name: '', slug: '' });
    setModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (modalType === 'product') {
        await createProductCat.mutateAsync(data);
      } else {
        await createArticleCat.mutateAsync(data);
      }
      setModalOpen(false);
      reset();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu danh mục');
    }
  };

  const handleDelete = async (id: number, type: 'product' | 'article') => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      if (type === 'product') {
        await deleteProductCat.mutateAsync(id);
      } else {
        await deleteArticleCat.mutateAsync(id);
      }
    } catch (err) {
      alert('Không thể xóa danh mục. Có thể danh mục này đang chứa dữ liệu.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-border">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-dark">Danh mục Sản phẩm</h2>
          <Button size="sm" variant="outline" className="flex items-center gap-1.5" onClick={() => openModal('product')}>
            <Plus className="w-4 h-4" /> Thêm
          </Button>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-border">
            {loadingProducts ? (
              <li className="p-6 text-center text-gray-500">Đang tải...</li>
            ) : productCats?.map(cat => (
              <li key={cat.id} className="p-4 flex items-center justify-between hover:bg-surface/30">
                <div>
                  <h4 className="font-medium text-text-dark">{cat.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">/{cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(cat.id, 'product')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Article Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-border">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-dark">Danh mục Bài viết</h2>
          <Button size="sm" variant="outline" className="flex items-center gap-1.5" onClick={() => openModal('article')}>
            <Plus className="w-4 h-4" /> Thêm
          </Button>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-border">
            {loadingArticles ? (
              <li className="p-6 text-center text-gray-500">Đang tải...</li>
            ) : articleCats?.map(cat => (
              <li key={cat.id} className="p-4 flex items-center justify-between hover:bg-surface/30">
                <div>
                  <h4 className="font-medium text-text-dark">{cat.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">/{cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(cat.id, 'article')} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">
                {modalType === 'product' ? 'Thêm Danh mục Sản phẩm' : 'Thêm Danh mục Bài viết'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Tên danh mục"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Đường dẫn (slug)"
                {...register('slug')}
                error={errors.slug?.message}
                placeholder="vd: cham-soc-da"
              />
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" loading={createProductCat.isPending || createArticleCat.isPending}>
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
