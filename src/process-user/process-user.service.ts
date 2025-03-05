import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { processStatusId, userId, isActive } = createProcessUserDto;

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
    return await this.processUserRepository
      .createQueryBuilder('processUser')
      .select([
        'processUser.id',
        'processUser.createdAt',
        'processUser.updatedAt',
        'processUser.isActive',
        'processStatus.id',
        'user.id',
        'user.firstName',
        'processStatusUser.id',
        'processStatusUser.documentNumber',
        'section.id',
        'section.sectionName',
      ])
      .leftJoin('processUser.processStatus', 'processStatus')
      .leftJoin('processStatus.user', 'processStatusUser')
      .leftJoin('processStatus.section', 'section')
      .leftJoin('processUser.user', 'user')
      .where('processUser.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findAllHistory() {
    const now = new Date();
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return await this.processUserRepository
      .createQueryBuilder('processUser')
      .select([
        'processUser.id',
        'processUser.createdAt',
        'processUser.updatedAt',
        'processUser.isActive',
        'processStatus.id',
        'user.id',
        'user.firstName',
        'processStatusUser.id',
        'processStatusUser.documentNumber',
        'section.id',
        'section.sectionName',
      ])
      .leftJoin('processUser.processStatus', 'processStatus')
      .leftJoin('processStatus.user', 'processStatusUser')
      .leftJoin('processStatus.section', 'section')
      .leftJoin('processUser.user', 'user')
      .where('processUser.createdAt BETWEEN :firstDayOfLastMonth AND :now', {
        firstDayOfLastMonth,
        now,
      })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} processUser`;
  }

  update(id: number, updateProcessUserDto: UpdateProcessUserDto) {
    return `This action updates a #${id} processUser`;
  }

  async remove(id: string): Promise<void> {
    const processUser = await this.processUserRepository.findOne({
      where: { id },
      relations: ['processStatus'],
      select: ['id', 'processStatus'],
    });

    if (!processUser) {
      throw new NotFoundException(`ProcessUser con ID ${id} no encontrado`);
    }

    await this.processStatusService.update(processUser.processStatus.id, {
      isAssigned: false,
    });

    await this.processUserRepository.update(id, { isActive: false });
  }
}
