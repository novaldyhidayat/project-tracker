import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionService } from './discussion.service';
import { DiscussionController } from './discussion.controller';
import { Discussion, DiscussionSchema } from '../schemas/discussion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
    ]),
  ],
  providers: [DiscussionService],
  controllers: [DiscussionController],
  exports: [DiscussionService],
})
export class DiscussionModule {}
