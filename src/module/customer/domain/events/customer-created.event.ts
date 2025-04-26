import { UniqueEntityId } from '@lib/domain';
import { IDomainEvent } from '@lib/domain/events/IDomainEvent';

export class CustomerCreatedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;

  constructor(public readonly customerId: UniqueEntityId) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.customerId;
  }
}
