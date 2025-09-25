import { Controller, Get, Render, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { TaskStatus } from '../schemas/task.schema';

@Controller()
export class ViewsController {
  constructor(private readonly jwtService: JwtService) {}

  @Get()
  root(@Req() req: Request, @Res() res: Response) {
    const target = this.resolveRedirectPathFromRequest(req);
    if (!target) {
      return res.redirect('/login');
    }
    return res.redirect(target);
  }

  @Get('login')
  login(@Req() req: Request, @Res() res: Response) {
    const target = this.resolveRedirectPathFromRequest(req);
    if (target) {
      return res.redirect(target);
    }
    return res.render('login');
  }

  @Get('register')
  @Render('register')
  register() {
    return {};
  }

  @Get('board')
  @UseGuards(JwtAuthGuard)
  @Render('board')
  board(@Req() req: Request) {
    return {
      title: 'Task Board',
      active: 'board',
      user: req.user,
      statuses: Object.values(TaskStatus).map((status) => ({
        key: status,
        label: status.replace('_', ' ').toUpperCase(),
      })),
    };
  }

  @Get('company')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Render('company')
  company(@Req() req: Request) {
    return {
      title: 'Company',
      active: 'company',
      user: req.user,
    };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.OWNER)
  @Render('dashboard')
  dashboard(@Req() req: Request) {
    return {
      title: 'Dashboard',
      active: 'dashboard',
      user: req.user,
    };
  }

  @Get('projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.OWNER, Role.PROJECT_MANAGER, Role.EMPLOYEE)
  @Render('projects')
  projects(@Req() req: Request) {
    return {
      title: 'Projects',
      active: 'projects',
      user: req.user,
    };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN, Role.OWNER)
  @Render('users')
  users(@Req() req: Request) {
    return {
      title: 'User Management',
      active: 'users',
      user: req.user,
    };
  }

  private resolveRedirectPathFromRequest(req: Request): string | null {
    const token = req.cookies?.access_token;
    if (!token) {
      return null;
    }

    try {
      const payload = this.jwtService.verify<{ role?: Role }>(token);
      if (!payload?.role) {
        return null;
      }
      return this.resolveRedirectPathFromRole(payload.role);
    } catch {
      return null;
    }
  }

  private resolveRedirectPathFromRole(role: Role): string {
    switch (role) {
      case Role.SUPERADMIN:
        return '/company';
      case Role.OWNER:
        return '/dashboard';
      case Role.PROJECT_MANAGER:
        return '/projects';
      case Role.EMPLOYEE:
        return '/board';
      default:
        return '/login';
    }
  }
}
