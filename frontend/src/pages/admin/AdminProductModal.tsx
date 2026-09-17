import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Trash2 } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { useProductCategories } from '../../hooks/useCategories';
import { uploadApi } from '../../api/uploadApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { ProductDetailResponse } from '../../types/product.types';

const productSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập tên sản phẩm'),
  slug: z.string().min(2, 'Vui lòng nhập slug'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá không hợp lệ'),
  stock: z.number().min(0, 'Tồn kho không hợp lệ'),
  categoryId: z.number().min(1, 'Vui lòng chọn danh mục'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  isFeatured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  product: ProductDetailResponse | null;
  onClose: () => void;
}

export function AdminProductModal({ product, onClose }: Props) {
  const isEditing = !!product;
  const { data: categories } = useProductCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls || []);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      categoryId: categories?.find(c => c.name === product?.categoryName)?.id || 0,
      status: product?.status || 'ACTIVE',
      isFeatured: product?.isFeatured || false,
    }
  });

  // Auto generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    if (!isEditing) {
      const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', slug);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadApi.uploadFile(file);
      setImageUrls(prev => [...prev, url]);
    } catch (err) {
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = { ...data, imageUrls };
      if (isEditing) {
        await updateProduct.mutateAsync({ id: product.id, data: payload });
      } else {
        await createProduct.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-text-dark">{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input label="Tên sản phẩm" required {...register('name')} onChange={handleNameChange} error={errors.name?.message} />
              <Input label="Đường dẫn (Slug)" required {...register('slug')} error={errors.slug?.message} />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Giá bán (VNĐ)" type="number" required {...register('price', { valueAsNumber: true })} error={errors.price?.message} />
                <Input label="Tồn kho" type="number" required {...register('stock', { valueAsNumber: true })} error={errors.stock?.message} />
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Danh mục <span className="text-red-500">*</span></label>
                <select {...register('categoryId', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value={0}>Chọn danh mục</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark block mb-1.5">Trạng thái</label>
                  <select {...register('status')} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm ẩn</option>
                  </select>
                </div>
                <div className="flex items-center mt-8">
                  <input type="checkbox" id="isFeatured" {...register('isFeatured')} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                  <label htmlFor="isFeatured" className="ml-2 text-sm text-text-dark font-medium">Sản phẩm nổi bật</label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Mô tả sản phẩm</label>
                <textarea {...register('description')} rows={5} className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark block mb-1.5">Hình ảnh (Upload)</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImageUrls(urls => urls.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-surface transition-colors">
                    {uploading ? <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" /> : <Upload className="w-6 h-6" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
            <Button type="submit" loading={createProduct.isPending || updateProduct.isPending}>Lưu sản phẩm</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
