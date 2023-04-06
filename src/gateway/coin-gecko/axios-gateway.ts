import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinGeckoAxiosGateway {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';
  private readonly platformId = 'avalanche';
  private readonly vsCurrency = 'usd';

  async getPrice(contractAddress: string): Promise<any> {
    const url = `${this.baseUrl}/simple/token_price/${this.platformId}?vs_currencies=${this.vsCurrency}&contract_addresses=${contractAddress}`;

    try {
      const resp = await axios.get(url);
      if (resp && resp.status === 200 && resp.data) {
        const key = contractAddress.toLowerCase();
        const value = resp.data[key][this.vsCurrency];
        return value;
      }
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
