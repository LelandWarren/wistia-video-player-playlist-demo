import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [ApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
