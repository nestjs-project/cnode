import { Injectable, NestMiddleware } from '@nestjs/common';
import * as loader from 'loader';
// import loader = require('loader');
import { ConfigService, EnvConfig } from '../../config';
import { APP_CONFIG } from '../constants';

@Injectable()
export class LocalsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  use(req, res, next) {
    let assets = {};
    if (this.configService.get('MINI_ASSETS')) {
      try {
        assets = require('../../../assets.json');
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(
          'You must execute `make build` before start app when mini_assets is true.',
        );
        throw e;
      }
    }

    res.locals.config = APP_CONFIG;
    res.locals.Loader = loader;
    res.locals.assets = assets;
    next();
  }
}