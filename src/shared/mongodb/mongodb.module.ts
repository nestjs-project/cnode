import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TopicDbModule } from './topic';

@Module({
  imports: [UserModule, TopicDbModule],
  exports: [UserModule, TopicDbModule],
})
export class MongodbModule {}