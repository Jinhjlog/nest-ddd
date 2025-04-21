import { ValueObject } from '@lib/domain';
import { err, ok, Result } from 'neverthrow';
import * as bcrypt from 'bcrypt';

export interface PasswordProps {
  value: string;
  hashed?: boolean;
}

export const PasswordError = {
  PasswordRequired: '비밀번호는 필수 입력값입니다.',
  TooShortPassword: '비밀번호는 6자 이상 입력되어야 합니다.',
  TooLongPassword: '비밀번호는 17자 이하로 입력되어야 합니다.',
  MissingSpecialCharacter:
    '비밀번호에는 특수문자가 1개 이상 포함되어야 합니다.',
} as const;

type PasswordErrorType = (typeof PasswordError)[keyof typeof PasswordError];

export class Password extends ValueObject<PasswordProps> {
  private static readonly MIN_LENGTH = 6;
  private static readonly MAX_LENGTH = 17;
  private static readonly SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

  private constructor(props: PasswordProps) {
    super(props);
  }

  static async create(
    password?: string,
    shouldHash: boolean = false,
  ): Promise<Result<Password, PasswordErrorType>> {
    if (!password) {
      return err(PasswordError.PasswordRequired);
    }

    if (password.length < Password.MIN_LENGTH) {
      return err(PasswordError.TooShortPassword);
    }

    if (password.length > Password.MAX_LENGTH) {
      return err(PasswordError.TooLongPassword);
    }

    if (!this.SPECIAL_CHAR_REGEX.test(password)) {
      return err(PasswordError.MissingSpecialCharacter);
    }

    if (shouldHash) {
      return ok(
        new Password({
          value: await this.hashPassword(password),
          hashed: true,
        }),
      );
    }

    return ok(
      new Password({
        value: password,
        hashed: false,
      }),
    );
  }

  static unsafeCreate(password: string): Password {
    return new Password({
      value: password,
      hashed: true,
    });
  }

  private static hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    return bcrypt.hash(password, saltRound);
  }

  async comparePassword(value: string): Promise<boolean> {
    return bcrypt.compare(value, this.props.value);
  }
}
