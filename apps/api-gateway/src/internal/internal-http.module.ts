import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InternalHttpService } from './internal-http.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 0,
    }),
  ],
  providers: [InternalHttpService],
  exports: [HttpModule, InternalHttpService],
})
export class InternalHttpModule {}
