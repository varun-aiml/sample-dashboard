export type Transaction = {
    transactionId: string;
    customerName: string;
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
};

const BASE_URL = 'http://localhost:8080';

export async function fetchAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${BASE_URL}/api/transactions`);
    if (!response.ok) {
        throw new Error('Failed to fetch transactions');
    }
    return response.json();
}

export async function fetchSuccessfulTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${BASE_URL}/api/transactions/success`);
    if (!response.ok) {
        throw new Error('Failed to fetch successful transactions');
    }
    return response.json();
}

export async function fetchFailedTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${BASE_URL}/api/transactions/failed`);
    if (!response.ok) {
        throw new Error('Failed to fetch failed transactions');
    }
    return response.json();
}
