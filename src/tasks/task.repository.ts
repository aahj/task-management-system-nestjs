import { Injectable } from "@nestjs/common";
import { Task } from "../entities/task.entity";
import { DataSource, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create.task.dto";
import { TaskStatus } from "./task.model";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TaskRepository extends Repository<Task> {
    constructor(private datasource: DataSource) {
        super(Task, datasource.createEntityManager());
    }

    async createTask(dto: CreateTaskDto): Promise<Task> {
        const task = new Task();
        task.title = dto.title;
        task.description = dto.description;
        task.status = TaskStatus.OPEN;
        await task.save();
        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
    
        if (status) {
          query.andWhere('task.status = :status', { status });
        }
    
        if (search) {
          query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
    
        const tasks = await query.getMany();
        return tasks;
      }

}