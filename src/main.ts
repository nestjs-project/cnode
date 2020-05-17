import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as ejsMate from 'ejs-mate';
import * as loaderConnect from 'loader-connect';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 注意：这个要在express.static之前调用，loader2.0之后要使用loader-connect
  // 自动转换less为css
  app.use(loaderConnect.less(__dirname));

  // 所有的静态文件路径都前缀"/static", 需要使用“挂载”功能
  app.useStaticAssets(join(__dirname, '..', 'public'),{
    prefix: '/public/',   //设置虚拟路径
  });

  // 配置模板（视图）的基本目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // 指定视图引擎 处理.html后缀文件
  app.engine('html', ejsMate);

  // 配置视图引擎
  app.set('view engine', 'html');

  // await app.listen(Configuration.getEnv('PORT'));
  await app.listen(3000);
}
bootstrap();
