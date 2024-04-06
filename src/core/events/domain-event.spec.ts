import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateCreated implements DomainEvent {
  public readonly ocurredAt: Date;
  public aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<unknown> {
  static create() {
    const aggregate = new CustomAggregate(null);
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe('DomainEvent', () => {
  it('should be able to dispatch and listen to events', () => {
    const registerSpy = vi.spyOn(DomainEvents, 'register');

    DomainEvents.register(() => {}, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();
    expect(aggregate.domainEvents.length).toBe(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(registerSpy).toHaveBeenCalledWith(expect.any(Function), CustomAggregateCreated.name);
    expect(aggregate.domainEvents.length).toBe(0);
  });
});
