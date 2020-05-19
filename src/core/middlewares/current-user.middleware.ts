import { Injectable, NestMiddleware } from '@nestjs/common';
import { TRequest, TResponse, TNext } from '../../shared';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  use(req: TRequest, res: TResponse, next: TNext) {
    res.locals.current_user = null;
    const { user } = req as any;
    if (!user) {
      return next();
    }
    res.locals.current_user = user;
    next();
  }
} 