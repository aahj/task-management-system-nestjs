import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.model';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

const mockUser = { username: "test user", id: 11 };

describe('TaskService', () => {
    let tasksService;
    let taskRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [TasksService, { provide: TaskRepository, useFactory: mockTaskRepository }]
        }).compile();
        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);

    });
    describe('getTasks', () => {
        it('should get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.OPEN, search: 'some query' };
            const res = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(res).toEqual('some value');
        });
    });

    describe('getTaskByid', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = { title: 'abc', description: 'abc..' };
            taskRepository.findOne.mockResolvedValue(mockTask);
            const res = await tasksService.getTaskById(1);
            expect(res).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });
        it('throw an error if the task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(111)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('should create a task', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = { title: 'abc', description: 'abc...' };
            const res = await tasksService.createTask(createTaskDto);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto);
            expect(res).toEqual('someTask');
        });
    });

    describe('delete task by id', () => {
        it('should delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTaskById(10);
            expect(taskRepository.delete).toHaveBeenCalledWith(10);
        });
        it('throw an error if the task is not found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTaskById(111)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskById', () => {
        it('should update the task with the task id', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const res = await tasksService.updateTaskById(1,TaskStatus.CLOSED);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(res.status).toEqual(TaskStatus.CLOSED);

        });
    });
});