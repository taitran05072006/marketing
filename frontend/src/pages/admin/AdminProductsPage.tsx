import { useState } from 'react';
import { useAdminProducts, useDeleteProduct } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatCurrency';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AdminProductModal } from './AdminProductModal';
import type { ProductDetailResponse } from '../../types/product.types';

export function AdminProductsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useAdminProducts({ page, size: 10 });
  const deleteProduct = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetailResponse | null>(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductDetailResponse) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) {
      deleteProduct.mutate(id);
    }
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-dark">Quản lý Sản phẩm</h2>
        <Button onClick={handleCreate} size="sm" className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Thêm mới
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 text-gray-500 text-sm border-b border-border">
              <th className="py-4 px-6 font-medium">Sản phẩm</th>
              <th className="py-4 px-6 font-medium">Danh mục</th>
              <th className="py-4 px-6 font-medium text-right">Giá</th>
              <th className="py-4 px-6 font-medium text-right">Tồn kho</th>
              <th className="py-4 px-6 font-medium text-center">Trạng thái</th>
              <th className="py-4 px-6 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-dark">
            {isLoading ? (
              <tr><td colSpan={6} className="py-12 text-center">Đang tải...</td></tr>
            ) : data?.content?.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-500">Chưa có sản phẩm nào</td></tr>
            ) : (
              data?.content?.map(product => (
                <tr key={product.id} className="border-b border-border hover:bg-surface/30">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border bg-surface overflow-hidden flex-shrink-0">
                        {product.imageUrls?.[0] && <img src={product.imageUrls[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="font-medium line-clamp-2 max-w-[200px]">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-600">{product.categoryName}</td>
                  <td className="py-3 px-6 text-right font-medium">{formatCurrency(product.price)}</td>
                  <td className="py-3 px-6 text-right">
                    <span className={product.stock < 10 ? 'text-red-600 font-bold' : ''}>{product.stock}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-border flex justify-center">
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      {isModalOpen && (
        <AdminProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
