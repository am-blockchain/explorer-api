import { Injectable } from '@nestjs/common';
import { AvalancheRpcGateway } from '../gateway/web3/rpc-gateway';
import { AvalancheTransaction } from '../gateway/web3/types/transaction';

@Injectable()
export class ExplorerService {
  constructor(private readonly explorerGateway: AvalancheRpcGateway) {}

  async get(txnHash: string): Promise<AvalancheTransaction> {
    return this.explorerGateway.getTransaction(txnHash);
  }
}
