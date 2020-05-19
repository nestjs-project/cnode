import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
// import { UserService } from './shared/mongodb/user';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    // private readonly userService: UserService
  ) {}

  @Get()
  // @Render('index')
  async root () {
    // const docs = await this.userService.findAll({});
    // return {
    //   // data: docs
    // }
    return 'hello world';
  }
}
