import { useState, useEffect, useCallback } from 'react';

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

interface EtherscanTransaction {
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value: string;
    txreceipt_status: string;
    gasPrice: string;
    gasUsed: string;
    isError: string;
    input: string;
}

export interface FormattedTransaction {
    date: Date;
    hash: string;
    from: string;
    to: string;
    value: string;
    status: 'pending' | 'success' | 'failed';
    isIncoming: boolean;
}

export function useActivity(address: string | null, chainId: number) {
    const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        if (!address) return;
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = 'https://api.etherscan.io/v2/api';

            const params = new URLSearchParams({
            chainid: String(chainId),
            module: 'account',
            action: 'txlist',
            address: address,
            startblock: '0',
            endblock: '99999999',
            page: '1',
            offset: '50',
            sort: 'desc',
            apikey: ETHERSCAN_API_KEY,
            });

            const response = await fetch(`${apiUrl}?${params.toString()}`);

            if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === '1') {
            const rawTxs: EtherscanTransaction[] = data.result;
            const formattedTxs = formatTransactions(rawTxs, address);
            setTransactions(formattedTxs);
            } else {
            setError(data.message || 'Failed to load transactions');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setIsLoading(false);
        }
        }, [address, chainId]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const formatTransactions = (rawTxs: EtherscanTransaction[], currentAddress: string): FormattedTransaction[] => {
      return rawTxs.map(tx => {
        const valueInEther = parseFloat(tx.value) / 1e18;
        const isIncoming = tx.to.toLowerCase() === currentAddress.toLowerCase();
        let status: 'pending' | 'success' | 'failed' = 'pending';

        if (tx.txreceipt_status === '1') status = 'success';
        else if (tx.txreceipt_status === '0') status = 'failed';

        return {
        date: new Date(parseInt(tx.timeStamp) * 1000),
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: valueInEther.toFixed(4),
        status,
        isIncoming,
        };
      });
    };

    return { transactions, isLoading, error, refetch: fetchTransactions };
}