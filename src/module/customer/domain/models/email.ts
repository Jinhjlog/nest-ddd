import { ValueObject } from '@lib/domain';
import { err, ok, Result } from 'neverthrow';

export interface EmailProps {
  value: string;
}

export const EmailError = {
  EmailRequired: 'email은 필수 입력값입니다',
  InvalidEmail: 'email 형식이 올바르지 않습니다.',
} as const;

type EmailErrorType = (typeof EmailError)[keyof typeof EmailError];

export class Email extends ValueObject<EmailProps> {
  constructor(props: EmailProps) {
    super(props);
  }

  static create(email?: string): Result<Email, EmailErrorType> {
    if (!email) {
      return err(EmailError.EmailRequired);
    }

    // 이메일 형식 검사
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return err(EmailError.InvalidEmail);
    }

    return ok(new Email({ value: email }));
  }

  static unsafeCreate(email: string): Email {
    return new Email({ value: email });
  }
}
