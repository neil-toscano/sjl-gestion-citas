import { Injectable } from '@nestjs/common';
import { CreateProcessUserDto } from './dto/create-process-user.dto';
import { UpdateProcessUserDto } from './dto/update-process-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessUser } from './entities/process-user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProcessStatusService } from 'src/process-status/process-status.service';

@Injectable()
export class ProcessUserService {
  constructor(
    @InjectRepository(ProcessUser)
    private readonly processUserRepository: Repository<ProcessUser>,
    private readonly userService: UserService,
    private readonly processStatusService: ProcessStatusService,
  ) {

  }
  async create(createProcessUserDto: CreateProcessUserDto): Promise<ProcessUser> {
    const { processStatusId, userId, isActive = true } = createProcessUserDto;

    await this.processStatusService.findOneById(processStatusId);
    await this.userService.findOne(userId);

    const processUser = this.processUserRepository.create({
      processStatus: {
        id: processStatusId
      },
      user: {
        id: userId
      },
      isActive: isActive,
    });

    await this.processStatusService.update(processStatusId, {
      isAssigned: true,
    });

    return this.processUserRepository.save(processUser);
  }

  async findAll() {
    return await this.processUserRepository.find({
      where: {
        isActive: true,
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} processUser`;
  }

  update(id: number, updateProcessUserDto: UpdateProcessUserDto) {
    return `This action updates a #${id} processUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} processUser`;
  }
}
