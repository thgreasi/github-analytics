import { AsapAction } from './AsapAction';
import { QueueScheduler } from './QueueScheduler';
export class AsapScheduler extends QueueScheduler {
    scheduleNow(work, state) {
        return new AsapAction(this, work).schedule(state);
    }
}
//# sourceMappingURL=AsapScheduler.js.map