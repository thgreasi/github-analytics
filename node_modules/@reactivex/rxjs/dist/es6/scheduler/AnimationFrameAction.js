import { FutureAction } from './FutureAction';
import { AnimationFrame } from '../util/AnimationFrame';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AnimationFrameAction extends FutureAction {
    _schedule(state, delay = 0) {
        if (delay > 0) {
            return super._schedule(state, delay);
        }
        this.delay = delay;
        this.state = state;
        const { scheduler } = this;
        scheduler.actions.push(this);
        if (!scheduler.scheduledId) {
            scheduler.scheduledId = AnimationFrame.requestAnimationFrame(() => {
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
                AnimationFrame.cancelAnimationFrame(scheduledId);
            }
        }
    }
}
//# sourceMappingURL=AnimationFrameAction.js.map