import { Module } from '@nestjs/common';
import { MongodbModule } from './mongodb';
import { ServicesModule } from './services'

@Module({
  imports: [MongodbModule, ServicesModule],
  exports: [MongodbModule, ServicesModule],
})
export class SharedModule {}
