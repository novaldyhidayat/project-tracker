import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  content: string;

  @Prop({ type: String, ref: 'Task' })
  taskId?: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
