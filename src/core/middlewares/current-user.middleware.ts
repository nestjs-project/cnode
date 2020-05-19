import { Injectable, NestMiddleware, Request, Response, Next } from '@nestjs/common';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  use(req, res, next) {
    res.locals.current_user = null;
    const { user } = req;
    if (!user) {
      return next();
    }
    res.locals.current_user = user;
    next();
  }
} 