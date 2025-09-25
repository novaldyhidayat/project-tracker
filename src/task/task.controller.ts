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
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { TaskStatus } from '../schemas/task.schema';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.PROJECT_MANAGER, Role.EMPLOYEE)
  create(
    @Body()
    createTaskDto: {
      title: string;
      description?: string;
      projectId: string;
      assigneeId?: string;
    },
    @Request() req,
  ) {
    return this.taskService.create({
      ...createTaskDto,
      createdBy: req.user._id,
    });
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.taskService.findByProject(projectId);
  }

  @Get('my')
  @Roles(Role.EMPLOYEE)
  findMyTasks(@Request() req) {
    return this.taskService.findByAssignee(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateTaskDto: Partial<{
      title: string;
      description: string;
      assigneeId: string;
      isCompleted: boolean;
    }>,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Patch(':id/position')
  @Roles(Role.PROJECT_MANAGER, Role.EMPLOYEE)
  updatePosition(
    @Param('id') id: string,
    @Body() body: { position: number; status: TaskStatus },
  ) {
    return this.taskService.updatePosition(id, body.position, body.status);
  }

  @Post('bulk-update-positions')
  @Roles(Role.PROJECT_MANAGER, Role.EMPLOYEE)
  updatePositions(
    @Body()
    body: {
      tasks: { id: string; position: number; status: TaskStatus }[];
    },
  ) {
    return this.taskService.updatePositions(body.tasks);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_MANAGER)
  remove(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
