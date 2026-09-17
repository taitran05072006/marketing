USE marketing;

-- Insert 3 categories
INSERT INTO product_categories (id, name, slug, description, created_at, updated_at) VALUES 
(1, 'Làm Sạch', 'lam-sach', 'Các sản phẩm làm sạch da như sữa rửa mặt, tẩy trang', NOW(), NOW()),
(2, 'Đặc Trị', 'dac-tri', 'Các sản phẩm serum, tinh chất đặc trị mụn, nám', NOW(), NOW()),
(3, 'Dưỡng Ẩm', 'duong-am', 'Kem dưỡng ẩm giúp da mềm mịn', NOW(), NOW());

-- Insert 10 products
INSERT INTO products (id, name, slug, description, price, stock, is_featured, status, category_id, created_at, updated_at) VALUES 
(1, 'Sữa Rửa Mặt Tinh Chất Trà Xanh', 'sua-rua-mat-tra-xanh', 'Sữa rửa mặt dịu nhẹ với chiết xuất trà xanh, giúp làm sạch sâu mà không gây khô da.', 250000.00, 50, 1, 'ACTIVE', 1, NOW(), NOW()),
(2, 'Nước Tẩy Trang Cấp Ẩm Hyaluronic', 'nuoc-tay-trang-ha', 'Tẩy trang nhẹ nhàng lấy đi lớp bụi bẩn, bảo vệ màng ẩm tự nhiên của da.', 320000.00, 100, 0, 'ACTIVE', 1, NOW(), NOW()),
(3, 'Serum Niacinamide 10% + Zinc 1%', 'serum-niacinamide-10', 'Serum giúp làm sáng da, thu nhỏ lỗ chân lông và kiểm soát dầu hiệu quả.', 450000.00, 30, 1, 'ACTIVE', 2, NOW(), NOW()),
(4, 'Tinh Chất Vitamin C 15% Sáng Da', 'tinh-chat-vit-c-15', 'Giúp chống oxy hoá mạnh mẽ, làm mờ vết thâm mụn và dưỡng da trắng sáng.', 550000.00, 25, 1, 'ACTIVE', 2, NOW(), NOW()),
(5, 'Kem Dưỡng Phục Hồi B5', 'kem-duong-phuc-hoi-b5', 'Kem dưỡng chứa Vitamin B5 và Ceramide giúp phục hồi hàng rào bảo vệ da nhanh chóng.', 380000.00, 80, 1, 'ACTIVE', 3, NOW(), NOW()),
(6, 'Kem Dưỡng Ẩm Dạng Gel Lô Hội', 'gel-duong-am-lo-hoi', 'Dưỡng ẩm mỏng nhẹ, thấm nhanh, làm dịu da tức thì, rất phù hợp cho da dầu mụn.', 290000.00, 45, 0, 'ACTIVE', 3, NOW(), NOW()),
(7, 'Tẩy Da Chết Hóa Học BHA 2%', 'tay-da-chet-bha-2', 'Làm sạch sâu lỗ chân lông, đẩy lùi mụn ẩn và mụn đầu đen.', 420000.00, 60, 1, 'ACTIVE', 2, NOW(), NOW()),
(8, 'Dầu Tẩy Trang Sạch Sâu', 'dau-tay-trang-sach-sau', 'Hòa tan lớp trang điểm chống nước, làm sạch bã nhờn mà vẫn giữ da mềm mại.', 350000.00, 40, 0, 'ACTIVE', 1, NOW(), NOW()),
(9, 'Kem Dưỡng Chống Lão Hóa Retinol 0.5%', 'kem-chong-lao-hoa-retinol', 'Kem dưỡng ban đêm chứa Retinol giúp làm mờ nếp nhăn và trẻ hoá làn da.', 650000.00, 15, 1, 'ACTIVE', 3, NOW(), NOW()),
(10, 'Mặt Nạ Bùn Khoáng Giảm Nhờn', 'mat-na-bun-khoang', 'Hút sạch bã nhờn, làm thông thoáng lỗ chân lông, thích hợp đắp hàng tuần.', 150000.00, 120, 0, 'ACTIVE', 1, NOW(), NOW());

-- Insert product images (one primary image per product)
INSERT INTO product_images (product_id, image_url, is_primary, sort_order, created_at) VALUES 
(1, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(2, 'https://images.unsplash.com/photo-1601049541289-9b1b7bb5c928?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(3, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(4, 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(5, 'https://images.unsplash.com/photo-1611079830811-865fc433d8b5?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(6, 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(7, 'https://images.unsplash.com/photo-1608248593801-ba455959bb8a?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(8, 'https://images.unsplash.com/photo-1571781564344-9dc9bb0b81f1?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(9, 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop', 1, 1, NOW()),
(10, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=600&auto=format&fit=crop', 1, 1, NOW());
