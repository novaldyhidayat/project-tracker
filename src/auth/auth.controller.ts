import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax' | 'strict' | 'none' | boolean;
      maxAge: number;
      path: string;
      domain?: string;
    } = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
      path: '/',
      domain: isProduction ? 'yourdomain.com' : undefined,
    };

    res.cookie('access_token', tokens.access_token, cookieOptions);
    res.cookie('refresh_token', tokens.refresh_token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log('Cookies set with options:', {
      ...cookieOptions,
      access_token: `${tokens.access_token.substring(0, 10)}...`,
      refresh_token: `${tokens.refresh_token.substring(0, 10)}...`,
    });

    let redirectUrl = '/board';
    if (req.user.role === 'superadmin') {
      redirectUrl = '/company';
    } else if (req.user.role === 'owner') {
      redirectUrl = '/dashboard';
    } else if (
      req.user.role === 'project_manager' ||
      req.user.role === 'employee'
    ) {
      redirectUrl = '/projects';
    }

    return { ...tokens, redirectUrl };
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.redirect('/login');
  }
}
