import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { SharedModule } from '../../shared';

@Module({
  imports: [SharedModule],
  controllers: [TopicController],
  providers: [TopicService]
})
export class TopicModule {}
