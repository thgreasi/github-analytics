import { Subscriber } from './Subscriber';
export class Operator {
    call(subscriber, source) {
        return source._subscribe(new Subscriber(subscriber));
    }
}
//# sourceMappingURL=Operator.js.map