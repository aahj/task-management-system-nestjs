import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.CLOSED,
        TaskStatus.OPEN
    ];
    transform(value: any) {
        value = value.toLowerCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException('Invalid status');
        }
        return value;
    }
    private isStatusValid(status: any) {
        const index = this.allowedStatus.indexOf(status);        
        return index !== -1;
    }
}