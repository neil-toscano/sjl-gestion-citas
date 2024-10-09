import { Injectable } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermission } from './entities/user-permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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


    return await this.userPermissionRepository.save(userPermission);
  }

  findAll() {
    return `This action returns all userPermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPermission`;
  }

  update(id: number, updateUserPermissionDto: UpdateUserPermissionDto) {
    return `This action updates a #${id} userPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPermission`;
  }
}
