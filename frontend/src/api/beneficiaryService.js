import apiClient from './apiClient';

export const beneficiaryService = {
  async getBeneficiaries(customerId) {
    const response = await apiClient.get(`/beneficiaries/customer/${customerId}`);
    return response.data;
  },

  async addBeneficiary({ customerId, beneficiaryName, beneficiaryAccount, bankName, ifscCode }) {
    const response = await apiClient.post('/beneficiaries', {
      customerId,
      beneficiaryName,
      beneficiaryAccount,
      bankName: bankName || 'Partner Bank',
      ifscCode: ifscCode || 'BANK0001234',
    });
    return response.data;
  },

  async deleteBeneficiary(id, customerId) {
    const response = await apiClient.delete(`/beneficiaries/${id}/customer/${customerId}`);
    return response.data;
  },
};

