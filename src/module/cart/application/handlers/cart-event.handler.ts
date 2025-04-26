import { Injectable, OnModuleInit } from '@nestjs/common';
import { DomainEvents } from '@lib/domain/events/DomainEvents';
import { IDomainEvent } from '@lib/domain/events/IDomainEvent';
import { CreateCartUseCase } from '../usecases/create-cart.usecase';
import { CustomerCreatedEvent } from 'src/module/customer/domain/events';

@Injectable()
export class CartEventHandler implements OnModuleInit {
  constructor(private readonly createCartUseCase: CreateCartUseCase) {}

  onModuleInit() {
    DomainEvents.register(
      (event) => this.handle(event),
      CustomerCreatedEvent.name,
    );
  }

  handle(event: IDomainEvent): void {
    switch (event.constructor.name) {
      case CustomerCreatedEvent.name:
        this.createCartUseCase
          .execute(event.getAggregateId())
          .catch((error) => {
            throw new Error('[CartEventHandler] 장바구니 생성 에러' + error);
          });
        break;
      default:
        throw new Error('Unknown event');
    }
  }
}
