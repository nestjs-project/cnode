import { Controller, Get, Render, Post, Body, Query, UseGuards, Logger, Req, Res, All } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TRequest, TResponse, User } from '../../shared';
import { ConfigService } from '../../config';
import { RegisterDto, AccountDto } from './dto';
import { AuthService } from './auth.service';
import { ViewsPath } from '../../core';

/**
 * req/res as any 暂时解决项目不能运行问题
 */
@Controller()
export class AuthController {
    private readonly logger = new Logger(AuthController.name, true);
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService,
    ) {}

    /** 注册模板 */
    @Get('/register')
    @Render(ViewsPath.Register)
    async registerView() {
        return { pageTitle: '注册' };
    }

    /** 注册提交 */
    @Post('/register')
    @Render(ViewsPath.Register)
    async register(@Body() register: RegisterDto) {
        return await this.authService.register(register);
    }

    /** 激活账号 */
    @Get('/active_account')
    @Render(ViewsPath.Notify)
    async activeAccount(@Query() account: AccountDto) {
        return await this.authService.activeAccount(account);
    }

     /** 登录模板 */
     @Get('/login')
     @Render(ViewsPath.Login)
     async loginView(@Req() req: TRequest) {
         const error: string = req.flash('loginError')[0];
         console.log('loginView', error);
         return { pageTitle: '登录', error};
     }

     /** 本地登录提交 */
     @Post('/login')
     @UseGuards(AuthGuard('local'))
     async passportLocal(@Req() req: TRequest, @Res() res: TResponse) {
         this.logger.log(JSON.stringify((req as any).user));
         this.verifyLogin(req, res, (req as any).user);
     }

     /** github登录提交 */
     @Get('/github')
     @UseGuards(AuthGuard('github'))
     async github() {
         return null;
     }
 
     @Get('/github/callback')
     async githubCallback(@Req() req: TRequest, @Res() res: TResponse) {
         this.logger.log(JSON.stringify((req as any).user));
         const existUser = await this.authService.github((req as any).user);
         this.verifyLogin(req, res, existUser);
     }
 
     /** 登出 */
     @All('/logout')
     async logout(@Req() req: TRequest, @Res() res: TResponse) {
         // 销毁 session
         req.session.destroy();
         // 清除 cookie
         res.clearCookie(this.config.get('AUTH_COOKIE_NAME'), { path: '/' });
         // 调用 passport 的 logout方法
         (req as any).logout();
         // 重定向到首页
         res.redirect('/');
     }
 
     /** 验证登录 */
     private verifyLogin(@Req() req, @Res() res, user: User) {
         // id 存入 Cookie, 用于验证过期.
         const auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
         // 配置 Cookie
         const opts = {
             path: '/',
             maxAge: 1000 * 60 * 60 * 24 * 30,
             signed: true,
             httpOnly: true,
         };
         res.cookie(this.config.get('AUTH_COOKIE_NAME'), auth_token, opts); // cookie 有效期30天
         // 调用 passport 的 login方法 传递 user信息
         req.login(user, () => {
             // 重定向首页
             res.redirect('/');
         });
     }
}