import { publishReplay } from './publishReplay';
/**
 * @param bufferSize
 * @param windowTime
 * @param scheduler
 * @return {Observable<any>}
 * @method cache
 * @owner Observable
 */
export function cache(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    return publishReplay.call(this, bufferSize, windowTime, scheduler).refCount();
}
//# sourceMappingURL=cache.js.map