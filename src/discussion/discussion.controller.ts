import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('discussions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post()
  @Roles(Role.PROJECT_MANAGER, Role.EMPLOYEE)
  create(
    @Body() createDiscussionDto: { message: string; projectId: string },
    @Request() req,
  ) {
    return this.discussionService.create({
      ...createDiscussionDto,
      userId: req.user._id,
    });
  }

  @Get()
  findAll() {
    return this.discussionService.findAll();
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.discussionService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_MANAGER)
  remove(@Param('id') id: string) {
    return this.discussionService.delete(id);
  }
}
