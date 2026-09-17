import type { OrderStatus } from '../types/common.types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPING: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const SKIN_CONCERNS = [
  {
    label: 'Da mụn',
    description: 'Kiểm soát mụn, giảm viêm, làm sạch sâu',
    icon: '🫧',
    categoryKeyword: 'mun',
  },
  {
    label: 'Da dầu',
    description: 'Kiểm soát bã nhờn, se khít lỗ chân lông',
    icon: '✨',
    categoryKeyword: 'dau',
  },
  {
    label: 'Da khô',
    description: 'Cấp ẩm chuyên sâu, phục hồi hàng rào da',
    icon: '💧',
    categoryKeyword: 'kho',
  },
  {
    label: 'Da nhạy cảm',
    description: 'Dịu nhẹ, kháng kích ứng, củng cố da',
    icon: '🌿',
    categoryKeyword: 'nhay-cam',
  },
  {
    label: 'Da thâm',
    description: 'Sáng đều màu da, mờ thâm nám, đốm đen',
    icon: '🌸',
    categoryKeyword: 'tham',
  },
];

export const WHY_US_FEATURES = [
  {
    icon: '🔬',
    title: 'Kiến thức khoa học',
    description: 'Mọi sản phẩm đều được nghiên cứu và kiểm chứng bởi chuyên gia da liễu.',
  },
  {
    icon: '📋',
    title: 'Thông tin minh bạch',
    description: 'Công bố đầy đủ thành phần, công dụng và nguồn gốc xuất xứ rõ ràng.',
  },
  {
    icon: '🎯',
    title: 'Phù hợp từng loại da',
    description: 'Tư vấn chọn sản phẩm theo đúng loại da và nhu cầu cụ thể của bạn.',
  },
  {
    icon: '🌱',
    title: 'Chăm sóc bền vững',
    description: 'Cam kết sản phẩm thân thiện môi trường và phát triển bền vững lâu dài.',
  },
];
