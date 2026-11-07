import apiClient from './apiClient';

export const ledgerService = {
  /**
   * Retrieves ledger transaction history for an account
   * Returns list of { id, transactionReference, accountNumber, entryType, amount, balanceAfter, createdAt }
   */
  async getAccountHistory(accountNumber) {
    const response = await apiClient.get(`/ledger/history/${accountNumber}`);
    return response.data;
  },

  /**
   * Process manual ledger operation (DEBIT or CREDIT) if needed for admin/testing
   */
  async processOperation({ reference, accountNumber, amount, operationType }) {
    const response = await apiClient.post('/ledger/process', {
      transactionReference: reference,
      accountNumber,
      amount: parseFloat(amount),
      operationType,
    });
    return response.data;
  },
};

