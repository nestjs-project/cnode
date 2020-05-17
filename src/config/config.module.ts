import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigToken } from './config.constants';
import { EnvConfig } from './config.interface';

@Global()
@Module({})
export class ConfigModule {
  // 默认用2种注册服务的写法，一种是类，一种是工厂。前面基础篇已经提及了，后面讲怎么使用它们。
  static forRoot<T = EnvConfig>(filePath?: string, validator?: (envConfig: T) => T): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useValue: new ConfigService(filePath || `${process.env.NODE_ENV || 'development'}.env`, validator),
        },
        {
          provide: ConfigToken,
          useFactory: () => new ConfigService(filePath || `${process.env.NODE_ENV || 'development'}.env`, validator),
        },
      ],
      exports: [
        ConfigService,
        ConfigToken,
      ],
    };
  }
}
