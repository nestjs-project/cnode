import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { Module } from '@nestjs/common';
import { UserDbService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserDbService],
  exports: [UserDbService],
})
export class UserModule {}
