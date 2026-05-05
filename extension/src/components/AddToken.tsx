import React, { useState } from 'react';
import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains'; // or defaultChain from your lib/chains
import { useTokens } from '../hooks/useTokens';

// Standard ERC-20 ABI
const ERC20_ABI = [
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
] as const;

const AddToken: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
  } | null>(null);

  const { addToken } = useTokens();

  const fetchTokenInfo = async () => {
    setError('');
    setTokenInfo(null);
    if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      setError('Invalid contract address');
      return;
    }

    setIsLoading(true);
    try {
      const client = createPublicClient({
        chain: sepolia, // or use defaultChain from lib/chains to support network switching
        transport: http(import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'),
      });

      const contract = getContract({
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        client,
      });

      const [name, symbol, decimals] = await Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals(),
      ]);

      setTokenInfo({ name, symbol, decimals: Number(decimals) });
    } catch (e: any) {
      setError('Failed to read token data. It may not be an ERC-20 contract.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async () => {
    if (!tokenInfo) return;
    try {
      await addToken({
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        contractAddress: contractAddress.toLowerCase(),
        decimals: tokenInfo.decimals,
      });
      onBack(); // return to token list
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Add Token</h2>
      </div>

      {/* Contract address field */}
      <div className="mb-4">
        <label className="text-sm text-muted mb-2 block">Contract Address (ERC-20)</label>
        <input
          type="text"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => { setContractAddress(e.target.value); setError(''); setTokenInfo(null); }}
          className="w-full p-3 border border-gray-300 rounded-xl text-md focus:outline-none focus:border-primary font-mono"
        />
        <button
          onClick={fetchTokenInfo}
          disabled={isLoading || contractAddress.length < 42}
          className="mt-2 text-primary text-sm font-medium hover:underline disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Find Token'}
        </button>
      </div>

      {/* Token data display */}
      {tokenInfo && (
        <div className="bg-light p-4 rounded-xl mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {tokenInfo.symbol.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-lg">{tokenInfo.name}</div>
              <div className="text-sm text-muted">{tokenInfo.symbol} • Decimals: {tokenInfo.decimals}</div>
            </div>
          </div>
          <button
            onClick={handleAddToken}
            className="mt-4 w-full py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Add Token
          </button>
        </div>
      )}

      {error && <p className="text-danger text-sm">{error}</p>}
    </div>
  );
};

export default AddToken;