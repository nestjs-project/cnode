import { Module } from '@nestjs/common';
import { ConfigModule, EnvConfig } from '../config';
import { ConfigValidate } from './config.validate';

@Module({
  imports: [
    ConfigModule.forRoot<EnvConfig>(null, ConfigValidate.validateInput),
  ],
})
export class CoreModule {
}