import { FutureAction } from './FutureAction';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class QueueAction extends FutureAction {
    _schedule(state, delay = 0) {
        if (delay > 0) {
            return super._schedule(state, delay);
        }
        this.delay = delay;
        this.state = state;
        const scheduler = this.scheduler;
        scheduler.actions.push(this);
        scheduler.flush();
        return this;
    }
}
//# sourceMappingURL=QueueAction.js.map