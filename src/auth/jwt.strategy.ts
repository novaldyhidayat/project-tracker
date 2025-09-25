import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.access_token;
          this.logger.debug(
            `Extracted token from cookies: ${token ? 'exists' : 'not found'}`,
          );
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    if (!payload || !payload.sub) {
      this.logger.error('Invalid JWT payload: missing sub field');
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.logger.error(`User not found with id: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }
      this.logger.debug(`User validated: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Error during JWT validation: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
