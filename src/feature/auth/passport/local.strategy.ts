import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'name',
            passwordField: 'pass',
            passReqToCallback: false,
        });
    }

    // tslint:disable-next-line:ban-types
    async validate(username: string, password: string, done: Function) {
        await this.authService.local(username, password)
            .then(user => done(null, user))
            .catch(err => done(err, false));
    }
} 