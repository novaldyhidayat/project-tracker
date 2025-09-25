import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(project: Partial<Project>): Promise<Project> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel
      .find()
      .populate('companyId')
      .populate('managerId')
      .exec();
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel
      .findById(id)
      .populate('companyId')
      .populate('managerId')
      .exec();
  }

  async findByCompany(companyId: string): Promise<Project[]> {
    return this.projectModel.find({ companyId }).populate('managerId').exec();
  }

  async findByManager(managerId: string): Promise<Project[]> {
    return this.projectModel.find({ managerId }).exec();
  }

  async update(id: string, project: Partial<Project>): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, project, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Project | null> {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
