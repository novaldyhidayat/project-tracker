import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { DiscussionModule } from './discussion/discussion.module';
import { NoteModule } from './note/note.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ViewsController } from './views/views.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { AuthExceptionFilter } from './auth/auth-exception.filter';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    CompanyModule,
    ProjectModule,
    TaskModule,
    DiscussionModule,
    NoteModule,
    DashboardModule,
    CacheModule.register({
      isGlobal: true,
      store: 'redis',
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController, ViewsController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
  ],
})
export class AppModule {}
