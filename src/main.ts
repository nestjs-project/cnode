import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as ejsMate from 'ejs-mate';
import * as loaderConnect from 'loader-connect';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as connectRedis from 'connect-redis';
import * as redis from 'redis'; 
import * as csurf from 'csurf';

import { AppModule } from './app.module';
import { ConfigService } from './config';
import { getRedisConfig } from './tools';
import { HttpExceptionFilter } from './core/filters';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  // 根目录 nest-cnode
  const rootDir = join(__dirname, '..');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config: ConfigService<any> = app.get(ConfigService);

  // 注意：这个要在express.static之前调用，loader2.0之后要使用loader-connect
  // 自动转换less为css
  if (config.isDevelopment) {
    app.use(loaderConnect.less(rootDir));
  }

  // prefix 所有的静态文件路径添加前缀"/static", 需要使用“挂载”功能
  app.useStaticAssets(join(__dirname, '..', 'public'),{
    prefix: '/public/',   //设置虚拟路径
  });
  // 配置模板（视图）的基本目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 指定视图引擎 处理.html后缀文件
  app.engine('html', ejsMate);
  // 配置视图引擎
  app.set('view engine', 'html');
  
  // 链接Redis
  const RedisStore = connectRedis(expressSession);
  const secret = config.get('SESSION_SECRET');
  const redisClient = redis.createClient(getRedisConfig(config));
  redisClient.unref()
  redisClient.on('error', console.log)

  // 注册session中间件
  app.use(expressSession({
    name: 'jiayi',
    secret,  // 用来对sessionid 相关的 cookie 进行签名
    store: new RedisStore({client: redisClient}),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
  }));

  // 注册cookies中间件
  app.use(cookieParser(secret));

  // 防止跨站请求伪造
  app.use(csurf({ cookie: true }));
  // 设置变量 csrf 保存csrfToken值
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.csrf = (req as any).csrfToken ? (req as any).csrfToken() : '';
    next();
  });

  // 注册并配置全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
    forbidUnknownValues: true,
  }));

  // 注册全局http异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // await app.listen(Configuration.getEnv('PORT'));
  await app.listen(3000);
}

bootstrap();
