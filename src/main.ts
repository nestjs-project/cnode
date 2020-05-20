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
import * as passport from 'passport';
import * as flash from 'connect-flash';

import { AppModule } from './app.module';
import { HttpExceptionFilter, ConfigService } from './core';
import { TRequest, TResponse, TNext } from './shared';
import { RedisConfig, ExpressConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 不知道这个初始化有什么用，先注释
  // 初始化
  //  app.init();

  // 根目录 nest-cnode
  const rootDir = ConfigService.root();

  const expressConfig = ConfigService.get<ExpressConfig>('express');

  // 注意：这个要在express.static之前调用，loader2.0之后要使用loader-connect
  // 自动转换less为css
  if (expressConfig.isDevelopment()) {
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
  const secret = expressConfig.secret;
  const redisConfig = ConfigService.get<RedisConfig>('redis');
  const redisClient = redis.createClient(redisConfig);
  redisClient.unref()
  redisClient.on('error', console.error)

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

  // 注册消息中间件
  app.use(flash());

  // 注册passport中间件
  app.use(passport.initialize());
  app.use(passport.session());

  // 防止跨站请求伪造
  app.use(csurf({ cookie: true }));
  // 设置变量 csrf 保存csrfToken值
  app.use((req: TRequest, res: TResponse, next: TNext) => {
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

  await app.listen(expressConfig.port, expressConfig.host);
}

bootstrap();
