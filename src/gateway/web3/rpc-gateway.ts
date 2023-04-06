import Web3 from 'web3';
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

  async getTransaction(txnHash: string): Promise<AvalancheTransaction> {
    try {
      const txn: Transaction = await this.web3.eth.getTransaction(txnHash);
      const txnDetails = await this.getTransactionDetails(txn);
      return txnDetails;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  private async getTransactionDetails(
    txn: Transaction,
  ): Promise<AvalancheTransaction> {
    const txnReceipt: TransactionReceipt =
      await this.web3.eth.getTransactionReceipt(txn.hash);

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