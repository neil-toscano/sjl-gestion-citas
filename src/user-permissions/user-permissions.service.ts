import { Injectable } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {

  }

  async create(createUserPermissionDto: CreateUserPermissionDto) {
    const {sectionId, userId } = createUserPermissionDto;
    const userPermission = this.userPermissionRepository.create({
      section: {
        id: sectionId
      },
      user: {
        id: userId
      }
    });

    await this.userPermissionRepository
    .delete({
      user: {
        id: userId
      },
      section: {
        id: sectionId
      }
    });

    return await this.userPermissionRepository.save(userPermission);
  }

  findAll() {
    return `This action returns all userPermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPermission`;
  }

  async findPlatformOperators(sectionId: string) {
    return await this.userPermissionRepository.find({
      where: {
        section: {
          id: sectionId
        }
      },
      relations: ['user']
    })
  }

  async findByUser(id: string) {
    return await this.userPermissionRepository.find({
      where: {
        user: {
          id: id
        }
      },
      relations: ['section']
    })
  }

  update(id: number, updateUserPermissionDto: UpdateUserPermissionDto) {
    return `This action updates a #${id} userPermission`;
  }

  async remove(id: string) {
    await this.userPermissionRepository.delete({
      id: id,
    });

    return {
      ok: true,
      message: 'se eliminó correctamente el permiso',
    };
  }
}
