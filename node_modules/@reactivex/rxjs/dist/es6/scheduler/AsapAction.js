import { Immediate } from '../util/Immediate';
import { FutureAction } from './FutureAction';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AsapAction extends FutureAction {
    _schedule(state, delay = 0) {
        if (delay > 0) {
            return super._schedule(state, delay);
        }
        this.delay = delay;
        this.state = state;
        const { scheduler } = this;
        scheduler.actions.push(this);
        if (!scheduler.scheduledId) {
            scheduler.scheduledId = Immediate.setImmediate(() => {
                scheduler.scheduledId = null;
                scheduler.flush();
            });
        }
        return this;
    }
    _unsubscribe() {
        const { scheduler } = this;
        const { scheduledId, actions } = scheduler;
        super._unsubscribe();
        if (actions.length === 0) {
            scheduler.active = false;
            if (scheduledId != null) {
                scheduler.scheduledId = null;
                Immediate.clearImmediate(scheduledId);
            }
        }
    }
}
//# sourceMappingURL=AsapAction.js.map