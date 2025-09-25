import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  domain: string;

  @Prop({ type: String, ref: 'User' })
  ownerId: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
