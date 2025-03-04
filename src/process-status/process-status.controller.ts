import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProcessStatusService } from './process-status.service';
import { CreateProcessStatusDto } from './dto/create-process-status.dto';
import { UpdateProcessStatusDto } from './dto/update-process-status.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('process-status')
export class ProcessStatusController {
  constructor(private readonly processStatusService: ProcessStatusService) {}

  @Post()
  @Auth()
  create(
    @GetUser() user: User,
    @Body() createProcessStatusDto: CreateProcessStatusDto,
  ) {
    return this.processStatusService.create(createProcessStatusDto, user);
  }

  @Get('next-review/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  async getNextUserForReview(
    @Param('sectionId') sectionId: string,
    @GetUser() admin: User,
  ) {
    return await this.processStatusService.findNextUserForReview(
      sectionId,
      admin.id,
    );
  }

  @Get('completed-users/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  findCompletedUsersBySection(
    @Param('sectionId') sectionId: string,
    @GetUser() admin: User,
  ) {
    return this.processStatusService.findUsersWithCompletedDocuments(
      sectionId,
      admin,
    );
  }
  
  @Get('completed-users')
  @Auth(ValidRoles.admin)
  findAllCompletedUsers(
    @GetUser() admin: User,
  ) {
    return this.processStatusService.findAllUsersWithCompletedDocuments();
  }

  @Get('corrected/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  async findAllUsersWithCorrectedDocuments(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() admin: User,
  ) {
    return this.processStatusService.getAllUsersWithCorrectedDocuments(
      sectionId,
      admin,
    );
  }

  @Get('next-corrected/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  async NextUserCorrected(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() admin: User,
  ) {
    return this.processStatusService.NextUserCorrected(sectionId, admin.id);
  }

  @Get('unresolved-documents/:sectionId')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  async findAllUsersWithUnresolvedDocuments(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() admin: User,
  ) {
    return this.processStatusService.getAllUsersWithUnresolvedDocuments(
      sectionId,
      admin,
    );
  }

  @Get('is-eligible-for-appointment/:sectionId')
  @Auth()
  async isEligibleForAppointment(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.processStatusService.checkEligibilityForAppointment(
      sectionId,
      user,
    );
  }

  @Get(':userId/:sectionId')
  @Auth(ValidRoles.superUser)
  async processStatusByUserSection(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.processStatusService.processStatusByUserSection(
      sectionId,
      userId,
    );
  }

  @Get('status/count')
  @Auth()
  async countByStatus() {
    return this.processStatusService.countByStatus();
  }

  @Get(':id')
  @Auth()
  findOneByUserSection(
    @Param('id', new ParseUUIDPipe()) sectionId: string,
    @GetUser() user: User,
  ) {
    return this.processStatusService.findOneByUserSection(sectionId, user);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateProcessStatusDto: UpdateProcessStatusDto,
  ) {
    return this.processStatusService.update(id, updateProcessStatusDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.processStatusService.remove(id);
  }
}
