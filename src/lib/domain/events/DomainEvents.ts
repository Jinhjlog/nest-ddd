import { UniqueEntityId } from '@lib/domain/UniqueEntityId';
import { IDomainEvent } from './IDomainEvent';
import { AggregateRoot } from '@lib/domain/AggregateRoot';

// TODO:필요에 따라 Nestjs EventEmitter로 리팩토링 하는 것을 고려
// 1. 성능 병목이 발견될 때: 프로파일링을 통해 현재 이벤트 시스템이 병목이 되는 것이 확인된 경우
// 2. 비동기 처리가 복잡해질 때: 이벤트 핸들러의 비동기 처리가 늘어나고 복잡해지는 경우
// 3. 시스템 확장 시: 애플리케이션이 성장하여 더 복잡한 이벤트 라우팅이 필요할 때
// 4. 표준화가 필요할 때: 여러 개발자/팀이 참여하면서 NestJS 표준 패턴으로 통일이 필요해질 때

// 실제 성능 이슈가 발견되지 않는 경우 이 구현을 계속 사용하는 것이 좋음

/**
 * DomainEvents 클래스
 *
 * 도메인 이벤트를 처리하기 위한 정적 메서드를 제공하는 클래스입니다.
 * 이벤트 핸들러 등록, 애그리게이트 표시, 이벤트 발행 등의 기능을 담당합니다.
 */
export class DomainEvents {
  // 이벤트 타입별 핸들러 함수 저장소
  private static handlersMap: Record<
    string,
    Array<(event: IDomainEvent) => void>
  > = {};
  // 이벤트를 발행해야 할 애그리게이트 목록
  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * 애그리게이트를 발행 대상으로 표시합니다.
   *
   * @method markAggregateForDispatch
   * @static
   * @param aggregate - 발행 대상으로 표시할 애그리게이트 루트 객체
   * @desc 도메인 이벤트를 생성한 애그리게이트 루트 객체가 호출합니다.
   * 이벤트들은 인프라스트럭처가 작업 단위를 커밋할 때 최종적으로 발행됩니다.
   */
  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  /**
   * 애그리게이트의 모든 도메인 이벤트를 발행합니다.
   *
   * @param aggregate - 이벤트를 발행할 애그리게이트
   */
  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: IDomainEvent) =>
      this.dispatch(event),
    );
  }

  /**
   * 발행 대상으로 표시된 애그리게이트 목록에서 애그리게이트를 제거합니다.
   *
   * @param aggregate - 목록에서 제거할 애그리게이트
   */
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>,
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  /**
   * ID로 발행 대상으로 표시된 애그리게이트를 찾습니다.
   *
   * @param id - 검색할 애그리게이트의 ID
   * @returns 찾은 애그리게이트 또는 없는 경우 null
   */
  private static findMarkedAggregateByID(
    id: UniqueEntityId,
  ): AggregateRoot<any> | null {
    let found: AggregateRoot<any> | null = null;
    for (const aggregate of this.markedAggregates) {
      if (aggregate.id.equals(id)) {
        found = aggregate;
      }
    }

    return found;
  }

  /**
   * 특정 ID를 가진 애그리게이트의 모든 이벤트를 발행합니다.
   *
   * @param id - 이벤트를 발행할 애그리게이트의 ID
   */
  public static dispatchEventsForAggregate(id: UniqueEntityId): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  /**
   * 특정 이벤트 유형에 대한 핸들러를 등록합니다.
   *
   * @param callback - 이벤트 발생 시 실행할 콜백 함수
   * @param eventClassName - 등록할 이벤트 클래스 이름
   */
  public static register(
    callback: (event: IDomainEvent) => void,
    eventClassName: string,
  ): void {
    if (!(eventClassName in this.handlersMap)) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
    console.log(`Registered event handler for ${eventClassName}`);
  }

  /**
   * 모든 이벤트 핸들러를 제거합니다.
   */
  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  /**
   * 발행 대상으로 표시된 모든 애그리게이트를 제거합니다.
   */
  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  /**
   * 도메인 이벤트를 발행하고 해당 이벤트에 등록된 모든 핸들러를 실행합니다.
   *
   * @param event - 발행할 도메인 이벤트
   */
  private static dispatch(event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (eventClassName in this.handlersMap) {
      const handlers = this.handlersMap[eventClassName];
      console.log(`found ${handlers.length}`);

      for (const handler of handlers) {
        handler(event);
      }
    } else {
      console.log(`No handlers found for event: ${eventClassName}`);
    }
  }
}
