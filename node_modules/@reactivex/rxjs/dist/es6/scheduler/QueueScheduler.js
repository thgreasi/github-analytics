import { QueueAction } from './QueueAction';
import { FutureAction } from './FutureAction';
export class QueueScheduler {
    constructor() {
        this.active = false;
        this.actions = []; // XXX: use `any` to remove type param `T` from `VirtualTimeScheduler`.
        this.scheduledId = null;
    }
    now() {
        return Date.now();
    }
    flush() {
        if (this.active || this.scheduledId) {
            return;
        }
        this.active = true;
        const actions = this.actions;
        // XXX: use `any` to remove type param `T` from `VirtualTimeScheduler`.
        for (let action = null; action = actions.shift();) {
            action.execute();
            if (action.error) {
                this.active = false;
                throw action.error;
            }
        }
        this.active = false;
    }
    schedule(work, delay = 0, state) {
        return (delay <= 0) ?
            this.scheduleNow(work, state) :
            this.scheduleLater(work, delay, state);
    }
    scheduleNow(work, state) {
        return new QueueAction(this, work).schedule(state);
    }
    scheduleLater(work, delay, state) {
        return new FutureAction(this, work).schedule(state, delay);
    }
}
//# sourceMappingURL=QueueScheduler.js.map