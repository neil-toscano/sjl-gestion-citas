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

  @Get()
  findAll() {
    return this.processStatusService.findAll();
  }

  @Get('next-review/:sectionId')
  @Auth()
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
  @Auth()
  findCompletedUsers(
    @Param('sectionId') sectionId: string,
    @GetUser() admin: User,
  ) {
    return this.processStatusService.findUsersWithCompletedDocuments(
      sectionId,
      admin,
    );
  }

  @Get('corrected/:sectionId')
  @Auth()
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
  @Auth()
  async NextUserCorrected(
    @Param('sectionId', new ParseUUIDPipe()) sectionId: string,
    @GetUser() admin: User,
  ) {
    return this.processStatusService.NextUserCorrected(sectionId, admin.id);
  }

  @Get('unresolved-documents/:sectionId')
  @Auth()
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

  @Get('status/count')
  async countByStatus() {
    return this.processStatusService.countByStatus();
  }

  @Get(':id')
  @Auth()
  findOneByUserSection(@Param('id') sectionId: string, @GetUser() user: User) {
    return this.processStatusService.findOneByUserSection(sectionId, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProcessStatusDto: UpdateProcessStatusDto,
  ) {
    return this.processStatusService.update(id, updateProcessStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processStatusService.remove(id);
  }
}
