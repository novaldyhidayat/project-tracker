import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.PROJECT_MANAGER)
  create(
    @Body()
    createProjectDto: { name: string; description?: string; companyId: string },
    @Request() req,
  ) {
    return this.projectService.create({
      ...createProjectDto,
      managerId: req.user._id,
    });
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get('company/:companyId')
  @Roles(Role.OWNER, Role.PROJECT_MANAGER, Role.EMPLOYEE)
  findByCompany(@Param('companyId') companyId: string) {
    return this.projectService.findByCompany(companyId);
  }

  @Get('my')
  @Roles(Role.PROJECT_MANAGER)
  findMyProjects(@Request() req) {
    return this.projectService.findByManager(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Put(':id')
  @Roles(Role.PROJECT_MANAGER)
  update(
    @Param('id') id: string,
    @Body()
    updateProjectDto: Partial<{
      name: string;
      description: string;
      isActive: boolean;
    }>,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_MANAGER)
  remove(@Param('id') id: string) {
    return this.projectService.delete(id);
  }
}
