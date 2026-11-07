import apiClient from './apiClient';

export const transferService = {
  /**
   * Initiates a fund transfer.
   * Backend orchestrates: Fraud Check -> Ledger Debit -> Ledger Credit -> Kafka Notification Event
   */
  async initiateTransfer({ sourceAccount, destinationAccount, amount, currency = 'INR' }) {
    const response = await apiClient.post('/transfers', {
      sourceAccount,
      destinationAccount,
      amount: parseFloat(amount),
      currency,
    });
    return response.data;
  },

  /**
   * Retrieves status of a transfer transaction by reference.
   */
  async getTransferStatus(transactionReference) {
    const response = await apiClient.get(`/transfers/${transactionReference}`);
    return response.data;
  },
};

