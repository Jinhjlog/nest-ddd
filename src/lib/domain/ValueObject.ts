/**
 * ValueObjectProps는 값 객체의 속성을 정의하는 기본 인터페이스입니다.
 * 동적 속성을 허용하기 위해 인덱스 시그니처를 사용합니다.
 */
interface ValueObjectProps {
  [index: string]: any;
}

/**
 * ValueObject는 도메인 모델에서 값 객체를 표현하는 추상 기본 클래스입니다.
 * 값 객체는 고유한 식별자 없이 값 자체로 의미를 가지며, 불변성을 보장합니다.
 *
 * @template T - ValueObjectProps를 확장하는 값 객체의 속성 타입
 */
export abstract class ValueObject<T extends ValueObjectProps> {
  /**
   * 값 객체의 속성을 저장하는 읽기 전용 객체
   */
  public props: T;

  /**
   * ValueObject의 생성자
   * 전달받은 속성을 복사하여 저장합니다.
   *
   * @param props - 값 객체의 속성들
   */
  constructor(props: T) {
    const baseProps = {
      ...props, // 속성 복사를 통한 불변성 보장
    };

    this.props = baseProps;
  }

  /**
   * 두 값 객체가 동일한지 비교합니다.
   * 모든 속성의 값이 정확히 일치해야 동일한 것으로 간주됩니다.
   *
   * @param vo - 비교할 값 객체
   * @returns 두 값 객체가 동일하면 true, 그렇지 않으면 false
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    // JSON 문자열 비교를 통한 깊은 비교 수행
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
