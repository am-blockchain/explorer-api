import { Test, TestingModule } from '@nestjs/testing';
import { RpcGateway } from './ava-rpc-gateway';

describe('ExplorerService', () => {
  let gateway: RpcGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpcGateway],
    }).compile();

    gateway = module.get<RpcGateway>(RpcGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should get txn details by hash', async () => {
    const result = await gateway.getTransaction(
      '0x0459a3eacf4c0dad19e02316e5e80287a77096ac71dc7f6a9f6a6668ecdda7d2',
    );

    console.log({ result });

    // expect(result.length).toBeGreaterThan(0);
    // expect(result[0]).toHaveProperty('value');
    // expect(result[0].from).toBe('0x187b2d576ba7ec2141c180A96eDd0f202492f36B');
    // expect(result[0].to).toBe('0x057538553Aab34f162b1beDD89914aA540a26073');
  });
});
