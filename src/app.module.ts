import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config';
import { UserModule } from './shared/mongodb/user/user.module';
import { CoreModule } from './core/core.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          uri: configService.get('MONGODB_URI'),
          useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
    CoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
