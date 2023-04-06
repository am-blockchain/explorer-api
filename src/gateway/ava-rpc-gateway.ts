import Web3 from 'web3';
import * as math from 'mathjs';
import { Injectable } from '@nestjs/common';
import { Transaction, TransactionReceipt } from 'web3-core';
import {
  AvalancheTransaction,
  ERC20TokenTransfer,
  TxnStatus,
} from './types/transaction';

@Injectable()
export class RpcGateway {
  constructor() {
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

      // https://web3js.readthedocs.io/en/v1.7.5/web3-eth-abi.html#decodelog
      // https://ethereum.stackexchange.com/questions/79788/what-is-input-in-web3-eth-abi-decodeloginputs-hexstring-topics
      const decodedLog = this.web3.eth.abi.decodeLog(
        [
          {
            type: 'string',
            name: 'tokenTicker',
            indexed: true,
          },
          {
            type: 'address',
            name: 'from',
            indexed: true,
          },
          {
            type: 'address',
            name: 'to',
            indexed: true,
          },
          {
            type: 'uint256',
            name: 'value',
          },
        ],
        data,
        topics,
      );
      // address: smart contract address of the erc20 token being transferred
      // data: value (ie Amount) of the token being transferred
      // from: address initiating the token transfer
      // to: address receiving the token transfer

      const { from, to, value } = decodedLog;

      // console.log({ logs, topics, from, to, value });

      const tokenTransfer: ERC20TokenTransfer = {
        value,
        from,
        to,
        address,
      };

      tokenTransfers.push(tokenTransfer);
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
}