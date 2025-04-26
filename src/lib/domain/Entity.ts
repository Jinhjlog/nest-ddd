import { UniqueEntityId } from './UniqueEntityId';

/**
 * 주어진 값이 EntityClass의 인스턴스인지 확인하는 타입 가드 함수입니다.
 *
 * @param v - 검사할 값
 * @returns EntityClass의 인스턴스이면 true, 아니면 false
 */
const isEntity = (v: any): v is EntityClass<any> => {
  return v instanceof EntityClass;
};

/**
 * EntityClass는 도메인 엔티티를 표현하기 위한 추상 기본 클래스입니다.
 * 모든 엔티티는 고유한 식별자(ID)와 속성(props)을 가지며, 엔티티 간의 동등성 비교를 위한 기능을 제공합니다.
 *
 * @template T - 엔티티의 속성을 정의하는 타입
 */
export abstract class EntityClass<T> {
  /**
   * 엔티티의 고유 식별자
   * 외부에서 직접 접근할 수 없도록 protected로 선언
   */
  protected readonly _id: UniqueEntityId;

  /**
   * 엔티티의 속성을 담고 있는 객체
   * 읽기 전용으로 선언되어 불변성 보장
   */
  public readonly props: T;

  /**
   * EntityClass의 생성자
   *
   * @param props - 엔티티의 속성
   * @param id - 엔티티의 식별자 (선택적)
   */
  constructor(props: T, id?: UniqueEntityId) {
    this._id = id ? id : new UniqueEntityId(); // ID가 주어지지 않으면 새로 생성
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  /**
   * 두 엔티티가 동일한지 비교합니다.
   * 엔티티는 ID가 같으면 동일한 엔티티로 간주됩니다.
   *
   * @param object - 비교할 엔티티 객체
   * @returns 두 엔티티가 동일하면 true, 그렇지 않으면 false
   */
  public equals(object?: EntityClass<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      // 같은 참조인 경우
      return true;
    }

    if (!isEntity(object)) {
      // EntityClass의 인스턴스가 아닌 경우
      return false;
    }

    return this._id.equals(object._id); // ID 비교
  }
}
