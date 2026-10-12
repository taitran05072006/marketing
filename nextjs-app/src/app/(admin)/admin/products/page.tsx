'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';
import apiClient from '@/api/apiClient';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const fetchProducts = () => {
    apiClient
      .get(`/admin/products?page=0&size=50${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`)
      .then((res) => {
        setProducts(res.data.content || []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiClient.put(`/admin/products/${id}/status?status=${nextStatus}`);
      fetchProducts();
    } catch (e) {
      console.error('Failed to toggle product status', e);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-dark">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách sản phẩm trong hệ thống</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="flex-1 text-sm outline-none text-text-dark"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Đang tải danh sách sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Không tìm thấy sản phẩm nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface/50 text-gray-500 border-b border-border">
                  <th className="py-3 px-6 font-medium">Sản phẩm</th>
                  <th className="py-3 px-6 font-medium">Danh mục</th>
                  <th className="py-3 px-6 font-medium">Giá bán</th>
                  <th className="py-3 px-6 font-medium">Tồn kho</th>
                  <th className="py-3 px-6 font-medium">Trạng thái</th>
                  <th className="py-3 px-6 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/30">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface shrink-0">
                          {p.primaryImageUrl ? (
                            <Image src={p.primaryImageUrl} alt={p.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">💊</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-dark line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-gray-600">{p.categoryName}</td>
                    <td className="py-3 px-6 font-bold text-primary">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-6">{p.stock}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => toggleStatus(p.id, p.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          p.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {p.status === 'ACTIVE' ? 'Đang bán' : 'Tạm ẩn'}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
