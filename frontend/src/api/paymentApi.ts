import apiClient from './apiClient';

export const paymentApi = {
  // POST /api/payments/checkout/{orderId}?method={PAYOS|COD}
  createPaymentLink: async (orderId: number, method: 'PAYOS' | 'COD' = 'PAYOS'): Promise<string> => {
    const res = await apiClient.post<{ checkoutUrl: string }>(`/payments/checkout/${orderId}?method=${method}`);
    return res.data.checkoutUrl;
  },
};
