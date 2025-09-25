import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(company: Partial<Company>): Promise<Company> {
    const createdCompany = new this.companyModel(company);
    return createdCompany.save();
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findById(id: string): Promise<Company | null> {
    return this.companyModel.findById(id).exec();
  }

  async findByDomain(domain: string): Promise<Company | null> {
    return this.companyModel.findOne({ domain }).exec();
  }

  async update(id: string, company: Partial<Company>): Promise<Company | null> {
    return this.companyModel
      .findByIdAndUpdate(id, company, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Company | null> {
    return this.companyModel.findByIdAndDelete(id).exec();
  }
}
