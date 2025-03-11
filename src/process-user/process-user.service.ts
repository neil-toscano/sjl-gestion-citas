import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProcessUserDto } from './dto/create-process-user.dto';
import { UpdateProcessUserDto } from './dto/update-process-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessUser } from './entities/process-user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProcessStatusService } from 'src/process-status/process-status.service';
import { User } from 'src/user/entities/user.entity';
import { ProcessStatusEnum } from 'src/process-status/interfaces/status.enum';

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
        'processStatus.updatedAt',
        'processStatus.status',
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
      .andWhere('processStatus.isCompleted = :isCompleted', { isCompleted: false })
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
        'processStatus.status',
      ])
      .leftJoin('processUser.processStatus', 'processStatus')
      .leftJoin('processStatus.user', 'processStatusUser')
      .leftJoin('processStatus.section', 'section')
      .leftJoin('processUser.user', 'user')
      .where('processUser.createdAt >= :startDate', {
        startDate: firstDayOfLastMonth
      })
      .andWhere('processUser.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async findAllAsignados() {
    const estadisticaNuevos = await this.processStatusService.findAllUsersWithCompletedDocuments();
    const estadisticaAsignado = await this.findAll();
    
    return {
        nuevos_tramites: estadisticaNuevos.length,  // <- Aquí el length
        tramites_asignados: estadisticaAsignado.length
    };
}

  async findAllNewAssigned(sectionId: string, user: User) {
    return this.processUserRepository.find({
      where: {
        user: {
          id: user.id,
        },
        isActive: true,
        processStatus: {
          section: {
            id: sectionId
          },
          status: ProcessStatusEnum.EN_PROCESO
        },

      },
      relations: ['processStatus', 'processStatus.user', 'processStatus.section']
    })
  };

  async findAllCorrected(sectionId: string, user: User) {
    return this.processUserRepository.find({
      where: {
        user: {
          id: user.id,
        },
        isActive: true,
        processStatus: {
          section: {
            id: sectionId
          },
          status: ProcessStatusEnum.CORRECTED
        },
      },
      relations: ['processStatus', 'processStatus.user', 'processStatus.section']
    })
  };

  async findAllUnresolved(sectionId: string, user: User) {
    return this.processUserRepository.find({
      where: {
        user: {
          id: user.id,
        },
        isActive: true,
        processStatus: {
          section: {
            id: sectionId
          },
          isCompleted: false,
          status: ProcessStatusEnum.UNDER_OBSERVATION,
        },
      },
      relations: ['processStatus', 'processStatus.user', 'processStatus.section']
    })
  };

  async countByUser(userId: string) {
    const result = await this.processUserRepository
      .createQueryBuilder('processUser')
      .innerJoin('processUser.processStatus', 'processStatus')
      .innerJoin('processStatus.section', 'section')
      .where('processUser.userId = :userId', { userId })
      .andWhere('processUser.isActive = :isActive', { isActive: true })
      .andWhere('processStatus.isCompleted = :isCompleted', { isCompleted: false })
      .select([
        'section.sectionName as "sectionName"',
        'processStatus.sectionId as "sectionId"',
        'processStatus.status as status',
        'COUNT(processUser.id) as count'
      ])
      .groupBy('section.sectionName')
      .addGroupBy('processStatus.sectionId')
      .addGroupBy('processStatus.status')
      .getRawMany();

    return result;
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

    await this.processStatusService.update(processUser.processStatus.id, {
      isAssigned: false
    });

    await this.processUserRepository.update(id, { isActive: false });
  }
}
