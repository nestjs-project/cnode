import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TopicModule } from './topic/topic.module';

@Module({
    imports: [AuthModule, TopicModule],
    exports: [AuthModule, TopicModule],
})
export class FeatureModule {}
