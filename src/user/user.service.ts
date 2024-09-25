import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto';

import * as bcrypt from 'bcrypt';
import { Document } from 'src/documents/entities/document.entity';
import { DocumentsService } from 'src/documents/documents.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role: 'user' })
      .getMany();
  }

  async findOneByDni(dni: string) {
    const user = await this.userRepository.findOne({
      where: { dni },
      select: {
        email: true,
        password: true,
        id: true,
        roles: true,
        dni: true,
        firstName: true,
        lastName: true,
        province: true,
        district: true,
        mobileNumber: true,
      }, //! OJO!
    });

    return user;
  }

  async findOneBy(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    return user;
  }

  async findOneAdmin(id: string) {
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere(':role = ANY(user.roles)', { role: 'super-user' }) // Verifica si el rol está en el array
      .getOne();

    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }

    return admin;
  }

  async findAdmins(): Promise<User[]> {
    const admins = await this.userRepository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role: 'super-user' }) // Verifica si el rol está en el array
      .getMany(); // Obtiene todos los usuarios que coincidan

    if (admins.length === 0) {
      throw new NotFoundException(`No admins with the 'super-user' role found`);
    }

    return admins;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
