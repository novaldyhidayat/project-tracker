import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DiscussionDocument = Discussion & Document;

@Schema({ timestamps: true })
export class Discussion {
  @Prop({ required: true })
  message: string;

  @Prop({ type: String, ref: 'Project' })
  projectId: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
