import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { AvalancheRpcGateway } from '../gateway/web3/rpc-gateway';
import { CoinGeckoAxiosGateway } from '../gateway/coin-gecko/axios-gateway';

describe('ExplorerController', () => {
  let controller: ExplorerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExplorerController],
      providers: [ExplorerService, AvalancheRpcGateway, CoinGeckoAxiosGateway],
    }).compile();

    controller = module.get<ExplorerController>(ExplorerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get txn details by hash', async () => {
    // https://snowtrace.io/tx/0x1a706c98dc20588d7d9565ba9f2d577889cd1c1cb1fd9600e206bc4883676a07
    const txn = await controller.get(
      '0x1a706c98dc20588d7d9565ba9f2d577889cd1c1cb1fd9600e206bc4883676a07',
    );
    const { transfers } = txn;

    expect(transfers.length).toBeGreaterThan(0);
    expect(transfers[0]).toHaveProperty('value');
    expect(transfers[0].from).toBe(
      '0x11237ed9f89ca76bc3c04b58d639caa22e75bfc3',
    );
    expect(transfers[0].to).toBe('0xa17a5cd66fb95b4628fc64dc8fff32c6fade03a8');
    expect(transfers[0].address).toBe(
      '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    );
  });
});
