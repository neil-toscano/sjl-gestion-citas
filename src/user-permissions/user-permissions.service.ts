import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
import { Any, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {}

  async create(createUserPermissionDto: CreateUserPermissionDto) {
    const { sectionId, userId } = createUserPermissionDto;

    await this.userPermissionRepository.delete({
      user: {
        id: userId,
      },
      section: {
        id: sectionId,
      },
    });

    const userPermission = this.userPermissionRepository.create({
      section: {
        id: sectionId,
      },
      user: {
        id: userId,
      },
    });
    return await this.userPermissionRepository.save(userPermission);
  }

  async findByUser(id: string) {
    return await this.userPermissionRepository.find({
      where: {
        user: {
          id: id,
        },
      },
      relations: ['section'],
    });
  }

  async findPlatformOperators(sectionId: string) {
    return await this.userPermissionRepository
      .createQueryBuilder('userPermission')
      .leftJoinAndSelect('userPermission.user', 'user')
      .where('userPermission.sectionId = :sectionId', { sectionId })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere(':role = ANY(user.roles)', { role: 'platform-operator' })
      .getMany();
  }

  async remove(id: string) {
    try {
      const result = await this.userPermissionRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException('Permiso no encontrado');
      }

      return {
        ok: true,
        message: 'Se eliminó correctamente el permiso',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Ocurrió un error al eliminar el permiso',
        error: error.message,
      });
    }
  }
}
