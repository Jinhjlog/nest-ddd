/**
 * Identifier 클래스는 도메인 객체의 식별자를 표현하기 위한 기본 클래스입니다.
 * 모든 종류의 ID 타입(string, number 등)을 지원하며, ID 값의 비교와 변환을 위한 기본 동작을 정의합니다.
 *
 * @template T - ID 값의 타입 (예: string, number, 또는 custom type)
 *
 */
export class Identifier<T> {
  /**
   * @param value - 식별자의 실제 값
   */
  constructor(private value: T) {
    this.value = value;
  }

  /**
   * 두 식별자가 동일한지 비교합니다.
   * null, undefined 체크와 타입 체크를 포함합니다.
   *
   * @param id - 비교할 식별자
   * @returns 두 식별자가 동일하면 true, 그렇지 않으면 false
   */
  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return id.toValue() === this.value;
  }

  /**
   * 식별자를 문자열로 변환합니다.
   *
   * @returns 식별자의 문자열 표현
   */
  toString() {
    return String(this.value);
  }

  /**
   * 식별자의 원시 값을 반환합니다.
   *
   * @returns 식별자의 실제 값
   */
  toValue() {
    return this.value;
  }
}
