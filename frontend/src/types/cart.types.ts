// Matches backend CartItemResponse DTO
export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  primaryImageUrl: string;
  quantity: number;
  price: number;
}

// Matches backend CartResponse DTO
export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  totalAmount: number;
}

// Matches backend CartItemRequest DTO
export interface CartItemRequest {
  productId: number;
  quantity: number;
}
