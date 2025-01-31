import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transport/nats.module';

@Module({
  controllers: [ProductsController],
  imports: [NatsModule]
})
export class ProductsModule {}
