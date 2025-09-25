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
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('notes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @Roles(Role.PROJECT_MANAGER, Role.EMPLOYEE)
  create(
    @Body() createNoteDto: { content: string; taskId?: string },
    @Request() req,
  ) {
    return this.noteService.create({ ...createNoteDto, userId: req.user._id });
  }

  @Get()
  findAll() {
    return this.noteService.findAll();
  }

  @Get('task/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.noteService.findByTask(taskId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: Partial<{ content: string }>,
  ) {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @Roles(Role.PROJECT_MANAGER, Role.EMPLOYEE)
  remove(@Param('id') id: string) {
    return this.noteService.delete(id);
  }
}
