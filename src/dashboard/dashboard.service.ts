import { Injectable } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';

@Injectable()
export class DashboardService {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService,
    private companyService: CompanyService,
  ) {}

  async getCompanyDashboard(companyId: string) {
    const projects = await this.projectService.findByCompany(companyId);
    const tasks = await Promise.all(
      projects.map(async (project) => {
        return await this.taskService.findByProject(
          (project as any)._id.toString(),
        );
      }),
    );
    const flatTasks = tasks.flat();
    const totalTasks = flatTasks.length;
    const completedTasks = flatTasks.filter((task) => task.isCompleted).length;
    const inProgressTasks = flatTasks.filter(
      (task) => task.status === 'in_progress',
    ).length;
    const todoTasks = flatTasks.filter((task) => task.status === 'todo').length;

    const users = await this.userService.findAll();
    const companyUsers = users.filter((user) => user.companyId === companyId);

    return {
      projectsCount: projects.length,
      tasksCount: totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      usersCount: companyUsers.length,
      projects: projects.map((p) => ({
        id: (p as any)._id,
        name: p.name,
        manager: p.managerId,
      })),
    };
  }
}
