import {
  BadRequestException,
  ConflictException,
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
import { TermDto } from 'src/common/dtos/term.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { documentNumber, email } = createUserDto;

    const existUserByDni = await this.userRepository.findOne({
      where: {
        documentNumber,
      },
    });

    if (existUserByDni) {
      throw new ConflictException('El Documento ya está registrado.');
    }

    const existUserByEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (existUserByEmail) {
      throw new ConflictException('El correo ya está registrado.');
    }

    try {
      const { ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync('P', 10),
      });

      const newUser = await this.userRepository.save(user);

      return newUser;
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

  async findByTerm(
    termDto: TermDto,
    throwError: boolean = true,
  ): Promise<User | undefined> {
    const { field, value } = termDto;

    const user = await this.userRepository.findOne({
      where: { [field]: value },
    });
    if (!user && throwError) {
      throw new NotFoundException(
        `Usuario con ${field} ${value} no encontrado`,
      );
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    return user;
  }

  async findOnePlatformOperator(id: string) {
    const platformOperator = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere(':role = ANY(user.roles)', { role: 'platform-operator' }) // Verifica si el rol está en el array
      .getOne();

    if (!platformOperator) {
      throw new NotFoundException(`Platform-operator with id ${id} not found`);
    }

    return platformOperator;
  }

  async findPlatformOperators(): Promise<User[]> {
    const platformOperator = await this.userRepository
      .createQueryBuilder('user')
      .where(':role = ANY(user.roles)', { role: 'platform-operator' }) // Verifica si el rol está en el array
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getMany();

    if (platformOperator.length === 0) {
      return [];
    }

    return platformOperator;
  }

  async updateVerify(user: User) {
    await this.userRepository.save(user);
    return {
      statusCode: 201,
      message: 'Email verificado correctamente',
    };
  }

  async updatePassword(user: User, password: string) {
    user.password = bcrypt.hashSync(password, 10);
    await this.userRepository.save(user);
    return {
      statusCode: 201,
      message: 'Contraseña modificado correctamente',
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id: id })
      .execute();
    return {
      ok: true,
      message: `se actualizó los datos del usuario`,
    };
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
