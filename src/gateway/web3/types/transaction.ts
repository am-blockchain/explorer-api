import { BigNumber } from 'mathjs';

export interface ERC20TokenTransfer {
  value: string;
  from: string;
  to: string;
  address: string;
  currentUsdPrice?: number;
}

export interface AvalancheTransaction {
  blockHash: string;
  blockNumber: number;
  // timestampSEC: number;
  // logs: OptimismLog[];
  hash: string;
  status: TxnStatus;
  transfers: ERC20TokenTransfer[];
  from: string;
  to: string;
  fee: BigNumber;
  gasUsed: BigNumber;
  gasPrice: BigNumber;
  nonce: number;
  transactionIndex: number;
}

export enum TxnStatus {
  Succeeded = 'succeeded',
  Failed = 'failed',
}
