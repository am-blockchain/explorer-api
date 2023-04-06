import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { AvalancheRpcGateway } from '../gateway/web3/rpc-gateway';
import { CoinGeckoAxiosGateway } from '../gateway/coin-gecko/axios-gateway';

@Module({
  controllers: [ExplorerController],
  providers: [ExplorerService, AvalancheRpcGateway, CoinGeckoAxiosGateway],
})
export class ExplorerModule {}
