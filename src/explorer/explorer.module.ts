import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { RpcGateway } from '../gateway/ava-rpc-gateway';

@Module({
  controllers: [ExplorerController],
  providers: [ExplorerService, RpcGateway],
})
export class ExplorerModule {}
