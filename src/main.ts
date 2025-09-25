import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';
import * as hbsLayouts from 'handlebars-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('project-tracker');

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  hbs.registerPartials(join(__dirname, '..', 'views', 'layouts'));
  hbsLayouts(hbs.handlebars);

  hbs.handlebars.registerHelper('eq', (a, b) => a === b);
  hbs.handlebars.registerHelper('or', (...args) => {
    return args.slice(0, -1).some((arg) => !!arg);
  });
  hbs.handlebars.registerHelper('userInitials', (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  });
  hbs.handlebars.registerHelper('roleLabel', (role) => {
    const labels = {
      SUPERADMIN: 'Super Admin',
      OWNER: 'Owner',
      PROJECT_MANAGER: 'Project Manager',
      EMPLOYEE: 'Employee',
    };
    return labels[role] || role;
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
