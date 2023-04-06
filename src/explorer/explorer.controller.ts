import { Controller, Get } from '@nestjs/common';
import { ExplorerService } from './explorer.service';
import { AvalancheTransaction } from '../gateway/web3/types/transaction';

@Controller('explorer')
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Get('/txn/:hash')
  async get(hash: string): Promise<AvalancheTransaction> {
    return this.explorerService.get(hash);
  }
}
