import { QueueScheduler } from './QueueScheduler';
import { AnimationFrameAction } from './AnimationFrameAction';
export class AnimationFrameScheduler extends QueueScheduler {
    scheduleNow(work, state) {
        return new AnimationFrameAction(this, work).schedule(state);
    }
}
//# sourceMappingURL=AnimationFrameScheduler.js.map