import { UniqueEntityId } from '../UniqueEntityId';

export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): UniqueEntityId;
}
