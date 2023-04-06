import { Test, TestingModule } from '@nestjs/testing';
import { CoinGeckoAxiosGateway } from './axios-gateway';

describe('CoinGeckoAxiosGateway', () => {
  let gateway: CoinGeckoAxiosGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinGeckoAxiosGateway],
    }).compile();

    gateway = module.get<CoinGeckoAxiosGateway>(CoinGeckoAxiosGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should get current price for token', async () => {
    const contractAddresss = '0x8a0cAc13c7da965a312f08ea4229c37869e85cB9'; // GRT.e token
    const price = await gateway.getPrice(contractAddresss);

    expect(price).toBeDefined();
  });
});
