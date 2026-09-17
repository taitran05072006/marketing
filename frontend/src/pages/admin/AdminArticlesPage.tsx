import { useState } from 'react';
import { useAdminArticles, useDeleteArticle, usePublishArticle } from '../../hooks/useArticles';
import { formatDateShort } from '../../utils/formatDate';
import { Pagination } from '../../components/common/Pagination';
import { ErrorState } from '../../components/common/ErrorState';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2, Globe, FileEdit } from 'lucide-react';
import { AdminArticleModal } from './AdminArticleModal';

export function AdminArticlesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useAdminArticles(page, 10);
  const deleteArticle = useDeleteArticle();
  const publishArticle = usePublishArticle();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  const handleCreate = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handlePublishToggle = (id: number, currentStatus: string) => {
    publishArticle.mutate({ id, isPublished: currentStatus !== 'PUBLISHED' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deleteArticle.mutate(id);
    }
  };

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-dark">Quản lý Bài viết</h2>
        <Button size="sm" className="flex items-center gap-1.5" onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Viết bài mới
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/50 text-gray-500 text-sm border-b border-border">
              <th className="py-4 px-6 font-medium">Bài viết</th>
              <th className="py-4 px-6 font-medium">Danh mục</th>
              <th className="py-4 px-6 font-medium">Tác giả</th>
              <th className="py-4 px-6 font-medium">Ngày cập nhật</th>
              <th className="py-4 px-6 font-medium text-center">Trạng thái</th>
              <th className="py-4 px-6 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-dark">
            {isLoading ? (
              <tr><td colSpan={6} className="py-12 text-center">Đang tải...</td></tr>
            ) : data?.content?.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-gray-500">Chưa có bài viết nào</td></tr>
            ) : (
              data?.content?.map(article => (
                <tr key={article.id} className="border-b border-border hover:bg-surface/30">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded border bg-surface overflow-hidden flex-shrink-0">
                        {article.thumbnailUrl && <img src={article.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="font-medium line-clamp-2 max-w-[250px]">{article.title}</div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-600">{article.categoryName}</td>
                  <td className="py-3 px-6 text-gray-600">{article.authorName}</td>
                  <td className="py-3 px-6 text-gray-600">{formatDateShort(article.updatedAt || article.createdAt)}</td>
                  <td className="py-3 px-6 text-center">
                    <button 
                      onClick={() => handlePublishToggle(article.id, article.status)}
                      disabled={publishArticle.isPending}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors disabled:opacity-50 ${
                      article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}>
                      {article.status === 'PUBLISHED' ? <Globe className="w-3 h-3" /> : <FileEdit className="w-3 h-3" />}
                      {article.status === 'PUBLISHED' ? 'Xuất bản' : 'Bản nháp'}
                    </button>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(article)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Xóa">
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
        <AdminArticleModal 
          article={editingArticle} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
