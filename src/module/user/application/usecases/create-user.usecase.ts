import { err, ok, Result } from 'neverthrow';
import {
  Email,
  EmailError,
  Password,
  PasswordError,
  Phone,
  PhoneError,
  User,
  Username,
  UsernameError,
} from '../../domain/models';
import { CreateUserDto, UserResultDto } from '../dtos';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories';

export const UsernameAlreadyExistsError = '이미 존재하는 username 입니다.';
export const EmailAlreadyExistsError = '이미 존재하는 email 입니다.';
export const PhoneAlreadyExistsError = '이미 존재하는 phone 입니다.';

type CreateUserError =
  | (typeof UsernameError)[keyof typeof UsernameError]
  | (typeof EmailError)[keyof typeof EmailError]
  | (typeof PhoneError)[keyof typeof PhoneError]
  | (typeof PasswordError)[keyof typeof PasswordError]
  | typeof UsernameAlreadyExistsError
  | typeof PhoneAlreadyExistsError
  | typeof EmailAlreadyExistsError;

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    dto: CreateUserDto,
  ): Promise<Result<UserResultDto, CreateUserError>> {
    const usernameOrError = Username.create(dto.username);
    const phoneOrError = Phone.create(dto.phone);
    const emailOrError = Email.create(dto.email);
    const passwordOrError = await Password.create(dto.password, true);

    const propsOrError = Result.combine([
      usernameOrError,
      phoneOrError,
      emailOrError,
      passwordOrError,
    ]);

    if (propsOrError.isErr()) {
      return err(propsOrError.error);
    }

    const [username, phone, email, password] = propsOrError.value;

    const usernameExists = await this.userRepository.existsUsername(username);
    if (usernameExists) {
      return err(UsernameAlreadyExistsError);
    }

    const phoneExists = await this.userRepository.existsPhone(phone);
    if (phoneExists) {
      return err(PhoneAlreadyExistsError);
    }

    const emailExists = await this.userRepository.existsEmail(email);
    if (emailExists) {
      return err(EmailAlreadyExistsError);
    }

    const user = new User({
      username,
      password,
      phone,
      email,
      realname: dto.realname,
    });

    await this.userRepository.save(user);

    return ok({
      username: user.props.username.props.value,
      phone: user.props.phone.props.value,
      email: user.props.email.props.value,
      realname: user.props.realname,
    });
  }
}
