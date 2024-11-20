import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Auth()
  create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @GetUser() admin: User,
  ) {
    return this.assignmentsService.create(createAssignmentDto, admin.id);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
