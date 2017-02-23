import { FutureAction } from './FutureAction';
import { QueueScheduler } from './QueueScheduler';
export class AsyncScheduler extends QueueScheduler {
    scheduleNow(work, state) {
        return new FutureAction(this, work).schedule(state, 0);
    }
}
//# sourceMappingURL=AsyncScheduler.js.map