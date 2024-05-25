import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from 'src/entities/task.entity';

@Injectable()
export class TasksService {
    constructor(private readonly taskRepository: TaskRepository) { }
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }
    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task ${id} not found`);
        }
        return task;
    }

    async createTask(dto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(dto);
    }

    async deleteTaskById(id: number): Promise<void> {
        const res = await this.taskRepository.delete(id);
        if (res.affected === 0) {
            throw new NotFoundException(`Task ${id} not found`);
        }
    }

    async updateTaskById(id: number, status: TaskStatus): Promise<Task> {
        const findtask = await this.getTaskById(id);
        findtask.status = status;
        await findtask.save();
        return findtask;
    }
}
