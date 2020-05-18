import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { FeatureModule } from './feature/feature.module';

// APP 模块不需要引入 shared 模块，shared 模式给业务模块引用的，APP 模块只需要引入 CoreModule, feature 模块就可以了。
@Module({
  imports: [
    CoreModule,
    FeatureModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
