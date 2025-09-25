import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017/task-management',
    ),
  ],
})
export class DatabaseModule {}
