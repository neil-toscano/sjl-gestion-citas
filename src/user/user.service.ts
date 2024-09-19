import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto';

import * as bcrypt from 'bcrypt';
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

      delete user.password;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role: 'user' }) // Usa el operador ANY para buscar dentro del array
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
