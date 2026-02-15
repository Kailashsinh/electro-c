import apiClient from './client';

export const applianceApi = {
  register: (data: {
    category: string;
    brand: string;
    model: string;
    purchaseDate: string;
    serial_number: string;
    invoiceNumber?: string;
    installation_address: string;
  }) => apiClient.post('/appliances', data),

  getMyAppliances: () => apiClient.get('/appliances/my'),
  searchCategories: (q: string) => apiClient.get(`/appliances/categories?q=${q}`),
  searchBrands: (q: string, categoryId?: string) => apiClient.get(`/appliances/brands?q=${q}&category_id=${categoryId || ''}`),
  searchModels: (q: string, brandId?: string) => apiClient.get(`/appliances/models?q=${q}&brand_id=${brandId || ''}`),
};
