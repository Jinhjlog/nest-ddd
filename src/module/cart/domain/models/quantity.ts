import { ValueObject } from '@lib/domain';
import { err, ok, Result } from 'neverthrow';

export interface QuantityProps {
  value: number;
}

export const QuantityError = {
  InvalidQuantity: '수량은 0보다 커야 합니다.',
  QuantityTooLarge: '수량은 100을 초과할 수 없습니다.',
} as const;

type QuantityErrorType = (typeof QuantityError)[keyof typeof QuantityError];

export class Quantity extends ValueObject<QuantityProps> {
  private constructor(props: QuantityProps) {
    super(props);
  }

  static create(value: number): Result<Quantity, QuantityErrorType> {
    if (value <= 0) {
      return err(QuantityError.InvalidQuantity);
    }

    if (value > 100) {
      return err(QuantityError.QuantityTooLarge);
    }

    return ok(new Quantity({ value }));
  }

  static unsafeCreate(value: number): Quantity {
    return new Quantity({ value });
  }

  plus(quantity: Quantity): Quantity {
    const newValue = this.props.value + quantity.props.value;
    return new Quantity({ value: newValue });
  }
}
