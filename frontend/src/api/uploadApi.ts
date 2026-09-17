import apiClient from './apiClient';

export const uploadApi = {
  // POST /api/admin/files/upload (multipart)
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ url: string }>('/admin/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  },
};
