import { EntityClass } from './Entity';
import { IDomainEvent } from './events/IDomainEvent';
import { DomainEvents } from './events/DomainEvents';

export abstract class AggregateRoot<T> extends EntityClass<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    // 이 애그리게이트의 도메인 이벤트 목록에 도메인 이벤트 추가
    this._domainEvents.push(domainEvent);
    // 이 애그리게이트 인스턴스를 도메인 이벤트의 애그리게이트 목록에 추가하여
    // 나중에 이벤트를 발행할 수 있도록 표시
    DomainEvents.markAggregateForDispatch(this);
    // 도메인 이벤트 로깅
    console.log('Domain event added:', domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
