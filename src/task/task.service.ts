import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: Partial<Task>): Promise<Task> {
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel
      .find()
      .populate('projectId')
      .populate('assigneeId')
      .populate('createdBy')
      .exec();
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel
      .findById(id)
      .populate('projectId')
      .populate('assigneeId')
      .populate('createdBy')
      .exec();
  }

  async findByProject(projectId: string): Promise<Task[]> {
    return this.taskModel
      .find({ projectId })
      .populate('assigneeId')
      .populate('createdBy')
      .sort({ position: 1 })
      .exec();
  }

  async findByAssignee(assigneeId: string): Promise<Task[]> {
    return this.taskModel.find({ assigneeId }).populate('projectId').exec();
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    return this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
  }

  async updatePosition(
    id: string,
    position: number,
    status?: TaskStatus,
  ): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, { position, status }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Task | null> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }
  async updatePositions(
    tasks: {
      id: string;
      position: number;
      status: TaskStatus;
    }[],
  ): Promise<void> {
    const bulkOps = tasks.map((task) => ({
      updateOne: {
        filter: { _id: task.id },
        update: { position: task.position, status: task.status },
      },
    }));
    await this.taskModel.bulkWrite(bulkOps);
  }
}
