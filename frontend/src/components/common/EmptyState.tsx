import { PackageOpen, FileSearch, ShoppingCart, BookOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-gray-300 mb-4">
        {icon ?? <PackageOpen className="w-16 h-16" />}
      </div>
      <h3 className="text-xl font-semibold text-text-dark mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function EmptyProducts() {
  return (
    <EmptyState
      icon={<PackageOpen className="w-16 h-16" />}
      title="Không tìm thấy sản phẩm"
      description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
    />
  );
}

export function EmptyArticles() {
  return (
    <EmptyState
      icon={<BookOpen className="w-16 h-16" />}
      title="Chưa có bài viết"
      description="Chúng tôi đang chuẩn bị nội dung mới. Quay lại sớm nhé!"
    />
  );
}

export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-16 h-16" />}
      title="Giỏ hàng đang trống"
      description="Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm."
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={<FileSearch className="w-16 h-16" />}
      title="Không có kết quả"
      description="Thử tìm với từ khóa khác."
    />
  );
}
