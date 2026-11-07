import apiClient from './apiClient';

const KNOWN_ACCOUNTS_KEY = 'bank_known_accounts_';

export const accountService = {
  // Store newly created accounts in localStorage cache per user for quick access
  saveKnownAccount(customerId, account) {
    try {
      const key = `${KNOWN_ACCOUNTS_KEY}${customerId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      if (!existing.some((a) => a.accountNumber === account.accountNumber)) {
        existing.push(account);
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  },

  getKnownAccounts(customerId) {
    try {
      const key = `${KNOWN_ACCOUNTS_KEY}${customerId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  async createAccount({ accountNumber, customerId, initialBalance, currency = 'INR' }) {
    const response = await apiClient.post('/accounts', {
      accountNumber,
      customerId,
      initialBalance: parseFloat(initialBalance),
      currency,
    });
    this.saveKnownAccount(customerId, response.data);
    return response.data;
  },

  async getAccountBalance(accountNumber) {
    const response = await apiClient.get(`/accounts/${accountNumber}/balance`);
    return response.data;
  },

  async getCustomerAccounts(customerId) {
    try {
      // Direct call to customer accounts endpoint
      const response = await apiClient.get(`/accounts/customer/${customerId}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach((acc) => this.saveKnownAccount(customerId, acc));
        return response.data;
      }
    } catch {
      // Fallback: load known accounts from cache and refresh their balances
    }

    const cached = this.getKnownAccounts(customerId);
    const refreshed = await Promise.all(
      cached.map(async (acc) => {
        try {
          const fresh = await this.getAccountBalance(acc.accountNumber);
          return fresh;
        } catch {
          return acc;
        }
      })
    );
    return refreshed;
  },
};

