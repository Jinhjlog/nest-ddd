import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories';
import { PrismaService } from 'src/module/core/database/prisma.service';
import { User, Username, Email, Phone } from '../../domain/models';
import { UserMapper } from '../mappers';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });
  }

  async existsUsername(username: Username): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username: username.props.value },
    });

    return !!user;
  }

  async existsEmail(email: Email): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.props.value },
    });

    return !!user;
  }

  async existsPhone(phone: Phone): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { phone: phone.props.value },
    });

    return !!user;
  }
}
