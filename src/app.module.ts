import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { Configuration } from './config';
import { UserModule } from './shared/mongodb/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(Configuration.get('mongodb_url'), { useNewUrlParser: true }),
    ConfigModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
