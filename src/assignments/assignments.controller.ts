import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @GetUser() admin: User,
  ) {
    return this.assignmentsService.create(createAssignmentDto, admin.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
