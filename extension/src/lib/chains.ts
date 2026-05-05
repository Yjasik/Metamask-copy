
import {
  // mainnet,
  sepolia,
  // linea,
  // polygon,
  // optimism,
  // arbitrum,
  // base,
  // bsc,
  // avalanche,
} from 'viem/chains';
import type { Chain } from 'viem';

export const supportedChains: Chain[] = [
  // mainnet,
  sepolia,
  // linea,
  // polygon,
  // optimism,
  // arbitrum,
  // base,
  // bsc,
  // avalanche,
];

export const defaultChain: Chain = sepolia;

export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find((c) => c.id === chainId);
}

export function getChainName(chain: Chain): string {
  return chain.name;
}