import { ulid } from 'ulid';
import { Identifier } from './Identifier';

/**
 * UniqueEntityID는 도메인 엔티티의 고유 식별자를 생성하고 관리하는 클래스입니다.
 * ULID를 기본 식별자로 사용합니다.
 */
export class UniqueEntityId extends Identifier<string | number> {
  /**
   * UniqueEntityID의 생성자
   * id가 제공되지 않으면 ULID를 자동으로 생성합니다.
   *
   * @param id - 선택적으로 제공되는 식별자 값 (문자열 또는 숫자)
   */
  constructor(id?: string | number) {
    super(id ? id : ulid());
  }
}
