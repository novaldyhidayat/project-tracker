import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../schemas/note.schema';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(note: Partial<Note>): Promise<Note> {
    const createdNote = new this.noteModel(note);
    return createdNote.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().populate('taskId').populate('userId').exec();
  }

  async findByTask(taskId: string): Promise<Note[]> {
    return this.noteModel
      .find({ taskId })
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Note | null> {
    return this.noteModel
      .findById(id)
      .populate('taskId')
      .populate('userId')
      .exec();
  }

  async update(id: string, note: Partial<Note>): Promise<Note | null> {
    return this.noteModel.findByIdAndUpdate(id, note, { new: true }).exec();
  }

  async delete(id: string): Promise<Note | null> {
    return this.noteModel.findByIdAndDelete(id).exec();
  }
}
