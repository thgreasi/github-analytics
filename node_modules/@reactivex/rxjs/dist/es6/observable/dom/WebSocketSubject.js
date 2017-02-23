import { Subject } from '../../Subject';
import { Subscriber } from '../../Subscriber';
import { Observable } from '../../Observable';
import { Subscription } from '../../Subscription';
import { root } from '../../util/root';
import { ReplaySubject } from '../../ReplaySubject';
import { tryCatch } from '../../util/tryCatch';
import { errorObject } from '../../util/errorObject';
import { assign } from '../../util/assign';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class WebSocketSubject extends Subject {
    constructor(urlConfigOrSource, destination) {
        if (urlConfigOrSource instanceof Observable) {
            super(destination, urlConfigOrSource);
        }
        else {
            super();
            this.WebSocketCtor = root.WebSocket;
            if (typeof urlConfigOrSource === 'string') {
                this.url = urlConfigOrSource;
            }
            else {
                // WARNING: config object could override important members here.
                assign(this, urlConfigOrSource);
            }
            if (!this.WebSocketCtor) {
                throw new Error('no WebSocket constructor can be found');
            }
            this.destination = new ReplaySubject();
        }
    }
    resultSelector(e) {
        return JSON.parse(e.data);
    }
    /**
     * @param urlConfigOrSource
     * @return {WebSocketSubject}
     * @static true
     * @name webSocket
     * @owner Observable
     */
    static create(urlConfigOrSource) {
        return new WebSocketSubject(urlConfigOrSource);
    }
    lift(operator) {
        const sock = new WebSocketSubject(this, this.destination);
        sock.operator = operator;
        return sock;
    }
    // TODO: factor this out to be a proper Operator/Subscriber implementation and eliminate closures
    multiplex(subMsg, unsubMsg, messageFilter) {
        const self = this;
        return new Observable((observer) => {
            const result = tryCatch(subMsg)();
            if (result === errorObject) {
                observer.error(errorObject.e);
            }
            else {
                self.next(result);
            }
            let subscription = self.subscribe(x => {
                const result = tryCatch(messageFilter)(x);
                if (result === errorObject) {
                    observer.error(errorObject.e);
                }
                else if (result) {
                    observer.next(x);
                }
            }, err => observer.error(err), () => observer.complete());
            return () => {
                const result = tryCatch(unsubMsg)();
                if (result === errorObject) {
                    observer.error(errorObject.e);
                }
                else {
                    self.next(result);
                }
                subscription.unsubscribe();
            };
        });
    }
    _unsubscribe() {
        this.socket = null;
        this.source = null;
        this.destination = new ReplaySubject();
        this.isStopped = false;
        this.hasErrored = false;
        this.hasCompleted = false;
        this.observers = null;
        this.isUnsubscribed = false;
    }
    _subscribe(subscriber) {
        if (!this.observers) {
            this.observers = [];
        }
        const subscription = super._subscribe(subscriber);
        // HACK: For some reason transpilation wasn't honoring this in arrow functions below
        // Doesn't seem right, need to reinvestigate.
        const self = this;
        const WebSocket = this.WebSocketCtor;
        if (self.source || !subscription || subscription.isUnsubscribed) {
            return subscription;
        }
        if (self.url && !self.socket) {
            const socket = self.protocol ? new WebSocket(self.url, self.protocol) : new WebSocket(self.url);
            self.socket = socket;
            socket.onopen = (e) => {
                const openObserver = self.openObserver;
                if (openObserver) {
                    openObserver.next(e);
                }
                const queue = self.destination;
                self.destination = Subscriber.create((x) => socket.readyState === 1 && socket.send(x), (e) => {
                    const closingObserver = self.closingObserver;
                    if (closingObserver) {
                        closingObserver.next(undefined);
                    }
                    if (e && e.code) {
                        socket.close(e.code, e.reason);
                    }
                    else {
                        self._finalError(new TypeError('WebSocketSubject.error must be called with an object with an error code, ' +
                            'and an optional reason: { code: number, reason: string }'));
                    }
                }, () => {
                    const closingObserver = self.closingObserver;
                    if (closingObserver) {
                        closingObserver.next(undefined);
                    }
                    socket.close();
                });
                if (queue && queue instanceof ReplaySubject) {
                    subscription.add(queue.subscribe(self.destination));
                }
            };
            socket.onerror = (e) => self.error(e);
            socket.onclose = (e) => {
                const closeObserver = self.closeObserver;
                if (closeObserver) {
                    closeObserver.next(e);
                }
                if (e.wasClean) {
                    self._finalComplete();
                }
                else {
                    self._finalError(e);
                }
            };
            socket.onmessage = (e) => {
                const result = tryCatch(self.resultSelector)(e);
                if (result === errorObject) {
                    self._finalError(errorObject.e);
                }
                else {
                    self._finalNext(result);
                }
            };
        }
        return new Subscription(() => {
            subscription.unsubscribe();
            if (!this.observers || this.observers.length === 0) {
                const { socket } = this;
                if (socket && socket.readyState < 2) {
                    socket.close();
                }
                this.socket = undefined;
                this.source = undefined;
                this.destination = new ReplaySubject();
            }
        });
    }
}
//# sourceMappingURL=WebSocketSubject.js.map