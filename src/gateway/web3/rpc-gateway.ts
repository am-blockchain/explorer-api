import Web3 from 'web3';
import NodeCache from 'node-cache';
import * as math from 'mathjs';
import { Injectable } from '@nestjs/common';
import { Transaction, TransactionReceipt } from 'web3-core';
import {
  AvalancheTransaction,
  ERC20TokenTransfer,
  TxnStatus,
} from './types/transaction';
import { CoinGeckoAxiosGateway } from '../coin-gecko/axios-gateway';

@Injectable()
export class AvalancheRpcGateway {
  constructor(private readonly coinGeckoGateway: CoinGeckoAxiosGateway) {
    this.web3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
  }

  private readonly web3: Web3;
  private txnMap = new NodeCache({ stdTTL: 1000, checkperiod: 200 });
  private receiptMap = new NodeCache({ stdTTL: 1000, checkperiod: 200 });
  // blockchain txns are immutable, so we dont need to make the call to the RPC node every time
  // we can just cache the results
  // this also makes our endpoint return results very fast
  // however, in-memory caching should be used for limited amount of data
  // the data can also be lost very easily if the server crashes or restarts
  // we should be using a remote cache server such as Redis

  async getTransaction(txnHash: string): Promise<AvalancheTransaction> {
    try {
      let txn: Transaction;

      // we are using `cache aside pattern`
      if (this.txnMap.get(txnHash)) {
        console.log(`Transaction ${txnHash} found in the local cache`);
        txn = this.txnMap.get(txnHash);
      } else {
        console.log(`Requesting Transaction ${txnHash} from the remote node`);
        txn = await this.web3.eth.getTransaction(txnHash);
        this.txnMap.set(txnHash, txn);
      }

      const txnDetails = await this.getTransactionDetails(txn);
      return txnDetails;
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  private async getTransactionDetails(
    txn: Transaction,
  ): Promise<AvalancheTransaction> {
    let txnReceipt: TransactionReceipt;

    if (this.receiptMap.get(txn.hash)) {
      console.log(
        `Transaction Receipt for ${txn.hash} found in the local cache`,
      );
      txnReceipt = this.receiptMap.get(txn.hash);
    } else {
      console.log(
        `Requesting Transaction Receipt for ${txn.hash} from the remote node`,
      );
      txnReceipt = await this.web3.eth.getTransactionReceipt(txn.hash);
      this.receiptMap.set(txn.hash, txnReceipt);
    }

    const {
      blockHash,
      blockNumber,
      gasPrice,
      hash,
      to,
      from,
      nonce,
      transactionIndex,
    } = txn;
    const { gasUsed, status, logs } = txnReceipt;
    const tokenTransfers: ERC20TokenTransfer[] =
      new Array<ERC20TokenTransfer>();

    for (const log of logs) {
      const { address, data, topics } = log;

      if (
        topics.length === 3 &&
        topics[0] ===
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      ) {
        // address: smart contract address of the erc20 token being transferred
        // value: amount of the token being transferred
        // from: address initiating the token transfer
        // to: address receiving the token transfer
        const value = this.web3.utils.toBN(data).toString();
        const from = this.hexToCleanAddress(topics[1]);
        const to = this.hexToCleanAddress(topics[2]);

        const currentUsdPrice = await this.coinGeckoGateway.getPrice(address);

        const tokenTransfer: ERC20TokenTransfer = {
          value,
          from,
          to,
          address: address.toLowerCase(),
          currentUsdPrice,
        };

        tokenTransfers.push(tokenTransfer);
      }
    }

    const txnDetails: AvalancheTransaction = {
      blockHash,
      blockNumber,
      hash,
      status: status ? TxnStatus.Succeeded : TxnStatus.Failed,
      transfers: tokenTransfers,
      from,
      to,
      fee: undefined,
      gasUsed: math.bignumber(gasUsed),
      gasPrice: math.bignumber(gasPrice),
      nonce,
      transactionIndex,
    };
    return txnDetails;
  }

  private hexToCleanAddress(hex: string) {
    const address = this.web3.eth.abi.decodeParameter('address', hex);
    return address.toLowerCase();
  }
}
