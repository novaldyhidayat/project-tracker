import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discussion, DiscussionDocument } from '../schemas/discussion.schema';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
  ) {}

  async create(discussion: Partial<Discussion>): Promise<Discussion> {
    const createdDiscussion = new this.discussionModel(discussion);
    return createdDiscussion.save();
  }

  async findAll(): Promise<Discussion[]> {
    return this.discussionModel
      .find()
      .populate('projectId')
      .populate('userId')
      .exec();
  }

  async findByProject(projectId: string): Promise<Discussion[]> {
    return this.discussionModel
      .find({ projectId })
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Discussion | null> {
    return this.discussionModel
      .findById(id)
      .populate('projectId')
      .populate('userId')
      .exec();
  }

  async delete(id: string): Promise<Discussion | null> {
    return this.discussionModel.findByIdAndDelete(id).exec();
  }
}
