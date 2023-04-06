import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { AvalancheRpcGateway } from '../gateway/web3/rpc-gateway';

@Module({
  controllers: [ExplorerController],
  providers: [ExplorerService, AvalancheRpcGateway],
})
export class ExplorerModule {}
