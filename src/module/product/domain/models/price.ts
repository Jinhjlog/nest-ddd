import { ValueObject } from '@lib/domain';
import { err, ok, Result } from 'neverthrow';

export interface PriceProps {
  value: number;
}

export const PriceError = {
  InvalidPrice: '가격은 0보다 작을 수 없습니다.',
} as const;

type PriceErrorType = (typeof PriceError)[keyof typeof PriceError];

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super(props);
  }

  static create(value: number): Result<Price, PriceErrorType> {
    if (value < 0) {
      return err(PriceError.InvalidPrice);
    }
    return ok(new Price({ value }));
  }

  static unsafeCreate(value: number): Price {
    return new Price({ value });
  }
}
