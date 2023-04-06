import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { ExplorerModule } from './explorer/explorer.module';

@Module({
  imports: [ExplorerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
