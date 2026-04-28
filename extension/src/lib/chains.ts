// extension/src/lib/chains.ts

import {
  mainnet,
  sepolia,
  linea,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  avalanche,
} from 'viem/chains';
import type { Chain } from 'viem';

/** Все поддерживаемые сети */
export const supportedChains: Chain[] = [
  mainnet,
  sepolia,
  linea,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  avalanche,
];

/** Сеть по умолчанию (для первого запуска) */
export const defaultChain: Chain = sepolia;

/**
 * Получить объект сети по её ID.
 * @param chainId - числовой идентификатор сети
 * @returns Chain или undefined
 */
export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find((c) => c.id === chainId);
}

/**
 * Получить короткое название сети (например, для отображения в шапке).
 * @param chain - объект сети
 * @returns строка с названием
 */
export function getChainName(chain: Chain): string {
  return chain.name;
}