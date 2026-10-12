'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';

export default function AdminCategoriesPage() {
  const [productCats, setProductCats] = useState<any[]>([]);
  const [articleCats, setArticleCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    Promise.all([
      apiClient.get('/admin/product-categories').catch(() => ({ data: [] })),
      apiClient.get('/admin/article-categories').catch(() => ({ data: [] })),
    ])
      .then(([pRes, aRes]) => {
        setProductCats(pRes.data || []);
        setArticleCats(aRes.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-dark">Quản lý Danh mục</h1>
        <p className="text-gray-500 text-sm mt-1">Danh mục sản phẩm và chủ đề bài viết</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Danh mục sản phẩm */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-serif font-bold text-text-dark">Danh mục Sản phẩm</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Đang tải...</p>
          ) : productCats.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có danh mục sản phẩm nào.</p>
          ) : (
            <div className="divide-y divide-border">
              {productCats.map((cat) => (
                <div key={cat.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-text-dark text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danh mục bài viết */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-serif font-bold text-text-dark">Danh mục Bài viết</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Đang tải...</p>
          ) : articleCats.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có danh mục bài viết nào.</p>
          ) : (
            <div className="divide-y divide-border">
              {articleCats.map((cat) => (
                <div key={cat.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-text-dark text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">/{cat.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
