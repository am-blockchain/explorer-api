import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerService } from './explorer.service';
import { RpcGateway } from '../gateway/ava-rpc-gateway';

describe('ExplorerService', () => {
  let service: ExplorerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExplorerService, RpcGateway],
    }).compile();

    service = module.get<ExplorerService>(ExplorerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get txn details by hash', async () => {
    const txn = await service.get(
      '0x652a607aa1e1532d8ed23c779421adef4c185e3d5901b20b209c98aa857072ee',
    );

    const { transfers } = txn;
    expect(transfers.length).toBeGreaterThan(0);
    expect(transfers[0]).toHaveProperty('value');
    expect(transfers[0].from).toBe(
      '0x98781e67f63d17f59eada759ea9d8686a40d6f21',
    );
    expect(transfers[0].to).toBe('0x5e6e33864550a5fb514b1752bc3560a5c4dac8b9');
    expect(transfers[0].address).toBe(
      '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    );
  });
});
