import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../../shared';
import { LocalStrategy, AuthSerializer, GithubStrategy } from './passport';
@Module({
  imports: [SharedModule],
  providers: [
    AuthService,
    AuthSerializer,
    LocalStrategy,
    GithubStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}