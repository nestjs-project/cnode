import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, EnvConfig } from '../config';
import { ConfigValidate } from './config.validate';
import { ConfigService } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot<EnvConfig>(null, ConfigValidate.validateInput),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          uri: configService.get('MONGODB_URI'),
          useNewUrlParser: true,
      }),
      inject: [ConfigService],
  }),
  ],
})
export class CoreModule {
}