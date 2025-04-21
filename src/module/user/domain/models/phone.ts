import { ValueObject } from '@lib/domain';
import { err, ok, Result } from 'neverthrow';

interface PhoneProps {
  value: string;
}

export const PhoneError = {
  PhoneRequired: 'phone은 필수 입력값입니다',
  InvalidPhone: 'phone 형식이 올바르지 않습니다.',
} as const;

type PhoneErrorType = (typeof PhoneError)[keyof typeof PhoneError];

export class Phone extends ValueObject<PhoneProps> {
  private constructor(props: PhoneProps) {
    super(props);
  }

  static create(phone?: string): Result<Phone, PhoneErrorType> {
    if (!phone) {
      return err(PhoneError.PhoneRequired);
    }

    // 전화번호 형식 검사 (000-0000-0000)
    if (!/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
      return err(PhoneError.InvalidPhone);
    }

    return ok(new Phone({ value: phone }));
  }

  static unsafeCreate(phone: string): Phone {
    return new Phone({ value: phone });
  }
}
