import { Subscriber } from '../Subscriber';
/**
 * Returns an Observable that applies a specified accumulator function to the first item emitted by a source Observable,
 * then feeds the result of that function along with the second item emitted by the source Observable into the same
 * function, and so on until all items have been emitted by the source Observable, and emits the final result from
 * the final call to your function as its sole item.
 * This technique, which is called "reduce" here, is sometimes called "aggregate," "fold," "accumulate," "compress," or
 * "inject" in other programming contexts.
 *
 * <img src="./img/reduce.png" width="100%">
 *
 * @param {initialValue} the initial (seed) accumulator value
 * @param {accumulator} an accumulator function to be invoked on each item emitted by the source Observable, the
 * result of which will be used in the next accumulator call.
 * @return {Observable} an Observable that emits a single item that is the result of accumulating the output from the
 * items emitted by the source Observable.
 * @method reduce
 * @owner Observable
 */
export function reduce(project, seed) {
    return this.lift(new ReduceOperator(project, seed));
}
export class ReduceOperator {
    constructor(project, seed) {
        this.project = project;
        this.seed = seed;
    }
    call(subscriber, source) {
        return source._subscribe(new ReduceSubscriber(subscriber, this.project, this.seed));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class ReduceSubscriber extends Subscriber {
    constructor(destination, project, seed) {
        super(destination);
        this.hasValue = false;
        this.acc = seed;
        this.project = project;
        this.hasSeed = typeof seed !== 'undefined';
    }
    _next(value) {
        if (this.hasValue || (this.hasValue = this.hasSeed)) {
            this._tryReduce(value);
        }
        else {
            this.acc = value;
            this.hasValue = true;
        }
    }
    _tryReduce(value) {
        let result;
        try {
            result = this.project(this.acc, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.acc = result;
    }
    _complete() {
        if (this.hasValue || this.hasSeed) {
            this.destination.next(this.acc);
        }
        this.destination.complete();
    }
}
//# sourceMappingURL=reduce.js.map