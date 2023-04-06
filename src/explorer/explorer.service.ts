import { Injectable } from '@nestjs/common';
import { RpcGateway } from '../gateway/ava-rpc-gateway';
import { AvalancheTransaction } from '../gateway/types/transaction';

@Injectable()
export class ExplorerService {
  constructor(private readonly explorerGateway: RpcGateway) {}

  async get(txnHash: string): Promise<AvalancheTransaction> {
    return this.explorerGateway.getTransaction(txnHash);
  }
}
