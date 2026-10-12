'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import apiClient from '@/api/apiClient';
import { formatDateShort } from '@/utils/formatDate';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const fetchArticles = () => {
    apiClient
      .get(`/admin/articles?page=0&size=50${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`)
      .then((res) => {
        setArticles(res.data.content || []);
      })
      .catch(() => {
        setArticles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, [keyword]);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await apiClient.put(`/admin/articles/${id}/status?status=${nextStatus}`);
      fetchArticles();
    } catch (e) {
      console.error('Failed to toggle article status', e);
    }
  };

  const deleteArticle = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await apiClient.delete(`/admin/articles/${id}`);
      fetchArticles();
    } catch (e) {
      console.error('Failed to delete article', e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-dark">Quản lý Bài viết</h1>
        <p className="text-gray-500 text-sm mt-1">Danh sách bài viết khoa học và kiến thức da liễu</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề bài viết..."
            className="flex-1 text-sm outline-none text-text-dark"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Đang tải danh sách bài viết...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Không tìm thấy bài viết nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface/50 text-gray-500 border-b border-border">
                  <th className="py-3 px-6 font-medium">Tiêu đề bài viết</th>
                  <th className="py-3 px-6 font-medium">Danh mục</th>
                  <th className="py-3 px-6 font-medium">Tác giả</th>
                  <th className="py-3 px-6 font-medium">Trạng thái</th>
                  <th className="py-3 px-6 font-medium">Ngày tạo</th>
                  <th className="py-3 px-6 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-surface/30">
                    <td className="py-3 px-6">
                      <p className="font-medium text-text-dark line-clamp-1">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.slug}</p>
                    </td>
                    <td className="py-3 px-6 text-gray-600">{a.categoryName}</td>
                    <td className="py-3 px-6 text-gray-600">{a.authorName}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => toggleStatus(a.id, a.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          a.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {a.status === 'PUBLISHED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {a.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-gray-500">{formatDateShort(a.createdAt)}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => deleteArticle(a.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
