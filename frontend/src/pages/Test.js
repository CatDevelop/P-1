"use strict";
(self.cf2qkqt7wl = self.cf2qkqt7wl || []).push([[179], {
    824: () => {
        function ne(t) {
            return "function" == typeof t
        }

        function $o(t) {
            const e = t(i => {
                Error.call(i), i.stack = (new Error).stack
            });
            return e.prototype = Object.create(Error.prototype), e.prototype.constructor = e, e
        }

        const zo = $o(t => function (e) {
            t(this), this.message = e ? `${e.length} errors occurred during unsubscription:\n${e.map((i, r) => `${r + 1}) ${i.toString()}`).join("\n  ")}` : "", this.name = "UnsubscriptionError", this.errors = e
        });

        function Pi(t, n) {
            if (t) {
                const e = t.indexOf(n);
                0 <= e && t.splice(e, 1)
            }
        }

        class jt {
            constructor(n) {
                this.initialTeardown = n, this.closed = !1, this._parentage = null, this._finalizers = null
            }

            unsubscribe() {
                let n;
                if (!this.closed) {
                    this.closed = !0;
                    const {_parentage: e} = this;
                    if (e) if (this._parentage = null, Array.isArray(e)) for (const o of e) o.remove(this); else e.remove(this);
                    const {initialTeardown: i} = this;
                    if (ne(i)) try {
                        i()
                    } catch (o) {
                        n = o instanceof zo ? o.errors : [o]
                    }
                    const {_finalizers: r} = this;
                    if (r) {
                        this._finalizers = null;
                        for (const o of r) try {
                            Kd(o)
                        } catch (s) {
                            n = n ?? [], s instanceof zo ? n = [...n, ...s.errors] : n.push(s)
                        }
                    }
                    if (n) throw new zo(n)
                }
            }

            add(n) {
                var e;
                if (n && n !== this) if (this.closed) Kd(n); else {
                    if (n instanceof jt) {
                        if (n.closed || n._hasParent(this)) return;
                        n._addParent(this)
                    }
                    (this._finalizers = null !== (e = this._finalizers) && void 0 !== e ? e : []).push(n)
                }
            }

            _hasParent(n) {
                const {_parentage: e} = this;
                return e === n || Array.isArray(e) && e.includes(n)
            }

            _addParent(n) {
                const {_parentage: e} = this;
                this._parentage = Array.isArray(e) ? (e.push(n), e) : e ? [e, n] : n
            }

            _removeParent(n) {
                const {_parentage: e} = this;
                e === n ? this._parentage = null : Array.isArray(e) && Pi(e, n)
            }

            remove(n) {
                const {_finalizers: e} = this;
                e && Pi(e, n), n instanceof jt && n._removeParent(this)
            }
        }

        jt.EMPTY = (() => {
            const t = new jt;
            return t.closed = !0, t
        })();
        const qd = jt.EMPTY;

        function Yd(t) {
            return t instanceof jt || t && "closed" in t && ne(t.remove) && ne(t.add) && ne(t.unsubscribe)
        }

        function Kd(t) {
            ne(t) ? t() : t.unsubscribe()
        }

        const ui = {
            onUnhandledError: null,
            onStoppedNotification: null,
            Promise: void 0,
            useDeprecatedSynchronousErrorHandling: !1,
            useDeprecatedNextContext: !1
        }, Go = {
            setTimeout(t, n, ...e) {
                const {delegate: i} = Go;
                return i?.setTimeout ? i.setTimeout(t, n, ...e) : setTimeout(t, n, ...e)
            }, clearTimeout(t) {
                const {delegate: n} = Go;
                return (n?.clearTimeout || clearTimeout)(t)
            }, delegate: void 0
        };

        function Zd(t) {
            Go.setTimeout(() => {
                const {onUnhandledError: n} = ui;
                if (!n) throw t;
                n(t)
            })
        }

        function Or() {
        }

        const tw = nl("C", void 0, void 0);

        function nl(t, n, e) {
            return {kind: t, value: n, error: e}
        }

        let di = null;

        function Wo(t) {
            if (ui.useDeprecatedSynchronousErrorHandling) {
                const n = !di;
                if (n && (di = {errorThrown: !1, error: null}), t(), n) {
                    const {errorThrown: e, error: i} = di;
                    if (di = null, e) throw i
                }
            } else t()
        }

        class il extends jt {
            constructor(n) {
                super(), this.isStopped = !1, n ? (this.destination = n, Yd(n) && n.add(this)) : this.destination = lw
            }

            static create(n, e, i) {
                return new Ir(n, e, i)
            }

            next(n) {
                this.isStopped ? ol(function iw(t) {
                    return nl("N", t, void 0)
                }(n), this) : this._next(n)
            }

            error(n) {
                this.isStopped ? ol(function nw(t) {
                    return nl("E", void 0, t)
                }(n), this) : (this.isStopped = !0, this._error(n))
            }

            complete() {
                this.isStopped ? ol(tw, this) : (this.isStopped = !0, this._complete())
            }

            unsubscribe() {
                this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
            }

            _next(n) {
                this.destination.next(n)
            }

            _error(n) {
                try {
                    this.destination.error(n)
                } finally {
                    this.unsubscribe()
                }
            }

            _complete() {
                try {
                    this.destination.complete()
                } finally {
                    this.unsubscribe()
                }
            }
        }

        const ow = Function.prototype.bind;

        function rl(t, n) {
            return ow.call(t, n)
        }

        class sw {
            constructor(n) {
                this.partialObserver = n
            }

            next(n) {
                const {partialObserver: e} = this;
                if (e.next) try {
                    e.next(n)
                } catch (i) {
                    qo(i)
                }
            }

            error(n) {
                const {partialObserver: e} = this;
                if (e.error) try {
                    e.error(n)
                } catch (i) {
                    qo(i)
                } else qo(n)
            }

            complete() {
                const {partialObserver: n} = this;
                if (n.complete) try {
                    n.complete()
                } catch (e) {
                    qo(e)
                }
            }
        }

        class Ir extends il {
            constructor(n, e, i) {
                let r;
                if (super(), ne(n) || !n) r = {next: n ?? void 0, error: e ?? void 0, complete: i ?? void 0}; else {
                    let o;
                    this && ui.useDeprecatedNextContext ? (o = Object.create(n), o.unsubscribe = () => this.unsubscribe(), r = {
                        next: n.next && rl(n.next, o),
                        error: n.error && rl(n.error, o),
                        complete: n.complete && rl(n.complete, o)
                    }) : r = n
                }
                this.destination = new sw(r)
            }
        }

        function qo(t) {
            ui.useDeprecatedSynchronousErrorHandling ? function rw(t) {
                ui.useDeprecatedSynchronousErrorHandling && di && (di.errorThrown = !0, di.error = t)
            }(t) : Zd(t)
        }

        function ol(t, n) {
            const {onStoppedNotification: e} = ui;
            e && Go.setTimeout(() => e(t, n))
        }

        const lw = {
            closed: !0, next: Or, error: function aw(t) {
                throw t
            }, complete: Or
        }, sl = "function" == typeof Symbol && Symbol.observable || "@@observable";

        function Ar(t) {
            return t
        }

        let Re = (() => {
            class t {
                constructor(e) {
                    e && (this._subscribe = e)
                }

                lift(e) {
                    const i = new t;
                    return i.source = this, i.operator = e, i
                }

                subscribe(e, i, r) {
                    const o = function uw(t) {
                        return t && t instanceof il || function cw(t) {
                            return t && ne(t.next) && ne(t.error) && ne(t.complete)
                        }(t) && Yd(t)
                    }(e) ? e : new Ir(e, i, r);
                    return Wo(() => {
                        const {operator: s, source: a} = this;
                        o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o))
                    }), o
                }

                _trySubscribe(e) {
                    try {
                        return this._subscribe(e)
                    } catch (i) {
                        e.error(i)
                    }
                }

                forEach(e, i) {
                    return new (i = Xd(i))((r, o) => {
                        const s = new Ir({
                            next: a => {
                                try {
                                    e(a)
                                } catch (l) {
                                    o(l), s.unsubscribe()
                                }
                            }, error: o, complete: r
                        });
                        this.subscribe(s)
                    })
                }

                _subscribe(e) {
                    var i;
                    return null === (i = this.source) || void 0 === i ? void 0 : i.subscribe(e)
                }

                [sl]() {
                    return this
                }

                pipe(...e) {
                    return function Qd(t) {
                        return 0 === t.length ? Ar : 1 === t.length ? t[0] : function (e) {
                            return t.reduce((i, r) => r(i), e)
                        }
                    }(e)(this)
                }

                toPromise(e) {
                    return new (e = Xd(e))((i, r) => {
                        let o;
                        this.subscribe(s => o = s, s => r(s), () => i(o))
                    })
                }
            }

            return t.create = n => new t(n), t
        })();

        function Xd(t) {
            var n;
            return null !== (n = t ?? ui.Promise) && void 0 !== n ? n : Promise
        }

        const dw = $o(t => function () {
            t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
        });
        let nn = (() => {
            class t extends Re {
                constructor() {
                    super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
                }

                lift(e) {
                    const i = new Jd(this, this);
                    return i.operator = e, i
                }

                _throwIfClosed() {
                    if (this.closed) throw new dw
                }

                next(e) {
                    Wo(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.currentObservers || (this.currentObservers = Array.from(this.observers));
                            for (const i of this.currentObservers) i.next(e)
                        }
                    })
                }

                error(e) {
                    Wo(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.hasError = this.isStopped = !0, this.thrownError = e;
                            const {observers: i} = this;
                            for (; i.length;) i.shift().error(e)
                        }
                    })
                }

                complete() {
                    Wo(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.isStopped = !0;
                            const {observers: e} = this;
                            for (; e.length;) e.shift().complete()
                        }
                    })
                }

                unsubscribe() {
                    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
                }

                get observed() {
                    var e;
                    return (null === (e = this.observers) || void 0 === e ? void 0 : e.length) > 0
                }

                _trySubscribe(e) {
                    return this._throwIfClosed(), super._trySubscribe(e)
                }

                _subscribe(e) {
                    return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e)
                }

                _innerSubscribe(e) {
                    const {hasError: i, isStopped: r, observers: o} = this;
                    return i || r ? qd : (this.currentObservers = null, o.push(e), new jt(() => {
                        this.currentObservers = null, Pi(o, e)
                    }))
                }

                _checkFinalizedStatuses(e) {
                    const {hasError: i, thrownError: r, isStopped: o} = this;
                    i ? e.error(r) : o && e.complete()
                }

                asObservable() {
                    const e = new Re;
                    return e.source = this, e
                }
            }

            return t.create = (n, e) => new Jd(n, e), t
        })();

        class Jd extends nn {
            constructor(n, e) {
                super(), this.destination = n, this.source = e
            }

            next(n) {
                var e, i;
                null === (i = null === (e = this.destination) || void 0 === e ? void 0 : e.next) || void 0 === i || i.call(e, n)
            }

            error(n) {
                var e, i;
                null === (i = null === (e = this.destination) || void 0 === e ? void 0 : e.error) || void 0 === i || i.call(e, n)
            }

            complete() {
                var n, e;
                null === (e = null === (n = this.destination) || void 0 === n ? void 0 : n.complete) || void 0 === e || e.call(n)
            }

            _subscribe(n) {
                var e, i;
                return null !== (i = null === (e = this.source) || void 0 === e ? void 0 : e.subscribe(n)) && void 0 !== i ? i : qd
            }
        }

        function et(t) {
            return n => {
                if (function hw(t) {
                    return ne(t?.lift)
                }(n)) return n.lift(function (e) {
                    try {
                        return t(e, this)
                    } catch (i) {
                        this.error(i)
                    }
                });
                throw new TypeError("Unable to lift unknown Observable type")
            }
        }

        function Ye(t, n, e, i, r) {
            return new fw(t, n, e, i, r)
        }

        class fw extends il {
            constructor(n, e, i, r, o, s) {
                super(n), this.onFinalize = o, this.shouldUnsubscribe = s, this._next = e ? function (a) {
                    try {
                        e(a)
                    } catch (l) {
                        n.error(l)
                    }
                } : super._next, this._error = r ? function (a) {
                    try {
                        r(a)
                    } catch (l) {
                        n.error(l)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._error, this._complete = i ? function () {
                    try {
                        i()
                    } catch (a) {
                        n.error(a)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._complete
            }

            unsubscribe() {
                var n;
                if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                    const {closed: e} = this;
                    super.unsubscribe(), !e && (null === (n = this.onFinalize) || void 0 === n || n.call(this))
                }
            }
        }

        function mt(t, n) {
            return et((e, i) => {
                let r = 0;
                e.subscribe(Ye(i, o => {
                    i.next(t.call(n, o, r++))
                }))
            })
        }

        function hi(t) {
            return this instanceof hi ? (this.v = t, this) : new hi(t)
        }

        function vw(t) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var e, n = t[Symbol.asyncIterator];
            return n ? n.call(t) : (t = function nh(t) {
                var n = "function" == typeof Symbol && Symbol.iterator, e = n && t[n], i = 0;
                if (e) return e.call(t);
                if (t && "number" == typeof t.length) return {
                    next: function () {
                        return t && i >= t.length && (t = void 0), {value: t && t[i++], done: !t}
                    }
                };
                throw new TypeError(n ? "Object is not iterable." : "Symbol.iterator is not defined.")
            }(t), e = {}, i("next"), i("throw"), i("return"), e[Symbol.asyncIterator] = function () {
                return this
            }, e);

            function i(o) {
                e[o] = t[o] && function (s) {
                    return new Promise(function (a, l) {
                        !function r(o, s, a, l) {
                            Promise.resolve(l).then(function (c) {
                                o({value: c, done: a})
                            }, s)
                        }(a, l, (s = t[o](s)).done, s.value)
                    })
                }
            }
        }

        const ll = t => t && "number" == typeof t.length && "function" != typeof t;

        function ih(t) {
            return ne(t?.then)
        }

        function rh(t) {
            return ne(t[sl])
        }

        function oh(t) {
            return Symbol.asyncIterator && ne(t?.[Symbol.asyncIterator])
        }

        function sh(t) {
            return new TypeError(`You provided ${null !== t && "object" == typeof t ? "an invalid object" : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
        }

        const ah = function yw() {
            return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"
        }();

        function lh(t) {
            return ne(t?.[ah])
        }

        function ch(t) {
            return function mw(t, n, e) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var r, i = e.apply(t, n || []), o = [];
                return r = {}, s("next"), s("throw"), s("return"), r[Symbol.asyncIterator] = function () {
                    return this
                }, r;

                function s(h) {
                    i[h] && (r[h] = function (f) {
                        return new Promise(function (p, m) {
                            o.push([h, f, p, m]) > 1 || a(h, f)
                        })
                    })
                }

                function a(h, f) {
                    try {
                        !function l(h) {
                            h.value instanceof hi ? Promise.resolve(h.value.v).then(c, u) : d(o[0][2], h)
                        }(i[h](f))
                    } catch (p) {
                        d(o[0][3], p)
                    }
                }

                function c(h) {
                    a("next", h)
                }

                function u(h) {
                    a("throw", h)
                }

                function d(h, f) {
                    h(f), o.shift(), o.length && a(o[0][0], o[0][1])
                }
            }(this, arguments, function* () {
                const e = t.getReader();
                try {
                    for (; ;) {
                        const {value: i, done: r} = yield hi(e.read());
                        if (r) return yield hi(void 0);
                        yield yield hi(i)
                    }
                } finally {
                    e.releaseLock()
                }
            })
        }

        function uh(t) {
            return ne(t?.getReader)
        }

        function tt(t) {
            if (t instanceof Re) return t;
            if (null != t) {
                if (rh(t)) return function bw(t) {
                    return new Re(n => {
                        const e = t[sl]();
                        if (ne(e.subscribe)) return e.subscribe(n);
                        throw new TypeError("Provided object does not correctly implement Symbol.observable")
                    })
                }(t);
                if (ll(t)) return function ww(t) {
                    return new Re(n => {
                        for (let e = 0; e < t.length && !n.closed; e++) n.next(t[e]);
                        n.complete()
                    })
                }(t);
                if (ih(t)) return function Cw(t) {
                    return new Re(n => {
                        t.then(e => {
                            n.closed || (n.next(e), n.complete())
                        }, e => n.error(e)).then(null, Zd)
                    })
                }(t);
                if (oh(t)) return dh(t);
                if (lh(t)) return function Dw(t) {
                    return new Re(n => {
                        for (const e of t) if (n.next(e), n.closed) return;
                        n.complete()
                    })
                }(t);
                if (uh(t)) return function Ew(t) {
                    return dh(ch(t))
                }(t)
            }
            throw sh(t)
        }

        function dh(t) {
            return new Re(n => {
                (function Sw(t, n) {
                    var e, i, r, o;
                    return function pw(t, n, e, i) {
                        return new (e || (e = Promise))(function (o, s) {
                            function a(u) {
                                try {
                                    c(i.next(u))
                                } catch (d) {
                                    s(d)
                                }
                            }

                            function l(u) {
                                try {
                                    c(i.throw(u))
                                } catch (d) {
                                    s(d)
                                }
                            }

                            function c(u) {
                                u.done ? o(u.value) : function r(o) {
                                    return o instanceof e ? o : new e(function (s) {
                                        s(o)
                                    })
                                }(u.value).then(a, l)
                            }

                            c((i = i.apply(t, n || [])).next())
                        })
                    }(this, void 0, void 0, function* () {
                        try {
                            for (e = vw(t); !(i = yield e.next()).done;) if (n.next(i.value), n.closed) return
                        } catch (s) {
                            r = {error: s}
                        } finally {
                            try {
                                i && !i.done && (o = e.return) && (yield o.call(e))
                            } finally {
                                if (r) throw r.error
                            }
                        }
                        n.complete()
                    })
                })(t, n).catch(e => n.error(e))
            })
        }

        function zn(t, n, e, i = 0, r = !1) {
            const o = n.schedule(function () {
                e(), r ? t.add(this.schedule(null, i)) : this.unsubscribe()
            }, i);
            if (t.add(o), !r) return o
        }

        function Fi(t, n, e = 1 / 0) {
            return ne(n) ? Fi((i, r) => mt((o, s) => n(i, o, r, s))(tt(t(i, r))), e) : ("number" == typeof n && (e = n), et((i, r) => function xw(t, n, e, i, r, o, s, a) {
                const l = [];
                let c = 0, u = 0, d = !1;
                const h = () => {
                    d && !l.length && !c && n.complete()
                }, f = m => c < i ? p(m) : l.push(m), p = m => {
                    o && n.next(m), c++;
                    let b = !1;
                    tt(e(m, u++)).subscribe(Ye(n, w => {
                        r?.(w), o ? f(w) : n.next(w)
                    }, () => {
                        b = !0
                    }, void 0, () => {
                        if (b) try {
                            for (c--; l.length && c < i;) {
                                const w = l.shift();
                                s ? zn(n, s, () => p(w)) : p(w)
                            }
                            h()
                        } catch (w) {
                            n.error(w)
                        }
                    }))
                };
                return t.subscribe(Ye(n, f, () => {
                    d = !0, h()
                })), () => {
                    a?.()
                }
            }(i, r, t, e)))
        }

        function hh(t = 1 / 0) {
            return Fi(Ar, t)
        }

        const cl = new Re(t => t.complete());

        function fh(t) {
            return t && ne(t.schedule)
        }

        function ul(t) {
            return t[t.length - 1]
        }

        function ph(t) {
            return ne(ul(t)) ? t.pop() : void 0
        }

        function Yo(t) {
            return fh(ul(t)) ? t.pop() : void 0
        }

        function gh(t, n = 0) {
            return et((e, i) => {
                e.subscribe(Ye(i, r => zn(i, t, () => i.next(r), n), () => zn(i, t, () => i.complete(), n), r => zn(i, t, () => i.error(r), n)))
            })
        }

        function mh(t, n = 0) {
            return et((e, i) => {
                i.add(t.schedule(() => e.subscribe(i), n))
            })
        }

        function vh(t, n) {
            if (!t) throw new Error("Iterable cannot be null");
            return new Re(e => {
                zn(e, n, () => {
                    const i = t[Symbol.asyncIterator]();
                    zn(e, n, () => {
                        i.next().then(r => {
                            r.done ? e.complete() : e.next(r.value)
                        })
                    }, 0, !0)
                })
            })
        }

        function Ko(t, n) {
            return n ? function kw(t, n) {
                if (null != t) {
                    if (rh(t)) return function Ow(t, n) {
                        return tt(t).pipe(mh(n), gh(n))
                    }(t, n);
                    if (ll(t)) return function Aw(t, n) {
                        return new Re(e => {
                            let i = 0;
                            return n.schedule(function () {
                                i === t.length ? e.complete() : (e.next(t[i++]), e.closed || this.schedule())
                            })
                        })
                    }(t, n);
                    if (ih(t)) return function Iw(t, n) {
                        return tt(t).pipe(mh(n), gh(n))
                    }(t, n);
                    if (oh(t)) return vh(t, n);
                    if (lh(t)) return function Pw(t, n) {
                        return new Re(e => {
                            let i;
                            return zn(e, n, () => {
                                i = t[ah](), zn(e, n, () => {
                                    let r, o;
                                    try {
                                        ({value: r, done: o} = i.next())
                                    } catch (s) {
                                        return void e.error(s)
                                    }
                                    o ? e.complete() : e.next(r)
                                }, 0, !0)
                            }), () => ne(i?.return) && i.return()
                        })
                    }(t, n);
                    if (uh(t)) return function Fw(t, n) {
                        return vh(ch(t), n)
                    }(t, n)
                }
                throw sh(t)
            }(t, n) : tt(t)
        }

        function Pr(...t) {
            const n = Yo(t), e = function Tw(t, n) {
                return "number" == typeof ul(t) ? t.pop() : n
            }(t, 1 / 0), i = t;
            return i.length ? 1 === i.length ? tt(i[0]) : hh(e)(Ko(i, n)) : cl
        }

        function dl(t = {}) {
            const {
                connector: n = (() => new nn),
                resetOnError: e = !0,
                resetOnComplete: i = !0,
                resetOnRefCountZero: r = !0
            } = t;
            return o => {
                let s, a, l, c = 0, u = !1, d = !1;
                const h = () => {
                    a?.unsubscribe(), a = void 0
                }, f = () => {
                    h(), s = l = void 0, u = d = !1
                }, p = () => {
                    const m = s;
                    f(), m?.unsubscribe()
                };
                return et((m, b) => {
                    c++, !d && !u && h();
                    const w = l = l ?? n();
                    b.add(() => {
                        c--, 0 === c && !d && !u && (a = hl(p, r))
                    }), w.subscribe(b), !s && c > 0 && (s = new Ir({
                        next: x => w.next(x), error: x => {
                            d = !0, h(), a = hl(f, e, x), w.error(x)
                        }, complete: () => {
                            u = !0, h(), a = hl(f, i), w.complete()
                        }
                    }), tt(m).subscribe(s))
                })(o)
            }
        }

        function hl(t, n, ...e) {
            if (!0 === n) return void t();
            if (!1 === n) return;
            const i = new Ir({
                next: () => {
                    i.unsubscribe(), t()
                }
            });
            return tt(n(...e)).subscribe(i)
        }

        function fe(t) {
            for (let n in t) if (t[n] === fe) return n;
            throw Error("Could not find renamed property on target object.")
        }

        function fl(t, n) {
            for (const e in n) n.hasOwnProperty(e) && !t.hasOwnProperty(e) && (t[e] = n[e])
        }

        function pe(t) {
            if ("string" == typeof t) return t;
            if (Array.isArray(t)) return "[" + t.map(pe).join(", ") + "]";
            if (null == t) return "" + t;
            if (t.overriddenName) return `${t.overriddenName}`;
            if (t.name) return `${t.name}`;
            const n = t.toString();
            if (null == n) return "" + n;
            const e = n.indexOf("\n");
            return -1 === e ? n : n.substring(0, e)
        }

        function pl(t, n) {
            return null == t || "" === t ? null === n ? "" : n : null == n || "" === n ? t : t + " " + n
        }

        const Nw = fe({__forward_ref__: fe});

        function ie(t) {
            return t.__forward_ref__ = ie, t.toString = function () {
                return pe(this())
            }, t
        }

        function B(t) {
            return gl(t) ? t() : t
        }

        function gl(t) {
            return "function" == typeof t && t.hasOwnProperty(Nw) && t.__forward_ref__ === ie
        }

        function ml(t) {
            return t && !!t.\u0275providers
        }

        const _h = "https://g.co/ng/security#xss";

        class M extends Error {
            constructor(n, e) {
                super(Zo(n, e)), this.code = n
            }
        }

        function Zo(t, n) {
            return `NG0${Math.abs(t)}${n ? ": " + n.trim() : ""}`
        }

        function U(t) {
            return "string" == typeof t ? t : null == t ? "" : String(t)
        }

        function Qo(t, n) {
            throw new M(-201, !1)
        }

        function Ut(t, n) {
            null == t && function ae(t, n, e, i) {
                throw new Error(`ASSERTION ERROR: ${t}` + (null == i ? "" : ` [Expected=> ${e} ${i} ${n} <=Actual]`))
            }(n, t, null, "!=")
        }

        function X(t) {
            return {token: t.token, providedIn: t.providedIn || null, factory: t.factory, value: void 0}
        }

        function Pt(t) {
            return {providers: t.providers || [], imports: t.imports || []}
        }

        function Xo(t) {
            return yh(t, Jo) || yh(t, wh)
        }

        function yh(t, n) {
            return t.hasOwnProperty(n) ? t[n] : null
        }

        function bh(t) {
            return t && (t.hasOwnProperty(vl) || t.hasOwnProperty(Uw)) ? t[vl] : null
        }

        const Jo = fe({\u0275prov: fe}), vl = fe({\u0275inj: fe}), wh = fe({ngInjectableDef: fe}),
            Uw = fe({ngInjectorDef: fe});
        var j = (() => ((j = j || {})[j.Default = 0] = "Default", j[j.Host = 1] = "Host", j[j.Self = 2] = "Self", j[j.SkipSelf = 4] = "SkipSelf", j[j.Optional = 8] = "Optional", j))();
        let _l;

        function $t(t) {
            const n = _l;
            return _l = t, n
        }

        function Ch(t, n, e) {
            const i = Xo(t);
            return i && "root" == i.providedIn ? void 0 === i.value ? i.value = i.factory() : i.value : e & j.Optional ? null : void 0 !== n ? n : void Qo(pe(t))
        }

        const ve = (() => typeof globalThis < "u" && globalThis || typeof global < "u" && global || typeof window < "u" && window || typeof self < "u" && typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && self)(),
            Fr = {}, yl = "__NG_DI_FLAG__", es = "ngTempTokenPath", zw = "ngTokenPath", Gw = /\n/gm, Ww = "\u0275",
            Dh = "__source";
        let kr;

        function ki(t) {
            const n = kr;
            return kr = t, n
        }

        function qw(t, n = j.Default) {
            if (void 0 === kr) throw new M(-203, !1);
            return null === kr ? Ch(t, void 0, n) : kr.get(t, n & j.Optional ? null : void 0, n)
        }

        function W(t, n = j.Default) {
            return (function $w() {
                return _l
            }() || qw)(B(t), n)
        }

        function Ni(t, n = j.Default) {
            return W(t, ts(n))
        }

        function ts(t) {
            return typeof t > "u" || "number" == typeof t ? t : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
        }

        function bl(t) {
            const n = [];
            for (let e = 0; e < t.length; e++) {
                const i = B(t[e]);
                if (Array.isArray(i)) {
                    if (0 === i.length) throw new M(900, !1);
                    let r, o = j.Default;
                    for (let s = 0; s < i.length; s++) {
                        const a = i[s], l = Yw(a);
                        "number" == typeof l ? -1 === l ? r = a.token : o |= l : r = a
                    }
                    n.push(W(r, o))
                } else n.push(W(i))
            }
            return n
        }

        function Nr(t, n) {
            return t[yl] = n, t.prototype[yl] = n, t
        }

        function Yw(t) {
            return t[yl]
        }

        function Tn(t) {
            return {toString: t}.toString()
        }

        var vn = (() => ((vn = vn || {})[vn.OnPush = 0] = "OnPush", vn[vn.Default = 1] = "Default", vn))(),
            _n = (() => {
                return (t = _n || (_n = {}))[t.Emulated = 0] = "Emulated", t[t.None = 2] = "None", t[t.ShadowDom = 3] = "ShadowDom", _n;
                var t
            })();
        const On = {}, re = [], ns = fe({\u0275cmp: fe}), wl = fe({\u0275dir: fe}), Cl = fe({\u0275pipe: fe}),
            Sh = fe({\u0275mod: fe}), In = fe({\u0275fac: fe}), Lr = fe({__NG_ELEMENT_ID__: fe});
        let Qw = 0;

        function ge(t) {
            return Tn(() => {
                const n = Mh(t), e = {
                    ...n,
                    decls: t.decls,
                    vars: t.vars,
                    template: t.template,
                    consts: t.consts || null,
                    ngContentSelectors: t.ngContentSelectors,
                    onPush: t.changeDetection === vn.OnPush,
                    directiveDefs: null,
                    pipeDefs: null,
                    dependencies: n.standalone && t.dependencies || null,
                    getStandaloneInjector: null,
                    data: t.data || {},
                    encapsulation: t.encapsulation || _n.Emulated,
                    id: "c" + Qw++,
                    styles: t.styles || re,
                    _: null,
                    schemas: t.schemas || null,
                    tView: null
                };
                Th(e);
                const i = t.dependencies;
                return e.directiveDefs = is(i, !1), e.pipeDefs = is(i, !0), e
            })
        }

        function Jw(t) {
            return le(t) || at(t)
        }

        function e0(t) {
            return null !== t
        }

        function zt(t) {
            return Tn(() => ({
                type: t.type,
                bootstrap: t.bootstrap || re,
                declarations: t.declarations || re,
                imports: t.imports || re,
                exports: t.exports || re,
                transitiveCompileScopes: null,
                schemas: t.schemas || null,
                id: t.id || null
            }))
        }

        function xh(t, n) {
            if (null == t) return On;
            const e = {};
            for (const i in t) if (t.hasOwnProperty(i)) {
                let r = t[i], o = r;
                Array.isArray(r) && (o = r[1], r = r[0]), e[r] = i, n && (n[r] = o)
            }
            return e
        }

        function I(t) {
            return Tn(() => {
                const n = Mh(t);
                return Th(n), n
            })
        }

        function Et(t) {
            return {
                type: t.type,
                name: t.name,
                factory: null,
                pure: !1 !== t.pure,
                standalone: !0 === t.standalone,
                onDestroy: t.type.prototype.ngOnDestroy || null
            }
        }

        function le(t) {
            return t[ns] || null
        }

        function at(t) {
            return t[wl] || null
        }

        function St(t) {
            return t[Cl] || null
        }

        function Mh(t) {
            const n = {};
            return {
                type: t.type,
                providersResolver: null,
                factory: null,
                hostBindings: t.hostBindings || null,
                hostVars: t.hostVars || 0,
                hostAttrs: t.hostAttrs || null,
                contentQueries: t.contentQueries || null,
                declaredInputs: n,
                exportAs: t.exportAs || null,
                standalone: !0 === t.standalone,
                selectors: t.selectors || re,
                viewQuery: t.viewQuery || null,
                features: t.features || null,
                setInput: null,
                findHostDirectiveDefs: null,
                hostDirectives: null,
                inputs: xh(t.inputs, n),
                outputs: xh(t.outputs)
            }
        }

        function Th(t) {
            t.features?.forEach(n => n(t))
        }

        function is(t, n) {
            if (!t) return null;
            const e = n ? St : Jw;
            return () => ("function" == typeof t ? t() : t).map(i => e(i)).filter(e0)
        }

        const An = 0, A = 1, q = 2, Ee = 3, rn = 4, fi = 5, lt = 6, Li = 7, xe = 8, rs = 9, os = 10, K = 11, Dl = 12,
            Vr = 13, Oh = 14, Ri = 15, ct = 16, Br = 17, Vi = 18, yn = 19, Hr = 20, Ih = 21, _e = 22, El = 1, Ah = 2,
            ss = 7, as = 8, Bi = 9, vt = 10;

        function kt(t) {
            return Array.isArray(t) && "object" == typeof t[El]
        }

        function on(t) {
            return Array.isArray(t) && !0 === t[El]
        }

        function Sl(t) {
            return 0 != (4 & t.flags)
        }

        function jr(t) {
            return t.componentOffset > -1
        }

        function ls(t) {
            return 1 == (1 & t.flags)
        }

        function sn(t) {
            return !!t.template
        }

        function n0(t) {
            return 0 != (256 & t[q])
        }

        function pi(t, n) {
            return t.hasOwnProperty(In) ? t[In] : null
        }

        class s0 {
            constructor(n, e, i) {
                this.previousValue = n, this.currentValue = e, this.firstChange = i
            }

            isFirstChange() {
                return this.firstChange
            }
        }

        function nt() {
            return kh
        }

        function kh(t) {
            return t.type.prototype.ngOnChanges && (t.setInput = l0), a0
        }

        function a0() {
            const t = Lh(this), n = t?.current;
            if (n) {
                const e = t.previous;
                if (e === On) t.previous = n; else for (let i in n) e[i] = n[i];
                t.current = null, this.ngOnChanges(n)
            }
        }

        function l0(t, n, e, i) {
            const r = this.declaredInputs[e], o = Lh(t) || function c0(t, n) {
                return t[Nh] = n
            }(t, {previous: On, current: null}), s = o.current || (o.current = {}), a = o.previous, l = a[r];
            s[r] = new s0(l && l.currentValue, n, a === On), t[i] = n
        }

        nt.ngInherit = !0;
        const Nh = "__ngSimpleChanges__";

        function Lh(t) {
            return t[Nh] || null
        }

        const Gt = function (t, n, e) {
        }, Rh = "svg";

        function it(t) {
            for (; Array.isArray(t);) t = t[An];
            return t
        }

        function cs(t, n) {
            return it(n[t])
        }

        function Nt(t, n) {
            return it(n[t.index])
        }

        function Bh(t, n) {
            return t.data[n]
        }

        function Hi(t, n) {
            return t[n]
        }

        function xt(t, n) {
            const e = n[t];
            return kt(e) ? e : e[An]
        }

        function us(t) {
            return 64 == (64 & t[q])
        }

        function Wn(t, n) {
            return null == n ? null : t[n]
        }

        function Hh(t) {
            t[Vi] = 0
        }

        function Ml(t, n) {
            t[fi] += n;
            let e = t, i = t[Ee];
            for (; null !== i && (1 === n && 1 === e[fi] || -1 === n && 0 === e[fi]);) i[fi] += n, e = i, i = i[Ee]
        }

        const $ = {lFrame: Zh(null), bindingsEnabled: !0};

        function Uh() {
            return $.bindingsEnabled
        }

        function D() {
            return $.lFrame.lView
        }

        function ee() {
            return $.lFrame.tView
        }

        function Ke(t) {
            return $.lFrame.contextLView = t, t[xe]
        }

        function Ze(t) {
            return $.lFrame.contextLView = null, t
        }

        function rt() {
            let t = $h();
            for (; null !== t && 64 === t.type;) t = t.parent;
            return t
        }

        function $h() {
            return $.lFrame.currentTNode
        }

        function bn(t, n) {
            const e = $.lFrame;
            e.currentTNode = t, e.isParent = n
        }

        function Tl() {
            return $.lFrame.isParent
        }

        function Ol() {
            $.lFrame.isParent = !1
        }

        function _t() {
            const t = $.lFrame;
            let n = t.bindingRootIndex;
            return -1 === n && (n = t.bindingRootIndex = t.tView.bindingStartIndex), n
        }

        function ji() {
            return $.lFrame.bindingIndex++
        }

        function Fn(t) {
            const n = $.lFrame, e = n.bindingIndex;
            return n.bindingIndex = n.bindingIndex + t, e
        }

        function C0(t, n) {
            const e = $.lFrame;
            e.bindingIndex = e.bindingRootIndex = t, Il(n)
        }

        function Il(t) {
            $.lFrame.currentDirectiveIndex = t
        }

        function qh() {
            return $.lFrame.currentQueryIndex
        }

        function Pl(t) {
            $.lFrame.currentQueryIndex = t
        }

        function E0(t) {
            const n = t[A];
            return 2 === n.type ? n.declTNode : 1 === n.type ? t[lt] : null
        }

        function Yh(t, n, e) {
            if (e & j.SkipSelf) {
                let r = n, o = t;
                for (; !(r = r.parent, null !== r || e & j.Host || (r = E0(o), null === r || (o = o[Ri], 10 & r.type)));) ;
                if (null === r) return !1;
                n = r, t = o
            }
            const i = $.lFrame = Kh();
            return i.currentTNode = n, i.lView = t, !0
        }

        function Fl(t) {
            const n = Kh(), e = t[A];
            $.lFrame = n, n.currentTNode = e.firstChild, n.lView = t, n.tView = e, n.contextLView = t, n.bindingIndex = e.bindingStartIndex, n.inI18n = !1
        }

        function Kh() {
            const t = $.lFrame, n = null === t ? null : t.child;
            return null === n ? Zh(t) : n
        }

        function Zh(t) {
            const n = {
                currentTNode: null,
                isParent: !0,
                lView: null,
                tView: null,
                selectedIndex: -1,
                contextLView: null,
                elementDepthCount: 0,
                currentNamespace: null,
                currentDirectiveIndex: -1,
                bindingRootIndex: -1,
                bindingIndex: -1,
                currentQueryIndex: 0,
                parent: t,
                child: null,
                inI18n: !1
            };
            return null !== t && (t.child = n), n
        }

        function Qh() {
            const t = $.lFrame;
            return $.lFrame = t.parent, t.currentTNode = null, t.lView = null, t
        }

        const Xh = Qh;

        function kl() {
            const t = Qh();
            t.isParent = !0, t.tView = null, t.selectedIndex = -1, t.contextLView = null, t.elementDepthCount = 0, t.currentDirectiveIndex = -1, t.currentNamespace = null, t.bindingRootIndex = -1, t.bindingIndex = -1, t.currentQueryIndex = 0
        }

        function yt() {
            return $.lFrame.selectedIndex
        }

        function gi(t) {
            $.lFrame.selectedIndex = t
        }

        function Ce() {
            const t = $.lFrame;
            return Bh(t.tView, t.selectedIndex)
        }

        function Ui() {
            $.lFrame.currentNamespace = Rh
        }

        function Nl() {
            !function T0() {
                $.lFrame.currentNamespace = null
            }()
        }

        function ds(t, n) {
            for (let e = n.directiveStart, i = n.directiveEnd; e < i; e++) {
                const o = t.data[e].type.prototype, {
                    ngAfterContentInit: s,
                    ngAfterContentChecked: a,
                    ngAfterViewInit: l,
                    ngAfterViewChecked: c,
                    ngOnDestroy: u
                } = o;
                s && (t.contentHooks ?? (t.contentHooks = [])).push(-e, s), a && ((t.contentHooks ?? (t.contentHooks = [])).push(e, a), (t.contentCheckHooks ?? (t.contentCheckHooks = [])).push(e, a)), l && (t.viewHooks ?? (t.viewHooks = [])).push(-e, l), c && ((t.viewHooks ?? (t.viewHooks = [])).push(e, c), (t.viewCheckHooks ?? (t.viewCheckHooks = [])).push(e, c)), null != u && (t.destroyHooks ?? (t.destroyHooks = [])).push(e, u)
            }
        }

        function hs(t, n, e) {
            Jh(t, n, 3, e)
        }

        function fs(t, n, e, i) {
            (3 & t[q]) === e && Jh(t, n, e, i)
        }

        function Ll(t, n) {
            let e = t[q];
            (3 & e) === n && (e &= 2047, e += 1, t[q] = e)
        }

        function Jh(t, n, e, i) {
            const o = i ?? -1, s = n.length - 1;
            let a = 0;
            for (let l = void 0 !== i ? 65535 & t[Vi] : 0; l < s; l++) if ("number" == typeof n[l + 1]) {
                if (a = n[l], null != i && a >= i) break
            } else n[l] < 0 && (t[Vi] += 65536), (a < o || -1 == o) && (A0(t, e, n, l), t[Vi] = (4294901760 & t[Vi]) + l + 2), l++
        }

        function A0(t, n, e, i) {
            const r = e[i] < 0, o = e[i + 1], a = t[r ? -e[i] : e[i]];
            if (r) {
                if (t[q] >> 11 < t[Vi] >> 16 && (3 & t[q]) === n) {
                    t[q] += 2048, Gt(4, a, o);
                    try {
                        o.call(a)
                    } finally {
                        Gt(5, a, o)
                    }
                }
            } else {
                Gt(4, a, o);
                try {
                    o.call(a)
                } finally {
                    Gt(5, a, o)
                }
            }
        }

        const $i = -1;

        class $r {
            constructor(n, e, i) {
                this.factory = n, this.resolving = !1, this.canSeeViewProviders = e, this.injectImpl = i
            }
        }

        function Vl(t, n, e) {
            let i = 0;
            for (; i < e.length;) {
                const r = e[i];
                if ("number" == typeof r) {
                    if (0 !== r) break;
                    i++;
                    const o = e[i++], s = e[i++], a = e[i++];
                    t.setAttribute(n, s, a, o)
                } else {
                    const o = r, s = e[++i];
                    tf(o) ? t.setProperty(n, o, s) : t.setAttribute(n, o, s), i++
                }
            }
            return i
        }

        function ef(t) {
            return 3 === t || 4 === t || 6 === t
        }

        function tf(t) {
            return 64 === t.charCodeAt(0)
        }

        function zr(t, n) {
            if (null !== n && 0 !== n.length) if (null === t || 0 === t.length) t = n.slice(); else {
                let e = -1;
                for (let i = 0; i < n.length; i++) {
                    const r = n[i];
                    "number" == typeof r ? e = r : 0 === e || nf(t, e, r, null, -1 === e || 2 === e ? n[++i] : null)
                }
            }
            return t
        }

        function nf(t, n, e, i, r) {
            let o = 0, s = t.length;
            if (-1 === n) s = -1; else for (; o < t.length;) {
                const a = t[o++];
                if ("number" == typeof a) {
                    if (a === n) {
                        s = -1;
                        break
                    }
                    if (a > n) {
                        s = o - 1;
                        break
                    }
                }
            }
            for (; o < t.length;) {
                const a = t[o];
                if ("number" == typeof a) break;
                if (a === e) {
                    if (null === i) return void (null !== r && (t[o + 1] = r));
                    if (i === t[o + 1]) return void (t[o + 2] = r)
                }
                o++, null !== i && o++, null !== r && o++
            }
            -1 !== s && (t.splice(s, 0, n), o = s + 1), t.splice(o++, 0, e), null !== i && t.splice(o++, 0, i), null !== r && t.splice(o++, 0, r)
        }

        function rf(t) {
            return t !== $i
        }

        function ps(t) {
            return 32767 & t
        }

        function gs(t, n) {
            let e = function N0(t) {
                return t >> 16
            }(t), i = n;
            for (; e > 0;) i = i[Ri], e--;
            return i
        }

        let Bl = !0;

        function ms(t) {
            const n = Bl;
            return Bl = t, n
        }

        const of = 255, sf = 5;
        let L0 = 0;
        const wn = {};

        function vs(t, n) {
            const e = af(t, n);
            if (-1 !== e) return e;
            const i = n[A];
            i.firstCreatePass && (t.injectorIndex = n.length, Hl(i.data, t), Hl(n, null), Hl(i.blueprint, null));
            const r = jl(t, n), o = t.injectorIndex;
            if (rf(r)) {
                const s = ps(r), a = gs(r, n), l = a[A].data;
                for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c]
            }
            return n[o + 8] = r, o
        }

        function Hl(t, n) {
            t.push(0, 0, 0, 0, 0, 0, 0, 0, n)
        }

        function af(t, n) {
            return -1 === t.injectorIndex || t.parent && t.parent.injectorIndex === t.injectorIndex || null === n[t.injectorIndex + 8] ? -1 : t.injectorIndex
        }

        function jl(t, n) {
            if (t.parent && -1 !== t.parent.injectorIndex) return t.parent.injectorIndex;
            let e = 0, i = null, r = n;
            for (; null !== r;) {
                if (i = pf(r), null === i) return $i;
                if (e++, r = r[Ri], -1 !== i.injectorIndex) return i.injectorIndex | e << 16
            }
            return $i
        }

        function Ul(t, n, e) {
            !function R0(t, n, e) {
                let i;
                "string" == typeof e ? i = e.charCodeAt(0) || 0 : e.hasOwnProperty(Lr) && (i = e[Lr]), null == i && (i = e[Lr] = L0++);
                const r = i & of;
                n.data[t + (r >> sf)] |= 1 << r
            }(t, n, e)
        }

        function lf(t, n, e) {
            if (e & j.Optional || void 0 !== t) return t;
            Qo()
        }

        function cf(t, n, e, i) {
            if (e & j.Optional && void 0 === i && (i = null), !(e & (j.Self | j.Host))) {
                const r = t[rs], o = $t(void 0);
                try {
                    return r ? r.get(n, i, e & j.Optional) : Ch(n, i, e & j.Optional)
                } finally {
                    $t(o)
                }
            }
            return lf(i, 0, e)
        }

        function uf(t, n, e, i = j.Default, r) {
            if (null !== t) {
                if (1024 & n[q]) {
                    const s = function U0(t, n, e, i, r) {
                        let o = t, s = n;
                        for (; null !== o && null !== s && 1024 & s[q] && !(256 & s[q]);) {
                            const a = df(o, s, e, i | j.Self, wn);
                            if (a !== wn) return a;
                            let l = o.parent;
                            if (!l) {
                                const c = s[Ih];
                                if (c) {
                                    const u = c.get(e, wn, i);
                                    if (u !== wn) return u
                                }
                                l = pf(s), s = s[Ri]
                            }
                            o = l
                        }
                        return r
                    }(t, n, e, i, wn);
                    if (s !== wn) return s
                }
                const o = df(t, n, e, i, wn);
                if (o !== wn) return o
            }
            return cf(n, e, i, r)
        }

        function df(t, n, e, i, r) {
            const o = function H0(t) {
                if ("string" == typeof t) return t.charCodeAt(0) || 0;
                const n = t.hasOwnProperty(Lr) ? t[Lr] : void 0;
                return "number" == typeof n ? n >= 0 ? n & of : j0 : n
            }(e);
            if ("function" == typeof o) {
                if (!Yh(n, t, i)) return i & j.Host ? lf(r, 0, i) : cf(n, e, i, r);
                try {
                    const s = o(i);
                    if (null != s || i & j.Optional) return s;
                    Qo()
                } finally {
                    Xh()
                }
            } else if ("number" == typeof o) {
                let s = null, a = af(t, n), l = $i, c = i & j.Host ? n[ct][lt] : null;
                for ((-1 === a || i & j.SkipSelf) && (l = -1 === a ? jl(t, n) : n[a + 8], l !== $i && ff(i, !1) ? (s = n[A], a = ps(l), n = gs(l, n)) : a = -1); -1 !== a;) {
                    const u = n[A];
                    if (hf(o, a, u.data)) {
                        const d = B0(a, n, e, s, i, c);
                        if (d !== wn) return d
                    }
                    l = n[a + 8], l !== $i && ff(i, n[A].data[a + 8] === c) && hf(o, a, n) ? (s = u, a = ps(l), n = gs(l, n)) : a = -1
                }
            }
            return r
        }

        function B0(t, n, e, i, r, o) {
            const s = n[A], a = s.data[t + 8],
                u = _s(a, s, e, null == i ? jr(a) && Bl : i != s && 0 != (3 & a.type), r & j.Host && o === a);
            return null !== u ? mi(n, s, u, a) : wn
        }

        function _s(t, n, e, i, r) {
            const o = t.providerIndexes, s = n.data, a = 1048575 & o, l = t.directiveStart, u = o >> 20,
                h = r ? a + u : t.directiveEnd;
            for (let f = i ? a : a + u; f < h; f++) {
                const p = s[f];
                if (f < l && e === p || f >= l && p.type === e) return f
            }
            if (r) {
                const f = s[l];
                if (f && sn(f) && f.type === e) return l
            }
            return null
        }

        function mi(t, n, e, i) {
            let r = t[e];
            const o = n.data;
            if (function P0(t) {
                return t instanceof $r
            }(r)) {
                const s = r;
                s.resolving && function Lw(t, n) {
                    const e = n ? `. Dependency path: ${n.join(" > ")} > ${t}` : "";
                    throw new M(-200, `Circular dependency in DI detected for ${t}${e}`)
                }(function se(t) {
                    return "function" == typeof t ? t.name || t.toString() : "object" == typeof t && null != t && "function" == typeof t.type ? t.type.name || t.type.toString() : U(t)
                }(o[e]));
                const a = ms(s.canSeeViewProviders);
                s.resolving = !0;
                const l = s.injectImpl ? $t(s.injectImpl) : null;
                Yh(t, i, j.Default);
                try {
                    r = t[e] = s.factory(void 0, o, t, i), n.firstCreatePass && e >= i.directiveStart && function I0(t, n, e) {
                        const {ngOnChanges: i, ngOnInit: r, ngDoCheck: o} = n.type.prototype;
                        if (i) {
                            const s = kh(n);
                            (e.preOrderHooks ?? (e.preOrderHooks = [])).push(t, s), (e.preOrderCheckHooks ?? (e.preOrderCheckHooks = [])).push(t, s)
                        }
                        r && (e.preOrderHooks ?? (e.preOrderHooks = [])).push(0 - t, r), o && ((e.preOrderHooks ?? (e.preOrderHooks = [])).push(t, o), (e.preOrderCheckHooks ?? (e.preOrderCheckHooks = [])).push(t, o))
                    }(e, o[e], n)
                } finally {
                    null !== l && $t(l), ms(a), s.resolving = !1, Xh()
                }
            }
            return r
        }

        function hf(t, n, e) {
            return !!(e[n + (t >> sf)] & 1 << t)
        }

        function ff(t, n) {
            return !(t & j.Self || t & j.Host && n)
        }

        class zi {
            constructor(n, e) {
                this._tNode = n, this._lView = e
            }

            get(n, e, i) {
                return uf(this._tNode, this._lView, n, ts(i), e)
            }
        }

        function j0() {
            return new zi(rt(), D())
        }

        function de(t) {
            return Tn(() => {
                const n = t.prototype.constructor, e = n[In] || $l(n), i = Object.prototype;
                let r = Object.getPrototypeOf(t.prototype).constructor;
                for (; r && r !== i;) {
                    const o = r[In] || $l(r);
                    if (o && o !== e) return o;
                    r = Object.getPrototypeOf(r)
                }
                return o => new o
            })
        }

        function $l(t) {
            return gl(t) ? () => {
                const n = $l(B(t));
                return n && n()
            } : pi(t)
        }

        function pf(t) {
            const n = t[A], e = n.type;
            return 2 === e ? n.declTNode : 1 === e ? t[lt] : null
        }

        function Gr(t) {
            return function V0(t, n) {
                if ("class" === n) return t.classes;
                if ("style" === n) return t.styles;
                const e = t.attrs;
                if (e) {
                    const i = e.length;
                    let r = 0;
                    for (; r < i;) {
                        const o = e[r];
                        if (ef(o)) break;
                        if (0 === o) r += 2; else if ("number" == typeof o) for (r++; r < i && "string" == typeof e[r];) r++; else {
                            if (o === n) return e[r + 1];
                            r += 2
                        }
                    }
                }
                return null
            }(rt(), t)
        }

        const Wi = "__parameters__";

        function Yi(t, n, e) {
            return Tn(() => {
                const i = function zl(t) {
                    return function (...e) {
                        if (t) {
                            const i = t(...e);
                            for (const r in i) this[r] = i[r]
                        }
                    }
                }(n);

                function r(...o) {
                    if (this instanceof r) return i.apply(this, o), this;
                    const s = new r(...o);
                    return a.annotation = s, a;

                    function a(l, c, u) {
                        const d = l.hasOwnProperty(Wi) ? l[Wi] : Object.defineProperty(l, Wi, {value: []})[Wi];
                        for (; d.length <= u;) d.push(null);
                        return (d[u] = d[u] || []).push(s), l
                    }
                }

                return e && (r.prototype = Object.create(e.prototype)), r.prototype.ngMetadataName = t, r.annotationCls = r, r
            })
        }

        class L {
            constructor(n, e) {
                this._desc = n, this.ngMetadataName = "InjectionToken", this.\u0275prov = void 0, "number" == typeof e ? this.__NG_ELEMENT_ID__ = e : void 0 !== e && (this.\u0275prov = X({
                    token: this,
                    providedIn: e.providedIn || "root",
                    factory: e.factory
                }))
            }

            get multi() {
                return this
            }

            toString() {
                return `InjectionToken ${this._desc}`
            }
        }

        function vi(t, n) {
            t.forEach(e => Array.isArray(e) ? vi(e, n) : n(e))
        }

        function mf(t, n, e) {
            n >= t.length ? t.push(e) : t.splice(n, 0, e)
        }

        function ys(t, n) {
            return n >= t.length - 1 ? t.pop() : t.splice(n, 1)[0]
        }

        function Yr(t, n) {
            const e = [];
            for (let i = 0; i < t; i++) e.push(n);
            return e
        }

        function Lt(t, n, e) {
            let i = Ki(t, n);
            return i >= 0 ? t[1 | i] = e : (i = ~i, function W0(t, n, e, i) {
                let r = t.length;
                if (r == n) t.push(e, i); else if (1 === r) t.push(i, t[0]), t[0] = e; else {
                    for (r--, t.push(t[r - 1], t[r]); r > n;) t[r] = t[r - 2], r--;
                    t[n] = e, t[n + 1] = i
                }
            }(t, i, n, e)), i
        }

        function Wl(t, n) {
            const e = Ki(t, n);
            if (e >= 0) return t[1 | e]
        }

        function Ki(t, n) {
            return function vf(t, n, e) {
                let i = 0, r = t.length >> e;
                for (; r !== i;) {
                    const o = i + (r - i >> 1), s = t[o << e];
                    if (n === s) return o << e;
                    s > n ? r = o : i = o + 1
                }
                return ~(r << e)
            }(t, n, 1)
        }

        const ws = Nr(Yi("Optional"), 8), Cs = Nr(Yi("SkipSelf"), 4);
        var Mt = (() => ((Mt = Mt || {})[Mt.Important = 1] = "Important", Mt[Mt.DashCase = 2] = "DashCase", Mt))();
        const Xl = new Map;
        let pC = 0;
        const ec = "__ngContext__";

        function ut(t, n) {
            kt(n) ? (t[ec] = n[Hr], function mC(t) {
                Xl.set(t[Hr], t)
            }(n)) : t[ec] = n
        }

        let tc;

        function nc(t, n) {
            return tc(t, n)
        }

        function Xr(t) {
            const n = t[Ee];
            return on(n) ? n[Ee] : n
        }

        function ic(t) {
            return Rf(t[Vr])
        }

        function rc(t) {
            return Rf(t[rn])
        }

        function Rf(t) {
            for (; null !== t && !on(t);) t = t[rn];
            return t
        }

        function Qi(t, n, e, i, r) {
            if (null != i) {
                let o, s = !1;
                on(i) ? o = i : kt(i) && (s = !0, i = i[An]);
                const a = it(i);
                0 === t && null !== e ? null == r ? $f(n, e, a) : _i(n, e, a, r || null, !0) : 1 === t && null !== e ? _i(n, e, a, r || null, !0) : 2 === t ? function dc(t, n, e) {
                    const i = Ss(t, n);
                    i && function LC(t, n, e, i) {
                        t.removeChild(n, e, i)
                    }(t, i, n, e)
                }(n, a, s) : 3 === t && n.destroyNode(a), null != o && function BC(t, n, e, i, r) {
                    const o = e[ss];
                    o !== it(e) && Qi(n, t, i, o, r);
                    for (let a = vt; a < e.length; a++) {
                        const l = e[a];
                        Jr(l[A], l, t, n, i, o)
                    }
                }(n, t, o, e, r)
            }
        }

        function sc(t, n, e) {
            return t.createElement(n, e)
        }

        function Bf(t, n) {
            const e = t[Bi], i = e.indexOf(n), r = n[Ee];
            512 & n[q] && (n[q] &= -513, Ml(r, -1)), e.splice(i, 1)
        }

        function ac(t, n) {
            if (t.length <= vt) return;
            const e = vt + n, i = t[e];
            if (i) {
                const r = i[Br];
                null !== r && r !== t && Bf(r, i), n > 0 && (t[e - 1][rn] = i[rn]);
                const o = ys(t, vt + n);
                !function TC(t, n) {
                    Jr(t, n, n[K], 2, null, null), n[An] = null, n[lt] = null
                }(i[A], i);
                const s = o[yn];
                null !== s && s.detachView(o[A]), i[Ee] = null, i[rn] = null, i[q] &= -65
            }
            return i
        }

        function Hf(t, n) {
            if (!(128 & n[q])) {
                const e = n[K];
                e.destroyNode && Jr(t, n, e, 3, null, null), function AC(t) {
                    let n = t[Vr];
                    if (!n) return lc(t[A], t);
                    for (; n;) {
                        let e = null;
                        if (kt(n)) e = n[Vr]; else {
                            const i = n[vt];
                            i && (e = i)
                        }
                        if (!e) {
                            for (; n && !n[rn] && n !== t;) kt(n) && lc(n[A], n), n = n[Ee];
                            null === n && (n = t), kt(n) && lc(n[A], n), e = n && n[rn]
                        }
                        n = e
                    }
                }(n)
            }
        }

        function lc(t, n) {
            if (!(128 & n[q])) {
                n[q] &= -65, n[q] |= 128, function NC(t, n) {
                    let e;
                    if (null != t && null != (e = t.destroyHooks)) for (let i = 0; i < e.length; i += 2) {
                        const r = n[e[i]];
                        if (!(r instanceof $r)) {
                            const o = e[i + 1];
                            if (Array.isArray(o)) for (let s = 0; s < o.length; s += 2) {
                                const a = r[o[s]], l = o[s + 1];
                                Gt(4, a, l);
                                try {
                                    l.call(a)
                                } finally {
                                    Gt(5, a, l)
                                }
                            } else {
                                Gt(4, r, o);
                                try {
                                    o.call(r)
                                } finally {
                                    Gt(5, r, o)
                                }
                            }
                        }
                    }
                }(t, n), function kC(t, n) {
                    const e = t.cleanup, i = n[Li];
                    let r = -1;
                    if (null !== e) for (let o = 0; o < e.length - 1; o += 2) if ("string" == typeof e[o]) {
                        const s = e[o + 3];
                        s >= 0 ? i[r = s]() : i[r = -s].unsubscribe(), o += 2
                    } else {
                        const s = i[r = e[o + 1]];
                        e[o].call(s)
                    }
                    if (null !== i) {
                        for (let o = r + 1; o < i.length; o++) (0, i[o])();
                        n[Li] = null
                    }
                }(t, n), 1 === n[A].type && n[K].destroy();
                const e = n[Br];
                if (null !== e && on(n[Ee])) {
                    e !== n[Ee] && Bf(e, n);
                    const i = n[yn];
                    null !== i && i.detachView(t)
                }
                !function vC(t) {
                    Xl.delete(t[Hr])
                }(n)
            }
        }

        function jf(t, n, e) {
            return function Uf(t, n, e) {
                let i = n;
                for (; null !== i && 40 & i.type;) i = (n = i).parent;
                if (null === i) return e[An];
                {
                    const {componentOffset: r} = i;
                    if (r > -1) {
                        const {encapsulation: o} = t.data[i.directiveStart + r];
                        if (o === _n.None || o === _n.Emulated) return null
                    }
                    return Nt(i, e)
                }
            }(t, n.parent, e)
        }

        function _i(t, n, e, i, r) {
            t.insertBefore(n, e, i, r)
        }

        function $f(t, n, e) {
            t.appendChild(n, e)
        }

        function zf(t, n, e, i, r) {
            null !== i ? _i(t, n, e, i, r) : $f(t, n, e)
        }

        function Ss(t, n) {
            return t.parentNode(n)
        }

        function Gf(t, n, e) {
            return qf(t, n, e)
        }

        let cc, Ts, pc, Os, qf = function Wf(t, n, e) {
            return 40 & t.type ? Nt(t, e) : null
        };

        function xs(t, n, e, i) {
            const r = jf(t, i, n), o = n[K], a = Gf(i.parent || n[lt], i, n);
            if (null != r) if (Array.isArray(e)) for (let l = 0; l < e.length; l++) zf(o, r, e[l], a, !1); else zf(o, r, e, a, !1);
            void 0 !== cc && cc(o, i, n, e, r)
        }

        function Ms(t, n) {
            if (null !== n) {
                const e = n.type;
                if (3 & e) return Nt(n, t);
                if (4 & e) return uc(-1, t[n.index]);
                if (8 & e) {
                    const i = n.child;
                    if (null !== i) return Ms(t, i);
                    {
                        const r = t[n.index];
                        return on(r) ? uc(-1, r) : it(r)
                    }
                }
                if (32 & e) return nc(n, t)() || it(t[n.index]);
                {
                    const i = Kf(t, n);
                    return null !== i ? Array.isArray(i) ? i[0] : Ms(Xr(t[ct]), i) : Ms(t, n.next)
                }
            }
            return null
        }

        function Kf(t, n) {
            return null !== n ? t[ct][lt].projection[n.projection] : null
        }

        function uc(t, n) {
            const e = vt + t + 1;
            if (e < n.length) {
                const i = n[e], r = i[A].firstChild;
                if (null !== r) return Ms(i, r)
            }
            return n[ss]
        }

        function hc(t, n, e, i, r, o, s) {
            for (; null != e;) {
                const a = i[e.index], l = e.type;
                if (s && 0 === n && (a && ut(it(a), i), e.flags |= 2), 32 != (32 & e.flags)) if (8 & l) hc(t, n, e.child, i, r, o, !1), Qi(n, t, r, a, o); else if (32 & l) {
                    const c = nc(e, i);
                    let u;
                    for (; u = c();) Qi(n, t, r, u, o);
                    Qi(n, t, r, a, o)
                } else 16 & l ? Zf(t, n, i, e, r, o) : Qi(n, t, r, a, o);
                e = s ? e.projectionNext : e.next
            }
        }

        function Jr(t, n, e, i, r, o) {
            hc(e, i, t.firstChild, n, r, o, !1)
        }

        function Zf(t, n, e, i, r, o) {
            const s = e[ct], l = s[lt].projection[i.projection];
            if (Array.isArray(l)) for (let c = 0; c < l.length; c++) Qi(n, t, r, l[c], o); else hc(t, n, l, s[Ee], r, o, !0)
        }

        function Qf(t, n, e) {
            "" === e ? t.removeAttribute(n, "class") : t.setAttribute(n, "class", e)
        }

        function Xf(t, n, e) {
            const {mergedAttrs: i, classes: r, styles: o} = e;
            null !== i && Vl(t, n, i), null !== r && Qf(t, n, r), null !== o && function jC(t, n, e) {
                t.setAttribute(n, "style", e)
            }(t, n, o)
        }

        function Xi(t) {
            return function fc() {
                if (void 0 === Ts && (Ts = null, ve.trustedTypes)) try {
                    Ts = ve.trustedTypes.createPolicy("angular", {
                        createHTML: t => t,
                        createScript: t => t,
                        createScriptURL: t => t
                    })
                } catch {
                }
                return Ts
            }()?.createHTML(t) || t
        }

        function ep(t) {
            return function gc() {
                if (void 0 === Os && (Os = null, ve.trustedTypes)) try {
                    Os = ve.trustedTypes.createPolicy("angular#unsafe-bypass", {
                        createHTML: t => t,
                        createScript: t => t,
                        createScriptURL: t => t
                    })
                } catch {
                }
                return Os
            }()?.createHTML(t) || t
        }

        class ip {
            constructor(n) {
                this.changingThisBreaksApplicationSecurity = n
            }

            toString() {
                return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${_h})`
            }
        }

        function qn(t) {
            return t instanceof ip ? t.changingThisBreaksApplicationSecurity : t
        }

        class XC {
            constructor(n) {
                this.inertDocumentHelper = n
            }

            getInertBodyElement(n) {
                n = "<body><remove></remove>" + n;
                try {
                    const e = (new window.DOMParser).parseFromString(Xi(n), "text/html").body;
                    return null === e ? this.inertDocumentHelper.getInertBodyElement(n) : (e.removeChild(e.firstChild), e)
                } catch {
                    return null
                }
            }
        }

        class JC {
            constructor(n) {
                this.defaultDoc = n, this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")
            }

            getInertBodyElement(n) {
                const e = this.inertDocument.createElement("template");
                return e.innerHTML = Xi(n), e
            }
        }

        const tD = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;

        function mc(t) {
            return (t = String(t)).match(tD) ? t : "unsafe:" + t
        }

        function kn(t) {
            const n = {};
            for (const e of t.split(",")) n[e] = !0;
            return n
        }

        function to(...t) {
            const n = {};
            for (const e of t) for (const i in e) e.hasOwnProperty(i) && (n[i] = !0);
            return n
        }

        const op = kn("area,br,col,hr,img,wbr"), sp = kn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
            ap = kn("rp,rt"),
            vc = to(op, to(sp, kn("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")), to(ap, kn("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")), to(ap, sp)),
            _c = kn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
            lp = to(_c, kn("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"), kn("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext")),
            nD = kn("script,style,template");

        class iD {
            constructor() {
                this.sanitizedSomething = !1, this.buf = []
            }

            sanitizeChildren(n) {
                let e = n.firstChild, i = !0;
                for (; e;) if (e.nodeType === Node.ELEMENT_NODE ? i = this.startElement(e) : e.nodeType === Node.TEXT_NODE ? this.chars(e.nodeValue) : this.sanitizedSomething = !0, i && e.firstChild) e = e.firstChild; else for (; e;) {
                    e.nodeType === Node.ELEMENT_NODE && this.endElement(e);
                    let r = this.checkClobberedElement(e, e.nextSibling);
                    if (r) {
                        e = r;
                        break
                    }
                    e = this.checkClobberedElement(e, e.parentNode)
                }
                return this.buf.join("")
            }

            startElement(n) {
                const e = n.nodeName.toLowerCase();
                if (!vc.hasOwnProperty(e)) return this.sanitizedSomething = !0, !nD.hasOwnProperty(e);
                this.buf.push("<"), this.buf.push(e);
                const i = n.attributes;
                for (let r = 0; r < i.length; r++) {
                    const o = i.item(r), s = o.name, a = s.toLowerCase();
                    if (!lp.hasOwnProperty(a)) {
                        this.sanitizedSomething = !0;
                        continue
                    }
                    let l = o.value;
                    _c[a] && (l = mc(l)), this.buf.push(" ", s, '="', cp(l), '"')
                }
                return this.buf.push(">"), !0
            }

            endElement(n) {
                const e = n.nodeName.toLowerCase();
                vc.hasOwnProperty(e) && !op.hasOwnProperty(e) && (this.buf.push("</"), this.buf.push(e), this.buf.push(">"))
            }

            chars(n) {
                this.buf.push(cp(n))
            }

            checkClobberedElement(n, e) {
                if (e && (n.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY) === Node.DOCUMENT_POSITION_CONTAINED_BY) throw new Error(`Failed to sanitize html because the element is clobbered: ${n.outerHTML}`);
                return e
            }
        }

        const rD = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, oD = /([^\#-~ |!])/g;

        function cp(t) {
            return t.replace(/&/g, "&amp;").replace(rD, function (n) {
                return "&#" + (1024 * (n.charCodeAt(0) - 55296) + (n.charCodeAt(1) - 56320) + 65536) + ";"
            }).replace(oD, function (n) {
                return "&#" + n.charCodeAt(0) + ";"
            }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }

        let Is;

        function yc(t) {
            return "content" in t && function aD(t) {
                return t.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === t.nodeName
            }(t) ? t.content : null
        }

        var Ve = (() => ((Ve = Ve || {})[Ve.NONE = 0] = "NONE", Ve[Ve.HTML = 1] = "HTML", Ve[Ve.STYLE = 2] = "STYLE", Ve[Ve.SCRIPT = 3] = "SCRIPT", Ve[Ve.URL = 4] = "URL", Ve[Ve.RESOURCE_URL = 5] = "RESOURCE_URL", Ve))();

        function an(t) {
            const n = function no() {
                const t = D();
                return t && t[Dl]
            }();
            return n ? ep(n.sanitize(Ve.HTML, t) || "") : function eo(t, n) {
                const e = function QC(t) {
                    return t instanceof ip && t.getTypeName() || null
                }(t);
                if (null != e && e !== n) {
                    if ("ResourceURL" === e && "URL" === n) return !0;
                    throw new Error(`Required a safe ${n}, got a ${e} (see ${_h})`)
                }
                return e === n
            }(t, "HTML") ? ep(qn(t)) : function sD(t, n) {
                let e = null;
                try {
                    Is = Is || function rp(t) {
                        const n = new JC(t);
                        return function eD() {
                            try {
                                return !!(new window.DOMParser).parseFromString(Xi(""), "text/html")
                            } catch {
                                return !1
                            }
                        }() ? new XC(n) : n
                    }(t);
                    let i = n ? String(n) : "";
                    e = Is.getInertBodyElement(i);
                    let r = 5, o = i;
                    do {
                        if (0 === r) throw new Error("Failed to sanitize html because the input is unstable");
                        r--, i = o, o = e.innerHTML, e = Is.getInertBodyElement(i)
                    } while (i !== o);
                    return Xi((new iD).sanitizeChildren(yc(e) || e))
                } finally {
                    if (e) {
                        const i = yc(e) || e;
                        for (; i.firstChild;) i.removeChild(i.firstChild)
                    }
                }
            }(function Jf() {
                return void 0 !== pc ? pc : typeof document < "u" ? document : void 0
            }(), U(t))
        }

        const hp = new L("ENVIRONMENT_INITIALIZER"), fp = new L("INJECTOR", -1), pp = new L("INJECTOR_DEF_TYPES");

        class gp {
            get(n, e = Fr) {
                if (e === Fr) {
                    const i = new Error(`NullInjectorError: No provider for ${pe(n)}!`);
                    throw i.name = "NullInjectorError", i
                }
                return e
            }
        }

        function gD(...t) {
            return {\u0275providers: mp(0, t), \u0275fromNgModule: !0}
        }

        function mp(t, ...n) {
            const e = [], i = new Set;
            let r;
            return vi(n, o => {
                const s = o;
                bc(s, e, [], i) && (r || (r = []), r.push(s))
            }), void 0 !== r && vp(r, e), e
        }

        function vp(t, n) {
            for (let e = 0; e < t.length; e++) {
                const {providers: r} = t[e];
                wc(r, o => {
                    n.push(o)
                })
            }
        }

        function bc(t, n, e, i) {
            if (!(t = B(t))) return !1;
            let r = null, o = bh(t);
            const s = !o && le(t);
            if (o || s) {
                if (s && !s.standalone) return !1;
                r = t
            } else {
                const l = t.ngModule;
                if (o = bh(l), !o) return !1;
                r = l
            }
            const a = i.has(r);
            if (s) {
                if (a) return !1;
                if (i.add(r), s.dependencies) {
                    const l = "function" == typeof s.dependencies ? s.dependencies() : s.dependencies;
                    for (const c of l) bc(c, n, e, i)
                }
            } else {
                if (!o) return !1;
                {
                    if (null != o.imports && !a) {
                        let c;
                        i.add(r);
                        try {
                            vi(o.imports, u => {
                                bc(u, n, e, i) && (c || (c = []), c.push(u))
                            })
                        } finally {
                        }
                        void 0 !== c && vp(c, n)
                    }
                    if (!a) {
                        const c = pi(r) || (() => new r);
                        n.push({provide: r, useFactory: c, deps: re}, {
                            provide: pp,
                            useValue: r,
                            multi: !0
                        }, {provide: hp, useValue: () => W(r), multi: !0})
                    }
                    const l = o.providers;
                    null == l || a || wc(l, u => {
                        n.push(u)
                    })
                }
            }
            return r !== t && void 0 !== t.providers
        }

        function wc(t, n) {
            for (let e of t) ml(e) && (e = e.\u0275providers), Array.isArray(e) ? wc(e, n) : n(e)
        }

        const mD = fe({provide: String, useValue: fe});

        function Cc(t) {
            return null !== t && "object" == typeof t && mD in t
        }

        function yi(t) {
            return "function" == typeof t
        }

        const Dc = new L("Set Injector scope."), As = {}, _D = {};
        let Ec;

        function Ps() {
            return void 0 === Ec && (Ec = new gp), Ec
        }

        class bi {
        }

        class bp extends bi {
            get destroyed() {
                return this._destroyed
            }

            constructor(n, e, i, r) {
                super(), this.parent = e, this.source = i, this.scopes = r, this.records = new Map, this._ngOnDestroyHooks = new Set, this._onDestroyHooks = [], this._destroyed = !1, xc(n, s => this.processProvider(s)), this.records.set(fp, Ji(void 0, this)), r.has("environment") && this.records.set(bi, Ji(void 0, this));
                const o = this.records.get(Dc);
                null != o && "string" == typeof o.value && this.scopes.add(o.value), this.injectorDefTypes = new Set(this.get(pp.multi, re, j.Self))
            }

            destroy() {
                this.assertNotDestroyed(), this._destroyed = !0;
                try {
                    for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
                    for (const n of this._onDestroyHooks) n()
                } finally {
                    this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), this._onDestroyHooks.length = 0
                }
            }

            onDestroy(n) {
                this._onDestroyHooks.push(n)
            }

            runInContext(n) {
                this.assertNotDestroyed();
                const e = ki(this), i = $t(void 0);
                try {
                    return n()
                } finally {
                    ki(e), $t(i)
                }
            }

            get(n, e = Fr, i = j.Default) {
                this.assertNotDestroyed(), i = ts(i);
                const r = ki(this), o = $t(void 0);
                try {
                    if (!(i & j.SkipSelf)) {
                        let a = this.records.get(n);
                        if (void 0 === a) {
                            const l = function DD(t) {
                                return "function" == typeof t || "object" == typeof t && t instanceof L
                            }(n) && Xo(n);
                            a = l && this.injectableDefInScope(l) ? Ji(Sc(n), As) : null, this.records.set(n, a)
                        }
                        if (null != a) return this.hydrate(n, a)
                    }
                    return (i & j.Self ? Ps() : this.parent).get(n, e = i & j.Optional && e === Fr ? null : e)
                } catch (s) {
                    if ("NullInjectorError" === s.name) {
                        if ((s[es] = s[es] || []).unshift(pe(n)), r) throw s;
                        return function Kw(t, n, e, i) {
                            const r = t[es];
                            throw n[Dh] && r.unshift(n[Dh]), t.message = function Zw(t, n, e, i = null) {
                                t = t && "\n" === t.charAt(0) && t.charAt(1) == Ww ? t.slice(2) : t;
                                let r = pe(n);
                                if (Array.isArray(n)) r = n.map(pe).join(" -> "); else if ("object" == typeof n) {
                                    let o = [];
                                    for (let s in n) if (n.hasOwnProperty(s)) {
                                        let a = n[s];
                                        o.push(s + ":" + ("string" == typeof a ? JSON.stringify(a) : pe(a)))
                                    }
                                    r = `{${o.join(", ")}}`
                                }
                                return `${e}${i ? "(" + i + ")" : ""}[${r}]: ${t.replace(Gw, "\n  ")}`
                            }("\n" + t.message, r, e, i), t[zw] = r, t[es] = null, t
                        }(s, n, "R3InjectorError", this.source)
                    }
                    throw s
                } finally {
                    $t(o), ki(r)
                }
            }

            resolveInjectorInitializers() {
                const n = ki(this), e = $t(void 0);
                try {
                    const i = this.get(hp.multi, re, j.Self);
                    for (const r of i) r()
                } finally {
                    ki(n), $t(e)
                }
            }

            toString() {
                const n = [], e = this.records;
                for (const i of e.keys()) n.push(pe(i));
                return `R3Injector[${n.join(", ")}]`
            }

            assertNotDestroyed() {
                if (this._destroyed) throw new M(205, !1)
            }

            processProvider(n) {
                let e = yi(n = B(n)) ? n : B(n && n.provide);
                const i = function bD(t) {
                    return Cc(t) ? Ji(void 0, t.useValue) : Ji(wp(t), As)
                }(n);
                if (yi(n) || !0 !== n.multi) this.records.get(e); else {
                    let r = this.records.get(e);
                    r || (r = Ji(void 0, As, !0), r.factory = () => bl(r.multi), this.records.set(e, r)), e = n, r.multi.push(n)
                }
                this.records.set(e, i)
            }

            hydrate(n, e) {
                return e.value === As && (e.value = _D, e.value = e.factory()), "object" == typeof e.value && e.value && function CD(t) {
                    return null !== t && "object" == typeof t && "function" == typeof t.ngOnDestroy
                }(e.value) && this._ngOnDestroyHooks.add(e.value), e.value
            }

            injectableDefInScope(n) {
                if (!n.providedIn) return !1;
                const e = B(n.providedIn);
                return "string" == typeof e ? "any" === e || this.scopes.has(e) : this.injectorDefTypes.has(e)
            }
        }

        function Sc(t) {
            const n = Xo(t), e = null !== n ? n.factory : pi(t);
            if (null !== e) return e;
            if (t instanceof L) throw new M(204, !1);
            if (t instanceof Function) return function yD(t) {
                const n = t.length;
                if (n > 0) throw Yr(n, "?"), new M(204, !1);
                const e = function jw(t) {
                    return t && (t[Jo] || t[wh]) || null
                }(t);
                return null !== e ? () => e.factory(t) : () => new t
            }(t);
            throw new M(204, !1)
        }

        function wp(t, n, e) {
            let i;
            if (yi(t)) {
                const r = B(t);
                return pi(r) || Sc(r)
            }
            if (Cc(t)) i = () => B(t.useValue); else if (function yp(t) {
                return !(!t || !t.useFactory)
            }(t)) i = () => t.useFactory(...bl(t.deps || [])); else if (function _p(t) {
                return !(!t || !t.useExisting)
            }(t)) i = () => W(B(t.useExisting)); else {
                const r = B(t && (t.useClass || t.provide));
                if (!function wD(t) {
                    return !!t.deps
                }(t)) return pi(r) || Sc(r);
                i = () => new r(...bl(t.deps))
            }
            return i
        }

        function Ji(t, n, e = !1) {
            return {factory: t, value: n, multi: e ? [] : void 0}
        }

        function xc(t, n) {
            for (const e of t) Array.isArray(e) ? xc(e, n) : e && ml(e) ? xc(e.\u0275providers, n) : n(e)
        }

        class ED {
        }

        class Cp {
        }

        class xD {
            resolveComponentFactory(n) {
                throw function SD(t) {
                    const n = Error(`No component factory found for ${pe(t)}. Did you add it to @NgModule.entryComponents?`);
                    return n.ngComponent = t, n
                }(n)
            }
        }

        let io = (() => {
            class t {
            }

            return t.NULL = new xD, t
        })();

        function MD() {
            return er(rt(), D())
        }

        function er(t, n) {
            return new he(Nt(t, n))
        }

        let he = (() => {
            class t {
                constructor(e) {
                    this.nativeElement = e
                }
            }

            return t.__NG_ELEMENT_ID__ = MD, t
        })();

        function TD(t) {
            return t instanceof he ? t.nativeElement : t
        }

        class Ep {
        }

        let Ot = (() => {
            class t {
            }

            return t.__NG_ELEMENT_ID__ = () => function OD() {
                const t = D(), e = xt(rt().index, t);
                return (kt(e) ? e : t)[K]
            }(), t
        })(), ID = (() => {
            class t {
            }

            return t.\u0275prov = X({token: t, providedIn: "root", factory: () => null}), t
        })();

        class Fs {
            constructor(n) {
                this.full = n, this.major = n.split(".")[0], this.minor = n.split(".")[1], this.patch = n.split(".").slice(2).join(".")
            }
        }

        const AD = new Fs("15.2.9"), Mc = {}, Tc = "ngOriginalError";

        function Oc(t) {
            return t[Tc]
        }

        class tr {
            constructor() {
                this._console = console
            }

            handleError(n) {
                const e = this._findOriginalError(n);
                this._console.error("ERROR", n), e && this._console.error("ORIGINAL ERROR", e)
            }

            _findOriginalError(n) {
                let e = n && Oc(n);
                for (; e && Oc(e);) e = Oc(e);
                return e || null
            }
        }

        function Sp(t) {
            return t.ownerDocument.defaultView
        }

        function Mp(t, n, e) {
            let i = t.length;
            for (; ;) {
                const r = t.indexOf(n, e);
                if (-1 === r) return r;
                if (0 === r || t.charCodeAt(r - 1) <= 32) {
                    const o = n.length;
                    if (r + o === i || t.charCodeAt(r + o) <= 32) return r
                }
                e = r + 1
            }
        }

        const Tp = "ng-template";

        function jD(t, n, e) {
            let i = 0, r = !0;
            for (; i < t.length;) {
                let o = t[i++];
                if ("string" == typeof o && r) {
                    const s = t[i++];
                    if (e && "class" === o && -1 !== Mp(s.toLowerCase(), n, 0)) return !0
                } else {
                    if (1 === o) {
                        for (; i < t.length && "string" == typeof (o = t[i++]);) if (o.toLowerCase() === n) return !0;
                        return !1
                    }
                    "number" == typeof o && (r = !1)
                }
            }
            return !1
        }

        function Op(t) {
            return 4 === t.type && t.value !== Tp
        }

        function UD(t, n, e) {
            return n === (4 !== t.type || e ? t.value : Tp)
        }

        function $D(t, n, e) {
            let i = 4;
            const r = t.attrs || [], o = function WD(t) {
                for (let n = 0; n < t.length; n++) if (ef(t[n])) return n;
                return t.length
            }(r);
            let s = !1;
            for (let a = 0; a < n.length; a++) {
                const l = n[a];
                if ("number" != typeof l) {
                    if (!s) if (4 & i) {
                        if (i = 2 | 1 & i, "" !== l && !UD(t, l, e) || "" === l && 1 === n.length) {
                            if (ln(i)) return !1;
                            s = !0
                        }
                    } else {
                        const c = 8 & i ? l : n[++a];
                        if (8 & i && null !== t.attrs) {
                            if (!jD(t.attrs, c, e)) {
                                if (ln(i)) return !1;
                                s = !0
                            }
                            continue
                        }
                        const d = zD(8 & i ? "class" : l, r, Op(t), e);
                        if (-1 === d) {
                            if (ln(i)) return !1;
                            s = !0;
                            continue
                        }
                        if ("" !== c) {
                            let h;
                            h = d > o ? "" : r[d + 1].toLowerCase();
                            const f = 8 & i ? h : null;
                            if (f && -1 !== Mp(f, c, 0) || 2 & i && c !== h) {
                                if (ln(i)) return !1;
                                s = !0
                            }
                        }
                    }
                } else {
                    if (!s && !ln(i) && !ln(l)) return !1;
                    if (s && ln(l)) continue;
                    s = !1, i = l | 1 & i
                }
            }
            return ln(i) || s
        }

        function ln(t) {
            return 0 == (1 & t)
        }

        function zD(t, n, e, i) {
            if (null === n) return -1;
            let r = 0;
            if (i || !e) {
                let o = !1;
                for (; r < n.length;) {
                    const s = n[r];
                    if (s === t) return r;
                    if (3 === s || 6 === s) o = !0; else {
                        if (1 === s || 2 === s) {
                            let a = n[++r];
                            for (; "string" == typeof a;) a = n[++r];
                            continue
                        }
                        if (4 === s) break;
                        if (0 === s) {
                            r += 4;
                            continue
                        }
                    }
                    r += o ? 1 : 2
                }
                return -1
            }
            return function qD(t, n) {
                let e = t.indexOf(4);
                if (e > -1) for (e++; e < t.length;) {
                    const i = t[e];
                    if ("number" == typeof i) return -1;
                    if (i === n) return e;
                    e++
                }
                return -1
            }(n, t)
        }

        function Ip(t, n, e = !1) {
            for (let i = 0; i < n.length; i++) if ($D(t, n[i], e)) return !0;
            return !1
        }

        function YD(t, n) {
            e:for (let e = 0; e < n.length; e++) {
                const i = n[e];
                if (t.length === i.length) {
                    for (let r = 0; r < t.length; r++) if (t[r] !== i[r]) continue e;
                    return !0
                }
            }
            return !1
        }

        function Ap(t, n) {
            return t ? ":not(" + n.trim() + ")" : n
        }

        function KD(t) {
            let n = t[0], e = 1, i = 2, r = "", o = !1;
            for (; e < t.length;) {
                let s = t[e];
                if ("string" == typeof s) if (2 & i) {
                    const a = t[++e];
                    r += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
                } else 8 & i ? r += "." + s : 4 & i && (r += " " + s); else "" !== r && !ln(s) && (n += Ap(o, r), r = ""), i = s, o = o || !ln(i);
                e++
            }
            return "" !== r && (n += Ap(o, r)), n
        }

        const z = {};

        function _(t) {
            Pp(ee(), D(), yt() + t, !1)
        }

        function Pp(t, n, e, i) {
            if (!i) if (3 == (3 & n[q])) {
                const o = t.preOrderCheckHooks;
                null !== o && hs(n, o, e)
            } else {
                const o = t.preOrderHooks;
                null !== o && fs(n, o, 0, e)
            }
            gi(e)
        }

        function Lp(t, n = null, e = null, i) {
            const r = Rp(t, n, e, i);
            return r.resolveInjectorInitializers(), r
        }

        function Rp(t, n = null, e = null, i, r = new Set) {
            const o = [e || re, gD(t)];
            return i = i || ("object" == typeof t ? void 0 : pe(t)), new bp(o, n || Ps(), i || null, r)
        }

        let Ln = (() => {
            class t {
                static create(e, i) {
                    if (Array.isArray(e)) return Lp({name: ""}, i, e, "");
                    {
                        const r = e.name ?? "";
                        return Lp({name: r}, e.parent, e.providers, r)
                    }
                }
            }

            return t.THROW_IF_NOT_FOUND = Fr, t.NULL = new gp, t.\u0275prov = X({
                token: t,
                providedIn: "any",
                factory: () => W(fp)
            }), t.__NG_ELEMENT_ID__ = -1, t
        })();

        function g(t, n = j.Default) {
            const e = D();
            return null === e ? W(t, n) : uf(rt(), e, B(t), n)
        }

        function zp(t, n) {
            const e = t.contentQueries;
            if (null !== e) for (let i = 0; i < e.length; i += 2) {
                const o = e[i + 1];
                if (-1 !== o) {
                    const s = t.data[o];
                    Pl(e[i]), s.contentQueries(2, n[o], o)
                }
            }
        }

        function Ns(t, n, e, i, r, o, s, a, l, c, u) {
            const d = n.blueprint.slice();
            return d[An] = r, d[q] = 76 | i, (null !== u || t && 1024 & t[q]) && (d[q] |= 1024), Hh(d), d[Ee] = d[Ri] = t, d[xe] = e, d[os] = s || t && t[os], d[K] = a || t && t[K], d[Dl] = l || t && t[Dl] || null, d[rs] = c || t && t[rs] || null, d[lt] = o, d[Hr] = function gC() {
                return pC++
            }(), d[Ih] = u, d[ct] = 2 == n.type ? t[ct] : d, d
        }

        function rr(t, n, e, i, r) {
            let o = t.data[n];
            if (null === o) o = function kc(t, n, e, i, r) {
                const o = $h(), s = Tl(), l = t.data[n] = function CE(t, n, e, i, r, o) {
                    return {
                        type: e,
                        index: i,
                        insertBeforeIndex: null,
                        injectorIndex: n ? n.injectorIndex : -1,
                        directiveStart: -1,
                        directiveEnd: -1,
                        directiveStylingLast: -1,
                        componentOffset: -1,
                        propertyBindings: null,
                        flags: 0,
                        providerIndexes: 0,
                        value: r,
                        attrs: o,
                        mergedAttrs: null,
                        localNames: null,
                        initialInputs: void 0,
                        inputs: null,
                        outputs: null,
                        tView: null,
                        next: null,
                        prev: null,
                        projectionNext: null,
                        child: null,
                        parent: n,
                        projection: null,
                        styles: null,
                        stylesWithoutHost: null,
                        residualStyles: void 0,
                        classes: null,
                        classesWithoutHost: null,
                        residualClasses: void 0,
                        classBindings: 0,
                        styleBindings: 0
                    }
                }(0, s ? o : o && o.parent, e, n, i, r);
                return null === t.firstChild && (t.firstChild = l), null !== o && (s ? null == o.child && null !== l.parent && (o.child = l) : null === o.next && (o.next = l, l.prev = o)), l
            }(t, n, e, i, r), function w0() {
                return $.lFrame.inI18n
            }() && (o.flags |= 32); else if (64 & o.type) {
                o.type = e, o.value = i, o.attrs = r;
                const s = function Ur() {
                    const t = $.lFrame, n = t.currentTNode;
                    return t.isParent ? n : n.parent
                }();
                o.injectorIndex = null === s ? -1 : s.injectorIndex
            }
            return bn(o, !0), o
        }

        function ro(t, n, e, i) {
            if (0 === e) return -1;
            const r = n.length;
            for (let o = 0; o < e; o++) n.push(i), t.blueprint.push(i), t.data.push(null);
            return r
        }

        function Nc(t, n, e) {
            Fl(n);
            try {
                const i = t.viewQuery;
                null !== i && zc(1, i, e);
                const r = t.template;
                null !== r && Gp(t, n, r, 1, e), t.firstCreatePass && (t.firstCreatePass = !1), t.staticContentQueries && zp(t, n), t.staticViewQueries && zc(2, t.viewQuery, e);
                const o = t.components;
                null !== o && function yE(t, n) {
                    for (let e = 0; e < n.length; e++) UE(t, n[e])
                }(n, o)
            } catch (i) {
                throw t.firstCreatePass && (t.incompleteFirstPass = !0, t.firstCreatePass = !1), i
            } finally {
                n[q] &= -5, kl()
            }
        }

        function Ls(t, n, e, i) {
            const r = n[q];
            if (128 != (128 & r)) {
                Fl(n);
                try {
                    Hh(n), function Gh(t) {
                        return $.lFrame.bindingIndex = t
                    }(t.bindingStartIndex), null !== e && Gp(t, n, e, 2, i);
                    const s = 3 == (3 & r);
                    if (s) {
                        const c = t.preOrderCheckHooks;
                        null !== c && hs(n, c, null)
                    } else {
                        const c = t.preOrderHooks;
                        null !== c && fs(n, c, 0, null), Ll(n, 0)
                    }
                    if (function HE(t) {
                        for (let n = ic(t); null !== n; n = rc(n)) {
                            if (!n[Ah]) continue;
                            const e = n[Bi];
                            for (let i = 0; i < e.length; i++) {
                                const r = e[i];
                                512 & r[q] || Ml(r[Ee], 1), r[q] |= 512
                            }
                        }
                    }(n), function BE(t) {
                        for (let n = ic(t); null !== n; n = rc(n)) for (let e = vt; e < n.length; e++) {
                            const i = n[e], r = i[A];
                            us(i) && Ls(r, i, r.template, i[xe])
                        }
                    }(n), null !== t.contentQueries && zp(t, n), s) {
                        const c = t.contentCheckHooks;
                        null !== c && hs(n, c)
                    } else {
                        const c = t.contentHooks;
                        null !== c && fs(n, c, 1), Ll(n, 1)
                    }
                    !function vE(t, n) {
                        const e = t.hostBindingOpCodes;
                        if (null !== e) try {
                            for (let i = 0; i < e.length; i++) {
                                const r = e[i];
                                if (r < 0) gi(~r); else {
                                    const o = r, s = e[++i], a = e[++i];
                                    C0(s, o), a(2, n[o])
                                }
                            }
                        } finally {
                            gi(-1)
                        }
                    }(t, n);
                    const a = t.components;
                    null !== a && function _E(t, n) {
                        for (let e = 0; e < n.length; e++) jE(t, n[e])
                    }(n, a);
                    const l = t.viewQuery;
                    if (null !== l && zc(2, l, i), s) {
                        const c = t.viewCheckHooks;
                        null !== c && hs(n, c)
                    } else {
                        const c = t.viewHooks;
                        null !== c && fs(n, c, 2), Ll(n, 2)
                    }
                    !0 === t.firstUpdatePass && (t.firstUpdatePass = !1), n[q] &= -41, 512 & n[q] && (n[q] &= -513, Ml(n[Ee], -1))
                } finally {
                    kl()
                }
            }
        }

        function Gp(t, n, e, i, r) {
            const o = yt(), s = 2 & i;
            try {
                gi(-1), s && n.length > _e && Pp(t, n, _e, !1), Gt(s ? 2 : 0, r), e(i, r)
            } finally {
                gi(o), Gt(s ? 3 : 1, r)
            }
        }

        function Lc(t, n, e) {
            if (Sl(n)) {
                const r = n.directiveEnd;
                for (let o = n.directiveStart; o < r; o++) {
                    const s = t.data[o];
                    s.contentQueries && s.contentQueries(1, e[o], o)
                }
            }
        }

        function Rc(t, n, e) {
            Uh() && (function OE(t, n, e, i) {
                const r = e.directiveStart, o = e.directiveEnd;
                jr(e) && function LE(t, n, e) {
                    const i = Nt(n, t), r = Wp(e), o = t[os],
                        s = Rs(t, Ns(t, r, null, e.onPush ? 32 : 16, i, n, o, o.createRenderer(i, e), null, null, null));
                    t[n.index] = s
                }(n, e, t.data[r + e.componentOffset]), t.firstCreatePass || vs(e, n), ut(i, n);
                const s = e.initialInputs;
                for (let a = r; a < o; a++) {
                    const l = t.data[a], c = mi(n, t, a, e);
                    ut(c, n), null !== s && RE(0, a - r, c, l, 0, s), sn(l) && (xt(e.index, n)[xe] = mi(n, t, a, e))
                }
            }(t, n, e, Nt(e, n)), 64 == (64 & e.flags) && Qp(t, n, e))
        }

        function Vc(t, n, e = Nt) {
            const i = n.localNames;
            if (null !== i) {
                let r = n.index + 1;
                for (let o = 0; o < i.length; o += 2) {
                    const s = i[o + 1], a = -1 === s ? e(n, t) : t[s];
                    t[r++] = a
                }
            }
        }

        function Wp(t) {
            const n = t.tView;
            return null === n || n.incompleteFirstPass ? t.tView = Bc(1, null, t.template, t.decls, t.vars, t.directiveDefs, t.pipeDefs, t.viewQuery, t.schemas, t.consts) : n
        }

        function Bc(t, n, e, i, r, o, s, a, l, c) {
            const u = _e + i, d = u + r, h = function bE(t, n) {
                const e = [];
                for (let i = 0; i < n; i++) e.push(i < t ? null : z);
                return e
            }(u, d), f = "function" == typeof c ? c() : c;
            return h[A] = {
                type: t,
                blueprint: h,
                template: e,
                queries: null,
                viewQuery: a,
                declTNode: n,
                data: h.slice().fill(null, u),
                bindingStartIndex: u,
                expandoStartIndex: d,
                hostBindingOpCodes: null,
                firstCreatePass: !0,
                firstUpdatePass: !0,
                staticViewQueries: !1,
                staticContentQueries: !1,
                preOrderHooks: null,
                preOrderCheckHooks: null,
                contentHooks: null,
                contentCheckHooks: null,
                viewHooks: null,
                viewCheckHooks: null,
                destroyHooks: null,
                cleanup: null,
                contentQueries: null,
                components: null,
                directiveRegistry: "function" == typeof o ? o() : o,
                pipeRegistry: "function" == typeof s ? s() : s,
                firstChild: null,
                schemas: l,
                consts: f,
                incompleteFirstPass: !1
            }
        }

        function qp(t, n, e, i) {
            const r = Jp(n);
            null === e ? r.push(i) : (r.push(e), t.firstCreatePass && eg(t).push(i, r.length - 1))
        }

        function Yp(t, n, e, i) {
            for (let r in t) if (t.hasOwnProperty(r)) {
                e = null === e ? {} : e;
                const o = t[r];
                null === i ? Kp(e, n, r, o) : i.hasOwnProperty(r) && Kp(e, n, i[r], o)
            }
            return e
        }

        function Kp(t, n, e, i) {
            t.hasOwnProperty(e) ? t[e].push(n, i) : t[e] = [n, i]
        }

        function Rt(t, n, e, i, r, o, s, a) {
            const l = Nt(n, e);
            let u, c = n.inputs;
            !a && null != c && (u = c[i]) ? (Gc(t, e, u, i, r), jr(n) && function SE(t, n) {
                const e = xt(n, t);
                16 & e[q] || (e[q] |= 32)
            }(e, n.index)) : 3 & n.type && (i = function EE(t) {
                return "class" === t ? "className" : "for" === t ? "htmlFor" : "formaction" === t ? "formAction" : "innerHtml" === t ? "innerHTML" : "readonly" === t ? "readOnly" : "tabindex" === t ? "tabIndex" : t
            }(i), r = null != s ? s(r, n.value || "", i) : r, o.setProperty(l, i, r))
        }

        function Hc(t, n, e, i) {
            if (Uh()) {
                const r = null === i ? null : {"": -1}, o = function AE(t, n) {
                    const e = t.directiveRegistry;
                    let i = null, r = null;
                    if (e) for (let o = 0; o < e.length; o++) {
                        const s = e[o];
                        if (Ip(n, s.selectors, !1)) if (i || (i = []), sn(s)) if (null !== s.findHostDirectiveDefs) {
                            const a = [];
                            r = r || new Map, s.findHostDirectiveDefs(s, a, r), i.unshift(...a, s), jc(t, n, a.length)
                        } else i.unshift(s), jc(t, n, 0); else r = r || new Map, s.findHostDirectiveDefs?.(s, i, r), i.push(s)
                    }
                    return null === i ? null : [i, r]
                }(t, e);
                let s, a;
                null === o ? s = a = null : [s, a] = o, null !== s && Zp(t, n, e, s, r, a), r && function PE(t, n, e) {
                    if (n) {
                        const i = t.localNames = [];
                        for (let r = 0; r < n.length; r += 2) {
                            const o = e[n[r + 1]];
                            if (null == o) throw new M(-301, !1);
                            i.push(n[r], o)
                        }
                    }
                }(e, i, r)
            }
            e.mergedAttrs = zr(e.mergedAttrs, e.attrs)
        }

        function Zp(t, n, e, i, r, o) {
            for (let c = 0; c < i.length; c++) Ul(vs(e, n), t, i[c].type);
            !function kE(t, n, e) {
                t.flags |= 1, t.directiveStart = n, t.directiveEnd = n + e, t.providerIndexes = n
            }(e, t.data.length, i.length);
            for (let c = 0; c < i.length; c++) {
                const u = i[c];
                u.providersResolver && u.providersResolver(u)
            }
            let s = !1, a = !1, l = ro(t, n, i.length, null);
            for (let c = 0; c < i.length; c++) {
                const u = i[c];
                e.mergedAttrs = zr(e.mergedAttrs, u.hostAttrs), NE(t, e, n, l, u), FE(l, u, r), null !== u.contentQueries && (e.flags |= 4), (null !== u.hostBindings || null !== u.hostAttrs || 0 !== u.hostVars) && (e.flags |= 64);
                const d = u.type.prototype;
                !s && (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) && ((t.preOrderHooks ?? (t.preOrderHooks = [])).push(e.index), s = !0), !a && (d.ngOnChanges || d.ngDoCheck) && ((t.preOrderCheckHooks ?? (t.preOrderCheckHooks = [])).push(e.index), a = !0), l++
            }
            !function DE(t, n, e) {
                const r = n.directiveEnd, o = t.data, s = n.attrs, a = [];
                let l = null, c = null;
                for (let u = n.directiveStart; u < r; u++) {
                    const d = o[u], h = e ? e.get(d) : null, p = h ? h.outputs : null;
                    l = Yp(d.inputs, u, l, h ? h.inputs : null), c = Yp(d.outputs, u, c, p);
                    const m = null === l || null === s || Op(n) ? null : VE(l, u, s);
                    a.push(m)
                }
                null !== l && (l.hasOwnProperty("class") && (n.flags |= 8), l.hasOwnProperty("style") && (n.flags |= 16)), n.initialInputs = a, n.inputs = l, n.outputs = c
            }(t, e, o)
        }

        function Qp(t, n, e) {
            const i = e.directiveStart, r = e.directiveEnd, o = e.index, s = function D0() {
                return $.lFrame.currentDirectiveIndex
            }();
            try {
                gi(o);
                for (let a = i; a < r; a++) {
                    const l = t.data[a], c = n[a];
                    Il(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && IE(l, c)
                }
            } finally {
                gi(-1), Il(s)
            }
        }

        function IE(t, n) {
            null !== t.hostBindings && t.hostBindings(1, n)
        }

        function jc(t, n, e) {
            n.componentOffset = e, (t.components ?? (t.components = [])).push(n.index)
        }

        function FE(t, n, e) {
            if (e) {
                if (n.exportAs) for (let i = 0; i < n.exportAs.length; i++) e[n.exportAs[i]] = t;
                sn(n) && (e[""] = t)
            }
        }

        function NE(t, n, e, i, r) {
            t.data[i] = r;
            const o = r.factory || (r.factory = pi(r.type)), s = new $r(o, sn(r), g);
            t.blueprint[i] = s, e[i] = s, function ME(t, n, e, i, r) {
                const o = r.hostBindings;
                if (o) {
                    let s = t.hostBindingOpCodes;
                    null === s && (s = t.hostBindingOpCodes = []);
                    const a = ~n.index;
                    (function TE(t) {
                        let n = t.length;
                        for (; n > 0;) {
                            const e = t[--n];
                            if ("number" == typeof e && e < 0) return e
                        }
                        return 0
                    })(s) != a && s.push(a), s.push(e, i, o)
                }
            }(t, n, i, ro(t, e, r.hostVars, z), r)
        }

        function Cn(t, n, e, i, r, o) {
            const s = Nt(t, n);
            !function Uc(t, n, e, i, r, o, s) {
                if (null == o) t.removeAttribute(n, r, e); else {
                    const a = null == s ? U(o) : s(o, i || "", r);
                    t.setAttribute(n, r, a, e)
                }
            }(n[K], s, o, t.value, e, i, r)
        }

        function RE(t, n, e, i, r, o) {
            const s = o[n];
            if (null !== s) {
                const a = i.setInput;
                for (let l = 0; l < s.length;) {
                    const c = s[l++], u = s[l++], d = s[l++];
                    null !== a ? i.setInput(e, d, c, u) : e[u] = d
                }
            }
        }

        function VE(t, n, e) {
            let i = null, r = 0;
            for (; r < e.length;) {
                const o = e[r];
                if (0 !== o) if (5 !== o) {
                    if ("number" == typeof o) break;
                    if (t.hasOwnProperty(o)) {
                        null === i && (i = []);
                        const s = t[o];
                        for (let a = 0; a < s.length; a += 2) if (s[a] === n) {
                            i.push(o, s[a + 1], e[r + 1]);
                            break
                        }
                    }
                    r += 2
                } else r += 2; else r += 4
            }
            return i
        }

        function Xp(t, n, e, i) {
            return [t, !0, !1, n, null, 0, i, e, null, null]
        }

        function jE(t, n) {
            const e = xt(n, t);
            if (us(e)) {
                const i = e[A];
                48 & e[q] ? Ls(i, e, i.template, e[xe]) : e[fi] > 0 && $c(e)
            }
        }

        function $c(t) {
            for (let i = ic(t); null !== i; i = rc(i)) for (let r = vt; r < i.length; r++) {
                const o = i[r];
                if (us(o)) if (512 & o[q]) {
                    const s = o[A];
                    Ls(s, o, s.template, o[xe])
                } else o[fi] > 0 && $c(o)
            }
            const e = t[A].components;
            if (null !== e) for (let i = 0; i < e.length; i++) {
                const r = xt(e[i], t);
                us(r) && r[fi] > 0 && $c(r)
            }
        }

        function UE(t, n) {
            const e = xt(n, t), i = e[A];
            (function $E(t, n) {
                for (let e = n.length; e < t.blueprint.length; e++) n.push(t.blueprint[e])
            })(i, e), Nc(i, e, e[xe])
        }

        function Rs(t, n) {
            return t[Vr] ? t[Oh][rn] = n : t[Vr] = n, t[Oh] = n, n
        }

        function Vs(t) {
            for (; t;) {
                t[q] |= 32;
                const n = Xr(t);
                if (n0(t) && !n) return t;
                t = n
            }
            return null
        }

        function Bs(t, n, e, i = !0) {
            const r = n[os];
            r.begin && r.begin();
            try {
                Ls(t, n, t.template, e)
            } catch (s) {
                throw i && ng(n, s), s
            } finally {
                r.end && r.end()
            }
        }

        function zc(t, n, e) {
            Pl(0), n(t, e)
        }

        function Jp(t) {
            return t[Li] || (t[Li] = [])
        }

        function eg(t) {
            return t.cleanup || (t.cleanup = [])
        }

        function ng(t, n) {
            const e = t[rs], i = e ? e.get(tr, null) : null;
            i && i.handleError(n)
        }

        function Gc(t, n, e, i, r) {
            for (let o = 0; o < e.length;) {
                const s = e[o++], a = e[o++], l = n[s], c = t.data[s];
                null !== c.setInput ? c.setInput(l, r, i, a) : l[a] = r
            }
        }

        function Hs(t, n, e) {
            let i = e ? t.styles : null, r = e ? t.classes : null, o = 0;
            if (null !== n) for (let s = 0; s < n.length; s++) {
                const a = n[s];
                "number" == typeof a ? o = a : 1 == o ? r = pl(r, a) : 2 == o && (i = pl(i, a + ": " + n[++s] + ";"))
            }
            e ? t.styles = i : t.stylesWithoutHost = i, e ? t.classes = r : t.classesWithoutHost = r
        }

        function js(t, n, e, i, r = !1) {
            for (; null !== e;) {
                const o = n[e.index];
                if (null !== o && i.push(it(o)), on(o)) for (let a = vt; a < o.length; a++) {
                    const l = o[a], c = l[A].firstChild;
                    null !== c && js(l[A], l, c, i)
                }
                const s = e.type;
                if (8 & s) js(t, n, e.child, i); else if (32 & s) {
                    const a = nc(e, n);
                    let l;
                    for (; l = a();) i.push(l)
                } else if (16 & s) {
                    const a = Kf(n, e);
                    if (Array.isArray(a)) i.push(...a); else {
                        const l = Xr(n[ct]);
                        js(l[A], l, a, i, !0)
                    }
                }
                e = r ? e.projectionNext : e.next
            }
            return i
        }

        class oo {
            get rootNodes() {
                const n = this._lView, e = n[A];
                return js(e, n, e.firstChild, [])
            }

            constructor(n, e) {
                this._lView = n, this._cdRefInjectingView = e, this._appRef = null, this._attachedToViewContainer = !1
            }

            get context() {
                return this._lView[xe]
            }

            set context(n) {
                this._lView[xe] = n
            }

            get destroyed() {
                return 128 == (128 & this._lView[q])
            }

            destroy() {
                if (this._appRef) this._appRef.detachView(this); else if (this._attachedToViewContainer) {
                    const n = this._lView[Ee];
                    if (on(n)) {
                        const e = n[as], i = e ? e.indexOf(this) : -1;
                        i > -1 && (ac(n, i), ys(e, i))
                    }
                    this._attachedToViewContainer = !1
                }
                Hf(this._lView[A], this._lView)
            }

            onDestroy(n) {
                qp(this._lView[A], this._lView, null, n)
            }

            markForCheck() {
                Vs(this._cdRefInjectingView || this._lView)
            }

            detach() {
                this._lView[q] &= -65
            }

            reattach() {
                this._lView[q] |= 64
            }

            detectChanges() {
                Bs(this._lView[A], this._lView, this.context)
            }

            checkNoChanges() {
            }

            attachToViewContainerRef() {
                if (this._appRef) throw new M(902, !1);
                this._attachedToViewContainer = !0
            }

            detachFromAppRef() {
                this._appRef = null, function IC(t, n) {
                    Jr(t, n, n[K], 2, null, null)
                }(this._lView[A], this._lView)
            }

            attachToAppRef(n) {
                if (this._attachedToViewContainer) throw new M(902, !1);
                this._appRef = n
            }
        }

        class zE extends oo {
            constructor(n) {
                super(n), this._view = n
            }

            detectChanges() {
                const n = this._view;
                Bs(n[A], n, n[xe], !1)
            }

            checkNoChanges() {
            }

            get context() {
                return null
            }
        }

        class ig extends io {
            constructor(n) {
                super(), this.ngModule = n
            }

            resolveComponentFactory(n) {
                const e = le(n);
                return new so(e, this.ngModule)
            }
        }

        function rg(t) {
            const n = [];
            for (let e in t) t.hasOwnProperty(e) && n.push({propName: t[e], templateName: e});
            return n
        }

        class WE {
            constructor(n, e) {
                this.injector = n, this.parentInjector = e
            }

            get(n, e, i) {
                i = ts(i);
                const r = this.injector.get(n, Mc, i);
                return r !== Mc || e === Mc ? r : this.parentInjector.get(n, e, i)
            }
        }

        class so extends Cp {
            get inputs() {
                return rg(this.componentDef.inputs)
            }

            get outputs() {
                return rg(this.componentDef.outputs)
            }

            constructor(n, e) {
                super(), this.componentDef = n, this.ngModule = e, this.componentType = n.type, this.selector = function ZD(t) {
                    return t.map(KD).join(",")
                }(n.selectors), this.ngContentSelectors = n.ngContentSelectors ? n.ngContentSelectors : [], this.isBoundToModule = !!e
            }

            create(n, e, i, r) {
                let o = (r = r || this.ngModule) instanceof bi ? r : r?.injector;
                o && null !== this.componentDef.getStandaloneInjector && (o = this.componentDef.getStandaloneInjector(o) || o);
                const s = o ? new WE(n, o) : n, a = s.get(Ep, null);
                if (null === a) throw new M(407, !1);
                const l = s.get(ID, null), c = a.createRenderer(null, this.componentDef),
                    u = this.componentDef.selectors[0][0] || "div", d = i ? function wE(t, n, e) {
                        return t.selectRootElement(n, e === _n.ShadowDom)
                    }(c, i, this.componentDef.encapsulation) : sc(c, u, function GE(t) {
                        const n = t.toLowerCase();
                        return "svg" === n ? Rh : "math" === n ? "math" : null
                    }(u)), h = this.componentDef.onPush ? 288 : 272,
                    f = Bc(0, null, null, 1, 0, null, null, null, null, null),
                    p = Ns(null, f, null, h, null, null, a, c, l, s, null);
                let m, b;
                Fl(p);
                try {
                    const w = this.componentDef;
                    let x, y = null;
                    w.findHostDirectiveDefs ? (x = [], y = new Map, w.findHostDirectiveDefs(w, x, y), x.push(w)) : x = [w];
                    const N = function YE(t, n) {
                        const e = t[A], i = _e;
                        return t[i] = n, rr(e, i, 2, "#host", null)
                    }(p, d), oe = function KE(t, n, e, i, r, o, s, a) {
                        const l = r[A];
                        !function ZE(t, n, e, i) {
                            for (const r of t) n.mergedAttrs = zr(n.mergedAttrs, r.hostAttrs);
                            null !== n.mergedAttrs && (Hs(n, n.mergedAttrs, !0), null !== e && Xf(i, e, n))
                        }(i, t, n, s);
                        const c = o.createRenderer(n, e),
                            u = Ns(r, Wp(e), null, e.onPush ? 32 : 16, r[t.index], t, o, c, a || null, null, null);
                        return l.firstCreatePass && jc(l, t, i.length - 1), Rs(r, u), r[t.index] = u
                    }(N, d, w, x, p, a, c);
                    b = Bh(f, _e), d && function XE(t, n, e, i) {
                        if (i) Vl(t, e, ["ng-version", AD.full]); else {
                            const {attrs: r, classes: o} = function QD(t) {
                                const n = [], e = [];
                                let i = 1, r = 2;
                                for (; i < t.length;) {
                                    let o = t[i];
                                    if ("string" == typeof o) 2 === r ? "" !== o && n.push(o, t[++i]) : 8 === r && e.push(o); else {
                                        if (!ln(r)) break;
                                        r = o
                                    }
                                    i++
                                }
                                return {attrs: n, classes: e}
                            }(n.selectors[0]);
                            r && Vl(t, e, r), o && o.length > 0 && Qf(t, e, o.join(" "))
                        }
                    }(c, w, d, i), void 0 !== e && function JE(t, n, e) {
                        const i = t.projection = [];
                        for (let r = 0; r < n.length; r++) {
                            const o = e[r];
                            i.push(null != o ? Array.from(o) : null)
                        }
                    }(b, this.ngContentSelectors, e), m = function QE(t, n, e, i, r, o) {
                        const s = rt(), a = r[A], l = Nt(s, r);
                        Zp(a, r, s, e, null, i);
                        for (let u = 0; u < e.length; u++) ut(mi(r, a, s.directiveStart + u, s), r);
                        Qp(a, r, s), l && ut(l, r);
                        const c = mi(r, a, s.directiveStart + s.componentOffset, s);
                        if (t[xe] = r[xe] = c, null !== o) for (const u of o) u(c, n);
                        return Lc(a, s, t), c
                    }(oe, w, x, y, p, [e1]), Nc(f, p, null)
                } finally {
                    kl()
                }
                return new qE(this.componentType, m, er(b, p), p, b)
            }
        }

        class qE extends ED {
            constructor(n, e, i, r, o) {
                super(), this.location = i, this._rootLView = r, this._tNode = o, this.instance = e, this.hostView = this.changeDetectorRef = new zE(r), this.componentType = n
            }

            setInput(n, e) {
                const i = this._tNode.inputs;
                let r;
                if (null !== i && (r = i[n])) {
                    const o = this._rootLView;
                    Gc(o[A], o, r, n, e), Vs(xt(this._tNode.index, o))
                }
            }

            get injector() {
                return new zi(this._tNode, this._rootLView)
            }

            destroy() {
                this.hostView.destroy()
            }

            onDestroy(n) {
                this.hostView.onDestroy(n)
            }
        }

        function e1() {
            const t = rt();
            ds(D()[A], t)
        }

        function R(t) {
            let n = function og(t) {
                return Object.getPrototypeOf(t.prototype).constructor
            }(t.type), e = !0;
            const i = [t];
            for (; n;) {
                let r;
                if (sn(t)) r = n.\u0275cmp || n.\u0275dir; else {
                    if (n.\u0275cmp) throw new M(903, !1);
                    r = n.\u0275dir
                }
                if (r) {
                    if (e) {
                        i.push(r);
                        const s = t;
                        s.inputs = Wc(t.inputs), s.declaredInputs = Wc(t.declaredInputs), s.outputs = Wc(t.outputs);
                        const a = r.hostBindings;
                        a && r1(t, a);
                        const l = r.viewQuery, c = r.contentQueries;
                        if (l && n1(t, l), c && i1(t, c), fl(t.inputs, r.inputs), fl(t.declaredInputs, r.declaredInputs), fl(t.outputs, r.outputs), sn(r) && r.data.animation) {
                            const u = t.data;
                            u.animation = (u.animation || []).concat(r.data.animation)
                        }
                    }
                    const o = r.features;
                    if (o) for (let s = 0; s < o.length; s++) {
                        const a = o[s];
                        a && a.ngInherit && a(t), a === R && (e = !1)
                    }
                }
                n = Object.getPrototypeOf(n)
            }
            !function t1(t) {
                let n = 0, e = null;
                for (let i = t.length - 1; i >= 0; i--) {
                    const r = t[i];
                    r.hostVars = n += r.hostVars, r.hostAttrs = zr(r.hostAttrs, e = zr(e, r.hostAttrs))
                }
            }(i)
        }

        function Wc(t) {
            return t === On ? {} : t === re ? [] : t
        }

        function n1(t, n) {
            const e = t.viewQuery;
            t.viewQuery = e ? (i, r) => {
                n(i, r), e(i, r)
            } : n
        }

        function i1(t, n) {
            const e = t.contentQueries;
            t.contentQueries = e ? (i, r, o) => {
                n(i, r, o), e(i, r, o)
            } : n
        }

        function r1(t, n) {
            const e = t.hostBindings;
            t.hostBindings = e ? (i, r) => {
                n(i, r), e(i, r)
            } : n
        }

        function Us(t) {
            return !!qc(t) && (Array.isArray(t) || !(t instanceof Map) && Symbol.iterator in t)
        }

        function qc(t) {
            return null !== t && ("function" == typeof t || "object" == typeof t)
        }

        function Dn(t, n, e) {
            return t[n] = e
        }

        function dt(t, n, e) {
            return !Object.is(t[n], e) && (t[n] = e, !0)
        }

        function wi(t, n, e, i) {
            const r = dt(t, n, e);
            return dt(t, n + 1, i) || r
        }

        function $e(t, n, e, i) {
            const r = D();
            return dt(r, ji(), n) && (ee(), Cn(Ce(), r, t, n, e, i)), $e
        }

        function sr(t, n, e, i) {
            return dt(t, ji(), e) ? n + U(e) + i : z
        }

        function ar(t, n, e, i, r, o) {
            const a = wi(t, function Pn() {
                return $.lFrame.bindingIndex
            }(), e, r);
            return Fn(2), a ? n + U(e) + i + U(r) + o : z
        }

        function O(t, n, e, i, r, o, s, a) {
            const l = D(), c = ee(), u = t + _e, d = c.firstCreatePass ? function p1(t, n, e, i, r, o, s, a, l) {
                const c = n.consts, u = rr(n, t, 4, s || null, Wn(c, a));
                Hc(n, e, u, Wn(c, l)), ds(n, u);
                const d = u.tView = Bc(2, u, i, r, o, n.directiveRegistry, n.pipeRegistry, null, n.schemas, c);
                return null !== n.queries && (n.queries.template(n, u), d.queries = n.queries.embeddedTView(u)), u
            }(u, c, l, n, e, i, r, o, s) : c.data[u];
            bn(d, !1);
            const h = l[K].createComment("");
            xs(c, l, h, d), ut(h, l), Rs(l, l[u] = Xp(h, l, h, d)), ls(d) && Rc(c, l, d), null != s && Vc(l, d, a)
        }

        function Me(t) {
            return Hi(function b0() {
                return $.lFrame.contextLView
            }(), _e + t)
        }

        function v(t, n, e) {
            const i = D();
            return dt(i, ji(), n) && Rt(ee(), Ce(), i, t, n, i[K], e, !1), v
        }

        function Yc(t, n, e, i, r) {
            const s = r ? "class" : "style";
            Gc(t, e, n.inputs[s], s, i)
        }

        function S(t, n, e, i) {
            const r = D(), o = ee(), s = _e + t, a = r[K], l = o.firstCreatePass ? function m1(t, n, e, i, r, o) {
                const s = n.consts, l = rr(n, t, 2, i, Wn(s, r));
                return Hc(n, e, l, Wn(s, o)), null !== l.attrs && Hs(l, l.attrs, !1), null !== l.mergedAttrs && Hs(l, l.mergedAttrs, !0), null !== n.queries && n.queries.elementStart(n, l), l
            }(s, o, r, n, e, i) : o.data[s], c = r[s] = sc(a, n, function O0() {
                return $.lFrame.currentNamespace
            }()), u = ls(l);
            return bn(l, !0), Xf(a, c, l), 32 != (32 & l.flags) && xs(o, r, c, l), 0 === function g0() {
                return $.lFrame.elementDepthCount
            }() && ut(c, r), function m0() {
                $.lFrame.elementDepthCount++
            }(), u && (Rc(o, r, l), Lc(o, l, r)), null !== i && Vc(r, l), S
        }

        function E() {
            let t = rt();
            Tl() ? Ol() : (t = t.parent, bn(t, !1));
            const n = t;
            !function v0() {
                $.lFrame.elementDepthCount--
            }();
            const e = ee();
            return e.firstCreatePass && (ds(e, t), Sl(t) && e.queries.elementEnd(t)), null != n.classesWithoutHost && function F0(t) {
                return 0 != (8 & t.flags)
            }(n) && Yc(e, n, D(), n.classesWithoutHost, !0), null != n.stylesWithoutHost && function k0(t) {
                return 0 != (16 & t.flags)
            }(n) && Yc(e, n, D(), n.stylesWithoutHost, !1), E
        }

        function k(t, n, e, i) {
            return S(t, n, e, i), E(), k
        }

        function Te(t, n, e) {
            const i = D(), r = ee(), o = t + _e, s = r.firstCreatePass ? function v1(t, n, e, i, r) {
                const o = n.consts, s = Wn(o, i), a = rr(n, t, 8, "ng-container", s);
                return null !== s && Hs(a, s, !0), Hc(n, e, a, Wn(o, r)), null !== n.queries && n.queries.elementStart(n, a), a
            }(o, r, i, n, e) : r.data[o];
            bn(s, !0);
            const a = i[o] = i[K].createComment("");
            return xs(r, i, a, s), ut(a, i), ls(s) && (Rc(r, i, s), Lc(r, s, i)), null != e && Vc(i, s), Te
        }

        function Oe() {
            let t = rt();
            const n = ee();
            return Tl() ? Ol() : (t = t.parent, bn(t, !1)), n.firstCreatePass && (ds(n, t), Sl(t) && n.queries.elementEnd(t)), Oe
        }

        function Yt(t, n, e) {
            return Te(t, n, e), Oe(), Yt
        }

        function Kt() {
            return D()
        }

        function zs(t) {
            return !!t && "function" == typeof t.then
        }

        const yg = function _g(t) {
            return !!t && "function" == typeof t.subscribe
        };

        function ce(t, n, e, i) {
            const r = D(), o = ee(), s = rt();
            return function wg(t, n, e, i, r, o, s) {
                const a = ls(i), c = t.firstCreatePass && eg(t), u = n[xe], d = Jp(n);
                let h = !0;
                if (3 & i.type || s) {
                    const m = Nt(i, n), b = s ? s(m) : m, w = d.length, x = s ? N => s(it(N[i.index])) : i.index;
                    let y = null;
                    if (!s && a && (y = function _1(t, n, e, i) {
                        const r = t.cleanup;
                        if (null != r) for (let o = 0; o < r.length - 1; o += 2) {
                            const s = r[o];
                            if (s === e && r[o + 1] === i) {
                                const a = n[Li], l = r[o + 2];
                                return a.length > l ? a[l] : null
                            }
                            "string" == typeof s && (o += 2)
                        }
                        return null
                    }(t, n, r, i.index)), null !== y) (y.__ngLastListenerFn__ || y).__ngNextListenerFn__ = o, y.__ngLastListenerFn__ = o, h = !1; else {
                        o = Dg(i, n, u, o, !1);
                        const N = e.listen(b, r, o);
                        d.push(o, N), c && c.push(r, x, w, w + 1)
                    }
                } else o = Dg(i, n, u, o, !1);
                const f = i.outputs;
                let p;
                if (h && null !== f && (p = f[r])) {
                    const m = p.length;
                    if (m) for (let b = 0; b < m; b += 2) {
                        const oe = n[p[b]][p[b + 1]].subscribe(o), Le = d.length;
                        d.push(o, oe), c && c.push(r, i.index, Le, -(Le + 1))
                    }
                }
            }(o, r, r[K], s, t, n, i), ce
        }

        function Cg(t, n, e, i) {
            try {
                return Gt(6, n, e), !1 !== e(i)
            } catch (r) {
                return ng(t, r), !1
            } finally {
                Gt(7, n, e)
            }
        }

        function Dg(t, n, e, i, r) {
            return function o(s) {
                if (s === Function) return i;
                Vs(t.componentOffset > -1 ? xt(t.index, n) : n);
                let l = Cg(n, e, i, s), c = o.__ngNextListenerFn__;
                for (; c;) l = Cg(n, e, c, s) && l, c = c.__ngNextListenerFn__;
                return r && !1 === l && (s.preventDefault(), s.returnValue = !1), l
            }
        }

        function P(t = 1) {
            return function S0(t) {
                return ($.lFrame.contextLView = function x0(t, n) {
                    for (; t > 0;) n = n[Ri], t--;
                    return n
                }(t, $.lFrame.contextLView))[xe]
            }(t)
        }

        function y1(t, n) {
            let e = null;
            const i = function GD(t) {
                const n = t.attrs;
                if (null != n) {
                    const e = n.indexOf(5);
                    if (!(1 & e)) return n[e + 1]
                }
                return null
            }(t);
            for (let r = 0; r < n.length; r++) {
                const o = n[r];
                if ("*" !== o) {
                    if (null === i ? Ip(t, o, !0) : YD(i, o)) return r
                } else e = r
            }
            return e
        }

        function Yn(t) {
            const n = D()[ct][lt];
            if (!n.projection) {
                const i = n.projection = Yr(t ? t.length : 1, null), r = i.slice();
                let o = n.child;
                for (; null !== o;) {
                    const s = t ? y1(o, t) : 0;
                    null !== s && (r[s] ? r[s].projectionNext = o : i[s] = o, r[s] = o), o = o.next
                }
            }
        }

        function Vt(t, n = 0, e) {
            const i = D(), r = ee(), o = rr(r, _e + t, 16, null, e || null);
            null === o.projection && (o.projection = n), Ol(), 32 != (32 & o.flags) && function VC(t, n, e) {
                Zf(n[K], 0, n, e, jf(t, e, n), Gf(e.parent || n[lt], e, n))
            }(r, i, o)
        }

        function Kc(t, n, e) {
            return Zc(t, "", n, "", e), Kc
        }

        function Zc(t, n, e, i, r) {
            const o = D(), s = sr(o, n, e, i);
            return s !== z && Rt(ee(), Ce(), o, t, s, o[K], r, !1), Zc
        }

        function Gs(t, n) {
            return t << 17 | n << 2
        }

        function Kn(t) {
            return t >> 17 & 32767
        }

        function Qc(t) {
            return 2 | t
        }

        function Ci(t) {
            return (131068 & t) >> 2
        }

        function Xc(t, n) {
            return -131069 & t | n << 2
        }

        function Jc(t) {
            return 1 | t
        }

        function Pg(t, n, e, i, r) {
            const o = t[e + 1], s = null === n;
            let a = i ? Kn(o) : Ci(o), l = !1;
            for (; 0 !== a && (!1 === l || s);) {
                const u = t[a + 1];
                S1(t[a], n) && (l = !0, t[a + 1] = i ? Jc(u) : Qc(u)), a = i ? Kn(u) : Ci(u)
            }
            l && (t[e + 1] = i ? Qc(o) : Jc(o))
        }

        function S1(t, n) {
            return null === t || null == n || (Array.isArray(t) ? t[1] : t) === n || !(!Array.isArray(t) || "string" != typeof n) && Ki(t, n) >= 0
        }

        const ze = {textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0};

        function Fg(t) {
            return t.substring(ze.key, ze.keyEnd)
        }

        function kg(t, n) {
            const e = ze.textEnd;
            return e === n ? -1 : (n = ze.keyEnd = function O1(t, n, e) {
                for (; n < e && t.charCodeAt(n) > 32;) n++;
                return n
            }(t, ze.key = n, e), pr(t, n, e))
        }

        function pr(t, n, e) {
            for (; n < e && t.charCodeAt(n) <= 32;) n++;
            return n
        }

        function Ws(t, n, e) {
            return cn(t, n, e, !1), Ws
        }

        function we(t, n) {
            return cn(t, n, null, !0), we
        }

        function Sn(t, n) {
            for (let e = function M1(t) {
                return function Lg(t) {
                    ze.key = 0, ze.keyEnd = 0, ze.value = 0, ze.valueEnd = 0, ze.textEnd = t.length
                }(t), kg(t, pr(t, 0, ze.textEnd))
            }(n); e >= 0; e = kg(n, e)) Lt(t, Fg(n), !0)
        }

        function cn(t, n, e, i) {
            const r = D(), o = ee(), s = Fn(2);
            o.firstUpdatePass && jg(o, t, s, i), n !== z && dt(r, s, n) && $g(o, o.data[yt()], r, r[K], t, r[s + 1] = function H1(t, n) {
                return null == t || "" === t || ("string" == typeof n ? t += n : "object" == typeof t && (t = pe(qn(t)))), t
            }(n, e), i, s)
        }

        function un(t, n, e, i) {
            const r = ee(), o = Fn(2);
            r.firstUpdatePass && jg(r, null, o, i);
            const s = D();
            if (e !== z && dt(s, o, e)) {
                const a = r.data[yt()];
                if (Gg(a, i) && !Hg(r, o)) {
                    let l = i ? a.classesWithoutHost : a.stylesWithoutHost;
                    null !== l && (e = pl(l, e || "")), Yc(r, a, s, e, i)
                } else !function B1(t, n, e, i, r, o, s, a) {
                    r === z && (r = re);
                    let l = 0, c = 0, u = 0 < r.length ? r[0] : null, d = 0 < o.length ? o[0] : null;
                    for (; null !== u || null !== d;) {
                        const h = l < r.length ? r[l + 1] : void 0, f = c < o.length ? o[c + 1] : void 0;
                        let m, p = null;
                        u === d ? (l += 2, c += 2, h !== f && (p = d, m = f)) : null === d || null !== u && u < d ? (l += 2, p = u) : (c += 2, p = d, m = f), null !== p && $g(t, n, e, i, p, m, s, a), u = l < r.length ? r[l] : null, d = c < o.length ? o[c] : null
                    }
                }(r, a, s, s[K], s[o + 1], s[o + 1] = function R1(t, n, e) {
                    if (null == e || "" === e) return re;
                    const i = [], r = qn(e);
                    if (Array.isArray(r)) for (let o = 0; o < r.length; o++) t(i, r[o], !0); else if ("object" == typeof r) for (const o in r) r.hasOwnProperty(o) && t(i, o, r[o]); else "string" == typeof r && n(i, r);
                    return i
                }(t, n, e), i, o)
            }
        }

        function Hg(t, n) {
            return n >= t.expandoStartIndex
        }

        function jg(t, n, e, i) {
            const r = t.data;
            if (null === r[e + 1]) {
                const o = r[yt()], s = Hg(t, e);
                Gg(o, i) && null === n && !s && (n = !1), n = function F1(t, n, e, i) {
                    const r = function Al(t) {
                        const n = $.lFrame.currentDirectiveIndex;
                        return -1 === n ? null : t[n]
                    }(t);
                    let o = i ? n.residualClasses : n.residualStyles;
                    if (null === r) 0 === (i ? n.classBindings : n.styleBindings) && (e = lo(e = eu(null, t, n, e, i), n.attrs, i), o = null); else {
                        const s = n.directiveStylingLast;
                        if (-1 === s || t[s] !== r) if (e = eu(r, t, n, e, i), null === o) {
                            let l = function k1(t, n, e) {
                                const i = e ? n.classBindings : n.styleBindings;
                                if (0 !== Ci(i)) return t[Kn(i)]
                            }(t, n, i);
                            void 0 !== l && Array.isArray(l) && (l = eu(null, t, n, l[1], i), l = lo(l, n.attrs, i), function N1(t, n, e, i) {
                                t[Kn(e ? n.classBindings : n.styleBindings)] = i
                            }(t, n, i, l))
                        } else o = function L1(t, n, e) {
                            let i;
                            const r = n.directiveEnd;
                            for (let o = 1 + n.directiveStylingLast; o < r; o++) i = lo(i, t[o].hostAttrs, e);
                            return lo(i, n.attrs, e)
                        }(t, n, i)
                    }
                    return void 0 !== o && (i ? n.residualClasses = o : n.residualStyles = o), e
                }(r, o, n, i), function D1(t, n, e, i, r, o) {
                    let s = o ? n.classBindings : n.styleBindings, a = Kn(s), l = Ci(s);
                    t[i] = e;
                    let u, c = !1;
                    if (Array.isArray(e) ? (u = e[1], (null === u || Ki(e, u) > 0) && (c = !0)) : u = e, r) if (0 !== l) {
                        const h = Kn(t[a + 1]);
                        t[i + 1] = Gs(h, a), 0 !== h && (t[h + 1] = Xc(t[h + 1], i)), t[a + 1] = function w1(t, n) {
                            return 131071 & t | n << 17
                        }(t[a + 1], i)
                    } else t[i + 1] = Gs(a, 0), 0 !== a && (t[a + 1] = Xc(t[a + 1], i)), a = i; else t[i + 1] = Gs(l, 0), 0 === a ? a = i : t[l + 1] = Xc(t[l + 1], i), l = i;
                    c && (t[i + 1] = Qc(t[i + 1])), Pg(t, u, i, !0), Pg(t, u, i, !1), function E1(t, n, e, i, r) {
                        const o = r ? t.residualClasses : t.residualStyles;
                        null != o && "string" == typeof n && Ki(o, n) >= 0 && (e[i + 1] = Jc(e[i + 1]))
                    }(n, u, t, i, o), s = Gs(a, l), o ? n.classBindings = s : n.styleBindings = s
                }(r, o, n, e, s, i)
            }
        }

        function eu(t, n, e, i, r) {
            let o = null;
            const s = e.directiveEnd;
            let a = e.directiveStylingLast;
            for (-1 === a ? a = e.directiveStart : a++; a < s && (o = n[a], i = lo(i, o.hostAttrs, r), o !== t);) a++;
            return null !== t && (e.directiveStylingLast = a), i
        }

        function lo(t, n, e) {
            const i = e ? 1 : 2;
            let r = -1;
            if (null !== n) for (let o = 0; o < n.length; o++) {
                const s = n[o];
                "number" == typeof s ? r = s : r === i && (Array.isArray(t) || (t = void 0 === t ? [] : ["", t]), Lt(t, s, !!e || n[++o]))
            }
            return void 0 === t ? null : t
        }

        function V1(t, n, e) {
            const i = String(n);
            "" !== i && !i.includes(" ") && Lt(t, i, e)
        }

        function $g(t, n, e, i, r, o, s, a) {
            if (!(3 & n.type)) return;
            const l = t.data, c = l[a + 1], u = function C1(t) {
                return 1 == (1 & t)
            }(c) ? zg(l, n, e, r, Ci(c), s) : void 0;
            qs(u) || (qs(o) || function b1(t) {
                return 2 == (2 & t)
            }(c) && (o = zg(l, null, e, r, a, s)), function HC(t, n, e, i, r) {
                if (n) r ? t.addClass(e, i) : t.removeClass(e, i); else {
                    let o = -1 === i.indexOf("-") ? void 0 : Mt.DashCase;
                    null == r ? t.removeStyle(e, i, o) : ("string" == typeof r && r.endsWith("!important") && (r = r.slice(0, -10), o |= Mt.Important), t.setStyle(e, i, r, o))
                }
            }(i, s, cs(yt(), e), r, o))
        }

        function zg(t, n, e, i, r, o) {
            const s = null === n;
            let a;
            for (; r > 0;) {
                const l = t[r], c = Array.isArray(l), u = c ? l[1] : l, d = null === u;
                let h = e[r + 1];
                h === z && (h = d ? re : void 0);
                let f = d ? Wl(h, i) : u === i ? h : void 0;
                if (c && !qs(f) && (f = Wl(l, i)), qs(f) && (a = f, s)) return a;
                const p = t[r + 1];
                r = s ? Kn(p) : Ci(p)
            }
            if (null !== n) {
                let l = o ? n.residualClasses : n.residualStyles;
                null != l && (a = Wl(l, i))
            }
            return a
        }

        function qs(t) {
            return void 0 !== t
        }

        function Gg(t, n) {
            return 0 != (t.flags & (n ? 8 : 16))
        }

        function Ie(t, n = "") {
            const e = D(), i = ee(), r = t + _e, o = i.firstCreatePass ? rr(i, r, 1, n, null) : i.data[r],
                s = e[r] = function oc(t, n) {
                    return t.createText(n)
                }(e[K], n);
            xs(i, e, s, o), bn(o, !1)
        }

        function Zn(t) {
            return Zt("", t, ""), Zn
        }

        function Zt(t, n, e) {
            const i = D(), r = sr(i, t, n, e);
            return r !== z && function Rn(t, n, e) {
                const i = cs(n, t);
                !function Vf(t, n, e) {
                    t.setValue(n, e)
                }(t[K], i, e)
            }(i, yt(), r), Zt
        }

        function Ys(t, n, e) {
            un(Lt, Sn, sr(D(), t, n, e), !0)
        }

        const Di = void 0;
        var rS = ["en", [["a", "p"], ["AM", "PM"], Di], [["AM", "PM"], Di, Di], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], Di, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], Di, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"], ["{1}, {0}", Di, "{1} 'at' {0}", Di], [".", ",", ";", "%", "+", "-", "E", "\xd7", "\u2030", "\u221e", "NaN", ":"], ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", function iS(t) {
            const e = Math.floor(Math.abs(t)), i = t.toString().replace(/^[^.]*\.?/, "").length;
            return 1 === e && 0 === i ? 1 : 5
        }];
        let gr = {};

        function bt(t) {
            const n = function sS(t) {
                return t.toLowerCase().replace(/_/g, "-")
            }(t);
            let e = fm(n);
            if (e) return e;
            const i = n.split("-")[0];
            if (e = fm(i), e) return e;
            if ("en" === i) return rS;
            throw new M(701, !1)
        }

        function fm(t) {
            return t in gr || (gr[t] = ve.ng && ve.ng.common && ve.ng.common.locales && ve.ng.common.locales[t]), gr[t]
        }

        var T = (() => ((T = T || {})[T.LocaleId = 0] = "LocaleId", T[T.DayPeriodsFormat = 1] = "DayPeriodsFormat", T[T.DayPeriodsStandalone = 2] = "DayPeriodsStandalone", T[T.DaysFormat = 3] = "DaysFormat", T[T.DaysStandalone = 4] = "DaysStandalone", T[T.MonthsFormat = 5] = "MonthsFormat", T[T.MonthsStandalone = 6] = "MonthsStandalone", T[T.Eras = 7] = "Eras", T[T.FirstDayOfWeek = 8] = "FirstDayOfWeek", T[T.WeekendRange = 9] = "WeekendRange", T[T.DateFormat = 10] = "DateFormat", T[T.TimeFormat = 11] = "TimeFormat", T[T.DateTimeFormat = 12] = "DateTimeFormat", T[T.NumberSymbols = 13] = "NumberSymbols", T[T.NumberFormats = 14] = "NumberFormats", T[T.CurrencyCode = 15] = "CurrencyCode", T[T.CurrencySymbol = 16] = "CurrencySymbol", T[T.CurrencyName = 17] = "CurrencyName", T[T.Currencies = 18] = "Currencies", T[T.Directionality = 19] = "Directionality", T[T.PluralCase = 20] = "PluralCase", T[T.ExtraData = 21] = "ExtraData", T))();
        const mr = "en-US";
        let pm = mr;

        function iu(t, n, e, i, r) {
            if (t = B(t), Array.isArray(t)) for (let o = 0; o < t.length; o++) iu(t[o], n, e, i, r); else {
                const o = ee(), s = D();
                let a = yi(t) ? t : B(t.provide), l = wp(t);
                const c = rt(), u = 1048575 & c.providerIndexes, d = c.directiveStart, h = c.providerIndexes >> 20;
                if (yi(t) || !t.multi) {
                    const f = new $r(l, r, g), p = ou(a, n, r ? u : u + h, d);
                    -1 === p ? (Ul(vs(c, s), o, a), ru(o, t, n.length), n.push(a), c.directiveStart++, c.directiveEnd++, r && (c.providerIndexes += 1048576), e.push(f), s.push(f)) : (e[p] = f, s[p] = f)
                } else {
                    const f = ou(a, n, u + h, d), p = ou(a, n, u, u + h), b = p >= 0 && e[p];
                    if (r && !b || !r && !(f >= 0 && e[f])) {
                        Ul(vs(c, s), o, a);
                        const w = function ix(t, n, e, i, r) {
                            const o = new $r(t, e, g);
                            return o.multi = [], o.index = n, o.componentProviders = 0, Bm(o, r, i && !e), o
                        }(r ? nx : tx, e.length, r, i, l);
                        !r && b && (e[p].providerFactory = w), ru(o, t, n.length, 0), n.push(a), c.directiveStart++, c.directiveEnd++, r && (c.providerIndexes += 1048576), e.push(w), s.push(w)
                    } else ru(o, t, f > -1 ? f : p, Bm(e[r ? p : f], l, !r && i));
                    !r && i && b && e[p].componentProviders++
                }
            }
        }

        function ru(t, n, e, i) {
            const r = yi(n), o = function vD(t) {
                return !!t.useClass
            }(n);
            if (r || o) {
                const l = (o ? B(n.useClass) : n).prototype.ngOnDestroy;
                if (l) {
                    const c = t.destroyHooks || (t.destroyHooks = []);
                    if (!r && n.multi) {
                        const u = c.indexOf(e);
                        -1 === u ? c.push(e, [i, l]) : c[u + 1].push(i, l)
                    } else c.push(e, l)
                }
            }
        }

        function Bm(t, n, e) {
            return e && t.componentProviders++, t.multi.push(n) - 1
        }

        function ou(t, n, e, i) {
            for (let r = e; r < i; r++) if (n[r] === t) return r;
            return -1
        }

        function tx(t, n, e, i) {
            return su(this.multi, [])
        }

        function nx(t, n, e, i) {
            const r = this.multi;
            let o;
            if (this.providerFactory) {
                const s = this.providerFactory.componentProviders, a = mi(e, e[A], this.providerFactory.index, i);
                o = a.slice(0, s), su(r, o);
                for (let l = s; l < a.length; l++) o.push(a[l])
            } else o = [], su(r, o);
            return o
        }

        function su(t, n) {
            for (let e = 0; e < t.length; e++) n.push((0, t[e])());
            return n
        }

        function ue(t, n = []) {
            return e => {
                e.providersResolver = (i, r) => function ex(t, n, e) {
                    const i = ee();
                    if (i.firstCreatePass) {
                        const r = sn(t);
                        iu(e, i.data, i.blueprint, r, !0), iu(n, i.data, i.blueprint, r, !1)
                    }
                }(i, r ? r(t) : t, n)
            }
        }

        class vr {
        }

        class rx {
        }

        class Hm extends vr {
            constructor(n, e) {
                super(), this._parent = e, this._bootstrapComponents = [], this.destroyCbs = [], this.componentFactoryResolver = new ig(this);
                const i = function Ft(t, n) {
                    const e = t[Sh] || null;
                    if (!e && !0 === n) throw new Error(`Type ${pe(t)} does not have '\u0275mod' property.`);
                    return e
                }(n);
                this._bootstrapComponents = function Nn(t) {
                    return t instanceof Function ? t() : t
                }(i.bootstrap), this._r3Injector = Rp(n, e, [{provide: vr, useValue: this}, {
                    provide: io,
                    useValue: this.componentFactoryResolver
                }], pe(n), new Set(["environment"])), this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(n)
            }

            get injector() {
                return this._r3Injector
            }

            destroy() {
                const n = this._r3Injector;
                !n.destroyed && n.destroy(), this.destroyCbs.forEach(e => e()), this.destroyCbs = null
            }

            onDestroy(n) {
                this.destroyCbs.push(n)
            }
        }

        class au extends rx {
            constructor(n) {
                super(), this.moduleType = n
            }

            create(n) {
                return new Hm(this.moduleType, n)
            }
        }

        function cu(t, n, e) {
            const i = _t() + t, r = D();
            return r[i] === z ? Dn(r, i, e ? n.call(e) : n()) : function ao(t, n) {
                return t[n]
            }(r, i)
        }

        function Ei(t, n, e, i) {
            return function Km(t, n, e, i, r, o) {
                const s = n + e;
                return dt(t, s, r) ? Dn(t, s + 1, o ? i.call(o, r) : i(r)) : go(t, s + 1)
            }(D(), _t(), t, n, e, i)
        }

        function uu(t, n, e, i, r) {
            return Zm(D(), _t(), t, n, e, i, r)
        }

        function du(t, n, e, i, r, o) {
            return function Qm(t, n, e, i, r, o, s, a) {
                const l = n + e;
                return function $s(t, n, e, i, r) {
                    const o = wi(t, n, e, i);
                    return dt(t, n + 2, r) || o
                }(t, l, r, o, s) ? Dn(t, l + 3, a ? i.call(a, r, o, s) : i(r, o, s)) : go(t, l + 3)
            }(D(), _t(), t, n, e, i, r, o)
        }

        function go(t, n) {
            const e = t[n];
            return e === z ? void 0 : e
        }

        function Zm(t, n, e, i, r, o, s) {
            const a = n + e;
            return wi(t, a, r, o) ? Dn(t, a + 2, s ? i.call(s, r, o) : i(r, o)) : go(t, a + 2)
        }

        function Xm(t, n, e, i, r, o, s, a, l) {
            const c = n + e;
            return function qt(t, n, e, i, r, o) {
                const s = wi(t, n, e, i);
                return wi(t, n + 2, r, o) || s
            }(t, c, r, o, s, a) ? Dn(t, c + 4, l ? i.call(l, r, o, s, a) : i(r, o, s, a)) : go(t, c + 4)
        }

        function mo(t, n) {
            const e = ee();
            let i;
            const r = t + _e;
            e.firstCreatePass ? (i = function Cx(t, n) {
                if (n) for (let e = n.length - 1; e >= 0; e--) {
                    const i = n[e];
                    if (t === i.name) return i
                }
            }(n, e.pipeRegistry), e.data[r] = i, i.onDestroy && (e.destroyHooks ?? (e.destroyHooks = [])).push(r, i.onDestroy)) : i = e.data[r];
            const o = i.factory || (i.factory = pi(i.type)), s = $t(g);
            try {
                const a = ms(!1), l = o();
                return ms(a), function g1(t, n, e, i) {
                    e >= t.data.length && (t.data[e] = null, t.blueprint[e] = null), n[e] = i
                }(e, D(), r, l), l
            } finally {
                $t(s)
            }
        }

        function hu(t, n, e, i) {
            const r = t + _e, o = D(), s = Hi(o, r);
            return vo(o, r) ? Zm(o, _t(), n, s.transform, e, i, s) : s.transform(e, i)
        }

        function fu(t, n, e, i, r, o) {
            const s = t + _e, a = D(), l = Hi(a, s);
            return vo(a, s) ? Xm(a, _t(), n, l.transform, e, i, r, o, l) : l.transform(e, i, r, o)
        }

        function vo(t, n) {
            return t[A].data[n].pure
        }

        function pu(t) {
            return n => {
                setTimeout(t, void 0, n)
            }
        }

        const G = class xx extends nn {
            constructor(n = !1) {
                super(), this.__isAsync = n
            }

            emit(n) {
                super.next(n)
            }

            subscribe(n, e, i) {
                let r = n, o = e || (() => null), s = i;
                if (n && "object" == typeof n) {
                    const l = n;
                    r = l.next?.bind(l), o = l.error?.bind(l), s = l.complete?.bind(l)
                }
                this.__isAsync && (o = pu(o), r && (r = pu(r)), s && (s = pu(s)));
                const a = super.subscribe({next: r, error: o, complete: s});
                return n instanceof jt && n.add(a), a
            }
        };

        function Mx() {
            return this._results[Symbol.iterator]()
        }

        class gu {
            get changes() {
                return this._changes || (this._changes = new G)
            }

            constructor(n = !1) {
                this._emitDistinctChangesOnly = n, this.dirty = !0, this._results = [], this._changesDetected = !1, this._changes = null, this.length = 0, this.first = void 0, this.last = void 0;
                const e = gu.prototype;
                e[Symbol.iterator] || (e[Symbol.iterator] = Mx)
            }

            get(n) {
                return this._results[n]
            }

            map(n) {
                return this._results.map(n)
            }

            filter(n) {
                return this._results.filter(n)
            }

            find(n) {
                return this._results.find(n)
            }

            reduce(n, e) {
                return this._results.reduce(n, e)
            }

            forEach(n) {
                this._results.forEach(n)
            }

            some(n) {
                return this._results.some(n)
            }

            toArray() {
                return this._results.slice()
            }

            toString() {
                return this._results.toString()
            }

            reset(n, e) {
                const i = this;
                i.dirty = !1;
                const r = function Wt(t) {
                    return t.flat(Number.POSITIVE_INFINITY)
                }(n);
                (this._changesDetected = !function z0(t, n, e) {
                    if (t.length !== n.length) return !1;
                    for (let i = 0; i < t.length; i++) {
                        let r = t[i], o = n[i];
                        if (e && (r = e(r), o = e(o)), o !== r) return !1
                    }
                    return !0
                }(i._results, r, e)) && (i._results = r, i.length = r.length, i.last = r[this.length - 1], i.first = r[0])
            }

            notifyOnChanges() {
                this._changes && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.emit(this)
            }

            setDirty() {
                this.dirty = !0
            }

            destroy() {
                this.changes.complete(), this.changes.unsubscribe()
            }
        }

        let te = (() => {
            class t {
            }

            return t.__NG_ELEMENT_ID__ = Ix, t
        })();
        const Tx = te, Ox = class extends Tx {
            constructor(n, e, i) {
                super(), this._declarationLView = n, this._declarationTContainer = e, this.elementRef = i
            }

            createEmbeddedView(n, e) {
                const i = this._declarationTContainer.tView,
                    r = Ns(this._declarationLView, i, n, 16, null, i.declTNode, null, null, null, null, e || null);
                r[Br] = this._declarationLView[this._declarationTContainer.index];
                const s = this._declarationLView[yn];
                return null !== s && (r[yn] = s.createEmbeddedView(i)), Nc(i, r, n), new oo(r)
            }
        };

        function Ix() {
            return Js(rt(), D())
        }

        function Js(t, n) {
            return 4 & t.type ? new Ox(n, t, er(t, n)) : null
        }

        let Qt = (() => {
            class t {
            }

            return t.__NG_ELEMENT_ID__ = Ax, t
        })();

        function Ax() {
            return nv(rt(), D())
        }

        const Px = Qt, ev = class extends Px {
            constructor(n, e, i) {
                super(), this._lContainer = n, this._hostTNode = e, this._hostLView = i
            }

            get element() {
                return er(this._hostTNode, this._hostLView)
            }

            get injector() {
                return new zi(this._hostTNode, this._hostLView)
            }

            get parentInjector() {
                const n = jl(this._hostTNode, this._hostLView);
                if (rf(n)) {
                    const e = gs(n, this._hostLView), i = ps(n);
                    return new zi(e[A].data[i + 8], e)
                }
                return new zi(null, this._hostLView)
            }

            clear() {
                for (; this.length > 0;) this.remove(this.length - 1)
            }

            get(n) {
                const e = tv(this._lContainer);
                return null !== e && e[n] || null
            }

            get length() {
                return this._lContainer.length - vt
            }

            createEmbeddedView(n, e, i) {
                let r, o;
                "number" == typeof i ? r = i : null != i && (r = i.index, o = i.injector);
                const s = n.createEmbeddedView(e || {}, o);
                return this.insert(s, r), s
            }

            createComponent(n, e, i, r, o) {
                const s = n && !function qr(t) {
                    return "function" == typeof t
                }(n);
                let a;
                if (s) a = e; else {
                    const d = e || {};
                    a = d.index, i = d.injector, r = d.projectableNodes, o = d.environmentInjector || d.ngModuleRef
                }
                const l = s ? n : new so(le(n)), c = i || this.parentInjector;
                if (!o && null == l.ngModule) {
                    const h = (s ? c : this.parentInjector).get(bi, null);
                    h && (o = h)
                }
                const u = l.create(c, r, void 0, o);
                return this.insert(u.hostView, a), u
            }

            insert(n, e) {
                const i = n._lView, r = i[A];
                if (function p0(t) {
                    return on(t[Ee])
                }(i)) {
                    const u = this.indexOf(n);
                    if (-1 !== u) this.detach(u); else {
                        const d = i[Ee], h = new ev(d, d[lt], d[Ee]);
                        h.detach(h.indexOf(n))
                    }
                }
                const o = this._adjustIndex(e), s = this._lContainer;
                !function PC(t, n, e, i) {
                    const r = vt + i, o = e.length;
                    i > 0 && (e[r - 1][rn] = n), i < o - vt ? (n[rn] = e[r], mf(e, vt + i, n)) : (e.push(n), n[rn] = null), n[Ee] = e;
                    const s = n[Br];
                    null !== s && e !== s && function FC(t, n) {
                        const e = t[Bi];
                        n[ct] !== n[Ee][Ee][ct] && (t[Ah] = !0), null === e ? t[Bi] = [n] : e.push(n)
                    }(s, n);
                    const a = n[yn];
                    null !== a && a.insertView(t), n[q] |= 64
                }(r, i, s, o);
                const a = uc(o, s), l = i[K], c = Ss(l, s[ss]);
                return null !== c && function OC(t, n, e, i, r, o) {
                    i[An] = r, i[lt] = n, Jr(t, i, e, 1, r, o)
                }(r, s[lt], l, i, c, a), n.attachToViewContainerRef(), mf(mu(s), o, n), n
            }

            move(n, e) {
                return this.insert(n, e)
            }

            indexOf(n) {
                const e = tv(this._lContainer);
                return null !== e ? e.indexOf(n) : -1
            }

            remove(n) {
                const e = this._adjustIndex(n, -1), i = ac(this._lContainer, e);
                i && (ys(mu(this._lContainer), e), Hf(i[A], i))
            }

            detach(n) {
                const e = this._adjustIndex(n, -1), i = ac(this._lContainer, e);
                return i && null != ys(mu(this._lContainer), e) ? new oo(i) : null
            }

            _adjustIndex(n, e = 0) {
                return n ?? this.length + e
            }
        };

        function tv(t) {
            return t[as]
        }

        function mu(t) {
            return t[as] || (t[as] = [])
        }

        function nv(t, n) {
            let e;
            const i = n[t.index];
            if (on(i)) e = i; else {
                let r;
                if (8 & t.type) r = it(i); else {
                    const o = n[K];
                    r = o.createComment("");
                    const s = Nt(t, n);
                    _i(o, Ss(o, s), r, function RC(t, n) {
                        return t.nextSibling(n)
                    }(o, s), !1)
                }
                n[t.index] = e = Xp(i, n, r, t), Rs(n, e)
            }
            return new ev(e, t, n)
        }

        class vu {
            constructor(n) {
                this.queryList = n, this.matches = null
            }

            clone() {
                return new vu(this.queryList)
            }

            setDirty() {
                this.queryList.setDirty()
            }
        }

        class _u {
            constructor(n = []) {
                this.queries = n
            }

            createEmbeddedView(n) {
                const e = n.queries;
                if (null !== e) {
                    const i = null !== n.contentQueries ? n.contentQueries[0] : e.length, r = [];
                    for (let o = 0; o < i; o++) {
                        const s = e.getByIndex(o);
                        r.push(this.queries[s.indexInDeclarationView].clone())
                    }
                    return new _u(r)
                }
                return null
            }

            insertView(n) {
                this.dirtyQueriesWithMatches(n)
            }

            detachView(n) {
                this.dirtyQueriesWithMatches(n)
            }

            dirtyQueriesWithMatches(n) {
                for (let e = 0; e < this.queries.length; e++) null !== av(n, e).matches && this.queries[e].setDirty()
            }
        }

        class iv {
            constructor(n, e, i = null) {
                this.predicate = n, this.flags = e, this.read = i
            }
        }

        class yu {
            constructor(n = []) {
                this.queries = n
            }

            elementStart(n, e) {
                for (let i = 0; i < this.queries.length; i++) this.queries[i].elementStart(n, e)
            }

            elementEnd(n) {
                for (let e = 0; e < this.queries.length; e++) this.queries[e].elementEnd(n)
            }

            embeddedTView(n) {
                let e = null;
                for (let i = 0; i < this.length; i++) {
                    const r = null !== e ? e.length : 0, o = this.getByIndex(i).embeddedTView(n, r);
                    o && (o.indexInDeclarationView = i, null !== e ? e.push(o) : e = [o])
                }
                return null !== e ? new yu(e) : null
            }

            template(n, e) {
                for (let i = 0; i < this.queries.length; i++) this.queries[i].template(n, e)
            }

            getByIndex(n) {
                return this.queries[n]
            }

            get length() {
                return this.queries.length
            }

            track(n) {
                this.queries.push(n)
            }
        }

        class bu {
            constructor(n, e = -1) {
                this.metadata = n, this.matches = null, this.indexInDeclarationView = -1, this.crossesNgTemplate = !1, this._appliesToNextNode = !0, this._declarationNodeIndex = e
            }

            elementStart(n, e) {
                this.isApplyingToNode(e) && this.matchTNode(n, e)
            }

            elementEnd(n) {
                this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1)
            }

            template(n, e) {
                this.elementStart(n, e)
            }

            embeddedTView(n, e) {
                return this.isApplyingToNode(n) ? (this.crossesNgTemplate = !0, this.addMatch(-n.index, e), new bu(this.metadata)) : null
            }

            isApplyingToNode(n) {
                if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
                    const e = this._declarationNodeIndex;
                    let i = n.parent;
                    for (; null !== i && 8 & i.type && i.index !== e;) i = i.parent;
                    return e === (null !== i ? i.index : -1)
                }
                return this._appliesToNextNode
            }

            matchTNode(n, e) {
                const i = this.metadata.predicate;
                if (Array.isArray(i)) for (let r = 0; r < i.length; r++) {
                    const o = i[r];
                    this.matchTNodeWithReadOption(n, e, Fx(e, o)), this.matchTNodeWithReadOption(n, e, _s(e, n, o, !1, !1))
                } else i === te ? 4 & e.type && this.matchTNodeWithReadOption(n, e, -1) : this.matchTNodeWithReadOption(n, e, _s(e, n, i, !1, !1))
            }

            matchTNodeWithReadOption(n, e, i) {
                if (null !== i) {
                    const r = this.metadata.read;
                    if (null !== r) if (r === he || r === Qt || r === te && 4 & e.type) this.addMatch(e.index, -2); else {
                        const o = _s(e, n, r, !1, !1);
                        null !== o && this.addMatch(e.index, o)
                    } else this.addMatch(e.index, i)
                }
            }

            addMatch(n, e) {
                null === this.matches ? this.matches = [n, e] : this.matches.push(n, e)
            }
        }

        function Fx(t, n) {
            const e = t.localNames;
            if (null !== e) for (let i = 0; i < e.length; i += 2) if (e[i] === n) return e[i + 1];
            return null
        }

        function Nx(t, n, e, i) {
            return -1 === e ? function kx(t, n) {
                return 11 & t.type ? er(t, n) : 4 & t.type ? Js(t, n) : null
            }(n, t) : -2 === e ? function Lx(t, n, e) {
                return e === he ? er(n, t) : e === te ? Js(n, t) : e === Qt ? nv(n, t) : void 0
            }(t, n, i) : mi(t, t[A], e, n)
        }

        function rv(t, n, e, i) {
            const r = n[yn].queries[i];
            if (null === r.matches) {
                const o = t.data, s = e.matches, a = [];
                for (let l = 0; l < s.length; l += 2) {
                    const c = s[l];
                    a.push(c < 0 ? null : Nx(n, o[c], s[l + 1], e.metadata.read))
                }
                r.matches = a
            }
            return r.matches
        }

        function wu(t, n, e, i) {
            const r = t.queries.getByIndex(e), o = r.matches;
            if (null !== o) {
                const s = rv(t, n, r, e);
                for (let a = 0; a < o.length; a += 2) {
                    const l = o[a];
                    if (l > 0) i.push(s[a / 2]); else {
                        const c = o[a + 1], u = n[-l];
                        for (let d = vt; d < u.length; d++) {
                            const h = u[d];
                            h[Br] === h[Ee] && wu(h[A], h, c, i)
                        }
                        if (null !== u[Bi]) {
                            const d = u[Bi];
                            for (let h = 0; h < d.length; h++) {
                                const f = d[h];
                                wu(f[A], f, c, i)
                            }
                        }
                    }
                }
            }
            return i
        }

        function Z(t) {
            const n = D(), e = ee(), i = qh();
            Pl(i + 1);
            const r = av(e, i);
            if (t.dirty && function f0(t) {
                return 4 == (4 & t[q])
            }(n) === (2 == (2 & r.metadata.flags))) {
                if (null === r.matches) t.reset([]); else {
                    const o = r.crossesNgTemplate ? wu(e, n, i, []) : rv(e, n, r, i);
                    t.reset(o, TD), t.notifyOnChanges()
                }
                return !0
            }
            return !1
        }

        function ye(t, n, e) {
            const i = ee();
            i.firstCreatePass && (sv(i, new iv(t, n, e), -1), 2 == (2 & n) && (i.staticViewQueries = !0)), ov(i, D(), n)
        }

        function ht(t, n, e, i) {
            const r = ee();
            if (r.firstCreatePass) {
                const o = rt();
                sv(r, new iv(n, e, i), o.index), function Vx(t, n) {
                    const e = t.contentQueries || (t.contentQueries = []);
                    n !== (e.length ? e[e.length - 1] : -1) && e.push(t.queries.length - 1, n)
                }(r, t), 2 == (2 & e) && (r.staticContentQueries = !0)
            }
            ov(r, D(), e)
        }

        function Q() {
            return function Rx(t, n) {
                return t[yn].queries[n].queryList
            }(D(), qh())
        }

        function ov(t, n, e) {
            const i = new gu(4 == (4 & e));
            qp(t, n, i, i.destroy), null === n[yn] && (n[yn] = new _u), n[yn].queries.push(new vu(i))
        }

        function sv(t, n, e) {
            null === t.queries && (t.queries = new yu), t.queries.track(new bu(n, e))
        }

        function av(t, n) {
            return t.queries.getByIndex(n)
        }

        function ft(t, n) {
            return Js(t, n)
        }

        function ta(...t) {
        }

        const xv = new L("Application Initializer");
        let na = (() => {
            class t {
                constructor(e) {
                    this.appInits = e, this.resolve = ta, this.reject = ta, this.initialized = !1, this.done = !1, this.donePromise = new Promise((i, r) => {
                        this.resolve = i, this.reject = r
                    })
                }

                runInitializers() {
                    if (this.initialized) return;
                    const e = [], i = () => {
                        this.done = !0, this.resolve()
                    };
                    if (this.appInits) for (let r = 0; r < this.appInits.length; r++) {
                        const o = this.appInits[r]();
                        if (zs(o)) e.push(o); else if (yg(o)) {
                            const s = new Promise((a, l) => {
                                o.subscribe({complete: a, error: l})
                            });
                            e.push(s)
                        }
                    }
                    Promise.all(e).then(() => {
                        i()
                    }).catch(r => {
                        this.reject(r)
                    }), 0 === e.length && i(), this.initialized = !0
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(xv, 8))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })();
        const yo = new L("AppId", {
            providedIn: "root", factory: function Mv() {
                return `${xu()}${xu()}${xu()}`
            }
        });

        function xu() {
            return String.fromCharCode(97 + Math.floor(25 * Math.random()))
        }

        const Tv = new L("Platform Initializer"),
            Mu = new L("Platform ID", {providedIn: "platform", factory: () => "unknown"}), xn = new L("LocaleId", {
                providedIn: "root",
                factory: () => Ni(xn, j.Optional | j.SkipSelf) || function rM() {
                    return typeof $localize < "u" && $localize.locale || mr
                }()
            }), oM = new L("DefaultCurrencyCode", {providedIn: "root", factory: () => "USD"}),
            cM = (() => Promise.resolve(0))();

        function Tu(t) {
            typeof Zone > "u" ? cM.then(() => {
                t && t.apply(null, null)
            }) : Zone.current.scheduleMicroTask("scheduleMicrotask", t)
        }

        class Ge {
            constructor({
                            enableLongStackTrace: n = !1,
                            shouldCoalesceEventChangeDetection: e = !1,
                            shouldCoalesceRunChangeDetection: i = !1
                        }) {
                if (this.hasPendingMacrotasks = !1, this.hasPendingMicrotasks = !1, this.isStable = !0, this.onUnstable = new G(!1), this.onMicrotaskEmpty = new G(!1), this.onStable = new G(!1), this.onError = new G(!1), typeof Zone > "u") throw new M(908, !1);
                Zone.assertZonePatched();
                const r = this;
                r._nesting = 0, r._outer = r._inner = Zone.current, Zone.TaskTrackingZoneSpec && (r._inner = r._inner.fork(new Zone.TaskTrackingZoneSpec)), n && Zone.longStackTraceZoneSpec && (r._inner = r._inner.fork(Zone.longStackTraceZoneSpec)), r.shouldCoalesceEventChangeDetection = !i && e, r.shouldCoalesceRunChangeDetection = i, r.lastRequestAnimationFrameId = -1, r.nativeRequestAnimationFrame = function uM() {
                    let t = ve.requestAnimationFrame, n = ve.cancelAnimationFrame;
                    if (typeof Zone < "u" && t && n) {
                        const e = t[Zone.__symbol__("OriginalDelegate")];
                        e && (t = e);
                        const i = n[Zone.__symbol__("OriginalDelegate")];
                        i && (n = i)
                    }
                    return {nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n}
                }().nativeRequestAnimationFrame, function fM(t) {
                    const n = () => {
                        !function hM(t) {
                            t.isCheckStableRunning || -1 !== t.lastRequestAnimationFrameId || (t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(ve, () => {
                                t.fakeTopEventTask || (t.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
                                    t.lastRequestAnimationFrameId = -1, Iu(t), t.isCheckStableRunning = !0, Ou(t), t.isCheckStableRunning = !1
                                }, void 0, () => {
                                }, () => {
                                })), t.fakeTopEventTask.invoke()
                            }), Iu(t))
                        }(t)
                    };
                    t._inner = t._inner.fork({
                        name: "angular",
                        properties: {isAngularZone: !0},
                        onInvokeTask: (e, i, r, o, s, a) => {
                            try {
                                return Av(t), e.invokeTask(r, o, s, a)
                            } finally {
                                (t.shouldCoalesceEventChangeDetection && "eventTask" === o.type || t.shouldCoalesceRunChangeDetection) && n(), Pv(t)
                            }
                        },
                        onInvoke: (e, i, r, o, s, a, l) => {
                            try {
                                return Av(t), e.invoke(r, o, s, a, l)
                            } finally {
                                t.shouldCoalesceRunChangeDetection && n(), Pv(t)
                            }
                        },
                        onHasTask: (e, i, r, o) => {
                            e.hasTask(r, o), i === r && ("microTask" == o.change ? (t._hasPendingMicrotasks = o.microTask, Iu(t), Ou(t)) : "macroTask" == o.change && (t.hasPendingMacrotasks = o.macroTask))
                        },
                        onHandleError: (e, i, r, o) => (e.handleError(r, o), t.runOutsideAngular(() => t.onError.emit(o)), !1)
                    })
                }(r)
            }

            static isInAngularZone() {
                return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone")
            }

            static assertInAngularZone() {
                if (!Ge.isInAngularZone()) throw new M(909, !1)
            }

            static assertNotInAngularZone() {
                if (Ge.isInAngularZone()) throw new M(909, !1)
            }

            run(n, e, i) {
                return this._inner.run(n, e, i)
            }

            runTask(n, e, i, r) {
                const o = this._inner, s = o.scheduleEventTask("NgZoneEvent: " + r, n, dM, ta, ta);
                try {
                    return o.runTask(s, e, i)
                } finally {
                    o.cancelTask(s)
                }
            }

            runGuarded(n, e, i) {
                return this._inner.runGuarded(n, e, i)
            }

            runOutsideAngular(n) {
                return this._outer.run(n)
            }
        }

        const dM = {};

        function Ou(t) {
            if (0 == t._nesting && !t.hasPendingMicrotasks && !t.isStable) try {
                t._nesting++, t.onMicrotaskEmpty.emit(null)
            } finally {
                if (t._nesting--, !t.hasPendingMicrotasks) try {
                    t.runOutsideAngular(() => t.onStable.emit(null))
                } finally {
                    t.isStable = !0
                }
            }
        }

        function Iu(t) {
            t.hasPendingMicrotasks = !!(t._hasPendingMicrotasks || (t.shouldCoalesceEventChangeDetection || t.shouldCoalesceRunChangeDetection) && -1 !== t.lastRequestAnimationFrameId)
        }

        function Av(t) {
            t._nesting++, t.isStable && (t.isStable = !1, t.onUnstable.emit(null))
        }

        function Pv(t) {
            t._nesting--, Ou(t)
        }

        class pM {
            constructor() {
                this.hasPendingMicrotasks = !1, this.hasPendingMacrotasks = !1, this.isStable = !0, this.onUnstable = new G, this.onMicrotaskEmpty = new G, this.onStable = new G, this.onError = new G
            }

            run(n, e, i) {
                return n.apply(e, i)
            }

            runGuarded(n, e, i) {
                return n.apply(e, i)
            }

            runOutsideAngular(n) {
                return n()
            }

            runTask(n, e, i, r) {
                return n.apply(e, i)
            }
        }

        const Fv = new L(""), ia = new L("");
        let Fu, Au = (() => {
            class t {
                constructor(e, i, r) {
                    this._ngZone = e, this.registry = i, this._pendingCount = 0, this._isZoneStable = !0, this._didWork = !1, this._callbacks = [], this.taskTrackingZone = null, Fu || (function gM(t) {
                        Fu = t
                    }(r), r.addToWindow(i)), this._watchAngularEvents(), e.run(() => {
                        this.taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone")
                    })
                }

                _watchAngularEvents() {
                    this._ngZone.onUnstable.subscribe({
                        next: () => {
                            this._didWork = !0, this._isZoneStable = !1
                        }
                    }), this._ngZone.runOutsideAngular(() => {
                        this._ngZone.onStable.subscribe({
                            next: () => {
                                Ge.assertNotInAngularZone(), Tu(() => {
                                    this._isZoneStable = !0, this._runCallbacksIfReady()
                                })
                            }
                        })
                    })
                }

                increasePendingRequestCount() {
                    return this._pendingCount += 1, this._didWork = !0, this._pendingCount
                }

                decreasePendingRequestCount() {
                    if (this._pendingCount -= 1, this._pendingCount < 0) throw new Error("pending async requests below zero");
                    return this._runCallbacksIfReady(), this._pendingCount
                }

                isStable() {
                    return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
                }

                _runCallbacksIfReady() {
                    if (this.isStable()) Tu(() => {
                        for (; 0 !== this._callbacks.length;) {
                            let e = this._callbacks.pop();
                            clearTimeout(e.timeoutId), e.doneCb(this._didWork)
                        }
                        this._didWork = !1
                    }); else {
                        let e = this.getPendingTasks();
                        this._callbacks = this._callbacks.filter(i => !i.updateCb || !i.updateCb(e) || (clearTimeout(i.timeoutId), !1)), this._didWork = !0
                    }
                }

                getPendingTasks() {
                    return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(e => ({
                        source: e.source,
                        creationLocation: e.creationLocation,
                        data: e.data
                    })) : []
                }

                addCallback(e, i, r) {
                    let o = -1;
                    i && i > 0 && (o = setTimeout(() => {
                        this._callbacks = this._callbacks.filter(s => s.timeoutId !== o), e(this._didWork, this.getPendingTasks())
                    }, i)), this._callbacks.push({doneCb: e, timeoutId: o, updateCb: r})
                }

                whenStable(e, i, r) {
                    if (r && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
                    this.addCallback(e, i, r), this._runCallbacksIfReady()
                }

                getPendingRequestCount() {
                    return this._pendingCount
                }

                registerApplication(e) {
                    this.registry.registerApplication(e, this)
                }

                unregisterApplication(e) {
                    this.registry.unregisterApplication(e)
                }

                findProviders(e, i, r) {
                    return []
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Ge), W(Pu), W(ia))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })(), Pu = (() => {
            class t {
                constructor() {
                    this._applications = new Map
                }

                registerApplication(e, i) {
                    this._applications.set(e, i)
                }

                unregisterApplication(e) {
                    this._applications.delete(e)
                }

                unregisterAllApplications() {
                    this._applications.clear()
                }

                getTestability(e) {
                    return this._applications.get(e) || null
                }

                getAllTestabilities() {
                    return Array.from(this._applications.values())
                }

                getAllRootElements() {
                    return Array.from(this._applications.keys())
                }

                findTestabilityInTree(e, i = !0) {
                    return Fu?.findTestabilityInTree(this, e, i) ?? null
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "platform"}), t
        })();
        const Vn = !1;
        let Qn = null;
        const kv = new L("AllowMultipleToken"), ku = new L("PlatformDestroyListeners"),
            mM = new L("appBootstrapListener");

        function Lv(t, n, e = []) {
            const i = `Platform: ${n}`, r = new L(i);
            return (o = []) => {
                let s = Nu();
                if (!s || s.injector.get(kv, !1)) {
                    const a = [...e, ...o, {provide: r, useValue: !0}];
                    t ? t(a) : function yM(t) {
                        if (Qn && !Qn.get(kv, !1)) throw new M(400, !1);
                        Qn = t;
                        const n = t.get(Vv);
                        (function Nv(t) {
                            const n = t.get(Tv, null);
                            n && n.forEach(e => e())
                        })(t)
                    }(function Rv(t = [], n) {
                        return Ln.create({
                            name: n,
                            providers: [{provide: Dc, useValue: "platform"}, {
                                provide: ku,
                                useValue: new Set([() => Qn = null])
                            }, ...t]
                        })
                    }(a, i))
                }
                return function wM(t) {
                    const n = Nu();
                    if (!n) throw new M(401, !1);
                    return n
                }()
            }
        }

        function Nu() {
            return Qn?.get(Vv) ?? null
        }

        let Vv = (() => {
            class t {
                constructor(e) {
                    this._injector = e, this._modules = [], this._destroyListeners = [], this._destroyed = !1
                }

                bootstrapModuleFactory(e, i) {
                    const r = function Hv(t, n) {
                        let e;
                        return e = "noop" === t ? new pM : ("zone.js" === t ? void 0 : t) || new Ge(n), e
                    }(i?.ngZone, function Bv(t) {
                        return {
                            enableLongStackTrace: !1,
                            shouldCoalesceEventChangeDetection: !(!t || !t.ngZoneEventCoalescing) || !1,
                            shouldCoalesceRunChangeDetection: !(!t || !t.ngZoneRunCoalescing) || !1
                        }
                    }(i)), o = [{provide: Ge, useValue: r}];
                    return r.run(() => {
                        const s = Ln.create({providers: o, parent: this.injector, name: e.moduleType.name}),
                            a = e.create(s), l = a.injector.get(tr, null);
                        if (!l) throw new M(402, !1);
                        return r.runOutsideAngular(() => {
                            const c = r.onError.subscribe({
                                next: u => {
                                    l.handleError(u)
                                }
                            });
                            a.onDestroy(() => {
                                oa(this._modules, a), c.unsubscribe()
                            })
                        }), function jv(t, n, e) {
                            try {
                                const i = e();
                                return zs(i) ? i.catch(r => {
                                    throw n.runOutsideAngular(() => t.handleError(r)), r
                                }) : i
                            } catch (i) {
                                throw n.runOutsideAngular(() => t.handleError(i)), i
                            }
                        }(l, r, () => {
                            const c = a.injector.get(na);
                            return c.runInitializers(), c.donePromise.then(() => (function gm(t) {
                                Ut(t, "Expected localeId to be defined"), "string" == typeof t && (pm = t.toLowerCase().replace(/_/g, "-"))
                            }(a.injector.get(xn, mr) || mr), this._moduleDoBootstrap(a), a))
                        })
                    })
                }

                bootstrapModule(e, i = []) {
                    const r = Uv({}, i);
                    return function vM(t, n, e) {
                        const i = new au(e);
                        return Promise.resolve(i)
                    }(0, 0, e).then(o => this.bootstrapModuleFactory(o, r))
                }

                _moduleDoBootstrap(e) {
                    const i = e.injector.get(ra);
                    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach(r => i.bootstrap(r)); else {
                        if (!e.instance.ngDoBootstrap) throw new M(-403, !1);
                        e.instance.ngDoBootstrap(i)
                    }
                    this._modules.push(e)
                }

                onDestroy(e) {
                    this._destroyListeners.push(e)
                }

                get injector() {
                    return this._injector
                }

                destroy() {
                    if (this._destroyed) throw new M(404, !1);
                    this._modules.slice().forEach(i => i.destroy()), this._destroyListeners.forEach(i => i());
                    const e = this._injector.get(ku, null);
                    e && (e.forEach(i => i()), e.clear()), this._destroyed = !0
                }

                get destroyed() {
                    return this._destroyed
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Ln))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "platform"}), t
        })();

        function Uv(t, n) {
            return Array.isArray(n) ? n.reduce(Uv, t) : {...t, ...n}
        }

        let ra = (() => {
            class t {
                get destroyed() {
                    return this._destroyed
                }

                get injector() {
                    return this._injector
                }

                constructor(e, i, r) {
                    this._zone = e, this._injector = i, this._exceptionHandler = r, this._bootstrapListeners = [], this._views = [], this._runningTick = !1, this._stable = !0, this._destroyed = !1, this._destroyListeners = [], this.componentTypes = [], this.components = [], this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this._zone.run(() => {
                                this.tick()
                            })
                        }
                    });
                    const o = new Re(a => {
                        this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks, this._zone.runOutsideAngular(() => {
                            a.next(this._stable), a.complete()
                        })
                    }), s = new Re(a => {
                        let l;
                        this._zone.runOutsideAngular(() => {
                            l = this._zone.onStable.subscribe(() => {
                                Ge.assertNotInAngularZone(), Tu(() => {
                                    !this._stable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks && (this._stable = !0, a.next(!0))
                                })
                            })
                        });
                        const c = this._zone.onUnstable.subscribe(() => {
                            Ge.assertInAngularZone(), this._stable && (this._stable = !1, this._zone.runOutsideAngular(() => {
                                a.next(!1)
                            }))
                        });
                        return () => {
                            l.unsubscribe(), c.unsubscribe()
                        }
                    });
                    this.isStable = Pr(o, s.pipe(dl()))
                }

                bootstrap(e, i) {
                    const r = e instanceof Cp;
                    if (!this._injector.get(na).done) {
                        !r && function Rr(t) {
                            const n = le(t) || at(t) || St(t);
                            return null !== n && n.standalone
                        }(e);
                        throw new M(405, Vn)
                    }
                    let s;
                    s = r ? e : this._injector.get(io).resolveComponentFactory(e), this.componentTypes.push(s.componentType);
                    const a = function _M(t) {
                            return t.isBoundToModule
                        }(s) ? void 0 : this._injector.get(vr), c = s.create(Ln.NULL, [], i || s.selector, a),
                        u = c.location.nativeElement, d = c.injector.get(Fv, null);
                    return d?.registerApplication(u), c.onDestroy(() => {
                        this.detachView(c.hostView), oa(this.components, c), d?.unregisterApplication(u)
                    }), this._loadComponent(c), c
                }

                tick() {
                    if (this._runningTick) throw new M(101, !1);
                    try {
                        this._runningTick = !0;
                        for (let e of this._views) e.detectChanges()
                    } catch (e) {
                        this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(e))
                    } finally {
                        this._runningTick = !1
                    }
                }

                attachView(e) {
                    const i = e;
                    this._views.push(i), i.attachToAppRef(this)
                }

                detachView(e) {
                    const i = e;
                    oa(this._views, i), i.detachFromAppRef()
                }

                _loadComponent(e) {
                    this.attachView(e.hostView), this.tick(), this.components.push(e);
                    const i = this._injector.get(mM, []);
                    i.push(...this._bootstrapListeners), i.forEach(r => r(e))
                }

                ngOnDestroy() {
                    if (!this._destroyed) try {
                        this._destroyListeners.forEach(e => e()), this._views.slice().forEach(e => e.destroy()), this._onMicrotaskEmptySubscription.unsubscribe()
                    } finally {
                        this._destroyed = !0, this._views = [], this._bootstrapListeners = [], this._destroyListeners = []
                    }
                }

                onDestroy(e) {
                    return this._destroyListeners.push(e), () => oa(this._destroyListeners, e)
                }

                destroy() {
                    if (this._destroyed) throw new M(406, !1);
                    const e = this._injector;
                    e.destroy && !e.destroyed && e.destroy()
                }

                get viewCount() {
                    return this._views.length
                }

                warnIfDestroyed() {
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Ge), W(bi), W(tr))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })();

        function oa(t, n) {
            const e = t.indexOf(n);
            e > -1 && t.splice(e, 1)
        }

        let Xn = (() => {
            class t {
            }

            return t.__NG_ELEMENT_ID__ = DM, t
        })();

        function DM(t) {
            return function EM(t, n, e) {
                if (jr(t) && !e) {
                    const i = xt(t.index, n);
                    return new oo(i, i)
                }
                return 47 & t.type ? new oo(n[ct], n) : null
            }(rt(), D(), 16 == (16 & t))
        }

        class qv {
            constructor() {
            }

            supports(n) {
                return Us(n)
            }

            create(n) {
                return new IM(n)
            }
        }

        const OM = (t, n) => n;

        class IM {
            constructor(n) {
                this.length = 0, this._linkedRecords = null, this._unlinkedRecords = null, this._previousItHead = null, this._itHead = null, this._itTail = null, this._additionsHead = null, this._additionsTail = null, this._movesHead = null, this._movesTail = null, this._removalsHead = null, this._removalsTail = null, this._identityChangesHead = null, this._identityChangesTail = null, this._trackByFn = n || OM
            }

            forEachItem(n) {
                let e;
                for (e = this._itHead; null !== e; e = e._next) n(e)
            }

            forEachOperation(n) {
                let e = this._itHead, i = this._removalsHead, r = 0, o = null;
                for (; e || i;) {
                    const s = !i || e && e.currentIndex < Kv(i, r, o) ? e : i, a = Kv(s, r, o), l = s.currentIndex;
                    if (s === i) r--, i = i._nextRemoved; else if (e = e._next, null == s.previousIndex) r++; else {
                        o || (o = []);
                        const c = a - r, u = l - r;
                        if (c != u) {
                            for (let h = 0; h < c; h++) {
                                const f = h < o.length ? o[h] : o[h] = 0, p = f + h;
                                u <= p && p < c && (o[h] = f + 1)
                            }
                            o[s.previousIndex] = u - c
                        }
                    }
                    a !== l && n(s, a, l)
                }
            }

            forEachPreviousItem(n) {
                let e;
                for (e = this._previousItHead; null !== e; e = e._nextPrevious) n(e)
            }

            forEachAddedItem(n) {
                let e;
                for (e = this._additionsHead; null !== e; e = e._nextAdded) n(e)
            }

            forEachMovedItem(n) {
                let e;
                for (e = this._movesHead; null !== e; e = e._nextMoved) n(e)
            }

            forEachRemovedItem(n) {
                let e;
                for (e = this._removalsHead; null !== e; e = e._nextRemoved) n(e)
            }

            forEachIdentityChange(n) {
                let e;
                for (e = this._identityChangesHead; null !== e; e = e._nextIdentityChange) n(e)
            }

            diff(n) {
                if (null == n && (n = []), !Us(n)) throw new M(900, !1);
                return this.check(n) ? this : null
            }

            onDestroy() {
            }

            check(n) {
                this._reset();
                let r, o, s, e = this._itHead, i = !1;
                if (Array.isArray(n)) {
                    this.length = n.length;
                    for (let a = 0; a < this.length; a++) o = n[a], s = this._trackByFn(a, o), null !== e && Object.is(e.trackById, s) ? (i && (e = this._verifyReinsertion(e, o, s, a)), Object.is(e.item, o) || this._addIdentityChange(e, o)) : (e = this._mismatch(e, o, s, a), i = !0), e = e._next
                } else r = 0, function d1(t, n) {
                    if (Array.isArray(t)) for (let e = 0; e < t.length; e++) n(t[e]); else {
                        const e = t[Symbol.iterator]();
                        let i;
                        for (; !(i = e.next()).done;) n(i.value)
                    }
                }(n, a => {
                    s = this._trackByFn(r, a), null !== e && Object.is(e.trackById, s) ? (i && (e = this._verifyReinsertion(e, a, s, r)), Object.is(e.item, a) || this._addIdentityChange(e, a)) : (e = this._mismatch(e, a, s, r), i = !0), e = e._next, r++
                }), this.length = r;
                return this._truncate(e), this.collection = n, this.isDirty
            }

            get isDirty() {
                return null !== this._additionsHead || null !== this._movesHead || null !== this._removalsHead || null !== this._identityChangesHead
            }

            _reset() {
                if (this.isDirty) {
                    let n;
                    for (n = this._previousItHead = this._itHead; null !== n; n = n._next) n._nextPrevious = n._next;
                    for (n = this._additionsHead; null !== n; n = n._nextAdded) n.previousIndex = n.currentIndex;
                    for (this._additionsHead = this._additionsTail = null, n = this._movesHead; null !== n; n = n._nextMoved) n.previousIndex = n.currentIndex;
                    this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
                }
            }

            _mismatch(n, e, i, r) {
                let o;
                return null === n ? o = this._itTail : (o = n._prev, this._remove(n)), null !== (n = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(i, null)) ? (Object.is(n.item, e) || this._addIdentityChange(n, e), this._reinsertAfter(n, o, r)) : null !== (n = null === this._linkedRecords ? null : this._linkedRecords.get(i, r)) ? (Object.is(n.item, e) || this._addIdentityChange(n, e), this._moveAfter(n, o, r)) : n = this._addAfter(new AM(e, i), o, r), n
            }

            _verifyReinsertion(n, e, i, r) {
                let o = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(i, null);
                return null !== o ? n = this._reinsertAfter(o, n._prev, r) : n.currentIndex != r && (n.currentIndex = r, this._addToMoves(n, r)), n
            }

            _truncate(n) {
                for (; null !== n;) {
                    const e = n._next;
                    this._addToRemovals(this._unlink(n)), n = e
                }
                null !== this._unlinkedRecords && this._unlinkedRecords.clear(), null !== this._additionsTail && (this._additionsTail._nextAdded = null), null !== this._movesTail && (this._movesTail._nextMoved = null), null !== this._itTail && (this._itTail._next = null), null !== this._removalsTail && (this._removalsTail._nextRemoved = null), null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null)
            }

            _reinsertAfter(n, e, i) {
                null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
                const r = n._prevRemoved, o = n._nextRemoved;
                return null === r ? this._removalsHead = o : r._nextRemoved = o, null === o ? this._removalsTail = r : o._prevRemoved = r, this._insertAfter(n, e, i), this._addToMoves(n, i), n
            }

            _moveAfter(n, e, i) {
                return this._unlink(n), this._insertAfter(n, e, i), this._addToMoves(n, i), n
            }

            _addAfter(n, e, i) {
                return this._insertAfter(n, e, i), this._additionsTail = null === this._additionsTail ? this._additionsHead = n : this._additionsTail._nextAdded = n, n
            }

            _insertAfter(n, e, i) {
                const r = null === e ? this._itHead : e._next;
                return n._next = r, n._prev = e, null === r ? this._itTail = n : r._prev = n, null === e ? this._itHead = n : e._next = n, null === this._linkedRecords && (this._linkedRecords = new Yv), this._linkedRecords.put(n), n.currentIndex = i, n
            }

            _remove(n) {
                return this._addToRemovals(this._unlink(n))
            }

            _unlink(n) {
                null !== this._linkedRecords && this._linkedRecords.remove(n);
                const e = n._prev, i = n._next;
                return null === e ? this._itHead = i : e._next = i, null === i ? this._itTail = e : i._prev = e, n
            }

            _addToMoves(n, e) {
                return n.previousIndex === e || (this._movesTail = null === this._movesTail ? this._movesHead = n : this._movesTail._nextMoved = n), n
            }

            _addToRemovals(n) {
                return null === this._unlinkedRecords && (this._unlinkedRecords = new Yv), this._unlinkedRecords.put(n), n.currentIndex = null, n._nextRemoved = null, null === this._removalsTail ? (this._removalsTail = this._removalsHead = n, n._prevRemoved = null) : (n._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = n), n
            }

            _addIdentityChange(n, e) {
                return n.item = e, this._identityChangesTail = null === this._identityChangesTail ? this._identityChangesHead = n : this._identityChangesTail._nextIdentityChange = n, n
            }
        }

        class AM {
            constructor(n, e) {
                this.item = n, this.trackById = e, this.currentIndex = null, this.previousIndex = null, this._nextPrevious = null, this._prev = null, this._next = null, this._prevDup = null, this._nextDup = null, this._prevRemoved = null, this._nextRemoved = null, this._nextAdded = null, this._nextMoved = null, this._nextIdentityChange = null
            }
        }

        class PM {
            constructor() {
                this._head = null, this._tail = null
            }

            add(n) {
                null === this._head ? (this._head = this._tail = n, n._nextDup = null, n._prevDup = null) : (this._tail._nextDup = n, n._prevDup = this._tail, n._nextDup = null, this._tail = n)
            }

            get(n, e) {
                let i;
                for (i = this._head; null !== i; i = i._nextDup) if ((null === e || e <= i.currentIndex) && Object.is(i.trackById, n)) return i;
                return null
            }

            remove(n) {
                const e = n._prevDup, i = n._nextDup;
                return null === e ? this._head = i : e._nextDup = i, null === i ? this._tail = e : i._prevDup = e, null === this._head
            }
        }

        class Yv {
            constructor() {
                this.map = new Map
            }

            put(n) {
                const e = n.trackById;
                let i = this.map.get(e);
                i || (i = new PM, this.map.set(e, i)), i.add(n)
            }

            get(n, e) {
                const r = this.map.get(n);
                return r ? r.get(n, e) : null
            }

            remove(n) {
                const e = n.trackById;
                return this.map.get(e).remove(n) && this.map.delete(e), n
            }

            get isEmpty() {
                return 0 === this.map.size
            }

            clear() {
                this.map.clear()
            }
        }

        function Kv(t, n, e) {
            const i = t.previousIndex;
            if (null === i) return i;
            let r = 0;
            return e && i < e.length && (r = e[i]), i + n + r
        }

        class Zv {
            constructor() {
            }

            supports(n) {
                return n instanceof Map || qc(n)
            }

            create() {
                return new FM
            }
        }

        class FM {
            constructor() {
                this._records = new Map, this._mapHead = null, this._appendAfter = null, this._previousMapHead = null, this._changesHead = null, this._changesTail = null, this._additionsHead = null, this._additionsTail = null, this._removalsHead = null, this._removalsTail = null
            }

            get isDirty() {
                return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead
            }

            forEachItem(n) {
                let e;
                for (e = this._mapHead; null !== e; e = e._next) n(e)
            }

            forEachPreviousItem(n) {
                let e;
                for (e = this._previousMapHead; null !== e; e = e._nextPrevious) n(e)
            }

            forEachChangedItem(n) {
                let e;
                for (e = this._changesHead; null !== e; e = e._nextChanged) n(e)
            }

            forEachAddedItem(n) {
                let e;
                for (e = this._additionsHead; null !== e; e = e._nextAdded) n(e)
            }

            forEachRemovedItem(n) {
                let e;
                for (e = this._removalsHead; null !== e; e = e._nextRemoved) n(e)
            }

            diff(n) {
                if (n) {
                    if (!(n instanceof Map || qc(n))) throw new M(900, !1)
                } else n = new Map;
                return this.check(n) ? this : null
            }

            onDestroy() {
            }

            check(n) {
                this._reset();
                let e = this._mapHead;
                if (this._appendAfter = null, this._forEach(n, (i, r) => {
                    if (e && e.key === r) this._maybeAddToChanges(e, i), this._appendAfter = e, e = e._next; else {
                        const o = this._getOrCreateRecordForKey(r, i);
                        e = this._insertBeforeOrAppend(e, o)
                    }
                }), e) {
                    e._prev && (e._prev._next = null), this._removalsHead = e;
                    for (let i = e; null !== i; i = i._nextRemoved) i === this._mapHead && (this._mapHead = null), this._records.delete(i.key), i._nextRemoved = i._next, i.previousValue = i.currentValue, i.currentValue = null, i._prev = null, i._next = null
                }
                return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty
            }

            _insertBeforeOrAppend(n, e) {
                if (n) {
                    const i = n._prev;
                    return e._next = n, e._prev = i, n._prev = e, i && (i._next = e), n === this._mapHead && (this._mapHead = e), this._appendAfter = n, n
                }
                return this._appendAfter ? (this._appendAfter._next = e, e._prev = this._appendAfter) : this._mapHead = e, this._appendAfter = e, null
            }

            _getOrCreateRecordForKey(n, e) {
                if (this._records.has(n)) {
                    const r = this._records.get(n);
                    this._maybeAddToChanges(r, e);
                    const o = r._prev, s = r._next;
                    return o && (o._next = s), s && (s._prev = o), r._next = null, r._prev = null, r
                }
                const i = new kM(n);
                return this._records.set(n, i), i.currentValue = e, this._addToAdditions(i), i
            }

            _reset() {
                if (this.isDirty) {
                    let n;
                    for (this._previousMapHead = this._mapHead, n = this._previousMapHead; null !== n; n = n._next) n._nextPrevious = n._next;
                    for (n = this._changesHead; null !== n; n = n._nextChanged) n.previousValue = n.currentValue;
                    for (n = this._additionsHead; null != n; n = n._nextAdded) n.previousValue = n.currentValue;
                    this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null
                }
            }

            _maybeAddToChanges(n, e) {
                Object.is(e, n.currentValue) || (n.previousValue = n.currentValue, n.currentValue = e, this._addToChanges(n))
            }

            _addToAdditions(n) {
                null === this._additionsHead ? this._additionsHead = this._additionsTail = n : (this._additionsTail._nextAdded = n, this._additionsTail = n)
            }

            _addToChanges(n) {
                null === this._changesHead ? this._changesHead = this._changesTail = n : (this._changesTail._nextChanged = n, this._changesTail = n)
            }

            _forEach(n, e) {
                n instanceof Map ? n.forEach(e) : Object.keys(n).forEach(i => e(n[i], i))
            }
        }

        class kM {
            constructor(n) {
                this.key = n, this.previousValue = null, this.currentValue = null, this._nextPrevious = null, this._next = null, this._prev = null, this._nextAdded = null, this._nextRemoved = null, this._nextChanged = null
            }
        }

        function Qv() {
            return new la([new qv])
        }

        let la = (() => {
            class t {
                constructor(e) {
                    this.factories = e
                }

                static create(e, i) {
                    if (null != i) {
                        const r = i.factories.slice();
                        e = e.concat(r)
                    }
                    return new t(e)
                }

                static extend(e) {
                    return {provide: t, useFactory: i => t.create(e, i || Qv()), deps: [[t, new Cs, new ws]]}
                }

                find(e) {
                    const i = this.factories.find(r => r.supports(e));
                    if (null != i) return i;
                    throw new M(901, !1)
                }
            }

            return t.\u0275prov = X({token: t, providedIn: "root", factory: Qv}), t
        })();

        function Xv() {
            return new bo([new Zv])
        }

        let bo = (() => {
            class t {
                constructor(e) {
                    this.factories = e
                }

                static create(e, i) {
                    if (i) {
                        const r = i.factories.slice();
                        e = e.concat(r)
                    }
                    return new t(e)
                }

                static extend(e) {
                    return {provide: t, useFactory: i => t.create(e, i || Xv()), deps: [[t, new Cs, new ws]]}
                }

                find(e) {
                    const i = this.factories.find(r => r.supports(e));
                    if (i) return i;
                    throw new M(901, !1)
                }
            }

            return t.\u0275prov = X({token: t, providedIn: "root", factory: Xv}), t
        })();
        const RM = Lv(null, "core", []);
        let VM = (() => {
            class t {
                constructor(e) {
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(ra))
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({}), t
        })(), ju = null;

        function br() {
            return ju
        }

        class jM {
        }

        const Xt = new L("DocumentToken"), e_ = {
            ADP: [void 0, void 0, 0],
            AFN: [void 0, "\u060b", 0],
            ALL: [void 0, void 0, 0],
            AMD: [void 0, "\u058f", 2],
            AOA: [void 0, "Kz"],
            ARS: [void 0, "$"],
            AUD: ["A$", "$"],
            AZN: [void 0, "\u20bc"],
            BAM: [void 0, "KM"],
            BBD: [void 0, "$"],
            BDT: [void 0, "\u09f3"],
            BHD: [void 0, void 0, 3],
            BIF: [void 0, void 0, 0],
            BMD: [void 0, "$"],
            BND: [void 0, "$"],
            BOB: [void 0, "Bs"],
            BRL: ["R$"],
            BSD: [void 0, "$"],
            BWP: [void 0, "P"],
            BYN: [void 0, void 0, 2],
            BYR: [void 0, void 0, 0],
            BZD: [void 0, "$"],
            CAD: ["CA$", "$", 2],
            CHF: [void 0, void 0, 2],
            CLF: [void 0, void 0, 4],
            CLP: [void 0, "$", 0],
            CNY: ["CN\xa5", "\xa5"],
            COP: [void 0, "$", 2],
            CRC: [void 0, "\u20a1", 2],
            CUC: [void 0, "$"],
            CUP: [void 0, "$"],
            CZK: [void 0, "K\u010d", 2],
            DJF: [void 0, void 0, 0],
            DKK: [void 0, "kr", 2],
            DOP: [void 0, "$"],
            EGP: [void 0, "E\xa3"],
            ESP: [void 0, "\u20a7", 0],
            EUR: ["\u20ac"],
            FJD: [void 0, "$"],
            FKP: [void 0, "\xa3"],
            GBP: ["\xa3"],
            GEL: [void 0, "\u20be"],
            GHS: [void 0, "GH\u20b5"],
            GIP: [void 0, "\xa3"],
            GNF: [void 0, "FG", 0],
            GTQ: [void 0, "Q"],
            GYD: [void 0, "$", 2],
            HKD: ["HK$", "$"],
            HNL: [void 0, "L"],
            HRK: [void 0, "kn"],
            HUF: [void 0, "Ft", 2],
            IDR: [void 0, "Rp", 2],
            ILS: ["\u20aa"],
            INR: ["\u20b9"],
            IQD: [void 0, void 0, 0],
            IRR: [void 0, void 0, 0],
            ISK: [void 0, "kr", 0],
            ITL: [void 0, void 0, 0],
            JMD: [void 0, "$"],
            JOD: [void 0, void 0, 3],
            JPY: ["\xa5", void 0, 0],
            KHR: [void 0, "\u17db"],
            KMF: [void 0, "CF", 0],
            KPW: [void 0, "\u20a9", 0],
            KRW: ["\u20a9", void 0, 0],
            KWD: [void 0, void 0, 3],
            KYD: [void 0, "$"],
            KZT: [void 0, "\u20b8"],
            LAK: [void 0, "\u20ad", 0],
            LBP: [void 0, "L\xa3", 0],
            LKR: [void 0, "Rs"],
            LRD: [void 0, "$"],
            LTL: [void 0, "Lt"],
            LUF: [void 0, void 0, 0],
            LVL: [void 0, "Ls"],
            LYD: [void 0, void 0, 3],
            MGA: [void 0, "Ar", 0],
            MGF: [void 0, void 0, 0],
            MMK: [void 0, "K", 0],
            MNT: [void 0, "\u20ae", 2],
            MRO: [void 0, void 0, 0],
            MUR: [void 0, "Rs", 2],
            MXN: ["MX$", "$"],
            MYR: [void 0, "RM"],
            NAD: [void 0, "$"],
            NGN: [void 0, "\u20a6"],
            NIO: [void 0, "C$"],
            NOK: [void 0, "kr", 2],
            NPR: [void 0, "Rs"],
            NZD: ["NZ$", "$"],
            OMR: [void 0, void 0, 3],
            PHP: ["\u20b1"],
            PKR: [void 0, "Rs", 2],
            PLN: [void 0, "z\u0142"],
            PYG: [void 0, "\u20b2", 0],
            RON: [void 0, "lei"],
            RSD: [void 0, void 0, 0],
            RUB: [void 0, "\u20bd"],
            RWF: [void 0, "RF", 0],
            SBD: [void 0, "$"],
            SEK: [void 0, "kr", 2],
            SGD: [void 0, "$"],
            SHP: [void 0, "\xa3"],
            SLE: [void 0, void 0, 2],
            SLL: [void 0, void 0, 0],
            SOS: [void 0, void 0, 0],
            SRD: [void 0, "$"],
            SSP: [void 0, "\xa3"],
            STD: [void 0, void 0, 0],
            STN: [void 0, "Db"],
            SYP: [void 0, "\xa3", 0],
            THB: [void 0, "\u0e3f"],
            TMM: [void 0, void 0, 0],
            TND: [void 0, void 0, 3],
            TOP: [void 0, "T$"],
            TRL: [void 0, void 0, 0],
            TRY: [void 0, "\u20ba"],
            TTD: [void 0, "$"],
            TWD: ["NT$", "$", 2],
            TZS: [void 0, void 0, 2],
            UAH: [void 0, "\u20b4"],
            UGX: [void 0, void 0, 0],
            USD: ["$"],
            UYI: [void 0, void 0, 0],
            UYU: [void 0, "$"],
            UYW: [void 0, void 0, 4],
            UZS: [void 0, void 0, 2],
            VEF: [void 0, "Bs", 2],
            VND: ["\u20ab", void 0, 0],
            VUV: [void 0, void 0, 0],
            XAF: ["FCFA", void 0, 0],
            XCD: ["EC$", "$"],
            XOF: ["F\u202fCFA", void 0, 0],
            XPF: ["CFPF", void 0, 0],
            XXX: ["\xa4"],
            YER: [void 0, void 0, 0],
            ZAR: [void 0, "R"],
            ZMK: [void 0, void 0, 0],
            ZMW: [void 0, "ZK"],
            ZWD: [void 0, void 0, 0]
        };
        var It = (() => ((It = It || {})[It.Decimal = 0] = "Decimal", It[It.Percent = 1] = "Percent", It[It.Currency = 2] = "Currency", It[It.Scientific = 3] = "Scientific", It))(),
            Be = (() => ((Be = Be || {})[Be.Zero = 0] = "Zero", Be[Be.One = 1] = "One", Be[Be.Two = 2] = "Two", Be[Be.Few = 3] = "Few", Be[Be.Many = 4] = "Many", Be[Be.Other = 5] = "Other", Be))(),
            V = (() => ((V = V || {})[V.Decimal = 0] = "Decimal", V[V.Group = 1] = "Group", V[V.List = 2] = "List", V[V.PercentSign = 3] = "PercentSign", V[V.PlusSign = 4] = "PlusSign", V[V.MinusSign = 5] = "MinusSign", V[V.Exponential = 6] = "Exponential", V[V.SuperscriptingExponent = 7] = "SuperscriptingExponent", V[V.PerMille = 8] = "PerMille", V[V.Infinity = 9] = "Infinity", V[V.NaN = 10] = "NaN", V[V.TimeSeparator = 11] = "TimeSeparator", V[V.CurrencyDecimal = 12] = "CurrencyDecimal", V[V.CurrencyGroup = 13] = "CurrencyGroup", V))();

        function Jt(t, n) {
            const e = bt(t), i = e[T.NumberSymbols][n];
            if (typeof i > "u") {
                if (n === V.CurrencyDecimal) return e[T.NumberSymbols][V.Decimal];
                if (n === V.CurrencyGroup) return e[T.NumberSymbols][V.Group]
            }
            return i
        }

        function Uu(t, n) {
            return bt(t)[T.NumberFormats][n]
        }

        const ZM = function hm(t) {
            return bt(t)[T.PluralCase]
        };
        const eT = 2, gT = /^(\d+)?\.((\d+)(-(\d+))?)?$/, o_ = 22, va = ".", Co = "0", mT = ";", vT = ",", Wu = "#",
            s_ = "\xa4";

        function qu(t, n, e, i, r, o, s = !1) {
            let a = "", l = !1;
            if (isFinite(t)) {
                let c = function DT(t) {
                    let i, r, o, s, a, n = Math.abs(t) + "", e = 0;
                    for ((r = n.indexOf(va)) > -1 && (n = n.replace(va, "")), (o = n.search(/e/i)) > 0 ? (r < 0 && (r = o), r += +n.slice(o + 1), n = n.substring(0, o)) : r < 0 && (r = n.length), o = 0; n.charAt(o) === Co; o++) ;
                    if (o === (a = n.length)) i = [0], r = 1; else {
                        for (a--; n.charAt(a) === Co;) a--;
                        for (r -= o, i = [], s = 0; o <= a; o++, s++) i[s] = Number(n.charAt(o))
                    }
                    return r > o_ && (i = i.splice(0, o_ - 1), e = r - 1, r = 1), {
                        digits: i,
                        exponent: e,
                        integerLen: r
                    }
                }(t);
                s && (c = function CT(t) {
                    if (0 === t.digits[0]) return t;
                    const n = t.digits.length - t.integerLen;
                    return t.exponent ? t.exponent += 2 : (0 === n ? t.digits.push(0, 0) : 1 === n && t.digits.push(0), t.integerLen += 2), t
                }(c));
                let u = n.minInt, d = n.minFrac, h = n.maxFrac;
                if (o) {
                    const x = o.match(gT);
                    if (null === x) throw new Error(`${o} is not a valid digit info`);
                    const y = x[1], N = x[3], oe = x[5];
                    null != y && (u = Ku(y)), null != N && (d = Ku(N)), null != oe ? h = Ku(oe) : null != N && d > h && (h = d)
                }
                !function ET(t, n, e) {
                    if (n > e) throw new Error(`The minimum number of digits after fraction (${n}) is higher than the maximum (${e}).`);
                    let i = t.digits, r = i.length - t.integerLen;
                    const o = Math.min(Math.max(n, r), e);
                    let s = o + t.integerLen, a = i[s];
                    if (s > 0) {
                        i.splice(Math.max(t.integerLen, s));
                        for (let d = s; d < i.length; d++) i[d] = 0
                    } else {
                        r = Math.max(0, r), t.integerLen = 1, i.length = Math.max(1, s = o + 1), i[0] = 0;
                        for (let d = 1; d < s; d++) i[d] = 0
                    }
                    if (a >= 5) if (s - 1 < 0) {
                        for (let d = 0; d > s; d--) i.unshift(0), t.integerLen++;
                        i.unshift(1), t.integerLen++
                    } else i[s - 1]++;
                    for (; r < Math.max(0, o); r++) i.push(0);
                    let l = 0 !== o;
                    const c = n + t.integerLen, u = i.reduceRight(function (d, h, f, p) {
                        return p[f] = (h += d) < 10 ? h : h - 10, l && (0 === p[f] && f >= c ? p.pop() : l = !1), h >= 10 ? 1 : 0
                    }, 0);
                    u && (i.unshift(u), t.integerLen++)
                }(c, d, h);
                let f = c.digits, p = c.integerLen;
                const m = c.exponent;
                let b = [];
                for (l = f.every(x => !x); p < u; p++) f.unshift(0);
                for (; p < 0; p++) f.unshift(0);
                p > 0 ? b = f.splice(p, f.length) : (b = f, f = [0]);
                const w = [];
                for (f.length >= n.lgSize && w.unshift(f.splice(-n.lgSize, f.length).join("")); f.length > n.gSize;) w.unshift(f.splice(-n.gSize, f.length).join(""));
                f.length && w.unshift(f.join("")), a = w.join(Jt(e, i)), b.length && (a += Jt(e, r) + b.join("")), m && (a += Jt(e, V.Exponential) + "+" + m)
            } else a = Jt(e, V.Infinity);
            return a = t < 0 && !l ? n.negPre + a + n.negSuf : n.posPre + a + n.posSuf, a
        }

        function Yu(t, n = "-") {
            const e = {
                    minInt: 1,
                    minFrac: 0,
                    maxFrac: 0,
                    posPre: "",
                    posSuf: "",
                    negPre: "",
                    negSuf: "",
                    gSize: 0,
                    lgSize: 0
                }, i = t.split(mT), r = i[0], o = i[1],
                s = -1 !== r.indexOf(va) ? r.split(va) : [r.substring(0, r.lastIndexOf(Co) + 1), r.substring(r.lastIndexOf(Co) + 1)],
                a = s[0], l = s[1] || "";
            e.posPre = a.substring(0, a.indexOf(Wu));
            for (let u = 0; u < l.length; u++) {
                const d = l.charAt(u);
                d === Co ? e.minFrac = e.maxFrac = u + 1 : d === Wu ? e.maxFrac = u + 1 : e.posSuf += d
            }
            const c = a.split(vT);
            if (e.gSize = c[1] ? c[1].length : 0, e.lgSize = c[2] || c[1] ? (c[2] || c[1]).length : 0, o) {
                const u = r.length - e.posPre.length - e.posSuf.length, d = o.indexOf(Wu);
                e.negPre = o.substring(0, d).replace(/'/g, ""), e.negSuf = o.slice(d + u).replace(/'/g, "")
            } else e.negPre = n + e.posPre, e.negSuf = e.posSuf;
            return e
        }

        function Ku(t) {
            const n = parseInt(t);
            if (isNaN(n)) throw new Error("Invalid integer literal when parsing " + t);
            return n
        }

        let Zu = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({
                token: t, factory: function (e) {
                    let i = null;
                    return e ? i = new e : (r = W(xn), i = new ST(r)), i;
                    var r
                }, providedIn: "root"
            }), t
        })();
        let ST = (() => {
            class t extends Zu {
                constructor(e) {
                    super(), this.locale = e
                }

                getPluralCategory(e, i) {
                    switch (ZM(i || this.locale)(e)) {
                        case Be.Zero:
                            return "zero";
                        case Be.One:
                            return "one";
                        case Be.Two:
                            return "two";
                        case Be.Few:
                            return "few";
                        case Be.Many:
                            return "many";
                        default:
                            return "other"
                    }
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(xn))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();

        function l_(t, n) {
            n = encodeURIComponent(n);
            for (const e of t.split(";")) {
                const i = e.indexOf("="), [r, o] = -1 == i ? [e, ""] : [e.slice(0, i), e.slice(i + 1)];
                if (r.trim() === n) return decodeURIComponent(o)
            }
            return null
        }

        const Qu = /\s+/, c_ = [];
        let Jn = (() => {
            class t {
                constructor(e, i, r, o) {
                    this._iterableDiffers = e, this._keyValueDiffers = i, this._ngEl = r, this._renderer = o, this.initialClasses = c_, this.stateMap = new Map
                }

                set klass(e) {
                    this.initialClasses = null != e ? e.trim().split(Qu) : c_
                }

                set ngClass(e) {
                    this.rawClass = "string" == typeof e ? e.trim().split(Qu) : e
                }

                ngDoCheck() {
                    for (const i of this.initialClasses) this._updateState(i, !0);
                    const e = this.rawClass;
                    if (Array.isArray(e) || e instanceof Set) for (const i of e) this._updateState(i, !0); else if (null != e) for (const i of Object.keys(e)) this._updateState(i, Boolean(e[i]));
                    this._applyStateDiff()
                }

                _updateState(e, i) {
                    const r = this.stateMap.get(e);
                    void 0 !== r ? (r.enabled !== i && (r.changed = !0, r.enabled = i), r.touched = !0) : this.stateMap.set(e, {
                        enabled: i,
                        changed: !0,
                        touched: !0
                    })
                }

                _applyStateDiff() {
                    for (const e of this.stateMap) {
                        const i = e[0], r = e[1];
                        r.changed ? (this._toggleClass(i, r.enabled), r.changed = !1) : r.touched || (r.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)), r.touched = !1
                    }
                }

                _toggleClass(e, i) {
                    (e = e.trim()).length > 0 && e.split(Qu).forEach(r => {
                        i ? this._renderer.addClass(this._ngEl.nativeElement, r) : this._renderer.removeClass(this._ngEl.nativeElement, r)
                    })
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(la), g(bo), g(he), g(Ot))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngClass", ""]],
                inputs: {klass: ["class", "klass"], ngClass: "ngClass"},
                standalone: !0
            }), t
        })();

        class TT {
            constructor(n, e, i, r) {
                this.$implicit = n, this.ngForOf = e, this.index = i, this.count = r
            }

            get first() {
                return 0 === this.index
            }

            get last() {
                return this.index === this.count - 1
            }

            get even() {
                return this.index % 2 == 0
            }

            get odd() {
                return !this.even
            }
        }

        let _a = (() => {
            class t {
                set ngForOf(e) {
                    this._ngForOf = e, this._ngForOfDirty = !0
                }

                set ngForTrackBy(e) {
                    this._trackByFn = e
                }

                get ngForTrackBy() {
                    return this._trackByFn
                }

                constructor(e, i, r) {
                    this._viewContainer = e, this._template = i, this._differs = r, this._ngForOf = null, this._ngForOfDirty = !0, this._differ = null
                }

                set ngForTemplate(e) {
                    e && (this._template = e)
                }

                ngDoCheck() {
                    if (this._ngForOfDirty) {
                        this._ngForOfDirty = !1;
                        const e = this._ngForOf;
                        !this._differ && e && (this._differ = this._differs.find(e).create(this.ngForTrackBy))
                    }
                    if (this._differ) {
                        const e = this._differ.diff(this._ngForOf);
                        e && this._applyChanges(e)
                    }
                }

                _applyChanges(e) {
                    const i = this._viewContainer;
                    e.forEachOperation((r, o, s) => {
                        if (null == r.previousIndex) i.createEmbeddedView(this._template, new TT(r.item, this._ngForOf, -1, -1), null === s ? void 0 : s); else if (null == s) i.remove(null === o ? void 0 : o); else if (null !== o) {
                            const a = i.get(o);
                            i.move(a, s), h_(a, r)
                        }
                    });
                    for (let r = 0, o = i.length; r < o; r++) {
                        const a = i.get(r).context;
                        a.index = r, a.count = o, a.ngForOf = this._ngForOf
                    }
                    e.forEachIdentityChange(r => {
                        h_(i.get(r.currentIndex), r)
                    })
                }

                static ngTemplateContextGuard(e, i) {
                    return !0
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Qt), g(te), g(la))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngFor", "", "ngForOf", ""]],
                inputs: {ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate"},
                standalone: !0
            }), t
        })();

        function h_(t, n) {
            t.context.$implicit = n.item
        }

        let ot = (() => {
            class t {
                constructor(e, i) {
                    this._viewContainer = e, this._context = new IT, this._thenTemplateRef = null, this._elseTemplateRef = null, this._thenViewRef = null, this._elseViewRef = null, this._thenTemplateRef = i
                }

                set ngIf(e) {
                    this._context.$implicit = this._context.ngIf = e, this._updateView()
                }

                set ngIfThen(e) {
                    f_("ngIfThen", e), this._thenTemplateRef = e, this._thenViewRef = null, this._updateView()
                }

                set ngIfElse(e) {
                    f_("ngIfElse", e), this._elseTemplateRef = e, this._elseViewRef = null, this._updateView()
                }

                _updateView() {
                    this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(), this._elseViewRef = null, this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(), this._thenViewRef = null, this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
                }

                static ngTemplateContextGuard(e, i) {
                    return !0
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Qt), g(te))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngIf", ""]],
                inputs: {ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse"},
                standalone: !0
            }), t
        })();

        class IT {
            constructor() {
                this.$implicit = null, this.ngIf = null
            }
        }

        function f_(t, n) {
            if (n && !n.createEmbeddedView) throw new Error(`${t} must be a TemplateRef, but received '${pe(n)}'.`)
        }

        class Xu {
            constructor(n, e) {
                this._viewContainerRef = n, this._templateRef = e, this._created = !1
            }

            create() {
                this._created = !0, this._viewContainerRef.createEmbeddedView(this._templateRef)
            }

            destroy() {
                this._created = !1, this._viewContainerRef.clear()
            }

            enforceState(n) {
                n && !this._created ? this.create() : !n && this._created && this.destroy()
            }
        }

        let Do = (() => {
            class t {
                constructor() {
                    this._defaultViews = [], this._defaultUsed = !1, this._caseCount = 0, this._lastCaseCheckIndex = 0, this._lastCasesMatched = !1
                }

                set ngSwitch(e) {
                    this._ngSwitch = e, 0 === this._caseCount && this._updateDefaultCases(!0)
                }

                _addCase() {
                    return this._caseCount++
                }

                _addDefault(e) {
                    this._defaultViews.push(e)
                }

                _matchCase(e) {
                    const i = e == this._ngSwitch;
                    return this._lastCasesMatched = this._lastCasesMatched || i, this._lastCaseCheckIndex++, this._lastCaseCheckIndex === this._caseCount && (this._updateDefaultCases(!this._lastCasesMatched), this._lastCaseCheckIndex = 0, this._lastCasesMatched = !1), i
                }

                _updateDefaultCases(e) {
                    if (this._defaultViews.length > 0 && e !== this._defaultUsed) {
                        this._defaultUsed = e;
                        for (const i of this._defaultViews) i.enforceState(e)
                    }
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngSwitch", ""]],
                inputs: {ngSwitch: "ngSwitch"},
                standalone: !0
            }), t
        })(), p_ = (() => {
            class t {
                constructor(e, i, r) {
                    this.ngSwitch = r, r._addCase(), this._view = new Xu(e, i)
                }

                ngDoCheck() {
                    this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase))
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Qt), g(te), g(Do, 9))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngSwitchCase", ""]],
                inputs: {ngSwitchCase: "ngSwitchCase"},
                standalone: !0
            }), t
        })(), m_ = (() => {
            class t {
                constructor(e, i, r) {
                    this._ngEl = e, this._differs = i, this._renderer = r, this._ngStyle = null, this._differ = null
                }

                set ngStyle(e) {
                    this._ngStyle = e, !this._differ && e && (this._differ = this._differs.find(e).create())
                }

                ngDoCheck() {
                    if (this._differ) {
                        const e = this._differ.diff(this._ngStyle);
                        e && this._applyChanges(e)
                    }
                }

                _setStyle(e, i) {
                    const [r, o] = e.split("."), s = -1 === r.indexOf("-") ? void 0 : Mt.DashCase;
                    null != i ? this._renderer.setStyle(this._ngEl.nativeElement, r, o ? `${i}${o}` : i, s) : this._renderer.removeStyle(this._ngEl.nativeElement, r, s)
                }

                _applyChanges(e) {
                    e.forEachRemovedItem(i => this._setStyle(i.key, null)), e.forEachAddedItem(i => this._setStyle(i.key, i.currentValue)), e.forEachChangedItem(i => this._setStyle(i.key, i.currentValue))
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he), g(bo), g(Ot))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngStyle", ""]],
                inputs: {ngStyle: "ngStyle"},
                standalone: !0
            }), t
        })(), wr = (() => {
            class t {
                constructor(e) {
                    this._viewContainerRef = e, this._viewRef = null, this.ngTemplateOutletContext = null, this.ngTemplateOutlet = null, this.ngTemplateOutletInjector = null
                }

                ngOnChanges(e) {
                    if (e.ngTemplateOutlet || e.ngTemplateOutletInjector) {
                        const i = this._viewContainerRef;
                        if (this._viewRef && i.remove(i.indexOf(this._viewRef)), this.ngTemplateOutlet) {
                            const {ngTemplateOutlet: r, ngTemplateOutletContext: o, ngTemplateOutletInjector: s} = this;
                            this._viewRef = i.createEmbeddedView(r, o, s ? {injector: s} : void 0)
                        } else this._viewRef = null
                    } else this._viewRef && e.ngTemplateOutletContext && this.ngTemplateOutletContext && (this._viewRef.context = this.ngTemplateOutletContext)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Qt))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngTemplateOutlet", ""]],
                inputs: {
                    ngTemplateOutletContext: "ngTemplateOutletContext",
                    ngTemplateOutlet: "ngTemplateOutlet",
                    ngTemplateOutletInjector: "ngTemplateOutletInjector"
                },
                standalone: !0,
                features: [nt]
            }), t
        })();

        function fn(t, n) {
            return new M(2100, !1)
        }

        const WT = /#/g;
        let v_ = (() => {
            class t {
                constructor(e) {
                    this._localization = e
                }

                transform(e, i, r) {
                    if (null == e) return "";
                    if ("object" != typeof i || null === i) throw fn();
                    return i[function a_(t, n, e, i) {
                        let r = `=${t}`;
                        if (n.indexOf(r) > -1 || (r = e.getPluralCategory(t, i), n.indexOf(r) > -1)) return r;
                        if (n.indexOf("other") > -1) return "other";
                        throw new Error(`No plural message found for value "${t}"`)
                    }(e, Object.keys(i), this._localization, r)].replace(WT, e.toString())
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Zu, 16))
            }, t.\u0275pipe = Et({name: "i18nPlural", type: t, pure: !0, standalone: !0}), t
        })(), y_ = (() => {
            class t {
                constructor(e) {
                    this._locale = e
                }

                transform(e, i, r) {
                    if (!Ju(e)) return null;
                    r = r || this._locale;
                    try {
                        return function wT(t, n, e) {
                            return qu(t, Yu(Uu(n, It.Decimal), Jt(n, V.MinusSign)), n, V.Group, V.Decimal, e)
                        }(ed(e), r, i)
                    } catch (o) {
                        throw fn()
                    }
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(xn, 16))
            }, t.\u0275pipe = Et({name: "number", type: t, pure: !0, standalone: !0}), t
        })(), b_ = (() => {
            class t {
                constructor(e, i = "USD") {
                    this._locale = e, this._defaultCurrencyCode = i
                }

                transform(e, i = this._defaultCurrencyCode, r = "symbol", o, s) {
                    if (!Ju(e)) return null;
                    s = s || this._locale, "boolean" == typeof r && (r = r ? "symbol" : "code");
                    let a = i || this._defaultCurrencyCode;
                    "code" !== r && (a = "symbol" === r || "symbol-narrow" === r ? function JM(t, n, e = "en") {
                        const i = function KM(t) {
                            return bt(t)[T.Currencies]
                        }(e)[t] || e_[t] || [], r = i[1];
                        return "narrow" === n && "string" == typeof r ? r : i[0] || t
                    }(a, "symbol" === r ? "wide" : "narrow", s) : r);
                    try {
                        return function yT(t, n, e, i, r) {
                            const s = Yu(Uu(n, It.Currency), Jt(n, V.MinusSign));
                            return s.minFrac = function tT(t) {
                                let n;
                                const e = e_[t];
                                return e && (n = e[2]), "number" == typeof n ? n : eT
                            }(i), s.maxFrac = s.minFrac, qu(t, s, n, V.CurrencyGroup, V.CurrencyDecimal, r).replace(s_, e).replace(s_, "").trim()
                        }(ed(e), s, a, i, o)
                    } catch (l) {
                        throw fn()
                    }
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(xn, 16), g(oM, 16))
            }, t.\u0275pipe = Et({name: "currency", type: t, pure: !0, standalone: !0}), t
        })();

        function Ju(t) {
            return !(null == t || "" === t || t != t)
        }

        function ed(t) {
            if ("string" == typeof t && !isNaN(Number(t) - parseFloat(t))) return Number(t);
            if ("number" != typeof t) throw new Error(`${t} is not a number`);
            return t
        }

        let ya = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({}), t
        })();

        class D_ {
        }

        class TO extends jM {
            constructor() {
                super(...arguments), this.supportsDOMEvents = !0
            }
        }

        class id extends TO {
            static makeCurrent() {
                !function HM(t) {
                    ju || (ju = t)
                }(new id)
            }

            onAndCancel(n, e, i) {
                return n.addEventListener(e, i, !1), () => {
                    n.removeEventListener(e, i, !1)
                }
            }

            dispatchEvent(n, e) {
                n.dispatchEvent(e)
            }

            remove(n) {
                n.parentNode && n.parentNode.removeChild(n)
            }

            createElement(n, e) {
                return (e = e || this.getDefaultDocument()).createElement(n)
            }

            createHtmlDocument() {
                return document.implementation.createHTMLDocument("fakeTitle")
            }

            getDefaultDocument() {
                return document
            }

            isElementNode(n) {
                return n.nodeType === Node.ELEMENT_NODE
            }

            isShadowRoot(n) {
                return n instanceof DocumentFragment
            }

            getGlobalEventTarget(n, e) {
                return "window" === e ? window : "document" === e ? n : "body" === e ? n.body : null
            }

            getBaseHref(n) {
                const e = function OO() {
                    return So = So || document.querySelector("base"), So ? So.getAttribute("href") : null
                }();
                return null == e ? null : function IO(t) {
                    Ca = Ca || document.createElement("a"), Ca.setAttribute("href", t);
                    const n = Ca.pathname;
                    return "/" === n.charAt(0) ? n : `/${n}`
                }(e)
            }

            resetBaseElement() {
                So = null
            }

            getUserAgent() {
                return window.navigator.userAgent
            }

            getCookie(n) {
                return l_(document.cookie, n)
            }
        }

        let Ca, So = null;
        const T_ = new L("TRANSITION_ID"), PO = [{
            provide: xv, useFactory: function AO(t, n, e) {
                return () => {
                    e.get(na).donePromise.then(() => {
                        const i = br(), r = n.querySelectorAll(`style[ng-transition="${t}"]`);
                        for (let o = 0; o < r.length; o++) i.remove(r[o])
                    })
                }
            }, deps: [T_, Xt, Ln], multi: !0
        }];
        let kO = (() => {
            class t {
                build() {
                    return new XMLHttpRequest
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const Da = new L("EventManagerPlugins");
        let Ea = (() => {
            class t {
                constructor(e, i) {
                    this._zone = i, this._eventNameToPlugin = new Map, e.forEach(r => {
                        r.manager = this
                    }), this._plugins = e.slice().reverse()
                }

                addEventListener(e, i, r) {
                    return this._findPluginFor(i).addEventListener(e, i, r)
                }

                addGlobalEventListener(e, i, r) {
                    return this._findPluginFor(i).addGlobalEventListener(e, i, r)
                }

                getZone() {
                    return this._zone
                }

                _findPluginFor(e) {
                    const i = this._eventNameToPlugin.get(e);
                    if (i) return i;
                    const r = this._plugins;
                    for (let o = 0; o < r.length; o++) {
                        const s = r[o];
                        if (s.supports(e)) return this._eventNameToPlugin.set(e, s), s
                    }
                    throw new Error(`No event manager plugin found for event ${e}`)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Da), W(Ge))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();

        class O_ {
            constructor(n) {
                this._doc = n
            }

            addGlobalEventListener(n, e, i) {
                const r = br().getGlobalEventTarget(this._doc, n);
                if (!r) throw new Error(`Unsupported event target ${r} for event ${e}`);
                return this.addEventListener(r, e, i)
            }
        }

        let I_ = (() => {
            class t {
                constructor() {
                    this.usageCount = new Map
                }

                addStyles(e) {
                    for (const i of e) 1 === this.changeUsageCount(i, 1) && this.onStyleAdded(i)
                }

                removeStyles(e) {
                    for (const i of e) 0 === this.changeUsageCount(i, -1) && this.onStyleRemoved(i)
                }

                onStyleRemoved(e) {
                }

                onStyleAdded(e) {
                }

                getAllStyles() {
                    return this.usageCount.keys()
                }

                changeUsageCount(e, i) {
                    const r = this.usageCount;
                    let o = r.get(e) ?? 0;
                    return o += i, o > 0 ? r.set(e, o) : r.delete(e), o
                }

                ngOnDestroy() {
                    for (const e of this.getAllStyles()) this.onStyleRemoved(e);
                    this.usageCount.clear()
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })(), xo = (() => {
            class t extends I_ {
                constructor(e) {
                    super(), this.doc = e, this.styleRef = new Map, this.hostNodes = new Set, this.resetHostNodes()
                }

                onStyleAdded(e) {
                    for (const i of this.hostNodes) this.addStyleToHost(i, e)
                }

                onStyleRemoved(e) {
                    const i = this.styleRef;
                    i.get(e)?.forEach(o => o.remove()), i.delete(e)
                }

                ngOnDestroy() {
                    super.ngOnDestroy(), this.styleRef.clear(), this.resetHostNodes()
                }

                addHost(e) {
                    this.hostNodes.add(e);
                    for (const i of this.getAllStyles()) this.addStyleToHost(e, i)
                }

                removeHost(e) {
                    this.hostNodes.delete(e)
                }

                addStyleToHost(e, i) {
                    const r = this.doc.createElement("style");
                    r.textContent = i, e.appendChild(r);
                    const o = this.styleRef.get(i);
                    o ? o.push(r) : this.styleRef.set(i, [r])
                }

                resetHostNodes() {
                    const e = this.hostNodes;
                    e.clear(), e.add(this.doc.head)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Xt))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const rd = {
            svg: "http://www.w3.org/2000/svg",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/",
            math: "http://www.w3.org/1998/MathML/"
        }, od = /%COMP%/g, F_ = new L("RemoveStylesOnCompDestory", {providedIn: "root", factory: () => !1});

        function k_(t, n) {
            return n.flat(100).map(e => e.replace(od, t))
        }

        function N_(t) {
            return n => {
                if ("__ngUnwrap__" === n) return t;
                !1 === t(n) && (n.preventDefault(), n.returnValue = !1)
            }
        }

        let sd = (() => {
            class t {
                constructor(e, i, r, o) {
                    this.eventManager = e, this.sharedStylesHost = i, this.appId = r, this.removeStylesOnCompDestory = o, this.rendererByCompId = new Map, this.defaultRenderer = new ad(e)
                }

                createRenderer(e, i) {
                    if (!e || !i) return this.defaultRenderer;
                    const r = this.getOrCreateRenderer(e, i);
                    return r instanceof V_ ? r.applyToHost(e) : r instanceof ld && r.applyStyles(), r
                }

                getOrCreateRenderer(e, i) {
                    const r = this.rendererByCompId;
                    let o = r.get(i.id);
                    if (!o) {
                        const s = this.eventManager, a = this.sharedStylesHost, l = this.removeStylesOnCompDestory;
                        switch (i.encapsulation) {
                            case _n.Emulated:
                                o = new V_(s, a, i, this.appId, l);
                                break;
                            case _n.ShadowDom:
                                return new jO(s, a, e, i);
                            default:
                                o = new ld(s, a, i, l)
                        }
                        o.onDestroy = () => r.delete(i.id), r.set(i.id, o)
                    }
                    return o
                }

                ngOnDestroy() {
                    this.rendererByCompId.clear()
                }

                begin() {
                }

                end() {
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Ea), W(xo), W(yo), W(F_))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();

        class ad {
            constructor(n) {
                this.eventManager = n, this.data = Object.create(null), this.destroyNode = null
            }

            destroy() {
            }

            createElement(n, e) {
                return e ? document.createElementNS(rd[e] || e, n) : document.createElement(n)
            }

            createComment(n) {
                return document.createComment(n)
            }

            createText(n) {
                return document.createTextNode(n)
            }

            appendChild(n, e) {
                (R_(n) ? n.content : n).appendChild(e)
            }

            insertBefore(n, e, i) {
                n && (R_(n) ? n.content : n).insertBefore(e, i)
            }

            removeChild(n, e) {
                n && n.removeChild(e)
            }

            selectRootElement(n, e) {
                let i = "string" == typeof n ? document.querySelector(n) : n;
                if (!i) throw new Error(`The selector "${n}" did not match any elements`);
                return e || (i.textContent = ""), i
            }

            parentNode(n) {
                return n.parentNode
            }

            nextSibling(n) {
                return n.nextSibling
            }

            setAttribute(n, e, i, r) {
                if (r) {
                    e = r + ":" + e;
                    const o = rd[r];
                    o ? n.setAttributeNS(o, e, i) : n.setAttribute(e, i)
                } else n.setAttribute(e, i)
            }

            removeAttribute(n, e, i) {
                if (i) {
                    const r = rd[i];
                    r ? n.removeAttributeNS(r, e) : n.removeAttribute(`${i}:${e}`)
                } else n.removeAttribute(e)
            }

            addClass(n, e) {
                n.classList.add(e)
            }

            removeClass(n, e) {
                n.classList.remove(e)
            }

            setStyle(n, e, i, r) {
                r & (Mt.DashCase | Mt.Important) ? n.style.setProperty(e, i, r & Mt.Important ? "important" : "") : n.style[e] = i
            }

            removeStyle(n, e, i) {
                i & Mt.DashCase ? n.style.removeProperty(e) : n.style[e] = ""
            }

            setProperty(n, e, i) {
                n[e] = i
            }

            setValue(n, e) {
                n.nodeValue = e
            }

            listen(n, e, i) {
                return "string" == typeof n ? this.eventManager.addGlobalEventListener(n, e, N_(i)) : this.eventManager.addEventListener(n, e, N_(i))
            }
        }

        function R_(t) {
            return "TEMPLATE" === t.tagName && void 0 !== t.content
        }

        class jO extends ad {
            constructor(n, e, i, r) {
                super(n), this.sharedStylesHost = e, this.hostEl = i, this.shadowRoot = i.attachShadow({mode: "open"}), this.sharedStylesHost.addHost(this.shadowRoot);
                const o = k_(r.id, r.styles);
                for (const s of o) {
                    const a = document.createElement("style");
                    a.textContent = s, this.shadowRoot.appendChild(a)
                }
            }

            nodeOrShadowRoot(n) {
                return n === this.hostEl ? this.shadowRoot : n
            }

            appendChild(n, e) {
                return super.appendChild(this.nodeOrShadowRoot(n), e)
            }

            insertBefore(n, e, i) {
                return super.insertBefore(this.nodeOrShadowRoot(n), e, i)
            }

            removeChild(n, e) {
                return super.removeChild(this.nodeOrShadowRoot(n), e)
            }

            parentNode(n) {
                return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)))
            }

            destroy() {
                this.sharedStylesHost.removeHost(this.shadowRoot)
            }
        }

        class ld extends ad {
            constructor(n, e, i, r, o = i.id) {
                super(n), this.sharedStylesHost = e, this.removeStylesOnCompDestory = r, this.rendererUsageCount = 0, this.styles = k_(o, i.styles)
            }

            applyStyles() {
                this.sharedStylesHost.addStyles(this.styles), this.rendererUsageCount++
            }

            destroy() {
                this.removeStylesOnCompDestory && (this.sharedStylesHost.removeStyles(this.styles), this.rendererUsageCount--, 0 === this.rendererUsageCount && this.onDestroy?.())
            }
        }

        class V_ extends ld {
            constructor(n, e, i, r, o) {
                const s = r + "-" + i.id;
                super(n, e, i, o, s), this.contentAttr = function VO(t) {
                    return "_ngcontent-%COMP%".replace(od, t)
                }(s), this.hostAttr = function BO(t) {
                    return "_nghost-%COMP%".replace(od, t)
                }(s)
            }

            applyToHost(n) {
                this.applyStyles(), this.setAttribute(n, this.hostAttr, "")
            }

            createElement(n, e) {
                const i = super.createElement(n, e);
                return super.setAttribute(i, this.contentAttr, ""), i
            }
        }

        let UO = (() => {
            class t extends O_ {
                constructor(e) {
                    super(e)
                }

                supports(e) {
                    return !0
                }

                addEventListener(e, i, r) {
                    return e.addEventListener(i, r, !1), () => this.removeEventListener(e, i, r)
                }

                removeEventListener(e, i, r) {
                    return e.removeEventListener(i, r)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Xt))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const B_ = ["alt", "control", "meta", "shift"], $O = {
            "\b": "Backspace",
            "\t": "Tab",
            "\x7f": "Delete",
            "\x1b": "Escape",
            Del: "Delete",
            Esc: "Escape",
            Left: "ArrowLeft",
            Right: "ArrowRight",
            Up: "ArrowUp",
            Down: "ArrowDown",
            Menu: "ContextMenu",
            Scroll: "ScrollLock",
            Win: "OS"
        }, zO = {alt: t => t.altKey, control: t => t.ctrlKey, meta: t => t.metaKey, shift: t => t.shiftKey};
        let GO = (() => {
            class t extends O_ {
                constructor(e) {
                    super(e)
                }

                supports(e) {
                    return null != t.parseEventName(e)
                }

                addEventListener(e, i, r) {
                    const o = t.parseEventName(i), s = t.eventCallback(o.fullKey, r, this.manager.getZone());
                    return this.manager.getZone().runOutsideAngular(() => br().onAndCancel(e, o.domEventName, s))
                }

                static parseEventName(e) {
                    const i = e.toLowerCase().split("."), r = i.shift();
                    if (0 === i.length || "keydown" !== r && "keyup" !== r) return null;
                    const o = t._normalizeKey(i.pop());
                    let s = "", a = i.indexOf("code");
                    if (a > -1 && (i.splice(a, 1), s = "code."), B_.forEach(c => {
                        const u = i.indexOf(c);
                        u > -1 && (i.splice(u, 1), s += c + ".")
                    }), s += o, 0 != i.length || 0 === o.length) return null;
                    const l = {};
                    return l.domEventName = r, l.fullKey = s, l
                }

                static matchEventFullKeyCode(e, i) {
                    let r = $O[e.key] || e.key, o = "";
                    return i.indexOf("code.") > -1 && (r = e.code, o = "code."), !(null == r || !r) && (r = r.toLowerCase(), " " === r ? r = "space" : "." === r && (r = "dot"), B_.forEach(s => {
                        s !== r && (0, zO[s])(e) && (o += s + ".")
                    }), o += r, o === i)
                }

                static eventCallback(e, i, r) {
                    return o => {
                        t.matchEventFullKeyCode(o, e) && r.runGuarded(() => i(o))
                    }
                }

                static _normalizeKey(e) {
                    return "esc" === e ? "escape" : e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Xt))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const j_ = [{provide: Mu, useValue: "browser"}, {
                provide: Tv, useValue: function WO() {
                    id.makeCurrent()
                }, multi: !0
            }, {
                provide: Xt, useFactory: function YO() {
                    return function GC(t) {
                        pc = t
                    }(document), document
                }, deps: []
            }], KO = Lv(RM, "browser", j_), U_ = new L(""), $_ = [{
                provide: ia, useClass: class FO {
                    addToWindow(n) {
                        ve.getAngularTestability = (i, r = !0) => {
                            const o = n.findTestabilityInTree(i, r);
                            if (null == o) throw new Error("Could not find testability for element.");
                            return o
                        }, ve.getAllAngularTestabilities = () => n.getAllTestabilities(), ve.getAllAngularRootElements = () => n.getAllRootElements(), ve.frameworkStabilizers || (ve.frameworkStabilizers = []), ve.frameworkStabilizers.push(i => {
                            const r = ve.getAllAngularTestabilities();
                            let o = r.length, s = !1;
                            const a = function (l) {
                                s = s || l, o--, 0 == o && i(s)
                            };
                            r.forEach(function (l) {
                                l.whenStable(a)
                            })
                        })
                    }

                    findTestabilityInTree(n, e, i) {
                        return null == e ? null : n.getTestability(e) ?? (i ? br().isShadowRoot(e) ? this.findTestabilityInTree(n, e.host, !0) : this.findTestabilityInTree(n, e.parentElement, !0) : null)
                    }
                }, deps: []
            }, {provide: Fv, useClass: Au, deps: [Ge, Pu, ia]}, {provide: Au, useClass: Au, deps: [Ge, Pu, ia]}],
            z_ = [{provide: Dc, useValue: "root"}, {
                provide: tr, useFactory: function qO() {
                    return new tr
                }, deps: []
            }, {provide: Da, useClass: UO, multi: !0, deps: [Xt, Ge, Mu]}, {
                provide: Da,
                useClass: GO,
                multi: !0,
                deps: [Xt]
            }, {provide: sd, useClass: sd, deps: [Ea, xo, yo, F_]}, {provide: Ep, useExisting: sd}, {
                provide: I_,
                useExisting: xo
            }, {provide: xo, useClass: xo, deps: [Xt]}, {provide: Ea, useClass: Ea, deps: [Da, Ge]}, {
                provide: D_,
                useClass: kO,
                deps: []
            }, []];
        let ZO = (() => {
            class t {
                constructor(e) {
                }

                static withServerTransition(e) {
                    return {
                        ngModule: t,
                        providers: [{provide: yo, useValue: e.appId}, {provide: T_, useExisting: yo}, PO]
                    }
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(U_, 12))
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({providers: [...z_, ...$_], imports: [ya, VM]}), t
        })();
        typeof window < "u" && window;
        const pn = void 0,
            sI = ["ru", [["AM", "PM"], pn, pn], pn, [["\u0412", "\u041f", "\u0412", "\u0421", "\u0427", "\u041f", "\u0421"], ["\u0432\u0441", "\u043f\u043d", "\u0432\u0442", "\u0441\u0440", "\u0447\u0442", "\u043f\u0442", "\u0441\u0431"], ["\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435", "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a", "\u0432\u0442\u043e\u0440\u043d\u0438\u043a", "\u0441\u0440\u0435\u0434\u0430", "\u0447\u0435\u0442\u0432\u0435\u0440\u0433", "\u043f\u044f\u0442\u043d\u0438\u0446\u0430", "\u0441\u0443\u0431\u0431\u043e\u0442\u0430"], ["\u0432\u0441", "\u043f\u043d", "\u0432\u0442", "\u0441\u0440", "\u0447\u0442", "\u043f\u0442", "\u0441\u0431"]], pn, [["\u042f", "\u0424", "\u041c", "\u0410", "\u041c", "\u0418", "\u0418", "\u0410", "\u0421", "\u041e", "\u041d", "\u0414"], ["\u044f\u043d\u0432.", "\u0444\u0435\u0432\u0440.", "\u043c\u0430\u0440.", "\u0430\u043f\u0440.", "\u043c\u0430\u044f", "\u0438\u044e\u043d.", "\u0438\u044e\u043b.", "\u0430\u0432\u0433.", "\u0441\u0435\u043d\u0442.", "\u043e\u043a\u0442.", "\u043d\u043e\u044f\u0431.", "\u0434\u0435\u043a."], ["\u044f\u043d\u0432\u0430\u0440\u044f", "\u0444\u0435\u0432\u0440\u0430\u043b\u044f", "\u043c\u0430\u0440\u0442\u0430", "\u0430\u043f\u0440\u0435\u043b\u044f", "\u043c\u0430\u044f", "\u0438\u044e\u043d\u044f", "\u0438\u044e\u043b\u044f", "\u0430\u0432\u0433\u0443\u0441\u0442\u0430", "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f", "\u043e\u043a\u0442\u044f\u0431\u0440\u044f", "\u043d\u043e\u044f\u0431\u0440\u044f", "\u0434\u0435\u043a\u0430\u0431\u0440\u044f"]], [["\u042f", "\u0424", "\u041c", "\u0410", "\u041c", "\u0418", "\u0418", "\u0410", "\u0421", "\u041e", "\u041d", "\u0414"], ["\u044f\u043d\u0432.", "\u0444\u0435\u0432\u0440.", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440.", "\u043c\u0430\u0439", "\u0438\u044e\u043d\u044c", "\u0438\u044e\u043b\u044c", "\u0430\u0432\u0433.", "\u0441\u0435\u043d\u0442.", "\u043e\u043a\u0442.", "\u043d\u043e\u044f\u0431.", "\u0434\u0435\u043a."], ["\u044f\u043d\u0432\u0430\u0440\u044c", "\u0444\u0435\u0432\u0440\u0430\u043b\u044c", "\u043c\u0430\u0440\u0442", "\u0430\u043f\u0440\u0435\u043b\u044c", "\u043c\u0430\u0439", "\u0438\u044e\u043d\u044c", "\u0438\u044e\u043b\u044c", "\u0430\u0432\u0433\u0443\u0441\u0442", "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044c", "\u043e\u043a\u0442\u044f\u0431\u0440\u044c", "\u043d\u043e\u044f\u0431\u0440\u044c", "\u0434\u0435\u043a\u0430\u0431\u0440\u044c"]], [["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], ["\u0434\u043e \u043d. \u044d.", "\u043d. \u044d."], ["\u0434\u043e \u0420\u043e\u0436\u0434\u0435\u0441\u0442\u0432\u0430 \u0425\u0440\u0438\u0441\u0442\u043e\u0432\u0430", "\u043e\u0442 \u0420\u043e\u0436\u0434\u0435\u0441\u0442\u0432\u0430 \u0425\u0440\u0438\u0441\u0442\u043e\u0432\u0430"]], 1, [6, 0], ["dd.MM.y", "d MMM y '\u0433'.", "d MMMM y '\u0433'.", "EEEE, d MMMM y '\u0433'."], ["HH:mm", "HH:mm:ss", "HH:mm:ss z", "HH:mm:ss zzzz"], ["{1}, {0}", pn, pn, pn], [",", "\xa0", ";", "%", "+", "-", "E", "\xd7", "\u2030", "\u221e", "\u043d\u0435\xa0\u0447\u0438\u0441\u043b\u043e", ":"], ["#,##0.###", "#,##0\xa0%", "#,##0.00\xa0\xa4", "#E0"], "RUB", "\u20bd", "\u0440\u043e\u0441\u0441\u0438\u0439\u0441\u043a\u0438\u0439 \u0440\u0443\u0431\u043b\u044c", {
                BYN: [pn, "\u0440."],
                GEL: [pn, "\u10da"],
                PHP: [pn, "\u20b1"],
                RON: [pn, "L"],
                RUB: ["\u20bd"],
                RUR: ["\u0440."],
                THB: ["\u0e3f"],
                TMT: ["\u0422\u041c\u0422"],
                TWD: ["NT$"],
                UAH: ["\u20b4"],
                XXX: ["XXXX"]
            }, "ltr", function oI(t) {
                const e = Math.floor(Math.abs(t)), i = t.toString().replace(/^[^.]*\.?/, "").length;
                return 0 === i && e % 10 == 1 && e % 100 != 11 ? 1 : 0 === i && e % 10 === Math.floor(e % 10) && e % 10 >= 2 && e % 10 <= 4 && !(e % 100 >= 12 && e % 100 <= 14) ? 3 : 0 === i && e % 10 == 0 || 0 === i && e % 10 === Math.floor(e % 10) && e % 10 >= 5 && e % 10 <= 9 || 0 === i && e % 100 === Math.floor(e % 100) && e % 100 >= 11 && e % 100 <= 14 ? 4 : 5
            }];

        function Cr(...t) {
            return Ko(t, Yo(t))
        }

        function tn(t, n) {
            return et((e, i) => {
                let r = 0;
                e.subscribe(Ye(i, o => t.call(n, o, r++) && i.next(o)))
            })
        }

        class Sa {
        }

        class dd {
        }

        class Hn {
            constructor(n) {
                this.normalizedNames = new Map, this.lazyUpdate = null, n ? this.lazyInit = "string" == typeof n ? () => {
                    this.headers = new Map, n.split("\n").forEach(e => {
                        const i = e.indexOf(":");
                        if (i > 0) {
                            const r = e.slice(0, i), o = r.toLowerCase(), s = e.slice(i + 1).trim();
                            this.maybeSetNormalizedName(r, o), this.headers.has(o) ? this.headers.get(o).push(s) : this.headers.set(o, [s])
                        }
                    })
                } : () => {
                    this.headers = new Map, Object.entries(n).forEach(([e, i]) => {
                        let r;
                        if (r = "string" == typeof i ? [i] : "number" == typeof i ? [i.toString()] : i.map(o => o.toString()), r.length > 0) {
                            const o = e.toLowerCase();
                            this.headers.set(o, r), this.maybeSetNormalizedName(e, o)
                        }
                    })
                } : this.headers = new Map
            }

            has(n) {
                return this.init(), this.headers.has(n.toLowerCase())
            }

            get(n) {
                this.init();
                const e = this.headers.get(n.toLowerCase());
                return e && e.length > 0 ? e[0] : null
            }

            keys() {
                return this.init(), Array.from(this.normalizedNames.values())
            }

            getAll(n) {
                return this.init(), this.headers.get(n.toLowerCase()) || null
            }

            append(n, e) {
                return this.clone({name: n, value: e, op: "a"})
            }

            set(n, e) {
                return this.clone({name: n, value: e, op: "s"})
            }

            delete(n, e) {
                return this.clone({name: n, value: e, op: "d"})
            }

            maybeSetNormalizedName(n, e) {
                this.normalizedNames.has(e) || this.normalizedNames.set(e, n)
            }

            init() {
                this.lazyInit && (this.lazyInit instanceof Hn ? this.copyFrom(this.lazyInit) : this.lazyInit(), this.lazyInit = null, this.lazyUpdate && (this.lazyUpdate.forEach(n => this.applyUpdate(n)), this.lazyUpdate = null))
            }

            copyFrom(n) {
                n.init(), Array.from(n.headers.keys()).forEach(e => {
                    this.headers.set(e, n.headers.get(e)), this.normalizedNames.set(e, n.normalizedNames.get(e))
                })
            }

            clone(n) {
                const e = new Hn;
                return e.lazyInit = this.lazyInit && this.lazyInit instanceof Hn ? this.lazyInit : this, e.lazyUpdate = (this.lazyUpdate || []).concat([n]), e
            }

            applyUpdate(n) {
                const e = n.name.toLowerCase();
                switch (n.op) {
                    case"a":
                    case"s":
                        let i = n.value;
                        if ("string" == typeof i && (i = [i]), 0 === i.length) return;
                        this.maybeSetNormalizedName(n.name, e);
                        const r = ("a" === n.op ? this.headers.get(e) : void 0) || [];
                        r.push(...i), this.headers.set(e, r);
                        break;
                    case"d":
                        const o = n.value;
                        if (o) {
                            let s = this.headers.get(e);
                            if (!s) return;
                            s = s.filter(a => -1 === o.indexOf(a)), 0 === s.length ? (this.headers.delete(e), this.normalizedNames.delete(e)) : this.headers.set(e, s)
                        } else this.headers.delete(e), this.normalizedNames.delete(e)
                }
            }

            forEach(n) {
                this.init(), Array.from(this.normalizedNames.keys()).forEach(e => n(this.normalizedNames.get(e), this.headers.get(e)))
            }
        }

        class lI {
            encodeKey(n) {
                return q_(n)
            }

            encodeValue(n) {
                return q_(n)
            }

            decodeKey(n) {
                return decodeURIComponent(n)
            }

            decodeValue(n) {
                return decodeURIComponent(n)
            }
        }

        const uI = /%(\d[a-f0-9])/gi,
            dI = {40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/"};

        function q_(t) {
            return encodeURIComponent(t).replace(uI, (n, e) => dI[e] ?? n)
        }

        function xa(t) {
            return `${t}`
        }

        class ti {
            constructor(n = {}) {
                if (this.updates = null, this.cloneFrom = null, this.encoder = n.encoder || new lI, n.fromString) {
                    if (n.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
                    this.map = function cI(t, n) {
                        const e = new Map;
                        return t.length > 0 && t.replace(/^\?/, "").split("&").forEach(r => {
                            const o = r.indexOf("="), [s, a] = -1 == o ? [n.decodeKey(r), ""] : [n.decodeKey(r.slice(0, o)), n.decodeValue(r.slice(o + 1))],
                                l = e.get(s) || [];
                            l.push(a), e.set(s, l)
                        }), e
                    }(n.fromString, this.encoder)
                } else n.fromObject ? (this.map = new Map, Object.keys(n.fromObject).forEach(e => {
                    const i = n.fromObject[e], r = Array.isArray(i) ? i.map(xa) : [xa(i)];
                    this.map.set(e, r)
                })) : this.map = null
            }

            has(n) {
                return this.init(), this.map.has(n)
            }

            get(n) {
                this.init();
                const e = this.map.get(n);
                return e ? e[0] : null
            }

            getAll(n) {
                return this.init(), this.map.get(n) || null
            }

            keys() {
                return this.init(), Array.from(this.map.keys())
            }

            append(n, e) {
                return this.clone({param: n, value: e, op: "a"})
            }

            appendAll(n) {
                const e = [];
                return Object.keys(n).forEach(i => {
                    const r = n[i];
                    Array.isArray(r) ? r.forEach(o => {
                        e.push({param: i, value: o, op: "a"})
                    }) : e.push({param: i, value: r, op: "a"})
                }), this.clone(e)
            }

            set(n, e) {
                return this.clone({param: n, value: e, op: "s"})
            }

            delete(n, e) {
                return this.clone({param: n, value: e, op: "d"})
            }

            toString() {
                return this.init(), this.keys().map(n => {
                    const e = this.encoder.encodeKey(n);
                    return this.map.get(n).map(i => e + "=" + this.encoder.encodeValue(i)).join("&")
                }).filter(n => "" !== n).join("&")
            }

            clone(n) {
                const e = new ti({encoder: this.encoder});
                return e.cloneFrom = this.cloneFrom || this, e.updates = (this.updates || []).concat(n), e
            }

            init() {
                null === this.map && (this.map = new Map), null !== this.cloneFrom && (this.cloneFrom.init(), this.cloneFrom.keys().forEach(n => this.map.set(n, this.cloneFrom.map.get(n))), this.updates.forEach(n => {
                    switch (n.op) {
                        case"a":
                        case"s":
                            const e = ("a" === n.op ? this.map.get(n.param) : void 0) || [];
                            e.push(xa(n.value)), this.map.set(n.param, e);
                            break;
                        case"d":
                            if (void 0 === n.value) {
                                this.map.delete(n.param);
                                break
                            }
                        {
                            let i = this.map.get(n.param) || [];
                            const r = i.indexOf(xa(n.value));
                            -1 !== r && i.splice(r, 1), i.length > 0 ? this.map.set(n.param, i) : this.map.delete(n.param)
                        }
                    }
                }), this.cloneFrom = this.updates = null)
            }
        }

        class hI {
            constructor() {
                this.map = new Map
            }

            set(n, e) {
                return this.map.set(n, e), this
            }

            get(n) {
                return this.map.has(n) || this.map.set(n, n.defaultValue()), this.map.get(n)
            }

            delete(n) {
                return this.map.delete(n), this
            }

            has(n) {
                return this.map.has(n)
            }

            keys() {
                return this.map.keys()
            }
        }

        function Y_(t) {
            return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer
        }

        function K_(t) {
            return typeof Blob < "u" && t instanceof Blob
        }

        function Z_(t) {
            return typeof FormData < "u" && t instanceof FormData
        }

        class Mo {
            constructor(n, e, i, r) {
                let o;
                if (this.url = e, this.body = null, this.reportProgress = !1, this.withCredentials = !1, this.responseType = "json", this.method = n.toUpperCase(), function fI(t) {
                    switch (t) {
                        case"DELETE":
                        case"GET":
                        case"HEAD":
                        case"OPTIONS":
                        case"JSONP":
                            return !1;
                        default:
                            return !0
                    }
                }(this.method) || r ? (this.body = void 0 !== i ? i : null, o = r) : o = i, o && (this.reportProgress = !!o.reportProgress, this.withCredentials = !!o.withCredentials, o.responseType && (this.responseType = o.responseType), o.headers && (this.headers = o.headers), o.context && (this.context = o.context), o.params && (this.params = o.params)), this.headers || (this.headers = new Hn), this.context || (this.context = new hI), this.params) {
                    const s = this.params.toString();
                    if (0 === s.length) this.urlWithParams = e; else {
                        const a = e.indexOf("?");
                        this.urlWithParams = e + (-1 === a ? "?" : a < e.length - 1 ? "&" : "") + s
                    }
                } else this.params = new ti, this.urlWithParams = e
            }

            serializeBody() {
                return null === this.body ? null : Y_(this.body) || K_(this.body) || Z_(this.body) || function pI(t) {
                    return typeof URLSearchParams < "u" && t instanceof URLSearchParams
                }(this.body) || "string" == typeof this.body ? this.body : this.body instanceof ti ? this.body.toString() : "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString()
            }

            detectContentTypeHeader() {
                return null === this.body || Z_(this.body) ? null : K_(this.body) ? this.body.type || null : Y_(this.body) ? null : "string" == typeof this.body ? "text/plain" : this.body instanceof ti ? "application/x-www-form-urlencoded;charset=UTF-8" : "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body ? "application/json" : null
            }

            clone(n = {}) {
                const e = n.method || this.method, i = n.url || this.url, r = n.responseType || this.responseType,
                    o = void 0 !== n.body ? n.body : this.body,
                    s = void 0 !== n.withCredentials ? n.withCredentials : this.withCredentials,
                    a = void 0 !== n.reportProgress ? n.reportProgress : this.reportProgress;
                let l = n.headers || this.headers, c = n.params || this.params;
                const u = n.context ?? this.context;
                return void 0 !== n.setHeaders && (l = Object.keys(n.setHeaders).reduce((d, h) => d.set(h, n.setHeaders[h]), l)), n.setParams && (c = Object.keys(n.setParams).reduce((d, h) => d.set(h, n.setParams[h]), c)), new Mo(e, i, o, {
                    params: c,
                    headers: l,
                    context: u,
                    reportProgress: a,
                    responseType: r,
                    withCredentials: s
                })
            }
        }

        var je = (() => ((je = je || {})[je.Sent = 0] = "Sent", je[je.UploadProgress = 1] = "UploadProgress", je[je.ResponseHeader = 2] = "ResponseHeader", je[je.DownloadProgress = 3] = "DownloadProgress", je[je.Response = 4] = "Response", je[je.User = 5] = "User", je))();

        class hd {
            constructor(n, e = 200, i = "OK") {
                this.headers = n.headers || new Hn, this.status = void 0 !== n.status ? n.status : e, this.statusText = n.statusText || i, this.url = n.url || null, this.ok = this.status >= 200 && this.status < 300
            }
        }

        class fd extends hd {
            constructor(n = {}) {
                super(n), this.type = je.ResponseHeader
            }

            clone(n = {}) {
                return new fd({
                    headers: n.headers || this.headers,
                    status: void 0 !== n.status ? n.status : this.status,
                    statusText: n.statusText || this.statusText,
                    url: n.url || this.url || void 0
                })
            }
        }

        class Ma extends hd {
            constructor(n = {}) {
                super(n), this.type = je.Response, this.body = void 0 !== n.body ? n.body : null
            }

            clone(n = {}) {
                return new Ma({
                    body: void 0 !== n.body ? n.body : this.body,
                    headers: n.headers || this.headers,
                    status: void 0 !== n.status ? n.status : this.status,
                    statusText: n.statusText || this.statusText,
                    url: n.url || this.url || void 0
                })
            }
        }

        class Q_ extends hd {
            constructor(n) {
                super(n, 0, "Unknown Error"), this.name = "HttpErrorResponse", this.ok = !1, this.message = this.status >= 200 && this.status < 300 ? `Http failure during parsing for ${n.url || "(unknown url)"}` : `Http failure response for ${n.url || "(unknown url)"}: ${n.status} ${n.statusText}`, this.error = n.error || null
            }
        }

        function pd(t, n) {
            return {
                body: n,
                headers: t.headers,
                context: t.context,
                observe: t.observe,
                params: t.params,
                reportProgress: t.reportProgress,
                responseType: t.responseType,
                withCredentials: t.withCredentials
            }
        }

        let gd = (() => {
            class t {
                constructor(e) {
                    this.handler = e
                }

                request(e, i, r = {}) {
                    let o;
                    if (e instanceof Mo) o = e; else {
                        let l, c;
                        l = r.headers instanceof Hn ? r.headers : new Hn(r.headers), r.params && (c = r.params instanceof ti ? r.params : new ti({fromObject: r.params})), o = new Mo(e, i, void 0 !== r.body ? r.body : null, {
                            headers: l,
                            context: r.context,
                            params: c,
                            reportProgress: r.reportProgress,
                            responseType: r.responseType || "json",
                            withCredentials: r.withCredentials
                        })
                    }
                    const s = Cr(o).pipe(function aI(t, n) {
                        return ne(n) ? Fi(t, n, 1) : Fi(t, 1)
                    }(l => this.handler.handle(l)));
                    if (e instanceof Mo || "events" === r.observe) return s;
                    const a = s.pipe(tn(l => l instanceof Ma));
                    switch (r.observe || "body") {
                        case"body":
                            switch (o.responseType) {
                                case"arraybuffer":
                                    return a.pipe(mt(l => {
                                        if (null !== l.body && !(l.body instanceof ArrayBuffer)) throw new Error("Response is not an ArrayBuffer.");
                                        return l.body
                                    }));
                                case"blob":
                                    return a.pipe(mt(l => {
                                        if (null !== l.body && !(l.body instanceof Blob)) throw new Error("Response is not a Blob.");
                                        return l.body
                                    }));
                                case"text":
                                    return a.pipe(mt(l => {
                                        if (null !== l.body && "string" != typeof l.body) throw new Error("Response is not a string.");
                                        return l.body
                                    }));
                                default:
                                    return a.pipe(mt(l => l.body))
                            }
                        case"response":
                            return a;
                        default:
                            throw new Error(`Unreachable: unhandled observe type ${r.observe}}`)
                    }
                }

                delete(e, i = {}) {
                    return this.request("DELETE", e, i)
                }

                get(e, i = {}) {
                    return this.request("GET", e, i)
                }

                head(e, i = {}) {
                    return this.request("HEAD", e, i)
                }

                jsonp(e, i) {
                    return this.request("JSONP", e, {
                        params: (new ti).append(i, "JSONP_CALLBACK"),
                        observe: "body",
                        responseType: "json"
                    })
                }

                options(e, i = {}) {
                    return this.request("OPTIONS", e, i)
                }

                patch(e, i, r = {}) {
                    return this.request("PATCH", e, pd(r, i))
                }

                post(e, i, r = {}) {
                    return this.request("POST", e, pd(r, i))
                }

                put(e, i, r = {}) {
                    return this.request("PUT", e, pd(r, i))
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Sa))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();

        function X_(t, n) {
            return n(t)
        }

        function gI(t, n) {
            return (e, i) => n.intercept(e, {handle: r => t(r, i)})
        }

        const vI = new L("HTTP_INTERCEPTORS"), To = new L("HTTP_INTERCEPTOR_FNS");

        function _I() {
            let t = null;
            return (n, e) => (null === t && (t = (Ni(vI, {optional: !0}) ?? []).reduceRight(gI, X_)), t(n, e))
        }

        let J_ = (() => {
            class t extends Sa {
                constructor(e, i) {
                    super(), this.backend = e, this.injector = i, this.chain = null
                }

                handle(e) {
                    if (null === this.chain) {
                        const i = Array.from(new Set(this.injector.get(To)));
                        this.chain = i.reduceRight((r, o) => function mI(t, n, e) {
                            return (i, r) => e.runInContext(() => n(i, o => t(o, r)))
                        }(r, o, this.injector), X_)
                    }
                    return this.chain(e, i => this.backend.handle(i))
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(dd), W(bi))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const CI = /^\)\]\}',?\n/;
        let ty = (() => {
            class t {
                constructor(e) {
                    this.xhrFactory = e
                }

                handle(e) {
                    if ("JSONP" === e.method) throw new Error("Attempted to construct Jsonp request without HttpClientJsonpModule installed.");
                    return new Re(i => {
                        const r = this.xhrFactory.build();
                        if (r.open(e.method, e.urlWithParams), e.withCredentials && (r.withCredentials = !0), e.headers.forEach((f, p) => r.setRequestHeader(f, p.join(","))), e.headers.has("Accept") || r.setRequestHeader("Accept", "application/json, text/plain, */*"), !e.headers.has("Content-Type")) {
                            const f = e.detectContentTypeHeader();
                            null !== f && r.setRequestHeader("Content-Type", f)
                        }
                        if (e.responseType) {
                            const f = e.responseType.toLowerCase();
                            r.responseType = "json" !== f ? f : "text"
                        }
                        const o = e.serializeBody();
                        let s = null;
                        const a = () => {
                            if (null !== s) return s;
                            const f = r.statusText || "OK", p = new Hn(r.getAllResponseHeaders()), m = function DI(t) {
                                return "responseURL" in t && t.responseURL ? t.responseURL : /^X-Request-URL:/m.test(t.getAllResponseHeaders()) ? t.getResponseHeader("X-Request-URL") : null
                            }(r) || e.url;
                            return s = new fd({headers: p, status: r.status, statusText: f, url: m}), s
                        }, l = () => {
                            let {headers: f, status: p, statusText: m, url: b} = a(), w = null;
                            204 !== p && (w = typeof r.response > "u" ? r.responseText : r.response), 0 === p && (p = w ? 200 : 0);
                            let x = p >= 200 && p < 300;
                            if ("json" === e.responseType && "string" == typeof w) {
                                const y = w;
                                w = w.replace(CI, "");
                                try {
                                    w = "" !== w ? JSON.parse(w) : null
                                } catch (N) {
                                    w = y, x && (x = !1, w = {error: N, text: w})
                                }
                            }
                            x ? (i.next(new Ma({
                                body: w,
                                headers: f,
                                status: p,
                                statusText: m,
                                url: b || void 0
                            })), i.complete()) : i.error(new Q_({
                                error: w,
                                headers: f,
                                status: p,
                                statusText: m,
                                url: b || void 0
                            }))
                        }, c = f => {
                            const {url: p} = a(), m = new Q_({
                                error: f,
                                status: r.status || 0,
                                statusText: r.statusText || "Unknown Error",
                                url: p || void 0
                            });
                            i.error(m)
                        };
                        let u = !1;
                        const d = f => {
                            u || (i.next(a()), u = !0);
                            let p = {type: je.DownloadProgress, loaded: f.loaded};
                            f.lengthComputable && (p.total = f.total), "text" === e.responseType && r.responseText && (p.partialText = r.responseText), i.next(p)
                        }, h = f => {
                            let p = {type: je.UploadProgress, loaded: f.loaded};
                            f.lengthComputable && (p.total = f.total), i.next(p)
                        };
                        return r.addEventListener("load", l), r.addEventListener("error", c), r.addEventListener("timeout", c), r.addEventListener("abort", c), e.reportProgress && (r.addEventListener("progress", d), null !== o && r.upload && r.upload.addEventListener("progress", h)), r.send(o), i.next({type: je.Sent}), () => {
                            r.removeEventListener("error", c), r.removeEventListener("abort", c), r.removeEventListener("load", l), r.removeEventListener("timeout", c), e.reportProgress && (r.removeEventListener("progress", d), null !== o && r.upload && r.upload.removeEventListener("progress", h)), r.readyState !== r.DONE && r.abort()
                        }
                    })
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(D_))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const md = new L("XSRF_ENABLED"),
            ny = new L("XSRF_COOKIE_NAME", {providedIn: "root", factory: () => "XSRF-TOKEN"}),
            iy = new L("XSRF_HEADER_NAME", {providedIn: "root", factory: () => "X-XSRF-TOKEN"});

        class ry {
        }

        let xI = (() => {
            class t {
                constructor(e, i, r) {
                    this.doc = e, this.platform = i, this.cookieName = r, this.lastCookieString = "", this.lastToken = null, this.parseCount = 0
                }

                getToken() {
                    if ("server" === this.platform) return null;
                    const e = this.doc.cookie || "";
                    return e !== this.lastCookieString && (this.parseCount++, this.lastToken = l_(e, this.cookieName), this.lastCookieString = e), this.lastToken
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Xt), W(Mu), W(ny))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();

        function MI(t, n) {
            const e = t.url.toLowerCase();
            if (!Ni(md) || "GET" === t.method || "HEAD" === t.method || e.startsWith("http://") || e.startsWith("https://")) return n(t);
            const i = Ni(ry).getToken(), r = Ni(iy);
            return null != i && !t.headers.has(r) && (t = t.clone({headers: t.headers.set(r, i)})), n(t)
        }

        var Fe = (() => ((Fe = Fe || {})[Fe.Interceptors = 0] = "Interceptors", Fe[Fe.LegacyInterceptors = 1] = "LegacyInterceptors", Fe[Fe.CustomXsrfConfiguration = 2] = "CustomXsrfConfiguration", Fe[Fe.NoXsrfProtection = 3] = "NoXsrfProtection", Fe[Fe.JsonpSupport = 4] = "JsonpSupport", Fe[Fe.RequestsMadeViaParent = 5] = "RequestsMadeViaParent", Fe))();

        function Dr(t, n) {
            return {\u0275kind: t, \u0275providers: n}
        }

        function TI(...t) {
            const n = [gd, ty, J_, {provide: Sa, useExisting: J_}, {provide: dd, useExisting: ty}, {
                provide: To,
                useValue: MI,
                multi: !0
            }, {provide: md, useValue: !0}, {provide: ry, useClass: xI}];
            for (const e of t) n.push(...e.\u0275providers);
            return function pD(t) {
                return {\u0275providers: t}
            }(n)
        }

        const oy = new L("LEGACY_INTERCEPTOR_FN");
        let II = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({
                providers: [TI(Dr(Fe.LegacyInterceptors, [{
                    provide: oy,
                    useFactory: _I
                }, {provide: To, useExisting: oy, multi: !0}]))]
            }), t
        })();
        const {isArray: AI} = Array, {getPrototypeOf: PI, prototype: FI, keys: kI} = Object;
        const {isArray: RI} = Array;

        function sy(t) {
            return mt(n => function VI(t, n) {
                return RI(n) ? t(...n) : t(n)
            }(t, n))
        }

        function BI(t, n) {
            return t.reduce((e, i, r) => (e[i] = n[r], e), {})
        }

        let ay = (() => {
            class t {
                constructor(e, i) {
                    this._renderer = e, this._elementRef = i, this.onChange = r => {
                    }, this.onTouched = () => {
                    }
                }

                setProperty(e, i) {
                    this._renderer.setProperty(this._elementRef.nativeElement, e, i)
                }

                registerOnTouched(e) {
                    this.onTouched = e
                }

                registerOnChange(e) {
                    this.onChange = e
                }

                setDisabledState(e) {
                    this.setProperty("disabled", e)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Ot), g(he))
            }, t.\u0275dir = I({type: t}), t
        })(), xi = (() => {
            class t extends ay {
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275dir = I({type: t, features: [R]}), t
        })();
        const Ct = new L("NgValueAccessor"), UI = {provide: Ct, useExisting: ie(() => Ta), multi: !0},
            zI = new L("CompositionEventMode");
        let Ta = (() => {
            class t extends ay {
                constructor(e, i, r) {
                    super(e, i), this._compositionMode = r, this._composing = !1, null == this._compositionMode && (this._compositionMode = !function $I() {
                        const t = br() ? br().getUserAgent() : "";
                        return /android (\d+)/.test(t.toLowerCase())
                    }())
                }

                writeValue(e) {
                    this.setProperty("value", e ?? "")
                }

                _handleInput(e) {
                    (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(e)
                }

                _compositionStart() {
                    this._composing = !0
                }

                _compositionEnd(e) {
                    this._composing = !1, this._compositionMode && this.onChange(e)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Ot), g(he), g(zI, 8))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
                hostBindings: function (e, i) {
                    1 & e && ce("input", function (o) {
                        return i._handleInput(o.target.value)
                    })("blur", function () {
                        return i.onTouched()
                    })("compositionstart", function () {
                        return i._compositionStart()
                    })("compositionend", function (o) {
                        return i._compositionEnd(o.target.value)
                    })
                },
                features: [ue([UI]), R]
            }), t
        })();
        const GI = !1, st = new L("NgValidators"), ii = new L("NgAsyncValidators");

        function _y(t) {
            return null != t
        }

        function yy(t) {
            const n = zs(t) ? Ko(t) : t;
            if (GI && !yg(n)) {
                let e = "Expected async validator to return Promise or Observable.";
                throw"object" == typeof t && (e += " Are you using a synchronous validator where an async validator is expected?"), new M(-1101, e)
            }
            return n
        }

        function by(t) {
            let n = {};
            return t.forEach(e => {
                n = null != e ? {...n, ...e} : n
            }), 0 === Object.keys(n).length ? null : n
        }

        function wy(t, n) {
            return n.map(e => e(t))
        }

        function Cy(t) {
            return t.map(n => function qI(t) {
                return !t.validate
            }(n) ? n : e => n.validate(e))
        }

        function vd(t) {
            return null != t ? function Dy(t) {
                if (!t) return null;
                const n = t.filter(_y);
                return 0 == n.length ? null : function (e) {
                    return by(wy(e, n))
                }
            }(Cy(t)) : null
        }

        function Ey(t) {
            if (!t) return null;
            const n = t.filter(_y);
            return 0 == n.length ? null : function (e) {
                return function HI(...t) {
                    const n = ph(t), {args: e, keys: i} = function NI(t) {
                        if (1 === t.length) {
                            const n = t[0];
                            if (AI(n)) return {args: n, keys: null};
                            if (function LI(t) {
                                return t && "object" == typeof t && PI(t) === FI
                            }(n)) {
                                const e = kI(n);
                                return {args: e.map(i => n[i]), keys: e}
                            }
                        }
                        return {args: t, keys: null}
                    }(t), r = new Re(o => {
                        const {length: s} = e;
                        if (!s) return void o.complete();
                        const a = new Array(s);
                        let l = s, c = s;
                        for (let u = 0; u < s; u++) {
                            let d = !1;
                            tt(e[u]).subscribe(Ye(o, h => {
                                d || (d = !0, c--), a[u] = h
                            }, () => l--, void 0, () => {
                                (!l || !d) && (c || o.next(i ? BI(i, a) : a), o.complete())
                            }))
                        }
                    });
                    return n ? r.pipe(sy(n)) : r
                }(wy(e, n).map(yy)).pipe(mt(by))
            }
        }

        function _d(t) {
            return null != t ? Ey(Cy(t)) : null
        }

        function Sy(t, n) {
            return null === t ? [n] : Array.isArray(t) ? [...t, n] : [t, n]
        }

        function xy(t) {
            return t._rawValidators
        }

        function My(t) {
            return t._rawAsyncValidators
        }

        function yd(t) {
            return t ? Array.isArray(t) ? t : [t] : []
        }

        function Ia(t, n) {
            return Array.isArray(t) ? t.includes(n) : t === n
        }

        function Ty(t, n) {
            const e = yd(n);
            return yd(t).forEach(r => {
                Ia(e, r) || e.push(r)
            }), e
        }

        function Oy(t, n) {
            return yd(n).filter(e => !Ia(t, e))
        }

        class Iy {
            constructor() {
                this._rawValidators = [], this._rawAsyncValidators = [], this._onDestroyCallbacks = []
            }

            get value() {
                return this.control ? this.control.value : null
            }

            get valid() {
                return this.control ? this.control.valid : null
            }

            get invalid() {
                return this.control ? this.control.invalid : null
            }

            get pending() {
                return this.control ? this.control.pending : null
            }

            get disabled() {
                return this.control ? this.control.disabled : null
            }

            get enabled() {
                return this.control ? this.control.enabled : null
            }

            get errors() {
                return this.control ? this.control.errors : null
            }

            get pristine() {
                return this.control ? this.control.pristine : null
            }

            get dirty() {
                return this.control ? this.control.dirty : null
            }

            get touched() {
                return this.control ? this.control.touched : null
            }

            get status() {
                return this.control ? this.control.status : null
            }

            get untouched() {
                return this.control ? this.control.untouched : null
            }

            get statusChanges() {
                return this.control ? this.control.statusChanges : null
            }

            get valueChanges() {
                return this.control ? this.control.valueChanges : null
            }

            get path() {
                return null
            }

            _setValidators(n) {
                this._rawValidators = n || [], this._composedValidatorFn = vd(this._rawValidators)
            }

            _setAsyncValidators(n) {
                this._rawAsyncValidators = n || [], this._composedAsyncValidatorFn = _d(this._rawAsyncValidators)
            }

            get validator() {
                return this._composedValidatorFn || null
            }

            get asyncValidator() {
                return this._composedAsyncValidatorFn || null
            }

            _registerOnDestroy(n) {
                this._onDestroyCallbacks.push(n)
            }

            _invokeOnDestroyCallbacks() {
                this._onDestroyCallbacks.forEach(n => n()), this._onDestroyCallbacks = []
            }

            reset(n) {
                this.control && this.control.reset(n)
            }

            hasError(n, e) {
                return !!this.control && this.control.hasError(n, e)
            }

            getError(n, e) {
                return this.control ? this.control.getError(n, e) : null
            }
        }

        class pt extends Iy {
            get formDirective() {
                return null
            }

            get path() {
                return null
            }
        }

        class ri extends Iy {
            constructor() {
                super(...arguments), this._parent = null, this.name = null, this.valueAccessor = null
            }
        }

        class Ay {
            constructor(n) {
                this._cd = n
            }

            get isTouched() {
                return !!this._cd?.control?.touched
            }

            get isUntouched() {
                return !!this._cd?.control?.untouched
            }

            get isPristine() {
                return !!this._cd?.control?.pristine
            }

            get isDirty() {
                return !!this._cd?.control?.dirty
            }

            get isValid() {
                return !!this._cd?.control?.valid
            }

            get isInvalid() {
                return !!this._cd?.control?.invalid
            }

            get isPending() {
                return !!this._cd?.control?.pending
            }

            get isSubmitted() {
                return !!this._cd?.submitted
            }
        }

        let Mi = (() => {
            class t extends Ay {
                constructor(e) {
                    super(e)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(ri, 2))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
                hostVars: 14,
                hostBindings: function (e, i) {
                    2 & e && we("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)("ng-pristine", i.isPristine)("ng-dirty", i.isDirty)("ng-valid", i.isValid)("ng-invalid", i.isInvalid)("ng-pending", i.isPending)
                },
                features: [R]
            }), t
        })(), oi = (() => {
            class t extends Ay {
                constructor(e) {
                    super(e)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(pt, 10))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]],
                hostVars: 16,
                hostBindings: function (e, i) {
                    2 & e && we("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)("ng-pristine", i.isPristine)("ng-dirty", i.isDirty)("ng-valid", i.isValid)("ng-invalid", i.isInvalid)("ng-pending", i.isPending)("ng-submitted", i.isSubmitted)
                },
                features: [R]
            }), t
        })();

        function Py(t, n) {
            return t ? `with name: '${n}'` : `at index: ${n}`
        }

        const Cd = !1, Oo = "VALID", Pa = "INVALID", Er = "PENDING", Io = "DISABLED";

        function Dd(t) {
            return (Fa(t) ? t.validators : t) || null
        }

        function Ed(t, n) {
            return (Fa(n) ? n.asyncValidators : t) || null
        }

        function Fa(t) {
            return null != t && !Array.isArray(t) && "object" == typeof t
        }

        class Ny {
            constructor(n, e) {
                this._pendingDirty = !1, this._hasOwnPendingAsyncValidator = !1, this._pendingTouched = !1, this._onCollectionChange = () => {
                }, this._parent = null, this.pristine = !0, this.touched = !1, this._onDisabledChange = [], this._assignValidators(n), this._assignAsyncValidators(e)
            }

            get validator() {
                return this._composedValidatorFn
            }

            set validator(n) {
                this._rawValidators = this._composedValidatorFn = n
            }

            get asyncValidator() {
                return this._composedAsyncValidatorFn
            }

            set asyncValidator(n) {
                this._rawAsyncValidators = this._composedAsyncValidatorFn = n
            }

            get parent() {
                return this._parent
            }

            get valid() {
                return this.status === Oo
            }

            get invalid() {
                return this.status === Pa
            }

            get pending() {
                return this.status == Er
            }

            get disabled() {
                return this.status === Io
            }

            get enabled() {
                return this.status !== Io
            }

            get dirty() {
                return !this.pristine
            }

            get untouched() {
                return !this.touched
            }

            get updateOn() {
                return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
            }

            setValidators(n) {
                this._assignValidators(n)
            }

            setAsyncValidators(n) {
                this._assignAsyncValidators(n)
            }

            addValidators(n) {
                this.setValidators(Ty(n, this._rawValidators))
            }

            addAsyncValidators(n) {
                this.setAsyncValidators(Ty(n, this._rawAsyncValidators))
            }

            removeValidators(n) {
                this.setValidators(Oy(n, this._rawValidators))
            }

            removeAsyncValidators(n) {
                this.setAsyncValidators(Oy(n, this._rawAsyncValidators))
            }

            hasValidator(n) {
                return Ia(this._rawValidators, n)
            }

            hasAsyncValidator(n) {
                return Ia(this._rawAsyncValidators, n)
            }

            clearValidators() {
                this.validator = null
            }

            clearAsyncValidators() {
                this.asyncValidator = null
            }

            markAsTouched(n = {}) {
                this.touched = !0, this._parent && !n.onlySelf && this._parent.markAsTouched(n)
            }

            markAllAsTouched() {
                this.markAsTouched({onlySelf: !0}), this._forEachChild(n => n.markAllAsTouched())
            }

            markAsUntouched(n = {}) {
                this.touched = !1, this._pendingTouched = !1, this._forEachChild(e => {
                    e.markAsUntouched({onlySelf: !0})
                }), this._parent && !n.onlySelf && this._parent._updateTouched(n)
            }

            markAsDirty(n = {}) {
                this.pristine = !1, this._parent && !n.onlySelf && this._parent.markAsDirty(n)
            }

            markAsPristine(n = {}) {
                this.pristine = !0, this._pendingDirty = !1, this._forEachChild(e => {
                    e.markAsPristine({onlySelf: !0})
                }), this._parent && !n.onlySelf && this._parent._updatePristine(n)
            }

            markAsPending(n = {}) {
                this.status = Er, !1 !== n.emitEvent && this.statusChanges.emit(this.status), this._parent && !n.onlySelf && this._parent.markAsPending(n)
            }

            disable(n = {}) {
                const e = this._parentMarkedDirty(n.onlySelf);
                this.status = Io, this.errors = null, this._forEachChild(i => {
                    i.disable({...n, onlySelf: !0})
                }), this._updateValue(), !1 !== n.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._updateAncestors({
                    ...n,
                    skipPristineCheck: e
                }), this._onDisabledChange.forEach(i => i(!0))
            }

            enable(n = {}) {
                const e = this._parentMarkedDirty(n.onlySelf);
                this.status = Oo, this._forEachChild(i => {
                    i.enable({...n, onlySelf: !0})
                }), this.updateValueAndValidity({onlySelf: !0, emitEvent: n.emitEvent}), this._updateAncestors({
                    ...n,
                    skipPristineCheck: e
                }), this._onDisabledChange.forEach(i => i(!1))
            }

            _updateAncestors(n) {
                this._parent && !n.onlySelf && (this._parent.updateValueAndValidity(n), n.skipPristineCheck || this._parent._updatePristine(), this._parent._updateTouched())
            }

            setParent(n) {
                this._parent = n
            }

            getRawValue() {
                return this.value
            }

            updateValueAndValidity(n = {}) {
                this._setInitialStatus(), this._updateValue(), this.enabled && (this._cancelExistingSubscription(), this.errors = this._runValidator(), this.status = this._calculateStatus(), (this.status === Oo || this.status === Er) && this._runAsyncValidator(n.emitEvent)), !1 !== n.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._parent && !n.onlySelf && this._parent.updateValueAndValidity(n)
            }

            _updateTreeValidity(n = {emitEvent: !0}) {
                this._forEachChild(e => e._updateTreeValidity(n)), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: n.emitEvent
                })
            }

            _setInitialStatus() {
                this.status = this._allControlsDisabled() ? Io : Oo
            }

            _runValidator() {
                return this.validator ? this.validator(this) : null
            }

            _runAsyncValidator(n) {
                if (this.asyncValidator) {
                    this.status = Er, this._hasOwnPendingAsyncValidator = !0;
                    const e = yy(this.asyncValidator(this));
                    this._asyncValidationSubscription = e.subscribe(i => {
                        this._hasOwnPendingAsyncValidator = !1, this.setErrors(i, {emitEvent: n})
                    })
                }
            }

            _cancelExistingSubscription() {
                this._asyncValidationSubscription && (this._asyncValidationSubscription.unsubscribe(), this._hasOwnPendingAsyncValidator = !1)
            }

            setErrors(n, e = {}) {
                this.errors = n, this._updateControlsErrors(!1 !== e.emitEvent)
            }

            get(n) {
                let e = n;
                return null == e || (Array.isArray(e) || (e = e.split(".")), 0 === e.length) ? null : e.reduce((i, r) => i && i._find(r), this)
            }

            getError(n, e) {
                const i = e ? this.get(e) : this;
                return i && i.errors ? i.errors[n] : null
            }

            hasError(n, e) {
                return !!this.getError(n, e)
            }

            get root() {
                let n = this;
                for (; n._parent;) n = n._parent;
                return n
            }

            _updateControlsErrors(n) {
                this.status = this._calculateStatus(), n && this.statusChanges.emit(this.status), this._parent && this._parent._updateControlsErrors(n)
            }

            _initObservables() {
                this.valueChanges = new G, this.statusChanges = new G
            }

            _calculateStatus() {
                return this._allControlsDisabled() ? Io : this.errors ? Pa : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Er) ? Er : this._anyControlsHaveStatus(Pa) ? Pa : Oo
            }

            _anyControlsHaveStatus(n) {
                return this._anyControls(e => e.status === n)
            }

            _anyControlsDirty() {
                return this._anyControls(n => n.dirty)
            }

            _anyControlsTouched() {
                return this._anyControls(n => n.touched)
            }

            _updatePristine(n = {}) {
                this.pristine = !this._anyControlsDirty(), this._parent && !n.onlySelf && this._parent._updatePristine(n)
            }

            _updateTouched(n = {}) {
                this.touched = this._anyControlsTouched(), this._parent && !n.onlySelf && this._parent._updateTouched(n)
            }

            _registerOnCollectionChange(n) {
                this._onCollectionChange = n
            }

            _setUpdateStrategy(n) {
                Fa(n) && null != n.updateOn && (this._updateOn = n.updateOn)
            }

            _parentMarkedDirty(n) {
                return !n && !(!this._parent || !this._parent.dirty) && !this._parent._anyControlsDirty()
            }

            _find(n) {
                return null
            }

            _assignValidators(n) {
                this._rawValidators = Array.isArray(n) ? n.slice() : n, this._composedValidatorFn = function eA(t) {
                    return Array.isArray(t) ? vd(t) : t || null
                }(this._rawValidators)
            }

            _assignAsyncValidators(n) {
                this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n, this._composedAsyncValidatorFn = function tA(t) {
                    return Array.isArray(t) ? _d(t) : t || null
                }(this._rawAsyncValidators)
            }
        }

        class ka extends Ny {
            constructor(n, e, i) {
                super(Dd(e), Ed(i, e)), this.controls = n, this._initObservables(), this._setUpdateStrategy(e), this._setUpControls(), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: !!this.asyncValidator
                })
            }

            registerControl(n, e) {
                return this.controls[n] ? this.controls[n] : (this.controls[n] = e, e.setParent(this), e._registerOnCollectionChange(this._onCollectionChange), e)
            }

            addControl(n, e, i = {}) {
                this.registerControl(n, e), this.updateValueAndValidity({emitEvent: i.emitEvent}), this._onCollectionChange()
            }

            removeControl(n, e = {}) {
                this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {
                }), delete this.controls[n], this.updateValueAndValidity({emitEvent: e.emitEvent}), this._onCollectionChange()
            }

            setControl(n, e, i = {}) {
                this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {
                }), delete this.controls[n], e && this.registerControl(n, e), this.updateValueAndValidity({emitEvent: i.emitEvent}), this._onCollectionChange()
            }

            contains(n) {
                return this.controls.hasOwnProperty(n) && this.controls[n].enabled
            }

            setValue(n, e = {}) {
                (function ky(t, n, e) {
                    t._forEachChild((i, r) => {
                        if (void 0 === e[r]) throw new M(1002, Cd ? function JI(t, n) {
                            return `Must supply a value for form control ${Py(t, n)}`
                        }(n, r) : "")
                    })
                })(this, !0, n), Object.keys(n).forEach(i => {
                    (function Fy(t, n, e) {
                        const i = t.controls;
                        if (!(n ? Object.keys(i) : i).length) throw new M(1e3, Cd ? function QI(t) {
                            return `\n    There are no form controls registered with this ${t ? "group" : "array"} yet. If you're using ngModel,\n    you may want to check next tick (e.g. use setTimeout).\n  `
                        }(n) : "");
                        if (!i[e]) throw new M(1001, Cd ? function XI(t, n) {
                            return `Cannot find form control ${Py(t, n)}`
                        }(n, e) : "")
                    })(this, !0, i), this.controls[i].setValue(n[i], {onlySelf: !0, emitEvent: e.emitEvent})
                }), this.updateValueAndValidity(e)
            }

            patchValue(n, e = {}) {
                null != n && (Object.keys(n).forEach(i => {
                    const r = this.controls[i];
                    r && r.patchValue(n[i], {onlySelf: !0, emitEvent: e.emitEvent})
                }), this.updateValueAndValidity(e))
            }

            reset(n = {}, e = {}) {
                this._forEachChild((i, r) => {
                    i.reset(n[r], {onlySelf: !0, emitEvent: e.emitEvent})
                }), this._updatePristine(e), this._updateTouched(e), this.updateValueAndValidity(e)
            }

            getRawValue() {
                return this._reduceChildren({}, (n, e, i) => (n[i] = e.getRawValue(), n))
            }

            _syncPendingControls() {
                let n = this._reduceChildren(!1, (e, i) => !!i._syncPendingControls() || e);
                return n && this.updateValueAndValidity({onlySelf: !0}), n
            }

            _forEachChild(n) {
                Object.keys(this.controls).forEach(e => {
                    const i = this.controls[e];
                    i && n(i, e)
                })
            }

            _setUpControls() {
                this._forEachChild(n => {
                    n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange)
                })
            }

            _updateValue() {
                this.value = this._reduceValue()
            }

            _anyControls(n) {
                for (const [e, i] of Object.entries(this.controls)) if (this.contains(e) && n(i)) return !0;
                return !1
            }

            _reduceValue() {
                return this._reduceChildren({}, (e, i, r) => ((i.enabled || this.disabled) && (e[r] = i.value), e))
            }

            _reduceChildren(n, e) {
                let i = n;
                return this._forEachChild((r, o) => {
                    i = e(i, r, o)
                }), i
            }

            _allControlsDisabled() {
                for (const n of Object.keys(this.controls)) if (this.controls[n].enabled) return !1;
                return Object.keys(this.controls).length > 0 || this.disabled
            }

            _find(n) {
                return this.controls.hasOwnProperty(n) ? this.controls[n] : null
            }
        }

        const Ti = new L("CallSetDisabledState", {providedIn: "root", factory: () => Ao}), Ao = "always";

        function Po(t, n, e = Ao) {
            Sd(t, n), n.valueAccessor.writeValue(t.value), (t.disabled || "always" === e) && n.valueAccessor.setDisabledState?.(t.disabled), function rA(t, n) {
                n.valueAccessor.registerOnChange(e => {
                    t._pendingValue = e, t._pendingChange = !0, t._pendingDirty = !0, "change" === t.updateOn && Ly(t, n)
                })
            }(t, n), function sA(t, n) {
                const e = (i, r) => {
                    n.valueAccessor.writeValue(i), r && n.viewToModelUpdate(i)
                };
                t.registerOnChange(e), n._registerOnDestroy(() => {
                    t._unregisterOnChange(e)
                })
            }(t, n), function oA(t, n) {
                n.valueAccessor.registerOnTouched(() => {
                    t._pendingTouched = !0, "blur" === t.updateOn && t._pendingChange && Ly(t, n), "submit" !== t.updateOn && t.markAsTouched()
                })
            }(t, n), function iA(t, n) {
                if (n.valueAccessor.setDisabledState) {
                    const e = i => {
                        n.valueAccessor.setDisabledState(i)
                    };
                    t.registerOnDisabledChange(e), n._registerOnDestroy(() => {
                        t._unregisterOnDisabledChange(e)
                    })
                }
            }(t, n)
        }

        function La(t, n, e = !0) {
            const i = () => {
            };
            n.valueAccessor && (n.valueAccessor.registerOnChange(i), n.valueAccessor.registerOnTouched(i)), Va(t, n), t && (n._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {
            }))
        }

        function Ra(t, n) {
            t.forEach(e => {
                e.registerOnValidatorChange && e.registerOnValidatorChange(n)
            })
        }

        function Sd(t, n) {
            const e = xy(t);
            null !== n.validator ? t.setValidators(Sy(e, n.validator)) : "function" == typeof e && t.setValidators([e]);
            const i = My(t);
            null !== n.asyncValidator ? t.setAsyncValidators(Sy(i, n.asyncValidator)) : "function" == typeof i && t.setAsyncValidators([i]);
            const r = () => t.updateValueAndValidity();
            Ra(n._rawValidators, r), Ra(n._rawAsyncValidators, r)
        }

        function Va(t, n) {
            let e = !1;
            if (null !== t) {
                if (null !== n.validator) {
                    const r = xy(t);
                    if (Array.isArray(r) && r.length > 0) {
                        const o = r.filter(s => s !== n.validator);
                        o.length !== r.length && (e = !0, t.setValidators(o))
                    }
                }
                if (null !== n.asyncValidator) {
                    const r = My(t);
                    if (Array.isArray(r) && r.length > 0) {
                        const o = r.filter(s => s !== n.asyncValidator);
                        o.length !== r.length && (e = !0, t.setAsyncValidators(o))
                    }
                }
            }
            const i = () => {
            };
            return Ra(n._rawValidators, i), Ra(n._rawAsyncValidators, i), e
        }

        function Ly(t, n) {
            t._pendingDirty && t.markAsDirty(), t.setValue(t._pendingValue, {emitModelToViewChange: !1}), n.viewToModelUpdate(t._pendingValue), t._pendingChange = !1
        }

        function By(t, n) {
            const e = t.indexOf(n);
            e > -1 && t.splice(e, 1)
        }

        function Hy(t) {
            return "object" == typeof t && null !== t && 2 === Object.keys(t).length && "value" in t && "disabled" in t
        }

        const Oi = class extends Ny {
            constructor(n = null, e, i) {
                super(Dd(e), Ed(i, e)), this.defaultValue = null, this._onChange = [], this._pendingChange = !1, this._applyFormState(n), this._setUpdateStrategy(e), this._initObservables(), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: !!this.asyncValidator
                }), Fa(e) && (e.nonNullable || e.initialValueIsDefault) && (this.defaultValue = Hy(n) ? n.value : n)
            }

            setValue(n, e = {}) {
                this.value = this._pendingValue = n, this._onChange.length && !1 !== e.emitModelToViewChange && this._onChange.forEach(i => i(this.value, !1 !== e.emitViewToModelChange)), this.updateValueAndValidity(e)
            }

            patchValue(n, e = {}) {
                this.setValue(n, e)
            }

            reset(n = this.defaultValue, e = {}) {
                this._applyFormState(n), this.markAsPristine(e), this.markAsUntouched(e), this.setValue(this.value, e), this._pendingChange = !1
            }

            _updateValue() {
            }

            _anyControls(n) {
                return !1
            }

            _allControlsDisabled() {
                return this.disabled
            }

            registerOnChange(n) {
                this._onChange.push(n)
            }

            _unregisterOnChange(n) {
                By(this._onChange, n)
            }

            registerOnDisabledChange(n) {
                this._onDisabledChange.push(n)
            }

            _unregisterOnDisabledChange(n) {
                By(this._onDisabledChange, n)
            }

            _forEachChild(n) {
            }

            _syncPendingControls() {
                return !("submit" !== this.updateOn || (this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), !this._pendingChange) || (this.setValue(this._pendingValue, {
                    onlySelf: !0,
                    emitModelToViewChange: !1
                }), 0))
            }

            _applyFormState(n) {
                Hy(n) ? (this.value = this._pendingValue = n.value, n.disabled ? this.disable({
                    onlySelf: !0,
                    emitEvent: !1
                }) : this.enable({onlySelf: !0, emitEvent: !1})) : this.value = this._pendingValue = n
            }
        };
        let Wy = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({}), t
        })();
        const Id = new L("NgModelWithFormControlWarning"), wA = {provide: pt, useExisting: ie(() => Mn)};
        let Mn = (() => {
            class t extends pt {
                constructor(e, i, r) {
                    super(), this.callSetDisabledState = r, this.submitted = !1, this._onCollectionChange = () => this._updateDomValue(), this.directives = [], this.form = null, this.ngSubmit = new G, this._setValidators(e), this._setAsyncValidators(i)
                }

                ngOnChanges(e) {
                    this._checkFormPresent(), e.hasOwnProperty("form") && (this._updateValidators(), this._updateDomValue(), this._updateRegistrations(), this._oldForm = this.form)
                }

                ngOnDestroy() {
                    this.form && (Va(this.form, this), this.form._onCollectionChange === this._onCollectionChange && this.form._registerOnCollectionChange(() => {
                    }))
                }

                get formDirective() {
                    return this
                }

                get control() {
                    return this.form
                }

                get path() {
                    return []
                }

                addControl(e) {
                    const i = this.form.get(e.path);
                    return Po(i, e, this.callSetDisabledState), i.updateValueAndValidity({emitEvent: !1}), this.directives.push(e), i
                }

                getControl(e) {
                    return this.form.get(e.path)
                }

                removeControl(e) {
                    La(e.control || null, e, !1), function uA(t, n) {
                        const e = t.indexOf(n);
                        e > -1 && t.splice(e, 1)
                    }(this.directives, e)
                }

                addFormGroup(e) {
                    this._setUpFormContainer(e)
                }

                removeFormGroup(e) {
                    this._cleanUpFormContainer(e)
                }

                getFormGroup(e) {
                    return this.form.get(e.path)
                }

                addFormArray(e) {
                    this._setUpFormContainer(e)
                }

                removeFormArray(e) {
                    this._cleanUpFormContainer(e)
                }

                getFormArray(e) {
                    return this.form.get(e.path)
                }

                updateModel(e, i) {
                    this.form.get(e.path).setValue(i)
                }

                onSubmit(e) {
                    return this.submitted = !0, function Vy(t, n) {
                        t._syncPendingControls(), n.forEach(e => {
                            const i = e.control;
                            "submit" === i.updateOn && i._pendingChange && (e.viewToModelUpdate(i._pendingValue), i._pendingChange = !1)
                        })
                    }(this.form, this.directives), this.ngSubmit.emit(e), "dialog" === e?.target?.method
                }

                onReset() {
                    this.resetForm()
                }

                resetForm(e) {
                    this.form.reset(e), this.submitted = !1
                }

                _updateDomValue() {
                    this.directives.forEach(e => {
                        const i = e.control, r = this.form.get(e.path);
                        i !== r && (La(i || null, e), (t => t instanceof Oi)(r) && (Po(r, e, this.callSetDisabledState), e.control = r))
                    }), this.form._updateTreeValidity({emitEvent: !1})
                }

                _setUpFormContainer(e) {
                    const i = this.form.get(e.path);
                    (function Ry(t, n) {
                        Sd(t, n)
                    })(i, e), i.updateValueAndValidity({emitEvent: !1})
                }

                _cleanUpFormContainer(e) {
                    if (this.form) {
                        const i = this.form.get(e.path);
                        i && function aA(t, n) {
                            return Va(t, n)
                        }(i, e) && i.updateValueAndValidity({emitEvent: !1})
                    }
                }

                _updateRegistrations() {
                    this.form._registerOnCollectionChange(this._onCollectionChange), this._oldForm && this._oldForm._registerOnCollectionChange(() => {
                    })
                }

                _updateValidators() {
                    Sd(this.form, this), this._oldForm && Va(this._oldForm, this)
                }

                _checkFormPresent() {
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(st, 10), g(ii, 10), g(Ti, 8))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "formGroup", ""]],
                hostBindings: function (e, i) {
                    1 & e && ce("submit", function (o) {
                        return i.onSubmit(o)
                    })("reset", function () {
                        return i.onReset()
                    })
                },
                inputs: {form: ["formGroup", "form"]},
                outputs: {ngSubmit: "ngSubmit"},
                exportAs: ["ngForm"],
                features: [ue([wA]), R, nt]
            }), t
        })();
        const EA = {provide: ri, useExisting: ie(() => jn)};
        let jn = (() => {
            class t extends ri {
                set isDisabled(e) {
                }

                constructor(e, i, r, o, s) {
                    super(), this._ngModelWarningConfig = s, this._added = !1, this.update = new G, this._ngModelWarningSent = !1, this._parent = e, this._setValidators(i), this._setAsyncValidators(r), this.valueAccessor = function Td(t, n) {
                        if (!n) return null;
                        let e, i, r;
                        return Array.isArray(n), n.forEach(o => {
                            o.constructor === Ta ? e = o : function cA(t) {
                                return Object.getPrototypeOf(t.constructor) === xi
                            }(o) ? i = o : r = o
                        }), r || i || e || null
                    }(0, o)
                }

                ngOnChanges(e) {
                    this._added || this._setUpControl(), function Md(t, n) {
                        if (!t.hasOwnProperty("model")) return !1;
                        const e = t.model;
                        return !!e.isFirstChange() || !Object.is(n, e.currentValue)
                    }(e, this.viewModel) && (this.viewModel = this.model, this.formDirective.updateModel(this, this.model))
                }

                ngOnDestroy() {
                    this.formDirective && this.formDirective.removeControl(this)
                }

                viewToModelUpdate(e) {
                    this.viewModel = e, this.update.emit(e)
                }

                get path() {
                    return function Na(t, n) {
                        return [...n.path, t]
                    }(null == this.name ? this.name : this.name.toString(), this._parent)
                }

                get formDirective() {
                    return this._parent ? this._parent.formDirective : null
                }

                _checkParentType() {
                }

                _setUpControl() {
                    this._checkParentType(), this.control = this.formDirective.addControl(this), this._added = !0
                }
            }

            return t._ngModelWarningSentOnce = !1, t.\u0275fac = function (e) {
                return new (e || t)(g(pt, 13), g(st, 10), g(ii, 10), g(Ct, 10), g(Id, 8))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "formControlName", ""]],
                inputs: {
                    name: ["formControlName", "name"],
                    isDisabled: ["disabled", "isDisabled"],
                    model: ["ngModel", "model"]
                },
                outputs: {update: "ngModelChange"},
                features: [ue([EA]), R, nt]
            }), t
        })(), lb = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({imports: [Wy]}), t
        })(), HA = (() => {
            class t {
                static withConfig(e) {
                    return {ngModule: t, providers: [{provide: Ti, useValue: e.callSetDisabledState ?? Ao}]}
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({imports: [lb]}), t
        })(), jA = (() => {
            class t {
                static withConfig(e) {
                    return {
                        ngModule: t,
                        providers: [{provide: Id, useValue: e.warnOnNgModelWithFormControl ?? "always"}, {
                            provide: Ti,
                            useValue: e.callSetDisabledState ?? Ao
                        }]
                    }
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({imports: [lb]}), t
        })();

        function Qe(t) {
            return et((n, e) => {
                tt(t).subscribe(Ye(e, () => e.complete(), Or)), !e.closed && n.subscribe(e)
            })
        }

        class UA extends jt {
            constructor(n, e) {
                super()
            }

            schedule(n, e = 0) {
                return this
            }
        }

        const Ba = {
            setInterval(t, n, ...e) {
                const {delegate: i} = Ba;
                return i?.setInterval ? i.setInterval(t, n, ...e) : setInterval(t, n, ...e)
            }, clearInterval(t) {
                const {delegate: n} = Ba;
                return (n?.clearInterval || clearInterval)(t)
            }, delegate: void 0
        };

        class Ld extends UA {
            constructor(n, e) {
                super(n, e), this.scheduler = n, this.work = e, this.pending = !1
            }

            schedule(n, e = 0) {
                var i;
                if (this.closed) return this;
                this.state = n;
                const r = this.id, o = this.scheduler;
                return null != r && (this.id = this.recycleAsyncId(o, r, e)), this.pending = !0, this.delay = e, this.id = null !== (i = this.id) && void 0 !== i ? i : this.requestAsyncId(o, this.id, e), this
            }

            requestAsyncId(n, e, i = 0) {
                return Ba.setInterval(n.flush.bind(n, this), i)
            }

            recycleAsyncId(n, e, i = 0) {
                if (null != i && this.delay === i && !1 === this.pending) return e;
                null != e && Ba.clearInterval(e)
            }

            execute(n, e) {
                if (this.closed) return new Error("executing a cancelled action");
                this.pending = !1;
                const i = this._execute(n, e);
                if (i) return i;
                !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
            }

            _execute(n, e) {
                let r, i = !1;
                try {
                    this.work(n)
                } catch (o) {
                    i = !0, r = o || new Error("Scheduled action threw falsy error")
                }
                if (i) return this.unsubscribe(), r
            }

            unsubscribe() {
                if (!this.closed) {
                    const {id: n, scheduler: e} = this, {actions: i} = e;
                    this.work = this.state = this.scheduler = null, this.pending = !1, Pi(i, this), null != n && (this.id = this.recycleAsyncId(e, n, null)), this.delay = null, super.unsubscribe()
                }
            }
        }

        const Rd = {now: () => (Rd.delegate || Date).now(), delegate: void 0};

        class ko {
            constructor(n, e = ko.now) {
                this.schedulerActionCtor = n, this.now = e
            }

            schedule(n, e = 0, i) {
                return new this.schedulerActionCtor(this, n).schedule(i, e)
            }
        }

        ko.now = Rd.now;

        class Vd extends ko {
            constructor(n, e = ko.now) {
                super(n, e), this.actions = [], this._active = !1
            }

            flush(n) {
                const {actions: e} = this;
                if (this._active) return void e.push(n);
                let i;
                this._active = !0;
                do {
                    if (i = n.execute(n.state, n.delay)) break
                } while (n = e.shift());
                if (this._active = !1, i) {
                    for (; n = e.shift();) n.unsubscribe();
                    throw i
                }
            }
        }

        const Ha = new Vd(Ld), $A = Ha;

        function cb(t = 0, n, e = $A) {
            let i = -1;
            return null != n && (fh(n) ? e = n : i = n), new Re(r => {
                let o = function GA(t) {
                    return t instanceof Date && !isNaN(t)
                }(t) ? +t - e.now() : t;
                o < 0 && (o = 0);
                let s = 0;
                return e.schedule(function () {
                    r.closed || (r.next(s++), 0 <= i ? this.schedule(void 0, i) : r.complete())
                }, o)
            })
        }

        function Bd(...t) {
            return function qA() {
                return hh(1)
            }()(Ko(t, Yo(t)))
        }

        function ub(...t) {
            const n = Yo(t);
            return et((e, i) => {
                (n ? Bd(t, e, n) : Bd(t, e)).subscribe(i)
            })
        }

        function db(t, n = Ha) {
            return et((e, i) => {
                let r = null, o = null, s = null;
                const a = () => {
                    if (r) {
                        r.unsubscribe(), r = null;
                        const c = o;
                        o = null, i.next(c)
                    }
                };

                function l() {
                    const c = s + t, u = n.now();
                    if (u < c) return r = this.schedule(void 0, c - u), void i.add(r);
                    a()
                }

                e.subscribe(Ye(i, c => {
                    o = c, s = n.now(), r || (r = n.schedule(l, t), i.add(r))
                }, () => {
                    a(), i.complete()
                }, void 0, () => {
                    o = r = null
                }))
            })
        }

        const No = {
            schedule(t) {
                let n = requestAnimationFrame, e = cancelAnimationFrame;
                const {delegate: i} = No;
                i && (n = i.requestAnimationFrame, e = i.cancelAnimationFrame);
                const r = n(o => {
                    e = void 0, t(o)
                });
                return new jt(() => e?.(r))
            }, requestAnimationFrame(...t) {
                const {delegate: n} = No;
                return (n?.requestAnimationFrame || requestAnimationFrame)(...t)
            }, cancelAnimationFrame(...t) {
                const {delegate: n} = No;
                return (n?.cancelAnimationFrame || cancelAnimationFrame)(...t)
            }, delegate: void 0
        }, QA = new class ZA extends Vd {
            flush(n) {
                this._active = !0;
                const e = this._scheduled;
                this._scheduled = void 0;
                const {actions: i} = this;
                let r;
                n = n || i.shift();
                do {
                    if (r = n.execute(n.state, n.delay)) break
                } while ((n = i[0]) && n.id === e && i.shift());
                if (this._active = !1, r) {
                    for (; (n = i[0]) && n.id === e && i.shift();) n.unsubscribe();
                    throw r
                }
            }
        }(class KA extends Ld {
            constructor(n, e) {
                super(n, e), this.scheduler = n, this.work = e
            }

            requestAsyncId(n, e, i = 0) {
                return null !== i && i > 0 ? super.requestAsyncId(n, e, i) : (n.actions.push(this), n._scheduled || (n._scheduled = No.requestAnimationFrame(() => n.flush(void 0))))
            }

            recycleAsyncId(n, e, i = 0) {
                var r;
                if (null != i ? i > 0 : this.delay > 0) return super.recycleAsyncId(n, e, i);
                const {actions: o} = n;
                null != e && (null === (r = o[o.length - 1]) || void 0 === r ? void 0 : r.id) !== e && (No.cancelAnimationFrame(e), n._scheduled = void 0)
            }
        });
        let Hd, XA = 1;
        const ja = {};

        function hb(t) {
            return t in ja && (delete ja[t], !0)
        }

        const JA = {
                setImmediate(t) {
                    const n = XA++;
                    return ja[n] = !0, Hd || (Hd = Promise.resolve()), Hd.then(() => hb(n) && t()), n
                }, clearImmediate(t) {
                    hb(t)
                }
            }, {setImmediate: eP, clearImmediate: tP} = JA, Ua = {
                setImmediate(...t) {
                    const {delegate: n} = Ua;
                    return (n?.setImmediate || eP)(...t)
                }, clearImmediate(t) {
                    const {delegate: n} = Ua;
                    return (n?.clearImmediate || tP)(t)
                }, delegate: void 0
            }, rP = new class iP extends Vd {
                flush(n) {
                    this._active = !0;
                    const e = this._scheduled;
                    this._scheduled = void 0;
                    const {actions: i} = this;
                    let r;
                    n = n || i.shift();
                    do {
                        if (r = n.execute(n.state, n.delay)) break
                    } while ((n = i[0]) && n.id === e && i.shift());
                    if (this._active = !1, r) {
                        for (; (n = i[0]) && n.id === e && i.shift();) n.unsubscribe();
                        throw r
                    }
                }
            }(class nP extends Ld {
                constructor(n, e) {
                    super(n, e), this.scheduler = n, this.work = e
                }

                requestAsyncId(n, e, i = 0) {
                    return null !== i && i > 0 ? super.requestAsyncId(n, e, i) : (n.actions.push(this), n._scheduled || (n._scheduled = Ua.setImmediate(n.flush.bind(n, void 0))))
                }

                recycleAsyncId(n, e, i = 0) {
                    var r;
                    if (null != i ? i > 0 : this.delay > 0) return super.recycleAsyncId(n, e, i);
                    const {actions: o} = n;
                    null != e && (null === (r = o[o.length - 1]) || void 0 === r ? void 0 : r.id) !== e && (Ua.clearImmediate(e), n._scheduled === e && (n._scheduled = void 0))
                }
            }), oP = ["addListener", "removeListener"], sP = ["addEventListener", "removeEventListener"],
            aP = ["on", "off"];

        function Un(t, n, e, i) {
            if (ne(e) && (i = e, e = void 0), i) return Un(t, n, e).pipe(sy(i));
            const [r, o] = function uP(t) {
                return ne(t.addEventListener) && ne(t.removeEventListener)
            }(t) ? sP.map(s => a => t[s](n, a, e)) : function lP(t) {
                return ne(t.addListener) && ne(t.removeListener)
            }(t) ? oP.map(fb(t, n)) : function cP(t) {
                return ne(t.on) && ne(t.off)
            }(t) ? aP.map(fb(t, n)) : [];
            if (!r && ll(t)) return Fi(s => Un(s, n, e))(tt(t));
            if (!r) throw new TypeError("Invalid event target");
            return new Re(s => {
                const a = (...l) => s.next(1 < l.length ? l : l[0]);
                return r(a), () => o(a)
            })
        }

        function fb(t, n) {
            return e => i => t[e](n, i)
        }

        const dP = ["content"], hP = ["scroll"], fP = ["padding"], Lo = function (t) {
            return {searchTerm: t}
        };

        function pP(t, n) {
            if (1 & t && (S(0, "div", 6), Yt(1, 7), E()), 2 & t) {
                const e = P();
                _(1), v("ngTemplateOutlet", e.headerTemplate)("ngTemplateOutletContext", Ei(2, Lo, e.filterValue))
            }
        }

        function gP(t, n) {
            if (1 & t && (S(0, "div", 8), Yt(1, 7), E()), 2 & t) {
                const e = P();
                _(1), v("ngTemplateOutlet", e.footerTemplate)("ngTemplateOutletContext", Ei(2, Lo, e.filterValue))
            }
        }

        const pb = ["*"], mP = ["searchInput"];

        function vP(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "span", 15), ce("click", function () {
                    Ke(e);
                    const r = P().$implicit;
                    return Ze(P(2).unselect(r))
                }), Ie(1, "\xd7"), E(), k(2, "span", 16)
            }
            if (2 & t) {
                const e = P().$implicit, i = P(2);
                _(2), v("ngItemLabel", e.label)("escape", i.escapeHTML)
            }
        }

        function _P(t, n) {
        }

        const yP = function (t, n, e) {
            return {item: t, clear: n, label: e}
        };

        function bP(t, n) {
            if (1 & t && (S(0, "div", 12), O(1, vP, 3, 2, "ng-template", null, 13, ft), O(3, _P, 0, 0, "ng-template", 14), E()), 2 & t) {
                const e = n.$implicit, i = Me(2), r = P(2);
                we("ng-value-disabled", e.disabled), _(3), v("ngTemplateOutlet", r.labelTemplate || i)("ngTemplateOutletContext", du(4, yP, e.value, r.clearItem, e.label))
            }
        }

        function wP(t, n) {
            if (1 & t && (Te(0), O(1, bP, 4, 8, "div", 11), Oe()), 2 & t) {
                const e = P();
                _(1), v("ngForOf", e.selectedItems)("ngForTrackBy", e.trackByOption)
            }
        }

        function CP(t, n) {
        }

        const DP = function (t, n) {
            return {items: t, clear: n}
        };

        function EP(t, n) {
            if (1 & t && O(0, CP, 0, 0, "ng-template", 14), 2 & t) {
                const e = P();
                v("ngTemplateOutlet", e.multiLabelTemplate)("ngTemplateOutletContext", uu(2, DP, e.selectedValues, e.clearItem))
            }
        }

        function SP(t, n) {
            1 & t && k(0, "div", 19)
        }

        function xP(t, n) {
        }

        function MP(t, n) {
            if (1 & t && (Te(0), O(1, SP, 1, 0, "ng-template", null, 17, ft), O(3, xP, 0, 0, "ng-template", 18), Oe()), 2 & t) {
                const e = Me(2), i = P();
                _(3), v("ngTemplateOutlet", i.loadingSpinnerTemplate || e)
            }
        }

        function TP(t, n) {
            1 & t && (S(0, "span", 20)(1, "span", 21), Ie(2, "\xd7"), E()()), 2 & t && Kc("title", P().clearAllText)
        }

        function OP(t, n) {
            if (1 & t && k(0, "span", 27), 2 & t) {
                const e = P().$implicit, i = P(2);
                v("ngItemLabel", e.label)("escape", i.escapeHTML)
            }
        }

        function IP(t, n) {
        }

        const AP = function (t, n, e, i) {
            return {item: t, item$: n, index: e, searchTerm: i}
        };

        function PP(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "div", 25), ce("click", function () {
                    const o = Ke(e).$implicit;
                    return Ze(P(2).toggleItem(o))
                })("mouseover", function () {
                    const o = Ke(e).$implicit;
                    return Ze(P(2).onItemHover(o))
                }), O(1, OP, 1, 2, "ng-template", null, 26, ft), O(3, IP, 0, 0, "ng-template", 14), E()
            }
            if (2 & t) {
                const e = n.$implicit, i = Me(2), r = P(2);
                we("ng-option-disabled", e.disabled)("ng-option-selected", e.selected)("ng-optgroup", e.children)("ng-option", !e.children)("ng-option-child", !!e.parent)("ng-option-marked", e === r.itemsList.markedItem), $e("role", e.children ? "group" : "option")("aria-selected", e.selected)("id", null == e ? null : e.htmlId), _(3), v("ngTemplateOutlet", e.children ? r.optgroupTemplate || i : r.optionTemplate || i)("ngTemplateOutletContext", function Ym(t, n, e, i, r, o, s) {
                    return Xm(D(), _t(), t, n, e, i, r, o, s)
                }(17, AP, e.value, e, e.index, r.searchTerm))
            }
        }

        function FP(t, n) {
            if (1 & t && (S(0, "span")(1, "span", 30), Ie(2), E(), Ie(3), E()), 2 & t) {
                const e = P(3);
                _(2), Zn(e.addTagText), _(1), Zt('"', e.searchTerm, '"')
            }
        }

        function kP(t, n) {
        }

        function NP(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "div", 28), ce("mouseover", function () {
                    return Ke(e), Ze(P(2).itemsList.unmarkItem())
                })("click", function () {
                    return Ke(e), Ze(P(2).selectTag())
                }), O(1, FP, 4, 2, "ng-template", null, 29, ft), O(3, kP, 0, 0, "ng-template", 14), E()
            }
            if (2 & t) {
                const e = Me(2), i = P(2);
                we("ng-option-marked", !i.itemsList.markedItem), _(3), v("ngTemplateOutlet", i.tagTemplate || e)("ngTemplateOutletContext", Ei(4, Lo, i.searchTerm))
            }
        }

        function LP(t, n) {
            if (1 & t && (S(0, "div", 32), Ie(1), E()), 2 & t) {
                const e = P(3);
                _(1), Zn(e.notFoundText)
            }
        }

        function RP(t, n) {
        }

        function VP(t, n) {
            if (1 & t && (Te(0), O(1, LP, 2, 1, "ng-template", null, 31, ft), O(3, RP, 0, 0, "ng-template", 14), Oe()), 2 & t) {
                const e = Me(2), i = P(2);
                _(3), v("ngTemplateOutlet", i.notFoundTemplate || e)("ngTemplateOutletContext", Ei(2, Lo, i.searchTerm))
            }
        }

        function BP(t, n) {
            if (1 & t && (S(0, "div", 32), Ie(1), E()), 2 & t) {
                const e = P(3);
                _(1), Zn(e.typeToSearchText)
            }
        }

        function HP(t, n) {
        }

        function jP(t, n) {
            if (1 & t && (Te(0), O(1, BP, 2, 1, "ng-template", null, 33, ft), O(3, HP, 0, 0, "ng-template", 18), Oe()), 2 & t) {
                const e = Me(2), i = P(2);
                _(3), v("ngTemplateOutlet", i.typeToSearchTemplate || e)
            }
        }

        function UP(t, n) {
            if (1 & t && (S(0, "div", 32), Ie(1), E()), 2 & t) {
                const e = P(3);
                _(1), Zn(e.loadingText)
            }
        }

        function $P(t, n) {
        }

        function zP(t, n) {
            if (1 & t && (Te(0), O(1, UP, 2, 1, "ng-template", null, 34, ft), O(3, $P, 0, 0, "ng-template", 14), Oe()), 2 & t) {
                const e = Me(2), i = P(2);
                _(3), v("ngTemplateOutlet", i.loadingTextTemplate || e)("ngTemplateOutletContext", Ei(2, Lo, i.searchTerm))
            }
        }

        function GP(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "ng-dropdown-panel", 22), ce("update", function (r) {
                    return Ke(e), Ze(P().viewPortItems = r)
                })("scroll", function (r) {
                    return Ke(e), Ze(P().scroll.emit(r))
                })("scrollToEnd", function (r) {
                    return Ke(e), Ze(P().scrollToEnd.emit(r))
                })("outsideClick", function () {
                    return Ke(e), Ze(P().close())
                }), Te(1), O(2, PP, 4, 22, "div", 23), O(3, NP, 4, 6, "div", 24), Oe(), O(4, VP, 4, 4, "ng-container", 3), O(5, jP, 4, 1, "ng-container", 3), O(6, zP, 4, 4, "ng-container", 3), E()
            }
            if (2 & t) {
                const e = P();
                we("ng-select-multiple", e.multiple), v("virtualScroll", e.virtualScroll)("bufferAmount", e.bufferAmount)("appendTo", e.appendTo)("position", e.dropdownPosition)("headerTemplate", e.headerTemplate)("footerTemplate", e.footerTemplate)("filterValue", e.searchTerm)("items", e.itemsList.filteredItems)("markedItem", e.itemsList.markedItem)("ngClass", e.appendTo ? e.classes : null)("id", e.dropdownId), _(2), v("ngForOf", e.viewPortItems)("ngForTrackBy", e.trackByOption), _(1), v("ngIf", e.showAddTag), _(1), v("ngIf", e.showNoItemsFound()), _(1), v("ngIf", e.showTypeToSearch()), _(1), v("ngIf", e.loading && 0 === e.itemsList.filteredItems.length)
            }
        }

        const gb = /[&<>"']/g, WP = RegExp(gb.source),
            qP = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"};

        function ke(t) {
            return null != t
        }

        function Ro(t) {
            return "object" == typeof t && ke(t)
        }

        function $a(t) {
            return t instanceof Function
        }

        let ZP = (() => {
            class t {
                constructor(e) {
                    this.element = e, this.escape = !0
                }

                ngOnChanges(e) {
                    this.element.nativeElement.innerHTML = this.escape ? function YP(t) {
                        return t && WP.test(t) ? t.replace(gb, n => qP[n]) : t
                    }(this.ngItemLabel) : this.ngItemLabel
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngItemLabel", ""]],
                inputs: {ngItemLabel: "ngItemLabel", escape: "escape"},
                features: [nt]
            }), t
        })(), QP = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-option-tmp", ""]]}), t
        })(), XP = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-optgroup-tmp", ""]]}), t
        })(), JP = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-label-tmp", ""]]}), t
        })(), eF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-multi-label-tmp", ""]]}), t
        })(), tF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-header-tmp", ""]]}), t
        })(), nF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-footer-tmp", ""]]}), t
        })(), iF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-notfound-tmp", ""]]}), t
        })(), rF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-typetosearch-tmp", ""]]}), t
        })(), oF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-loadingtext-tmp", ""]]}), t
        })(), sF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-tag-tmp", ""]]}), t
        })(), aF = (() => {
            class t {
                constructor(e) {
                    this.template = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(te))
            }, t.\u0275dir = I({type: t, selectors: [["", "ng-loadingspinner-tmp", ""]]}), t
        })();

        function mb() {
            return "axxxxxxxxxxx".replace(/[x]/g, () => (16 * Math.random() | 0).toString(16))
        }

        const lF = {
            "\u24b6": "A",
            \uff21: "A",
            \u00c0: "A",
            \u00c1: "A",
            \u00c2: "A",
            \u1ea6: "A",
            \u1ea4: "A",
            \u1eaa: "A",
            \u1ea8: "A",
            \u00c3: "A",
            \u0100: "A",
            \u0102: "A",
            \u1eb0: "A",
            \u1eae: "A",
            \u1eb4: "A",
            \u1eb2: "A",
            \u0226: "A",
            \u01e0: "A",
            \u00c4: "A",
            \u01de: "A",
            \u1ea2: "A",
            \u00c5: "A",
            \u01fa: "A",
            \u01cd: "A",
            \u0200: "A",
            \u0202: "A",
            \u1ea0: "A",
            \u1eac: "A",
            \u1eb6: "A",
            \u1e00: "A",
            \u0104: "A",
            \u023a: "A",
            \u2c6f: "A",
            \ua732: "AA",
            \u00c6: "AE",
            \u01fc: "AE",
            \u01e2: "AE",
            \ua734: "AO",
            \ua736: "AU",
            \ua738: "AV",
            \ua73a: "AV",
            \ua73c: "AY",
            "\u24b7": "B",
            \uff22: "B",
            \u1e02: "B",
            \u1e04: "B",
            \u1e06: "B",
            \u0243: "B",
            \u0182: "B",
            \u0181: "B",
            "\u24b8": "C",
            \uff23: "C",
            \u0106: "C",
            \u0108: "C",
            \u010a: "C",
            \u010c: "C",
            \u00c7: "C",
            \u1e08: "C",
            \u0187: "C",
            \u023b: "C",
            \ua73e: "C",
            "\u24b9": "D",
            \uff24: "D",
            \u1e0a: "D",
            \u010e: "D",
            \u1e0c: "D",
            \u1e10: "D",
            \u1e12: "D",
            \u1e0e: "D",
            \u0110: "D",
            \u018b: "D",
            \u018a: "D",
            \u0189: "D",
            \ua779: "D",
            \u01f1: "DZ",
            \u01c4: "DZ",
            \u01f2: "Dz",
            \u01c5: "Dz",
            "\u24ba": "E",
            \uff25: "E",
            \u00c8: "E",
            \u00c9: "E",
            \u00ca: "E",
            \u1ec0: "E",
            \u1ebe: "E",
            \u1ec4: "E",
            \u1ec2: "E",
            \u1ebc: "E",
            \u0112: "E",
            \u1e14: "E",
            \u1e16: "E",
            \u0114: "E",
            \u0116: "E",
            \u00cb: "E",
            \u1eba: "E",
            \u011a: "E",
            \u0204: "E",
            \u0206: "E",
            \u1eb8: "E",
            \u1ec6: "E",
            \u0228: "E",
            \u1e1c: "E",
            \u0118: "E",
            \u1e18: "E",
            \u1e1a: "E",
            \u0190: "E",
            \u018e: "E",
            "\u24bb": "F",
            \uff26: "F",
            \u1e1e: "F",
            \u0191: "F",
            \ua77b: "F",
            "\u24bc": "G",
            \uff27: "G",
            \u01f4: "G",
            \u011c: "G",
            \u1e20: "G",
            \u011e: "G",
            \u0120: "G",
            \u01e6: "G",
            \u0122: "G",
            \u01e4: "G",
            \u0193: "G",
            \ua7a0: "G",
            \ua77d: "G",
            \ua77e: "G",
            "\u24bd": "H",
            \uff28: "H",
            \u0124: "H",
            \u1e22: "H",
            \u1e26: "H",
            \u021e: "H",
            \u1e24: "H",
            \u1e28: "H",
            \u1e2a: "H",
            \u0126: "H",
            \u2c67: "H",
            \u2c75: "H",
            \ua78d: "H",
            "\u24be": "I",
            \uff29: "I",
            \u00cc: "I",
            \u00cd: "I",
            \u00ce: "I",
            \u0128: "I",
            \u012a: "I",
            \u012c: "I",
            \u0130: "I",
            \u00cf: "I",
            \u1e2e: "I",
            \u1ec8: "I",
            \u01cf: "I",
            \u0208: "I",
            \u020a: "I",
            \u1eca: "I",
            \u012e: "I",
            \u1e2c: "I",
            \u0197: "I",
            "\u24bf": "J",
            \uff2a: "J",
            \u0134: "J",
            \u0248: "J",
            "\u24c0": "K",
            \uff2b: "K",
            \u1e30: "K",
            \u01e8: "K",
            \u1e32: "K",
            \u0136: "K",
            \u1e34: "K",
            \u0198: "K",
            \u2c69: "K",
            \ua740: "K",
            \ua742: "K",
            \ua744: "K",
            \ua7a2: "K",
            "\u24c1": "L",
            \uff2c: "L",
            \u013f: "L",
            \u0139: "L",
            \u013d: "L",
            \u1e36: "L",
            \u1e38: "L",
            \u013b: "L",
            \u1e3c: "L",
            \u1e3a: "L",
            \u0141: "L",
            \u023d: "L",
            \u2c62: "L",
            \u2c60: "L",
            \ua748: "L",
            \ua746: "L",
            \ua780: "L",
            \u01c7: "LJ",
            \u01c8: "Lj",
            "\u24c2": "M",
            \uff2d: "M",
            \u1e3e: "M",
            \u1e40: "M",
            \u1e42: "M",
            \u2c6e: "M",
            \u019c: "M",
            "\u24c3": "N",
            \uff2e: "N",
            \u01f8: "N",
            \u0143: "N",
            \u00d1: "N",
            \u1e44: "N",
            \u0147: "N",
            \u1e46: "N",
            \u0145: "N",
            \u1e4a: "N",
            \u1e48: "N",
            \u0220: "N",
            \u019d: "N",
            \ua790: "N",
            \ua7a4: "N",
            \u01ca: "NJ",
            \u01cb: "Nj",
            "\u24c4": "O",
            \uff2f: "O",
            \u00d2: "O",
            \u00d3: "O",
            \u00d4: "O",
            \u1ed2: "O",
            \u1ed0: "O",
            \u1ed6: "O",
            \u1ed4: "O",
            \u00d5: "O",
            \u1e4c: "O",
            \u022c: "O",
            \u1e4e: "O",
            \u014c: "O",
            \u1e50: "O",
            \u1e52: "O",
            \u014e: "O",
            \u022e: "O",
            \u0230: "O",
            \u00d6: "O",
            \u022a: "O",
            \u1ece: "O",
            \u0150: "O",
            \u01d1: "O",
            \u020c: "O",
            \u020e: "O",
            \u01a0: "O",
            \u1edc: "O",
            \u1eda: "O",
            \u1ee0: "O",
            \u1ede: "O",
            \u1ee2: "O",
            \u1ecc: "O",
            \u1ed8: "O",
            \u01ea: "O",
            \u01ec: "O",
            \u00d8: "O",
            \u01fe: "O",
            \u0186: "O",
            \u019f: "O",
            \ua74a: "O",
            \ua74c: "O",
            \u01a2: "OI",
            \ua74e: "OO",
            \u0222: "OU",
            "\u24c5": "P",
            \uff30: "P",
            \u1e54: "P",
            \u1e56: "P",
            \u01a4: "P",
            \u2c63: "P",
            \ua750: "P",
            \ua752: "P",
            \ua754: "P",
            "\u24c6": "Q",
            \uff31: "Q",
            \ua756: "Q",
            \ua758: "Q",
            \u024a: "Q",
            "\u24c7": "R",
            \uff32: "R",
            \u0154: "R",
            \u1e58: "R",
            \u0158: "R",
            \u0210: "R",
            \u0212: "R",
            \u1e5a: "R",
            \u1e5c: "R",
            \u0156: "R",
            \u1e5e: "R",
            \u024c: "R",
            \u2c64: "R",
            \ua75a: "R",
            \ua7a6: "R",
            \ua782: "R",
            "\u24c8": "S",
            \uff33: "S",
            \u1e9e: "S",
            \u015a: "S",
            \u1e64: "S",
            \u015c: "S",
            \u1e60: "S",
            \u0160: "S",
            \u1e66: "S",
            \u1e62: "S",
            \u1e68: "S",
            \u0218: "S",
            \u015e: "S",
            \u2c7e: "S",
            \ua7a8: "S",
            \ua784: "S",
            "\u24c9": "T",
            \uff34: "T",
            \u1e6a: "T",
            \u0164: "T",
            \u1e6c: "T",
            \u021a: "T",
            \u0162: "T",
            \u1e70: "T",
            \u1e6e: "T",
            \u0166: "T",
            \u01ac: "T",
            \u01ae: "T",
            \u023e: "T",
            \ua786: "T",
            \ua728: "TZ",
            "\u24ca": "U",
            \uff35: "U",
            \u00d9: "U",
            \u00da: "U",
            \u00db: "U",
            \u0168: "U",
            \u1e78: "U",
            \u016a: "U",
            \u1e7a: "U",
            \u016c: "U",
            \u00dc: "U",
            \u01db: "U",
            \u01d7: "U",
            \u01d5: "U",
            \u01d9: "U",
            \u1ee6: "U",
            \u016e: "U",
            \u0170: "U",
            \u01d3: "U",
            \u0214: "U",
            \u0216: "U",
            \u01af: "U",
            \u1eea: "U",
            \u1ee8: "U",
            \u1eee: "U",
            \u1eec: "U",
            \u1ef0: "U",
            \u1ee4: "U",
            \u1e72: "U",
            \u0172: "U",
            \u1e76: "U",
            \u1e74: "U",
            \u0244: "U",
            "\u24cb": "V",
            \uff36: "V",
            \u1e7c: "V",
            \u1e7e: "V",
            \u01b2: "V",
            \ua75e: "V",
            \u0245: "V",
            \ua760: "VY",
            "\u24cc": "W",
            \uff37: "W",
            \u1e80: "W",
            \u1e82: "W",
            \u0174: "W",
            \u1e86: "W",
            \u1e84: "W",
            \u1e88: "W",
            \u2c72: "W",
            "\u24cd": "X",
            \uff38: "X",
            \u1e8a: "X",
            \u1e8c: "X",
            "\u24ce": "Y",
            \uff39: "Y",
            \u1ef2: "Y",
            \u00dd: "Y",
            \u0176: "Y",
            \u1ef8: "Y",
            \u0232: "Y",
            \u1e8e: "Y",
            \u0178: "Y",
            \u1ef6: "Y",
            \u1ef4: "Y",
            \u01b3: "Y",
            \u024e: "Y",
            \u1efe: "Y",
            "\u24cf": "Z",
            \uff3a: "Z",
            \u0179: "Z",
            \u1e90: "Z",
            \u017b: "Z",
            \u017d: "Z",
            \u1e92: "Z",
            \u1e94: "Z",
            \u01b5: "Z",
            \u0224: "Z",
            \u2c7f: "Z",
            \u2c6b: "Z",
            \ua762: "Z",
            "\u24d0": "a",
            \uff41: "a",
            \u1e9a: "a",
            \u00e0: "a",
            \u00e1: "a",
            \u00e2: "a",
            \u1ea7: "a",
            \u1ea5: "a",
            \u1eab: "a",
            \u1ea9: "a",
            \u00e3: "a",
            \u0101: "a",
            \u0103: "a",
            \u1eb1: "a",
            \u1eaf: "a",
            \u1eb5: "a",
            \u1eb3: "a",
            \u0227: "a",
            \u01e1: "a",
            \u00e4: "a",
            \u01df: "a",
            \u1ea3: "a",
            \u00e5: "a",
            \u01fb: "a",
            \u01ce: "a",
            \u0201: "a",
            \u0203: "a",
            \u1ea1: "a",
            \u1ead: "a",
            \u1eb7: "a",
            \u1e01: "a",
            \u0105: "a",
            \u2c65: "a",
            \u0250: "a",
            \ua733: "aa",
            \u00e6: "ae",
            \u01fd: "ae",
            \u01e3: "ae",
            \ua735: "ao",
            \ua737: "au",
            \ua739: "av",
            \ua73b: "av",
            \ua73d: "ay",
            "\u24d1": "b",
            \uff42: "b",
            \u1e03: "b",
            \u1e05: "b",
            \u1e07: "b",
            \u0180: "b",
            \u0183: "b",
            \u0253: "b",
            "\u24d2": "c",
            \uff43: "c",
            \u0107: "c",
            \u0109: "c",
            \u010b: "c",
            \u010d: "c",
            \u00e7: "c",
            \u1e09: "c",
            \u0188: "c",
            \u023c: "c",
            \ua73f: "c",
            \u2184: "c",
            "\u24d3": "d",
            \uff44: "d",
            \u1e0b: "d",
            \u010f: "d",
            \u1e0d: "d",
            \u1e11: "d",
            \u1e13: "d",
            \u1e0f: "d",
            \u0111: "d",
            \u018c: "d",
            \u0256: "d",
            \u0257: "d",
            \ua77a: "d",
            \u01f3: "dz",
            \u01c6: "dz",
            "\u24d4": "e",
            \uff45: "e",
            \u00e8: "e",
            \u00e9: "e",
            \u00ea: "e",
            \u1ec1: "e",
            \u1ebf: "e",
            \u1ec5: "e",
            \u1ec3: "e",
            \u1ebd: "e",
            \u0113: "e",
            \u1e15: "e",
            \u1e17: "e",
            \u0115: "e",
            \u0117: "e",
            \u00eb: "e",
            \u1ebb: "e",
            \u011b: "e",
            \u0205: "e",
            \u0207: "e",
            \u1eb9: "e",
            \u1ec7: "e",
            \u0229: "e",
            \u1e1d: "e",
            \u0119: "e",
            \u1e19: "e",
            \u1e1b: "e",
            \u0247: "e",
            \u025b: "e",
            \u01dd: "e",
            "\u24d5": "f",
            \uff46: "f",
            \u1e1f: "f",
            \u0192: "f",
            \ua77c: "f",
            "\u24d6": "g",
            \uff47: "g",
            \u01f5: "g",
            \u011d: "g",
            \u1e21: "g",
            \u011f: "g",
            \u0121: "g",
            \u01e7: "g",
            \u0123: "g",
            \u01e5: "g",
            \u0260: "g",
            \ua7a1: "g",
            \u1d79: "g",
            \ua77f: "g",
            "\u24d7": "h",
            \uff48: "h",
            \u0125: "h",
            \u1e23: "h",
            \u1e27: "h",
            \u021f: "h",
            \u1e25: "h",
            \u1e29: "h",
            \u1e2b: "h",
            \u1e96: "h",
            \u0127: "h",
            \u2c68: "h",
            \u2c76: "h",
            \u0265: "h",
            \u0195: "hv",
            "\u24d8": "i",
            \uff49: "i",
            \u00ec: "i",
            \u00ed: "i",
            \u00ee: "i",
            \u0129: "i",
            \u012b: "i",
            \u012d: "i",
            \u00ef: "i",
            \u1e2f: "i",
            \u1ec9: "i",
            \u01d0: "i",
            \u0209: "i",
            \u020b: "i",
            \u1ecb: "i",
            \u012f: "i",
            \u1e2d: "i",
            \u0268: "i",
            \u0131: "i",
            "\u24d9": "j",
            \uff4a: "j",
            \u0135: "j",
            \u01f0: "j",
            \u0249: "j",
            "\u24da": "k",
            \uff4b: "k",
            \u1e31: "k",
            \u01e9: "k",
            \u1e33: "k",
            \u0137: "k",
            \u1e35: "k",
            \u0199: "k",
            \u2c6a: "k",
            \ua741: "k",
            \ua743: "k",
            \ua745: "k",
            \ua7a3: "k",
            "\u24db": "l",
            \uff4c: "l",
            \u0140: "l",
            \u013a: "l",
            \u013e: "l",
            \u1e37: "l",
            \u1e39: "l",
            \u013c: "l",
            \u1e3d: "l",
            \u1e3b: "l",
            \u017f: "l",
            \u0142: "l",
            \u019a: "l",
            \u026b: "l",
            \u2c61: "l",
            \ua749: "l",
            \ua781: "l",
            \ua747: "l",
            \u01c9: "lj",
            "\u24dc": "m",
            \uff4d: "m",
            \u1e3f: "m",
            \u1e41: "m",
            \u1e43: "m",
            \u0271: "m",
            \u026f: "m",
            "\u24dd": "n",
            \uff4e: "n",
            \u01f9: "n",
            \u0144: "n",
            \u00f1: "n",
            \u1e45: "n",
            \u0148: "n",
            \u1e47: "n",
            \u0146: "n",
            \u1e4b: "n",
            \u1e49: "n",
            \u019e: "n",
            \u0272: "n",
            \u0149: "n",
            \ua791: "n",
            \ua7a5: "n",
            \u01cc: "nj",
            "\u24de": "o",
            \uff4f: "o",
            \u00f2: "o",
            \u00f3: "o",
            \u00f4: "o",
            \u1ed3: "o",
            \u1ed1: "o",
            \u1ed7: "o",
            \u1ed5: "o",
            \u00f5: "o",
            \u1e4d: "o",
            \u022d: "o",
            \u1e4f: "o",
            \u014d: "o",
            \u1e51: "o",
            \u1e53: "o",
            \u014f: "o",
            \u022f: "o",
            \u0231: "o",
            \u00f6: "o",
            \u022b: "o",
            \u1ecf: "o",
            \u0151: "o",
            \u01d2: "o",
            \u020d: "o",
            \u020f: "o",
            \u01a1: "o",
            \u1edd: "o",
            \u1edb: "o",
            \u1ee1: "o",
            \u1edf: "o",
            \u1ee3: "o",
            \u1ecd: "o",
            \u1ed9: "o",
            \u01eb: "o",
            \u01ed: "o",
            \u00f8: "o",
            \u01ff: "o",
            \u0254: "o",
            \ua74b: "o",
            \ua74d: "o",
            \u0275: "o",
            \u01a3: "oi",
            \u0223: "ou",
            \ua74f: "oo",
            "\u24df": "p",
            \uff50: "p",
            \u1e55: "p",
            \u1e57: "p",
            \u01a5: "p",
            \u1d7d: "p",
            \ua751: "p",
            \ua753: "p",
            \ua755: "p",
            "\u24e0": "q",
            \uff51: "q",
            \u024b: "q",
            \ua757: "q",
            \ua759: "q",
            "\u24e1": "r",
            \uff52: "r",
            \u0155: "r",
            \u1e59: "r",
            \u0159: "r",
            \u0211: "r",
            \u0213: "r",
            \u1e5b: "r",
            \u1e5d: "r",
            \u0157: "r",
            \u1e5f: "r",
            \u024d: "r",
            \u027d: "r",
            \ua75b: "r",
            \ua7a7: "r",
            \ua783: "r",
            "\u24e2": "s",
            \uff53: "s",
            \u00df: "s",
            \u015b: "s",
            \u1e65: "s",
            \u015d: "s",
            \u1e61: "s",
            \u0161: "s",
            \u1e67: "s",
            \u1e63: "s",
            \u1e69: "s",
            \u0219: "s",
            \u015f: "s",
            \u023f: "s",
            \ua7a9: "s",
            \ua785: "s",
            \u1e9b: "s",
            "\u24e3": "t",
            \uff54: "t",
            \u1e6b: "t",
            \u1e97: "t",
            \u0165: "t",
            \u1e6d: "t",
            \u021b: "t",
            \u0163: "t",
            \u1e71: "t",
            \u1e6f: "t",
            \u0167: "t",
            \u01ad: "t",
            \u0288: "t",
            \u2c66: "t",
            \ua787: "t",
            \ua729: "tz",
            "\u24e4": "u",
            \uff55: "u",
            \u00f9: "u",
            \u00fa: "u",
            \u00fb: "u",
            \u0169: "u",
            \u1e79: "u",
            \u016b: "u",
            \u1e7b: "u",
            \u016d: "u",
            \u00fc: "u",
            \u01dc: "u",
            \u01d8: "u",
            \u01d6: "u",
            \u01da: "u",
            \u1ee7: "u",
            \u016f: "u",
            \u0171: "u",
            \u01d4: "u",
            \u0215: "u",
            \u0217: "u",
            \u01b0: "u",
            \u1eeb: "u",
            \u1ee9: "u",
            \u1eef: "u",
            \u1eed: "u",
            \u1ef1: "u",
            \u1ee5: "u",
            \u1e73: "u",
            \u0173: "u",
            \u1e77: "u",
            \u1e75: "u",
            \u0289: "u",
            "\u24e5": "v",
            \uff56: "v",
            \u1e7d: "v",
            \u1e7f: "v",
            \u028b: "v",
            \ua75f: "v",
            \u028c: "v",
            \ua761: "vy",
            "\u24e6": "w",
            \uff57: "w",
            \u1e81: "w",
            \u1e83: "w",
            \u0175: "w",
            \u1e87: "w",
            \u1e85: "w",
            \u1e98: "w",
            \u1e89: "w",
            \u2c73: "w",
            "\u24e7": "x",
            \uff58: "x",
            \u1e8b: "x",
            \u1e8d: "x",
            "\u24e8": "y",
            \uff59: "y",
            \u1ef3: "y",
            \u00fd: "y",
            \u0177: "y",
            \u1ef9: "y",
            \u0233: "y",
            \u1e8f: "y",
            \u00ff: "y",
            \u1ef7: "y",
            \u1e99: "y",
            \u1ef5: "y",
            \u01b4: "y",
            \u024f: "y",
            \u1eff: "y",
            "\u24e9": "z",
            \uff5a: "z",
            \u017a: "z",
            \u1e91: "z",
            \u017c: "z",
            \u017e: "z",
            \u1e93: "z",
            \u1e95: "z",
            \u01b6: "z",
            \u0225: "z",
            \u0240: "z",
            \u2c6c: "z",
            \ua763: "z",
            \u0386: "\u0391",
            \u0388: "\u0395",
            \u0389: "\u0397",
            \u038a: "\u0399",
            \u03aa: "\u0399",
            \u038c: "\u039f",
            \u038e: "\u03a5",
            \u03ab: "\u03a5",
            \u038f: "\u03a9",
            \u03ac: "\u03b1",
            \u03ad: "\u03b5",
            \u03ae: "\u03b7",
            \u03af: "\u03b9",
            \u03ca: "\u03b9",
            \u0390: "\u03b9",
            \u03cc: "\u03bf",
            \u03cd: "\u03c5",
            \u03cb: "\u03c5",
            \u03b0: "\u03c5",
            \u03c9: "\u03c9",
            \u03c2: "\u03c3"
        };

        function za(t) {
            return t.replace(/[^\u0000-\u007E]/g, e => lF[e] || e)
        }

        class cF {
            constructor(n, e) {
                this._ngSelect = n, this._selectionModel = e, this._items = [], this._filteredItems = [], this._markedIndex = -1
            }

            get items() {
                return this._items
            }

            get filteredItems() {
                return this._filteredItems
            }

            get markedIndex() {
                return this._markedIndex
            }

            get selectedItems() {
                return this._selectionModel.value
            }

            get markedItem() {
                return this._filteredItems[this._markedIndex]
            }

            get noItemsToSelect() {
                return this._ngSelect.hideSelected && this._items.length === this.selectedItems.length
            }

            get maxItemsSelected() {
                return this._ngSelect.multiple && this._ngSelect.maxSelectedItems <= this.selectedItems.length
            }

            get lastSelectedItem() {
                let n = this.selectedItems.length - 1;
                for (; n >= 0; n--) {
                    const e = this.selectedItems[n];
                    if (!e.disabled) return e
                }
                return null
            }

            setItems(n) {
                this._items = n.map((e, i) => this.mapItem(e, i)), this._ngSelect.groupBy ? (this._groups = this._groupBy(this._items, this._ngSelect.groupBy), this._items = this._flatten(this._groups)) : (this._groups = new Map, this._groups.set(void 0, this._items)), this._filteredItems = [...this._items]
            }

            select(n) {
                if (n.selected || this.maxItemsSelected) return;
                const e = this._ngSelect.multiple;
                e || this.clearSelected(), this._selectionModel.select(n, e, this._ngSelect.selectableGroupAsModel), this._ngSelect.hideSelected && this._hideSelected(n)
            }

            unselect(n) {
                n.selected && (this._selectionModel.unselect(n, this._ngSelect.multiple), this._ngSelect.hideSelected && ke(n.index) && this._ngSelect.multiple && this._showSelected(n))
            }

            findItem(n) {
                let e;
                return e = this._ngSelect.compareWith ? i => this._ngSelect.compareWith(i.value, n) : this._ngSelect.bindValue ? i => !i.children && this.resolveNested(i.value, this._ngSelect.bindValue) === n : i => i.value === n || !i.children && i.label && i.label === this.resolveNested(n, this._ngSelect.bindLabel), this._items.find(i => e(i))
            }

            addItem(n) {
                const e = this.mapItem(n, this._items.length);
                return this._items.push(e), this._filteredItems.push(e), e
            }

            clearSelected(n = !1) {
                this._selectionModel.clear(n), this._items.forEach(e => {
                    e.selected = n && e.selected && e.disabled, e.marked = !1
                }), this._ngSelect.hideSelected && this.resetFilteredItems()
            }

            findByLabel(n) {
                return n = za(n).toLocaleLowerCase(), this.filteredItems.find(e => za(e.label).toLocaleLowerCase().substr(0, n.length) === n)
            }

            filter(n) {
                if (!n) return void this.resetFilteredItems();
                this._filteredItems = [], n = this._ngSelect.searchFn ? n : za(n).toLocaleLowerCase();
                const e = this._ngSelect.searchFn || this._defaultSearchFn, i = this._ngSelect.hideSelected;
                for (const r of Array.from(this._groups.keys())) {
                    const o = [];
                    for (const s of this._groups.get(r)) i && (s.parent && s.parent.selected || s.selected) || e(n, this._ngSelect.searchFn ? s.value : s) && o.push(s);
                    if (o.length > 0) {
                        const [s] = o.slice(-1);
                        if (s.parent) {
                            const a = this._items.find(l => l === s.parent);
                            this._filteredItems.push(a)
                        }
                        this._filteredItems.push(...o)
                    }
                }
            }

            resetFilteredItems() {
                this._filteredItems.length !== this._items.length && (this._filteredItems = this._ngSelect.hideSelected && this.selectedItems.length > 0 ? this._items.filter(n => !n.selected) : this._items)
            }

            unmarkItem() {
                this._markedIndex = -1
            }

            markNextItem() {
                this._stepToItem(1)
            }

            markPreviousItem() {
                this._stepToItem(-1)
            }

            markItem(n) {
                this._markedIndex = this._filteredItems.indexOf(n)
            }

            markSelectedOrDefault(n) {
                if (0 === this._filteredItems.length) return;
                const e = this._getLastMarkedIndex();
                this._markedIndex = e > -1 ? e : n ? this.filteredItems.findIndex(i => !i.disabled) : -1
            }

            resolveNested(n, e) {
                if (!Ro(n)) return n;
                if (-1 === e.indexOf(".")) return n[e];
                {
                    const i = e.split(".");
                    let r = n;
                    for (let o = 0, s = i.length; o < s; ++o) {
                        if (null == r) return null;
                        r = r[i[o]]
                    }
                    return r
                }
            }

            mapItem(n, e) {
                const i = ke(n.$ngOptionLabel) ? n.$ngOptionLabel : this.resolveNested(n, this._ngSelect.bindLabel),
                    r = ke(n.$ngOptionValue) ? n.$ngOptionValue : n;
                return {
                    index: e,
                    label: ke(i) ? i.toString() : "",
                    value: r,
                    disabled: n.disabled,
                    htmlId: `${this._ngSelect.dropdownId}-${e}`
                }
            }

            mapSelectedItems() {
                const n = this._ngSelect.multiple;
                for (const e of this.selectedItems) {
                    const i = this._ngSelect.bindValue ? this.resolveNested(e.value, this._ngSelect.bindValue) : e.value,
                        r = ke(i) ? this.findItem(i) : null;
                    this._selectionModel.unselect(e, n), this._selectionModel.select(r || e, n, this._ngSelect.selectableGroupAsModel)
                }
                this._ngSelect.hideSelected && (this._filteredItems = this.filteredItems.filter(e => -1 === this.selectedItems.indexOf(e)))
            }

            _showSelected(n) {
                if (this._filteredItems.push(n), n.parent) {
                    const e = n.parent;
                    this._filteredItems.find(r => r === e) || this._filteredItems.push(e)
                } else if (n.children) for (const e of n.children) e.selected = !1, this._filteredItems.push(e);
                this._filteredItems = [...this._filteredItems.sort((e, i) => e.index - i.index)]
            }

            _hideSelected(n) {
                this._filteredItems = this._filteredItems.filter(e => e !== n), n.parent ? n.parent.children.every(i => i.selected) && (this._filteredItems = this._filteredItems.filter(i => i !== n.parent)) : n.children && (this._filteredItems = this.filteredItems.filter(e => e.parent !== n))
            }

            _defaultSearchFn(n, e) {
                return za(e.label).toLocaleLowerCase().indexOf(n) > -1
            }

            _getNextItemIndex(n) {
                return n > 0 ? this._markedIndex >= this._filteredItems.length - 1 ? 0 : this._markedIndex + 1 : this._markedIndex <= 0 ? this._filteredItems.length - 1 : this._markedIndex - 1
            }

            _stepToItem(n) {
                0 === this._filteredItems.length || this._filteredItems.every(e => e.disabled) || (this._markedIndex = this._getNextItemIndex(n), this.markedItem.disabled && this._stepToItem(n))
            }

            _getLastMarkedIndex() {
                if (this._ngSelect.hideSelected || this._markedIndex > -1 && void 0 === this.markedItem) return -1;
                const n = this._filteredItems.indexOf(this.lastSelectedItem);
                return this.lastSelectedItem && n < 0 ? -1 : Math.max(this.markedIndex, n)
            }

            _groupBy(n, e) {
                const i = new Map;
                if (0 === n.length) return i;
                if (Array.isArray(n[0].value[e])) {
                    for (const s of n) {
                        const a = (s.value[e] || []).map((l, c) => this.mapItem(l, c));
                        i.set(s, a)
                    }
                    return i
                }
                const r = $a(this._ngSelect.groupBy), o = s => {
                    const a = r ? e(s.value) : s.value[e];
                    return ke(a) ? a : void 0
                };
                for (const s of n) {
                    const a = o(s), l = i.get(a);
                    l ? l.push(s) : i.set(a, [s])
                }
                return i
            }

            _flatten(n) {
                const e = $a(this._ngSelect.groupBy), i = [];
                for (const r of Array.from(n.keys())) {
                    let o = i.length;
                    if (void 0 === r) {
                        const d = n.get(void 0) || [];
                        i.push(...d.map(h => (h.index = o++, h)));
                        continue
                    }
                    const s = Ro(r), a = {
                            label: s ? "" : String(r),
                            children: void 0,
                            parent: null,
                            index: o++,
                            disabled: !this._ngSelect.selectableGroup,
                            htmlId: mb()
                        }, l = e ? this._ngSelect.bindLabel : this._ngSelect.groupBy,
                        c = this._ngSelect.groupValue || (() => s ? r.value : {[l]: r}),
                        u = n.get(r).map(d => (d.parent = a, d.children = void 0, d.index = o++, d));
                    a.children = u, a.value = c(r, u.map(d => d.value)), i.push(a), i.push(...u)
                }
                return i
            }
        }

        var gn = (() => {
            return (t = gn || (gn = {}))[t.Tab = 9] = "Tab", t[t.Enter = 13] = "Enter", t[t.Esc = 27] = "Esc", t[t.Space = 32] = "Space", t[t.ArrowUp = 38] = "ArrowUp", t[t.ArrowDown = 40] = "ArrowDown", t[t.Backspace = 8] = "Backspace", gn;
            var t
        })();
        let vb = (() => {
            class t {
                constructor() {
                    this._dimensions = {itemHeight: 0, panelHeight: 0, itemsPerViewport: 0}
                }

                get dimensions() {
                    return this._dimensions
                }

                calculateItems(e, i, r) {
                    const o = this._dimensions, s = o.itemHeight * i, l = Math.max(0, e) / s * i;
                    let c = Math.min(i, Math.ceil(l) + (o.itemsPerViewport + 1));
                    const d = Math.max(0, c - o.itemsPerViewport);
                    let h = Math.min(d, Math.floor(l)), f = o.itemHeight * Math.ceil(h) - o.itemHeight * Math.min(h, r);
                    return f = isNaN(f) ? 0 : f, h = isNaN(h) ? -1 : h, c = isNaN(c) ? -1 : c, h -= r, h = Math.max(0, h), c += r, c = Math.min(i, c), {
                        topPadding: f,
                        scrollHeight: s,
                        start: h,
                        end: c
                    }
                }

                setDimensions(e, i) {
                    const r = Math.max(1, Math.floor(i / e));
                    this._dimensions = {itemHeight: e, panelHeight: i, itemsPerViewport: r}
                }

                getScrollTo(e, i, r) {
                    const {panelHeight: o} = this.dimensions, s = e + i, l = r + o;
                    return o >= s && r === e ? null : s > l ? r + s - l : e <= r ? e : null
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac}), t
        })();
        const _b = ["top", "right", "bottom", "left"], uF = typeof requestAnimationFrame < "u" ? QA : rP;
        let yb = (() => {
            class t {
                constructor(e, i, r, o, s) {
                    this._renderer = e, this._zone = i, this._panelService = r, this._document = s, this.items = [], this.position = "auto", this.virtualScroll = !1, this.filterValue = null, this.update = new G, this.scroll = new G, this.scrollToEnd = new G, this.outsideClick = new G, this._destroy$ = new nn, this._scrollToEndFired = !1, this._updateScrollHeight = !1, this._lastScrollPosition = 0, this._dropdown = o.nativeElement
                }

                get currentPosition() {
                    return this._currentPosition
                }

                get itemsLength() {
                    return this._itemsLength
                }

                set itemsLength(e) {
                    e !== this._itemsLength && (this._itemsLength = e, this._onItemsLengthChanged())
                }

                get _startOffset() {
                    if (this.markedItem) {
                        const {itemHeight: e, panelHeight: i} = this._panelService.dimensions,
                            r = this.markedItem.index * e;
                        return i > r ? 0 : r
                    }
                    return 0
                }

                ngOnInit() {
                    this._select = this._dropdown.parentElement, this._virtualPadding = this.paddingElementRef.nativeElement, this._scrollablePanel = this.scrollElementRef.nativeElement, this._contentPanel = this.contentElementRef.nativeElement, this._handleScroll(), this._handleOutsideClick(), this._appendDropdown(), this._setupMousedownListener()
                }

                ngOnChanges(e) {
                    if (e.items) {
                        const i = e.items;
                        this._onItemsChange(i.currentValue, i.firstChange)
                    }
                }

                ngOnDestroy() {
                    this._destroy$.next(), this._destroy$.complete(), this._destroy$.unsubscribe(), this.appendTo && this._renderer.removeChild(this._dropdown.parentNode, this._dropdown)
                }

                scrollTo(e, i = !1) {
                    if (!e) return;
                    const r = this.items.indexOf(e);
                    if (r < 0 || r >= this.itemsLength) return;
                    let o;
                    if (this.virtualScroll) {
                        const s = this._panelService.dimensions.itemHeight;
                        o = this._panelService.getScrollTo(r * s, s, this._lastScrollPosition)
                    } else {
                        const s = this._dropdown.querySelector(`#${e.htmlId}`);
                        o = this._panelService.getScrollTo(s.offsetTop, s.clientHeight, i ? s.offsetTop : this._lastScrollPosition)
                    }
                    ke(o) && (this._scrollablePanel.scrollTop = o)
                }

                scrollToTag() {
                    const e = this._scrollablePanel;
                    e.scrollTop = e.scrollHeight - e.clientHeight
                }

                adjustPosition() {
                    this._updateYPosition()
                }

                _handleDropdownPosition() {
                    this._currentPosition = this._calculateCurrentPosition(this._dropdown), _b.includes(this._currentPosition) ? this._updateDropdownClass(this._currentPosition) : this._updateDropdownClass("bottom"), this.appendTo && this._updateYPosition(), this._dropdown.style.opacity = "1"
                }

                _updateDropdownClass(e) {
                    _b.forEach(r => {
                        const o = `ng-select-${r}`;
                        this._renderer.removeClass(this._dropdown, o), this._renderer.removeClass(this._select, o)
                    });
                    const i = `ng-select-${e}`;
                    this._renderer.addClass(this._dropdown, i), this._renderer.addClass(this._select, i)
                }

                _handleScroll() {
                    this._zone.runOutsideAngular(() => {
                        Un(this.scrollElementRef.nativeElement, "scroll").pipe(Qe(this._destroy$), function WA(t, n = Ha) {
                            return function zA(t) {
                                return et((n, e) => {
                                    let i = !1, r = null, o = null, s = !1;
                                    const a = () => {
                                        if (o?.unsubscribe(), o = null, i) {
                                            i = !1;
                                            const c = r;
                                            r = null, e.next(c)
                                        }
                                        s && e.complete()
                                    }, l = () => {
                                        o = null, s && e.complete()
                                    };
                                    n.subscribe(Ye(e, c => {
                                        i = !0, r = c, o || tt(t(c)).subscribe(o = Ye(e, a, l))
                                    }, () => {
                                        s = !0, (!i || !o || o.closed) && e.complete()
                                    }))
                                })
                            }(() => cb(t, n))
                        }(0, uF)).subscribe(e => {
                            const i = e.path || e.composedPath && e.composedPath();
                            this._onContentScrolled(i && 0 !== i.length ? i[0].scrollTop : e.target.scrollTop)
                        })
                    })
                }

                _handleOutsideClick() {
                    this._document && this._zone.runOutsideAngular(() => {
                        Pr(Un(this._document, "touchstart", {capture: !0}), Un(this._document, "mousedown", {capture: !0})).pipe(Qe(this._destroy$)).subscribe(e => this._checkToClose(e))
                    })
                }

                _checkToClose(e) {
                    if (this._select.contains(e.target) || this._dropdown.contains(e.target)) return;
                    const i = e.path || e.composedPath && e.composedPath();
                    e.target && e.target.shadowRoot && i && i[0] && this._select.contains(i[0]) || this._zone.run(() => this.outsideClick.emit())
                }

                _onItemsChange(e, i) {
                    this.items = e || [], this._scrollToEndFired = !1, this.itemsLength = e.length, this.virtualScroll ? this._updateItemsRange(i) : (this._setVirtualHeight(), this._updateItems(i))
                }

                _updateItems(e) {
                    this.update.emit(this.items), !1 !== e && this._zone.runOutsideAngular(() => {
                        Promise.resolve().then(() => {
                            this._panelService.setDimensions(0, this._scrollablePanel.clientHeight), this._handleDropdownPosition(), this.scrollTo(this.markedItem, e)
                        })
                    })
                }

                _updateItemsRange(e) {
                    this._zone.runOutsideAngular(() => {
                        this._measureDimensions().then(() => {
                            e ? (this._renderItemsRange(this._startOffset), this._handleDropdownPosition()) : this._renderItemsRange()
                        })
                    })
                }

                _onContentScrolled(e) {
                    this.virtualScroll && this._renderItemsRange(e), this._lastScrollPosition = e, this._fireScrollToEnd(e)
                }

                _updateVirtualHeight(e) {
                    this._updateScrollHeight && (this._virtualPadding.style.height = `${e}px`, this._updateScrollHeight = !1)
                }

                _setVirtualHeight() {
                    this._virtualPadding && (this._virtualPadding.style.height = "0px")
                }

                _onItemsLengthChanged() {
                    this._updateScrollHeight = !0
                }

                _renderItemsRange(e = null) {
                    if (e && this._lastScrollPosition === e) return;
                    const i = this._panelService.calculateItems(e = e || this._scrollablePanel.scrollTop, this.itemsLength, this.bufferAmount);
                    this._updateVirtualHeight(i.scrollHeight), this._contentPanel.style.transform = `translateY(${i.topPadding}px)`, this._zone.run(() => {
                        this.update.emit(this.items.slice(i.start, i.end)), this.scroll.emit({
                            start: i.start,
                            end: i.end
                        })
                    }), ke(e) && 0 === this._lastScrollPosition && (this._scrollablePanel.scrollTop = e, this._lastScrollPosition = e)
                }

                _measureDimensions() {
                    if (this._panelService.dimensions.itemHeight > 0 || 0 === this.itemsLength) return Promise.resolve(this._panelService.dimensions);
                    const [e] = this.items;
                    return this.update.emit([e]), Promise.resolve().then(() => {
                        const r = this._dropdown.querySelector(`#${e.htmlId}`).clientHeight;
                        return this._virtualPadding.style.height = r * this.itemsLength + "px", this._panelService.setDimensions(r, this._scrollablePanel.clientHeight), this._panelService.dimensions
                    })
                }

                _fireScrollToEnd(e) {
                    this._scrollToEndFired || 0 === e || e + this._dropdown.clientHeight >= (this.virtualScroll ? this._virtualPadding : this._contentPanel).clientHeight - 1 && (this._zone.run(() => this.scrollToEnd.emit()), this._scrollToEndFired = !0)
                }

                _calculateCurrentPosition(e) {
                    if ("auto" !== this.position) return this.position;
                    const i = this._select.getBoundingClientRect(),
                        r = document.documentElement.scrollTop || document.body.scrollTop;
                    return i.top + window.pageYOffset + i.height + e.getBoundingClientRect().height > r + document.documentElement.clientHeight ? "top" : "bottom"
                }

                _appendDropdown() {
                    if (this.appendTo) {
                        if (this._parent = document.querySelector(this.appendTo), !this._parent) throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`);
                        this._updateXPosition(), this._parent.appendChild(this._dropdown)
                    }
                }

                _updateXPosition() {
                    const e = this._select.getBoundingClientRect(), i = this._parent.getBoundingClientRect();
                    this._dropdown.style.left = e.left - i.left + "px", this._dropdown.style.width = e.width + "px", this._dropdown.style.minWidth = e.width + "px"
                }

                _updateYPosition() {
                    const e = this._select.getBoundingClientRect(), i = this._parent.getBoundingClientRect(),
                        r = e.height;
                    "top" === this._currentPosition ? (this._dropdown.style.bottom = i.bottom - e.bottom + r + "px", this._dropdown.style.top = "auto") : "bottom" === this._currentPosition && (this._dropdown.style.top = e.top - i.top + r + "px", this._dropdown.style.bottom = "auto")
                }

                _setupMousedownListener() {
                    this._zone.runOutsideAngular(() => {
                        Un(this._dropdown, "mousedown").pipe(Qe(this._destroy$)).subscribe(e => {
                            "INPUT" !== e.target.tagName && e.preventDefault()
                        })
                    })
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Ot), g(Ge), g(vb), g(he), g(Xt, 8))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-dropdown-panel"]],
                viewQuery: function (e, i) {
                    if (1 & e && (ye(dP, 7, he), ye(hP, 7, he), ye(fP, 7, he)), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.contentElementRef = r.first), Z(r = Q()) && (i.scrollElementRef = r.first), Z(r = Q()) && (i.paddingElementRef = r.first)
                    }
                },
                inputs: {
                    items: "items",
                    markedItem: "markedItem",
                    position: "position",
                    appendTo: "appendTo",
                    bufferAmount: "bufferAmount",
                    virtualScroll: "virtualScroll",
                    headerTemplate: "headerTemplate",
                    footerTemplate: "footerTemplate",
                    filterValue: "filterValue"
                },
                outputs: {update: "update", scroll: "scroll", scrollToEnd: "scrollToEnd", outsideClick: "outsideClick"},
                features: [nt],
                ngContentSelectors: pb,
                decls: 9,
                vars: 6,
                consts: [["class", "ng-dropdown-header", 4, "ngIf"], [1, "ng-dropdown-panel-items", "scroll-host"], ["scroll", ""], ["padding", ""], ["content", ""], ["class", "ng-dropdown-footer", 4, "ngIf"], [1, "ng-dropdown-header"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "ng-dropdown-footer"]],
                template: function (e, i) {
                    1 & e && (Yn(), O(0, pP, 2, 4, "div", 0), S(1, "div", 1, 2), k(3, "div", null, 3), S(5, "div", null, 4), Vt(7), E()(), O(8, gP, 2, 4, "div", 5)), 2 & e && (v("ngIf", i.headerTemplate), _(3), we("total-padding", i.virtualScroll), _(2), we("scrollable-content", i.virtualScroll && i.items.length), _(3), v("ngIf", i.footerTemplate))
                },
                dependencies: [ot, wr],
                encapsulation: 2,
                changeDetection: 0
            }), t
        })(), dF = (() => {
            class t {
                constructor(e) {
                    this.elementRef = e, this.stateChange$ = new nn, this._disabled = !1
                }

                get disabled() {
                    return this._disabled
                }

                set disabled(e) {
                    this._disabled = this._isDisabled(e)
                }

                get label() {
                    return (this.elementRef.nativeElement.textContent || "").trim()
                }

                ngOnChanges(e) {
                    e.disabled && this.stateChange$.next({value: this.value, disabled: this._disabled})
                }

                ngAfterViewChecked() {
                    this.label !== this._previousLabel && (this._previousLabel = this.label, this.stateChange$.next({
                        value: this.value,
                        disabled: this._disabled,
                        label: this.elementRef.nativeElement.innerHTML
                    }))
                }

                ngOnDestroy() {
                    this.stateChange$.complete()
                }

                _isDisabled(e) {
                    return null != e && "false" != `${e}`
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-option"]],
                inputs: {value: "value", disabled: "disabled"},
                features: [nt],
                ngContentSelectors: pb,
                decls: 1,
                vars: 0,
                template: function (e, i) {
                    1 & e && (Yn(), Vt(0))
                },
                encapsulation: 2,
                changeDetection: 0
            }), t
        })(), hF = (() => {
            class t {
                constructor() {
                    this.notFoundText = "No items found", this.typeToSearchText = "Type to search", this.addTagText = "Add item", this.loadingText = "Loading...", this.clearAllText = "Clear all", this.disableVirtualScroll = !0, this.openOnEnter = !0, this.appearance = "underline"
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })(), fF = (() => {
            class t {
                warn(e) {
                    console.warn(e)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })();
        const bb = new L("ng-select-selection-model");
        let wb = (() => {
            class t {
                constructor(e, i, r, o, s, a, l) {
                    this.classes = e, this.autoFocus = i, this.config = r, this._cd = a, this._console = l, this.markFirst = !0, this.dropdownPosition = "auto", this.loading = !1, this.closeOnSelect = !0, this.hideSelected = !1, this.selectOnTab = !1, this.bufferAmount = 4, this.selectableGroup = !1, this.selectableGroupAsModel = !0, this.searchFn = null, this.trackByFn = null, this.clearOnBackspace = !0, this.labelForId = null, this.inputAttrs = {}, this.readonly = !1, this.searchWhileComposing = !0, this.minTermLength = 0, this.editableSearchTerm = !1, this.keyDownFn = c => !0, this.multiple = !1, this.addTag = !1, this.searchable = !0, this.clearable = !0, this.isOpen = !1, this.blurEvent = new G, this.focusEvent = new G, this.changeEvent = new G, this.openEvent = new G, this.closeEvent = new G, this.searchEvent = new G, this.clearEvent = new G, this.addEvent = new G, this.removeEvent = new G, this.scroll = new G, this.scrollToEnd = new G, this.useDefaultClass = !0, this.viewPortItems = [], this.searchTerm = null, this.dropdownId = mb(), this.escapeHTML = !0, this._items = [], this._defaultLabel = "label", this._pressedKeys = [], this._isComposing = !1, this._destroy$ = new nn, this._keyPress$ = new nn, this._onChange = c => {
                    }, this._onTouched = () => {
                    }, this.clearItem = c => {
                        const u = this.selectedItems.find(d => d.value === c);
                        this.unselect(u)
                    }, this.trackByOption = (c, u) => this.trackByFn ? this.trackByFn(u.value) : u, this._mergeGlobalConfig(r), this.itemsList = new cF(this, o()), this.element = s.nativeElement
                }

                get items() {
                    return this._items
                }

                set items(e) {
                    null === e && (e = []), this._itemsAreUsed = !0, this._items = e
                }

                get compareWith() {
                    return this._compareWith
                }

                set compareWith(e) {
                    if (null != e && !$a(e)) throw Error("`compareWith` must be a function.");
                    this._compareWith = e
                }

                get clearSearchOnAdd() {
                    return ke(this._clearSearchOnAdd) ? this._clearSearchOnAdd : ke(this.config.clearSearchOnAdd) ? this.config.clearSearchOnAdd : this.closeOnSelect
                }

                set clearSearchOnAdd(e) {
                    this._clearSearchOnAdd = e
                }

                get disabled() {
                    return this.readonly || this._disabled
                }

                get filtered() {
                    return !!this.searchTerm && this.searchable || this._isComposing
                }

                get single() {
                    return !this.multiple
                }

                get _editableSearchTerm() {
                    return this.editableSearchTerm && !this.multiple
                }

                get selectedItems() {
                    return this.itemsList.selectedItems
                }

                get selectedValues() {
                    return this.selectedItems.map(e => e.value)
                }

                get hasValue() {
                    return this.selectedItems.length > 0
                }

                get currentPanelPosition() {
                    if (this.dropdownPanel) return this.dropdownPanel.currentPosition
                }

                ngOnInit() {
                    this._handleKeyPresses(), this._setInputAttributes()
                }

                ngOnChanges(e) {
                    e.multiple && this.itemsList.clearSelected(), e.items && this._setItems(e.items.currentValue || []), e.isOpen && (this._manualOpen = ke(e.isOpen.currentValue))
                }

                ngAfterViewInit() {
                    this._itemsAreUsed || (this.escapeHTML = !1, this._setItemsFromNgOptions()), ke(this.autoFocus) && this.focus()
                }

                ngOnDestroy() {
                    this._destroy$.next(), this._destroy$.complete()
                }

                handleKeyDown(e) {
                    if (gn[e.which]) {
                        if (!1 === this.keyDownFn(e)) return;
                        this.handleKeyCode(e)
                    } else e.key && 1 === e.key.length && this._keyPress$.next(e.key.toLocaleLowerCase())
                }

                handleKeyCode(e) {
                    switch (e.which) {
                        case gn.ArrowDown:
                            this._handleArrowDown(e);
                            break;
                        case gn.ArrowUp:
                            this._handleArrowUp(e);
                            break;
                        case gn.Space:
                            this._handleSpace(e);
                            break;
                        case gn.Enter:
                            this._handleEnter(e);
                            break;
                        case gn.Tab:
                            this._handleTab(e);
                            break;
                        case gn.Esc:
                            this.close(), e.preventDefault();
                            break;
                        case gn.Backspace:
                            this._handleBackspace()
                    }
                }

                handleMousedown(e) {
                    const i = e.target;
                    "INPUT" !== i.tagName && e.preventDefault(), i.classList.contains("ng-clear-wrapper") ? this.handleClearClick() : i.classList.contains("ng-arrow-wrapper") ? this.handleArrowClick() : i.classList.contains("ng-value-icon") || (this.focused || this.focus(), this.searchable ? this.open() : this.toggle())
                }

                handleArrowClick() {
                    this.isOpen ? this.close() : this.open()
                }

                handleClearClick() {
                    this.hasValue && (this.itemsList.clearSelected(!0), this._updateNgModel()), this._clearSearch(), this.focus(), this.clearEvent.emit(), this._onSelectionChanged()
                }

                clearModel() {
                    this.clearable && (this.itemsList.clearSelected(), this._updateNgModel())
                }

                writeValue(e) {
                    this.itemsList.clearSelected(), this._handleWriteValue(e), this._cd.markForCheck()
                }

                registerOnChange(e) {
                    this._onChange = e
                }

                registerOnTouched(e) {
                    this._onTouched = e
                }

                setDisabledState(e) {
                    this._disabled = e, this._cd.markForCheck()
                }

                toggle() {
                    this.isOpen ? this.close() : this.open()
                }

                open() {
                    this.disabled || this.isOpen || this._manualOpen || !this._isTypeahead && !this.addTag && this.itemsList.noItemsToSelect || (this.isOpen = !0, this.itemsList.markSelectedOrDefault(this.markFirst), this.openEvent.emit(), this.searchTerm || this.focus(), this.detectChanges())
                }

                close() {
                    !this.isOpen || this._manualOpen || (this.isOpen = !1, this._isComposing = !1, this._editableSearchTerm ? this.itemsList.resetFilteredItems() : this._clearSearch(), this.itemsList.unmarkItem(), this._onTouched(), this.closeEvent.emit(), this._cd.markForCheck())
                }

                toggleItem(e) {
                    !e || e.disabled || this.disabled || (this.multiple && e.selected ? this.unselect(e) : this.select(e), this._editableSearchTerm && this._setSearchTermFromItems(), this._onSelectionChanged())
                }

                select(e) {
                    e.selected || (this.itemsList.select(e), this.clearSearchOnAdd && !this._editableSearchTerm && this._clearSearch(), this._updateNgModel(), this.multiple && this.addEvent.emit(e.value)), (this.closeOnSelect || this.itemsList.noItemsToSelect) && this.close()
                }

                focus() {
                    this.searchInput.nativeElement.readOnly || this.searchInput.nativeElement.focus()
                }

                blur() {
                    this.searchInput.nativeElement.blur()
                }

                unselect(e) {
                    e && (this.itemsList.unselect(e), this.focus(), this._updateNgModel(), this.removeEvent.emit(e))
                }

                selectTag() {
                    let e;
                    e = $a(this.addTag) ? this.addTag(this.searchTerm) : this._primitive ? this.searchTerm : {[this.bindLabel]: this.searchTerm};
                    const i = r => this._isTypeahead || !this.isOpen ? this.itemsList.mapItem(r, null) : this.itemsList.addItem(r);
                    !function KP(t) {
                        return t instanceof Promise
                    }(e) ? e && this.select(i(e)) : e.then(r => this.select(i(r))).catch(() => {
                    })
                }

                showClear() {
                    return this.clearable && (this.hasValue || this.searchTerm) && !this.disabled
                }

                get showAddTag() {
                    if (!this._validTerm) return !1;
                    const e = this.searchTerm.toLowerCase().trim();
                    return this.addTag && !this.itemsList.filteredItems.some(i => i.label.toLowerCase() === e) && (!this.hideSelected && this.isOpen || !this.selectedItems.some(i => i.label.toLowerCase() === e)) && !this.loading
                }

                showNoItemsFound() {
                    const e = 0 === this.itemsList.filteredItems.length;
                    return (e && !this._isTypeahead && !this.loading || e && this._isTypeahead && this._validTerm && !this.loading) && !this.showAddTag
                }

                showTypeToSearch() {
                    return 0 === this.itemsList.filteredItems.length && this._isTypeahead && !this._validTerm && !this.loading
                }

                onCompositionStart() {
                    this._isComposing = !0
                }

                onCompositionEnd(e) {
                    this._isComposing = !1, !this.searchWhileComposing && this.filter(e)
                }

                filter(e) {
                    this._isComposing && !this.searchWhileComposing || (this.searchTerm = e, this._isTypeahead && (this._validTerm || 0 === this.minTermLength) && this.typeahead.next(e), this._isTypeahead || (this.itemsList.filter(this.searchTerm), this.isOpen && this.itemsList.markSelectedOrDefault(this.markFirst)), this.searchEvent.emit({
                        term: e,
                        items: this.itemsList.filteredItems.map(i => i.value)
                    }), this.open())
                }

                onInputFocus(e) {
                    this.focused || (this._editableSearchTerm && this._setSearchTermFromItems(), this.element.classList.add("ng-select-focused"), this.focusEvent.emit(e), this.focused = !0)
                }

                onInputBlur(e) {
                    this.element.classList.remove("ng-select-focused"), this.blurEvent.emit(e), !this.isOpen && !this.disabled && this._onTouched(), this._editableSearchTerm && this._setSearchTermFromItems(), this.focused = !1
                }

                onItemHover(e) {
                    e.disabled || this.itemsList.markItem(e)
                }

                detectChanges() {
                    this._cd.destroyed || this._cd.detectChanges()
                }

                _setSearchTermFromItems() {
                    const e = this.selectedItems && this.selectedItems[0];
                    this.searchTerm = e && e.label || null
                }

                _setItems(e) {
                    const i = e[0];
                    this.bindLabel = this.bindLabel || this._defaultLabel, this._primitive = ke(i) ? !Ro(i) : this._primitive || this.bindLabel === this._defaultLabel, this.itemsList.setItems(e), e.length > 0 && this.hasValue && this.itemsList.mapSelectedItems(), this.isOpen && ke(this.searchTerm) && !this._isTypeahead && this.itemsList.filter(this.searchTerm), (this._isTypeahead || this.isOpen) && this.itemsList.markSelectedOrDefault(this.markFirst)
                }

                _setItemsFromNgOptions() {
                    const e = r => {
                        this.items = r.map(o => ({
                            $ngOptionValue: o.value,
                            $ngOptionLabel: o.elementRef.nativeElement.innerHTML,
                            disabled: o.disabled
                        })), this.itemsList.setItems(this.items), this.hasValue && this.itemsList.mapSelectedItems(), this.detectChanges()
                    }, i = () => {
                        const r = Pr(this.ngOptions.changes, this._destroy$);
                        Pr(...this.ngOptions.map(o => o.stateChange$)).pipe(Qe(r)).subscribe(o => {
                            const s = this.itemsList.findItem(o.value);
                            s.disabled = o.disabled, s.label = o.label || s.label, this._cd.detectChanges()
                        })
                    };
                    this.ngOptions.changes.pipe(ub(this.ngOptions), Qe(this._destroy$)).subscribe(r => {
                        this.bindLabel = this._defaultLabel, e(r), i()
                    })
                }

                _isValidWriteValue(e) {
                    if (!ke(e) || this.multiple && "" === e || Array.isArray(e) && 0 === e.length) return !1;
                    const i = r => !(!ke(this.compareWith) && Ro(r) && this.bindValue && (this._console.warn(`Setting object(${JSON.stringify(r)}) as your model with bindValue is not allowed unless [compareWith] is used.`), 1));
                    return this.multiple ? Array.isArray(e) ? e.every(r => i(r)) : (this._console.warn("Multiple select ngModel should be array."), !1) : i(e)
                }

                _handleWriteValue(e) {
                    if (!this._isValidWriteValue(e)) return;
                    const i = r => {
                        let o = this.itemsList.findItem(r);
                        if (o) this.itemsList.select(o); else {
                            const s = Ro(r);
                            s || !s && !this.bindValue ? this.itemsList.select(this.itemsList.mapItem(r, null)) : this.bindValue && (o = {
                                [this.bindLabel]: null,
                                [this.bindValue]: r
                            }, this.itemsList.select(this.itemsList.mapItem(o, null)))
                        }
                    };
                    this.multiple ? e.forEach(r => i(r)) : i(e)
                }

                _handleKeyPresses() {
                    this.searchable || this._keyPress$.pipe(Qe(this._destroy$), function YA(t, n, e) {
                        const i = ne(t) || n || e ? {next: t, error: n, complete: e} : t;
                        return i ? et((r, o) => {
                            var s;
                            null === (s = i.subscribe) || void 0 === s || s.call(i);
                            let a = !0;
                            r.subscribe(Ye(o, l => {
                                var c;
                                null === (c = i.next) || void 0 === c || c.call(i, l), o.next(l)
                            }, () => {
                                var l;
                                a = !1, null === (l = i.complete) || void 0 === l || l.call(i), o.complete()
                            }, l => {
                                var c;
                                a = !1, null === (c = i.error) || void 0 === c || c.call(i, l), o.error(l)
                            }, () => {
                                var l, c;
                                a && (null === (l = i.unsubscribe) || void 0 === l || l.call(i)), null === (c = i.finalize) || void 0 === c || c.call(i)
                            }))
                        }) : Ar
                    }(e => this._pressedKeys.push(e)), db(200), tn(() => this._pressedKeys.length > 0), mt(() => this._pressedKeys.join(""))).subscribe(e => {
                        const i = this.itemsList.findByLabel(e);
                        i && (this.isOpen ? (this.itemsList.markItem(i), this._scrollToMarked(), this._cd.markForCheck()) : this.select(i)), this._pressedKeys = []
                    })
                }

                _setInputAttributes() {
                    const e = this.searchInput.nativeElement, i = {
                        type: "text",
                        autocorrect: "off",
                        autocapitalize: "off",
                        autocomplete: this.labelForId ? "off" : this.dropdownId, ...this.inputAttrs
                    };
                    for (const r of Object.keys(i)) e.setAttribute(r, i[r])
                }

                _updateNgModel() {
                    const e = [];
                    for (const r of this.selectedItems) if (this.bindValue) {
                        let o = null;
                        o = r.children ? r.value[(this.groupValue ? this.bindValue : this.groupBy) || this.groupBy] : this.itemsList.resolveNested(r.value, this.bindValue), e.push(o)
                    } else e.push(r.value);
                    const i = this.selectedItems.map(r => r.value);
                    this.multiple ? (this._onChange(e), this.changeEvent.emit(i)) : (this._onChange(ke(e[0]) ? e[0] : null), this.changeEvent.emit(i[0])), this._cd.markForCheck()
                }

                _clearSearch() {
                    this.searchTerm && (this._changeSearch(null), this.itemsList.resetFilteredItems())
                }

                _changeSearch(e) {
                    this.searchTerm = e, this._isTypeahead && this.typeahead.next(e)
                }

                _scrollToMarked() {
                    !this.isOpen || !this.dropdownPanel || this.dropdownPanel.scrollTo(this.itemsList.markedItem)
                }

                _scrollToTag() {
                    !this.isOpen || !this.dropdownPanel || this.dropdownPanel.scrollToTag()
                }

                _onSelectionChanged() {
                    this.isOpen && this.multiple && this.appendTo && (this._cd.detectChanges(), this.dropdownPanel.adjustPosition())
                }

                _handleTab(e) {
                    !1 === this.isOpen && !this.addTag || (this.selectOnTab ? this.itemsList.markedItem ? (this.toggleItem(this.itemsList.markedItem), e.preventDefault()) : this.showAddTag ? (this.selectTag(), e.preventDefault()) : this.close() : this.close())
                }

                _handleEnter(e) {
                    if (this.isOpen || this._manualOpen) this.itemsList.markedItem ? this.toggleItem(this.itemsList.markedItem) : this.showAddTag && this.selectTag(); else {
                        if (!this.openOnEnter) return;
                        this.open()
                    }
                    e.preventDefault()
                }

                _handleSpace(e) {
                    this.isOpen || this._manualOpen || (this.open(), e.preventDefault())
                }

                _handleArrowDown(e) {
                    this._nextItemIsTag(1) ? (this.itemsList.unmarkItem(), this._scrollToTag()) : (this.itemsList.markNextItem(), this._scrollToMarked()), this.open(), e.preventDefault()
                }

                _handleArrowUp(e) {
                    this.isOpen && (this._nextItemIsTag(-1) ? (this.itemsList.unmarkItem(), this._scrollToTag()) : (this.itemsList.markPreviousItem(), this._scrollToMarked()), e.preventDefault())
                }

                _nextItemIsTag(e) {
                    const i = this.itemsList.markedIndex + e;
                    return this.addTag && this.searchTerm && this.itemsList.markedItem && (i < 0 || i === this.itemsList.filteredItems.length)
                }

                _handleBackspace() {
                    this.searchTerm || !this.clearable || !this.clearOnBackspace || !this.hasValue || (this.multiple ? this.unselect(this.itemsList.lastSelectedItem) : this.clearModel())
                }

                get _isTypeahead() {
                    return this.typeahead && this.typeahead.observers.length > 0
                }

                get _validTerm() {
                    const e = this.searchTerm && this.searchTerm.trim();
                    return e && e.length >= this.minTermLength
                }

                _mergeGlobalConfig(e) {
                    this.placeholder = this.placeholder || e.placeholder, this.notFoundText = this.notFoundText || e.notFoundText, this.typeToSearchText = this.typeToSearchText || e.typeToSearchText, this.addTagText = this.addTagText || e.addTagText, this.loadingText = this.loadingText || e.loadingText, this.clearAllText = this.clearAllText || e.clearAllText, this.virtualScroll = ke(this.virtualScroll) ? this.virtualScroll : !!ke(e.disableVirtualScroll) && !e.disableVirtualScroll, this.openOnEnter = ke(this.openOnEnter) ? this.openOnEnter : e.openOnEnter, this.appendTo = this.appendTo || e.appendTo, this.bindValue = this.bindValue || e.bindValue, this.bindLabel = this.bindLabel || e.bindLabel, this.appearance = this.appearance || e.appearance
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(Gr("class"), Gr("autofocus"), g(hF), g(bb), g(he), g(Xn), g(fF))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-select"]],
                contentQueries: function (e, i, r) {
                    if (1 & e && (ht(r, QP, 5, te), ht(r, XP, 5, te), ht(r, JP, 5, te), ht(r, eF, 5, te), ht(r, tF, 5, te), ht(r, nF, 5, te), ht(r, iF, 5, te), ht(r, rF, 5, te), ht(r, oF, 5, te), ht(r, sF, 5, te), ht(r, aF, 5, te), ht(r, dF, 5)), 2 & e) {
                        let o;
                        Z(o = Q()) && (i.optionTemplate = o.first), Z(o = Q()) && (i.optgroupTemplate = o.first), Z(o = Q()) && (i.labelTemplate = o.first), Z(o = Q()) && (i.multiLabelTemplate = o.first), Z(o = Q()) && (i.headerTemplate = o.first), Z(o = Q()) && (i.footerTemplate = o.first), Z(o = Q()) && (i.notFoundTemplate = o.first), Z(o = Q()) && (i.typeToSearchTemplate = o.first), Z(o = Q()) && (i.loadingTextTemplate = o.first), Z(o = Q()) && (i.tagTemplate = o.first), Z(o = Q()) && (i.loadingSpinnerTemplate = o.first), Z(o = Q()) && (i.ngOptions = o)
                    }
                },
                viewQuery: function (e, i) {
                    if (1 & e && (ye(yb, 5), ye(mP, 7)), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.dropdownPanel = r.first), Z(r = Q()) && (i.searchInput = r.first)
                    }
                },
                hostVars: 20,
                hostBindings: function (e, i) {
                    1 & e && ce("keydown", function (o) {
                        return i.handleKeyDown(o)
                    }), 2 & e && we("ng-select-typeahead", i.typeahead)("ng-select-multiple", i.multiple)("ng-select-taggable", i.addTag)("ng-select-searchable", i.searchable)("ng-select-clearable", i.clearable)("ng-select-opened", i.isOpen)("ng-select", i.useDefaultClass)("ng-select-disabled", i.disabled)("ng-select-filtered", i.filtered)("ng-select-single", i.single)
                },
                inputs: {
                    bindLabel: "bindLabel",
                    bindValue: "bindValue",
                    markFirst: "markFirst",
                    placeholder: "placeholder",
                    notFoundText: "notFoundText",
                    typeToSearchText: "typeToSearchText",
                    addTagText: "addTagText",
                    loadingText: "loadingText",
                    clearAllText: "clearAllText",
                    appearance: "appearance",
                    dropdownPosition: "dropdownPosition",
                    appendTo: "appendTo",
                    loading: "loading",
                    closeOnSelect: "closeOnSelect",
                    hideSelected: "hideSelected",
                    selectOnTab: "selectOnTab",
                    openOnEnter: "openOnEnter",
                    maxSelectedItems: "maxSelectedItems",
                    groupBy: "groupBy",
                    groupValue: "groupValue",
                    bufferAmount: "bufferAmount",
                    virtualScroll: "virtualScroll",
                    selectableGroup: "selectableGroup",
                    selectableGroupAsModel: "selectableGroupAsModel",
                    searchFn: "searchFn",
                    trackByFn: "trackByFn",
                    clearOnBackspace: "clearOnBackspace",
                    labelForId: "labelForId",
                    inputAttrs: "inputAttrs",
                    tabIndex: "tabIndex",
                    readonly: "readonly",
                    searchWhileComposing: "searchWhileComposing",
                    minTermLength: "minTermLength",
                    editableSearchTerm: "editableSearchTerm",
                    keyDownFn: "keyDownFn",
                    typeahead: "typeahead",
                    multiple: "multiple",
                    addTag: "addTag",
                    searchable: "searchable",
                    clearable: "clearable",
                    isOpen: "isOpen",
                    items: "items",
                    compareWith: "compareWith",
                    clearSearchOnAdd: "clearSearchOnAdd"
                },
                outputs: {
                    blurEvent: "blur",
                    focusEvent: "focus",
                    changeEvent: "change",
                    openEvent: "open",
                    closeEvent: "close",
                    searchEvent: "search",
                    clearEvent: "clear",
                    addEvent: "add",
                    removeEvent: "remove",
                    scroll: "scroll",
                    scrollToEnd: "scrollToEnd"
                },
                features: [ue([{provide: Ct, useExisting: ie(() => t), multi: !0}, vb]), nt],
                decls: 14,
                vars: 19,
                consts: [[1, "ng-select-container", 3, "mousedown"], [1, "ng-value-container"], [1, "ng-placeholder"], [4, "ngIf"], ["role", "combobox", "aria-haspopup", "listbox", 1, "ng-input"], ["aria-autocomplete", "list", 3, "readOnly", "disabled", "value", "input", "compositionstart", "compositionend", "focus", "blur", "change"], ["searchInput", ""], ["class", "ng-clear-wrapper", 3, "title", 4, "ngIf"], [1, "ng-arrow-wrapper"], [1, "ng-arrow"], ["class", "ng-dropdown-panel", "role", "listbox", "aria-label", "Options list", 3, "virtualScroll", "bufferAmount", "appendTo", "position", "headerTemplate", "footerTemplate", "filterValue", "items", "markedItem", "ng-select-multiple", "ngClass", "id", "update", "scroll", "scrollToEnd", "outsideClick", 4, "ngIf"], ["class", "ng-value", 3, "ng-value-disabled", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "ng-value"], ["defaultLabelTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["aria-hidden", "true", 1, "ng-value-icon", "left", 3, "click"], [1, "ng-value-label", 3, "ngItemLabel", "escape"], ["defaultLoadingSpinnerTemplate", ""], [3, "ngTemplateOutlet"], [1, "ng-spinner-loader"], [1, "ng-clear-wrapper", 3, "title"], ["aria-hidden", "true", 1, "ng-clear"], ["role", "listbox", "aria-label", "Options list", 1, "ng-dropdown-panel", 3, "virtualScroll", "bufferAmount", "appendTo", "position", "headerTemplate", "footerTemplate", "filterValue", "items", "markedItem", "ngClass", "id", "update", "scroll", "scrollToEnd", "outsideClick"], ["class", "ng-option", 3, "ng-option-disabled", "ng-option-selected", "ng-optgroup", "ng-option", "ng-option-child", "ng-option-marked", "click", "mouseover", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "ng-option", "role", "option", 3, "ng-option-marked", "mouseover", "click", 4, "ngIf"], [1, "ng-option", 3, "click", "mouseover"], ["defaultOptionTemplate", ""], [1, "ng-option-label", 3, "ngItemLabel", "escape"], ["role", "option", 1, "ng-option", 3, "mouseover", "click"], ["defaultTagTemplate", ""], [1, "ng-tag-label"], ["defaultNotFoundTemplate", ""], [1, "ng-option", "ng-option-disabled"], ["defaultTypeToSearchTemplate", ""], ["defaultLoadingTextTemplate", ""]],
                template: function (e, i) {
                    if (1 & e) {
                        const r = Kt();
                        S(0, "div", 0), ce("mousedown", function (s) {
                            return i.handleMousedown(s)
                        }), S(1, "div", 1)(2, "div", 2), Ie(3), E(), O(4, wP, 2, 2, "ng-container", 3), O(5, EP, 1, 5, null, 3), S(6, "div", 4)(7, "input", 5, 6), ce("input", function () {
                            Ke(r);
                            const s = Me(8);
                            return Ze(i.filter(s.value))
                        })("compositionstart", function () {
                            return i.onCompositionStart()
                        })("compositionend", function () {
                            Ke(r);
                            const s = Me(8);
                            return Ze(i.onCompositionEnd(s.value))
                        })("focus", function (s) {
                            return i.onInputFocus(s)
                        })("blur", function (s) {
                            return i.onInputBlur(s)
                        })("change", function (s) {
                            return s.stopPropagation()
                        }), E()()(), O(9, MP, 4, 1, "ng-container", 3), O(10, TP, 3, 1, "span", 7), S(11, "span", 8), k(12, "span", 9), E()(), O(13, GP, 7, 19, "ng-dropdown-panel", 10)
                    }
                    2 & e && (we("ng-appearance-outline", "outline" === i.appearance)("ng-has-value", i.hasValue), _(3), Zn(i.placeholder), _(1), v("ngIf", (!i.multiLabelTemplate || !i.multiple) && i.selectedItems.length > 0), _(1), v("ngIf", i.multiple && i.multiLabelTemplate && i.selectedValues.length > 0), _(1), $e("aria-expanded", i.isOpen)("aria-owns", i.isOpen ? i.dropdownId : null), _(1), v("readOnly", !i.searchable || i.itemsList.maxItemsSelected)("disabled", i.disabled)("value", i.searchTerm ? i.searchTerm : ""), $e("id", i.labelForId)("tabindex", i.tabIndex)("aria-activedescendant", i.isOpen ? null == i.itemsList || null == i.itemsList.markedItem ? null : i.itemsList.markedItem.htmlId : null)("aria-controls", i.isOpen ? i.dropdownId : null), _(2), v("ngIf", i.loading), _(1), v("ngIf", i.showClear()), _(3), v("ngIf", i.isOpen))
                },
                dependencies: [Jn, _a, ot, wr, yb, ZP],
                styles: ['@charset "UTF-8";.ng-select{position:relative;display:block;box-sizing:border-box}.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{cursor:default;display:flex;outline:none;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none transparent;border:0 none;box-shadow:none;outline:none;padding:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border-top:2px solid rgba(66,66,66,.2);border-right:2px solid rgba(66,66,66,.2);border-bottom:2px solid rgba(66,66,66,.2);border-left:2px solid #424242;transform:translateZ(0);animation:load8 .8s infinite linear}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@keyframes load8{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-option-label:empty:before{content:"\\200b"}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:700;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}\n'],
                encapsulation: 2,
                changeDetection: 0
            }), t
        })();

        function pF() {
            return new gF
        }

        class gF {
            constructor() {
                this._selected = []
            }

            get value() {
                return this._selected
            }

            select(n, e, i) {
                if (n.selected = !0, (!n.children || !e && i) && this._selected.push(n), e) if (n.parent) {
                    const r = n.parent.children.length, o = n.parent.children.filter(s => s.selected).length;
                    n.parent.selected = r === o
                } else n.children && (this._setChildrenSelectedState(n.children, !0), this._removeChildren(n), this._selected = i && this._activeChildren(n) ? [...this._selected.filter(r => r.parent !== n), n] : [...this._selected, ...n.children.filter(r => !r.disabled)])
            }

            unselect(n, e) {
                if (this._selected = this._selected.filter(i => i !== n), n.selected = !1, e) if (n.parent && n.parent.selected) {
                    const i = n.parent.children;
                    this._removeParent(n.parent), this._removeChildren(n.parent), this._selected.push(...i.filter(r => r !== n && !r.disabled)), n.parent.selected = !1
                } else n.children && (this._setChildrenSelectedState(n.children, !1), this._removeChildren(n))
            }

            clear(n) {
                this._selected = n ? this._selected.filter(e => e.disabled) : []
            }

            _setChildrenSelectedState(n, e) {
                for (const i of n) i.disabled || (i.selected = e)
            }

            _removeChildren(n) {
                this._selected = [...this._selected.filter(e => e.parent !== n), ...n.children.filter(e => e.parent === n && e.disabled && e.selected)]
            }

            _removeParent(n) {
                this._selected = this._selected.filter(e => e !== n)
            }

            _activeChildren(n) {
                return n.children.every(e => !e.disabled || e.selected)
            }
        }

        let mF = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({
                providers: [{provide: bb, useValue: pF}],
                imports: [ya]
            }), t
        })();

        function Ga(t) {
            return "function" == typeof t
        }

        let jd = !1;
        const mn = {
            Promise: void 0, set useDeprecatedSynchronousErrorHandling(t) {
                if (t) {
                    const n = new Error;
                    console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" + n.stack)
                } else jd && console.log("RxJS: Back to a better error behavior. Thank you. <3");
                jd = t
            }, get useDeprecatedSynchronousErrorHandling() {
                return jd
            }
        };

        function Vo(t) {
            setTimeout(() => {
                throw t
            }, 0)
        }

        const Wa = {
            closed: !0, next(t) {
            }, error(t) {
                if (mn.useDeprecatedSynchronousErrorHandling) throw t;
                Vo(t)
            }, complete() {
            }
        }, vF = Array.isArray || (t => t && "number" == typeof t.length), qa = (() => {
            function t(n) {
                return Error.call(this), this.message = n ? `${n.length} errors occurred during unsubscription:\n${n.map((e, i) => `${i + 1}) ${e.toString()}`).join("\n  ")}` : "", this.name = "UnsubscriptionError", this.errors = n, this
            }

            return t.prototype = Object.create(Error.prototype), t
        })();

        class Dt {
            constructor(n) {
                this.closed = !1, this._parentOrParents = null, this._subscriptions = null, n && (this._ctorUnsubscribe = !0, this._unsubscribe = n)
            }

            unsubscribe() {
                let n;
                if (this.closed) return;
                let {_parentOrParents: e, _ctorUnsubscribe: i, _unsubscribe: r, _subscriptions: o} = this;
                if (this.closed = !0, this._parentOrParents = null, this._subscriptions = null, e instanceof Dt) e.remove(this); else if (null !== e) for (let s = 0; s < e.length; ++s) e[s].remove(this);
                if (Ga(r)) {
                    i && (this._unsubscribe = void 0);
                    try {
                        r.call(this)
                    } catch (s) {
                        n = s instanceof qa ? Cb(s.errors) : [s]
                    }
                }
                if (vF(o)) {
                    let s = -1, a = o.length;
                    for (; ++s < a;) {
                        const l = o[s];
                        if (null !== (t = l) && "object" == typeof t) try {
                            l.unsubscribe()
                        } catch (c) {
                            n = n || [], c instanceof qa ? n = n.concat(Cb(c.errors)) : n.push(c)
                        }
                    }
                }
                var t;
                if (n) throw new qa(n)
            }

            add(n) {
                let e = n;
                if (!n) return Dt.EMPTY;
                switch (typeof n) {
                    case"function":
                        e = new Dt(n);
                    case"object":
                        if (e === this || e.closed || "function" != typeof e.unsubscribe) return e;
                        if (this.closed) return e.unsubscribe(), e;
                        if (!(e instanceof Dt)) {
                            const o = e;
                            e = new Dt, e._subscriptions = [o]
                        }
                        break;
                    default:
                        throw new Error("unrecognized teardown " + n + " added to Subscription.")
                }
                let {_parentOrParents: i} = e;
                if (null === i) e._parentOrParents = this; else if (i instanceof Dt) {
                    if (i === this) return e;
                    e._parentOrParents = [i, this]
                } else {
                    if (-1 !== i.indexOf(this)) return e;
                    i.push(this)
                }
                const r = this._subscriptions;
                return null === r ? this._subscriptions = [e] : r.push(e), e
            }

            remove(n) {
                const e = this._subscriptions;
                if (e) {
                    const i = e.indexOf(n);
                    -1 !== i && e.splice(i, 1)
                }
            }
        }

        var t;

        function Cb(t) {
            return t.reduce((n, e) => n.concat(e instanceof qa ? e.errors : e), [])
        }

        Dt.EMPTY = ((t = new Dt).closed = !0, t);
        const Ya = "function" == typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random();

        class Bt extends Dt {
            constructor(n, e, i) {
                switch (super(), this.syncErrorValue = null, this.syncErrorThrown = !1, this.syncErrorThrowable = !1, this.isStopped = !1, arguments.length) {
                    case 0:
                        this.destination = Wa;
                        break;
                    case 1:
                        if (!n) {
                            this.destination = Wa;
                            break
                        }
                        if ("object" == typeof n) {
                            n instanceof Bt ? (this.syncErrorThrowable = n.syncErrorThrowable, this.destination = n, n.add(this)) : (this.syncErrorThrowable = !0, this.destination = new Db(this, n));
                            break
                        }
                    default:
                        this.syncErrorThrowable = !0, this.destination = new Db(this, n, e, i)
                }
            }

            [Ya]() {
                return this
            }

            static create(n, e, i) {
                const r = new Bt(n, e, i);
                return r.syncErrorThrowable = !1, r
            }

            next(n) {
                this.isStopped || this._next(n)
            }

            error(n) {
                this.isStopped || (this.isStopped = !0, this._error(n))
            }

            complete() {
                this.isStopped || (this.isStopped = !0, this._complete())
            }

            unsubscribe() {
                this.closed || (this.isStopped = !0, super.unsubscribe())
            }

            _next(n) {
                this.destination.next(n)
            }

            _error(n) {
                this.destination.error(n), this.unsubscribe()
            }

            _complete() {
                this.destination.complete(), this.unsubscribe()
            }

            _unsubscribeAndRecycle() {
                const {_parentOrParents: n} = this;
                return this._parentOrParents = null, this.unsubscribe(), this.closed = !1, this.isStopped = !1, this._parentOrParents = n, this
            }
        }

        class Db extends Bt {
            constructor(n, e, i, r) {
                super(), this._parentSubscriber = n;
                let o, s = this;
                Ga(e) ? o = e : e && (o = e.next, i = e.error, r = e.complete, e !== Wa && (s = Object.create(e), Ga(s.unsubscribe) && this.add(s.unsubscribe.bind(s)), s.unsubscribe = this.unsubscribe.bind(this))), this._context = s, this._next = o, this._error = i, this._complete = r
            }

            next(n) {
                if (!this.isStopped && this._next) {
                    const {_parentSubscriber: e} = this;
                    mn.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable ? this.__tryOrSetError(e, this._next, n) && this.unsubscribe() : this.__tryOrUnsub(this._next, n)
                }
            }

            error(n) {
                if (!this.isStopped) {
                    const {_parentSubscriber: e} = this, {useDeprecatedSynchronousErrorHandling: i} = mn;
                    if (this._error) i && e.syncErrorThrowable ? (this.__tryOrSetError(e, this._error, n), this.unsubscribe()) : (this.__tryOrUnsub(this._error, n), this.unsubscribe()); else if (e.syncErrorThrowable) i ? (e.syncErrorValue = n, e.syncErrorThrown = !0) : Vo(n), this.unsubscribe(); else {
                        if (this.unsubscribe(), i) throw n;
                        Vo(n)
                    }
                }
            }

            complete() {
                if (!this.isStopped) {
                    const {_parentSubscriber: n} = this;
                    if (this._complete) {
                        const e = () => this._complete.call(this._context);
                        mn.useDeprecatedSynchronousErrorHandling && n.syncErrorThrowable ? (this.__tryOrSetError(n, e), this.unsubscribe()) : (this.__tryOrUnsub(e), this.unsubscribe())
                    } else this.unsubscribe()
                }
            }

            __tryOrUnsub(n, e) {
                try {
                    n.call(this._context, e)
                } catch (i) {
                    if (this.unsubscribe(), mn.useDeprecatedSynchronousErrorHandling) throw i;
                    Vo(i)
                }
            }

            __tryOrSetError(n, e, i) {
                if (!mn.useDeprecatedSynchronousErrorHandling) throw new Error("bad call");
                try {
                    e.call(this._context, i)
                } catch (r) {
                    return mn.useDeprecatedSynchronousErrorHandling ? (n.syncErrorValue = r, n.syncErrorThrown = !0, !0) : (Vo(r), !0)
                }
                return !1
            }

            _unsubscribe() {
                const {_parentSubscriber: n} = this;
                this._context = null, this._parentSubscriber = null, n.unsubscribe()
            }
        }

        const wF = "function" == typeof Symbol && Symbol.observable || "@@observable";

        function CF(t) {
            return t
        }

        let Sb = (() => {
            class t {
                constructor(e) {
                    this._isScalar = !1, e && (this._subscribe = e)
                }

                lift(e) {
                    const i = new t;
                    return i.source = this, i.operator = e, i
                }

                subscribe(e, i, r) {
                    const {operator: o} = this, s = function bF(t, n, e) {
                        if (t) {
                            if (t instanceof Bt) return t;
                            if (t[Ya]) return t[Ya]()
                        }
                        return t || n || e ? new Bt(t, n, e) : new Bt(Wa)
                    }(e, i, r);
                    if (s.add(o ? o.call(s, this.source) : this.source || mn.useDeprecatedSynchronousErrorHandling && !s.syncErrorThrowable ? this._subscribe(s) : this._trySubscribe(s)), mn.useDeprecatedSynchronousErrorHandling && s.syncErrorThrowable && (s.syncErrorThrowable = !1, s.syncErrorThrown)) throw s.syncErrorValue;
                    return s
                }

                _trySubscribe(e) {
                    try {
                        return this._subscribe(e)
                    } catch (i) {
                        mn.useDeprecatedSynchronousErrorHandling && (e.syncErrorThrown = !0, e.syncErrorValue = i), function yF(t) {
                            for (; t;) {
                                const {closed: n, destination: e, isStopped: i} = t;
                                if (n || i) return !1;
                                t = e && e instanceof Bt ? e : null
                            }
                            return !0
                        }(e) ? e.error(i) : console.warn(i)
                    }
                }

                forEach(e, i) {
                    return new (i = xb(i))((r, o) => {
                        let s;
                        s = this.subscribe(a => {
                            try {
                                e(a)
                            } catch (l) {
                                o(l), s && s.unsubscribe()
                            }
                        }, o, r)
                    })
                }

                _subscribe(e) {
                    const {source: i} = this;
                    return i && i.subscribe(e)
                }

                [wF]() {
                    return this
                }

                pipe(...e) {
                    return 0 === e.length ? this : function Eb(t) {
                        return 0 === t.length ? CF : 1 === t.length ? t[0] : function (e) {
                            return t.reduce((i, r) => r(i), e)
                        }
                    }(e)(this)
                }

                toPromise(e) {
                    return new (e = xb(e))((i, r) => {
                        let o;
                        this.subscribe(s => o = s, s => r(s), () => i(o))
                    })
                }
            }

            return t.create = n => new t(n), t
        })();

        function xb(t) {
            if (t || (t = mn.Promise || Promise), !t) throw new Error("no Promise impl found");
            return t
        }

        const Bo = (() => {
            function t() {
                return Error.call(this), this.message = "object unsubscribed", this.name = "ObjectUnsubscribedError", this
            }

            return t.prototype = Object.create(Error.prototype), t
        })();

        class DF extends Dt {
            constructor(n, e) {
                super(), this.subject = n, this.subscriber = e, this.closed = !1
            }

            unsubscribe() {
                if (this.closed) return;
                this.closed = !0;
                const n = this.subject, e = n.observers;
                if (this.subject = null, !e || 0 === e.length || n.isStopped || n.closed) return;
                const i = e.indexOf(this.subscriber);
                -1 !== i && e.splice(i, 1)
            }
        }

        class EF extends Bt {
            constructor(n) {
                super(n), this.destination = n
            }
        }

        let Ho = (() => {
            class t extends Sb {
                constructor() {
                    super(), this.observers = [], this.closed = !1, this.isStopped = !1, this.hasError = !1, this.thrownError = null
                }

                [Ya]() {
                    return new EF(this)
                }

                lift(e) {
                    const i = new Mb(this, this);
                    return i.operator = e, i
                }

                next(e) {
                    if (this.closed) throw new Bo;
                    if (!this.isStopped) {
                        const {observers: i} = this, r = i.length, o = i.slice();
                        for (let s = 0; s < r; s++) o[s].next(e)
                    }
                }

                error(e) {
                    if (this.closed) throw new Bo;
                    this.hasError = !0, this.thrownError = e, this.isStopped = !0;
                    const {observers: i} = this, r = i.length, o = i.slice();
                    for (let s = 0; s < r; s++) o[s].error(e);
                    this.observers.length = 0
                }

                complete() {
                    if (this.closed) throw new Bo;
                    this.isStopped = !0;
                    const {observers: e} = this, i = e.length, r = e.slice();
                    for (let o = 0; o < i; o++) r[o].complete();
                    this.observers.length = 0
                }

                unsubscribe() {
                    this.isStopped = !0, this.closed = !0, this.observers = null
                }

                _trySubscribe(e) {
                    if (this.closed) throw new Bo;
                    return super._trySubscribe(e)
                }

                _subscribe(e) {
                    if (this.closed) throw new Bo;
                    return this.hasError ? (e.error(this.thrownError), Dt.EMPTY) : this.isStopped ? (e.complete(), Dt.EMPTY) : (this.observers.push(e), new DF(this, e))
                }

                asObservable() {
                    const e = new Sb;
                    return e.source = this, e
                }
            }

            return t.create = (n, e) => new Mb(n, e), t
        })();

        class Mb extends Ho {
            constructor(n, e) {
                super(), this.destination = n, this.source = e
            }

            next(n) {
                const {destination: e} = this;
                e && e.next && e.next(n)
            }

            error(n) {
                const {destination: e} = this;
                e && e.error && this.destination.error(n)
            }

            complete() {
                const {destination: n} = this;
                n && n.complete && this.destination.complete()
            }

            _subscribe(n) {
                const {source: e} = this;
                return e ? this.source.subscribe(n) : Dt.EMPTY
            }
        }

        class SF extends Dt {
            constructor(n, e) {
                super()
            }

            schedule(n, e = 0) {
                return this
            }
        }

        let Tb = (() => {
            class t {
                constructor(e, i = t.now) {
                    this.SchedulerAction = e, this.now = i
                }

                schedule(e, i = 0, r) {
                    return new this.SchedulerAction(this, e).schedule(r, i)
                }
            }

            return t.now = () => Date.now(), t
        })();

        class si extends Tb {
            constructor(n, e = Tb.now) {
                super(n, () => si.delegate && si.delegate !== this ? si.delegate.now() : e()), this.actions = [], this.active = !1, this.scheduled = void 0
            }

            schedule(n, e = 0, i) {
                return si.delegate && si.delegate !== this ? si.delegate.schedule(n, e, i) : super.schedule(n, e, i)
            }

            flush(n) {
                const {actions: e} = this;
                if (this.active) return void e.push(n);
                let i;
                this.active = !0;
                do {
                    if (i = n.execute(n.state, n.delay)) break
                } while (n = e.shift());
                if (this.active = !1, i) {
                    for (; n = e.shift();) n.unsubscribe();
                    throw i
                }
            }
        }

        const MF = new si(class xF extends SF {
            constructor(n, e) {
                super(n, e), this.scheduler = n, this.work = e, this.pending = !1
            }

            schedule(n, e = 0) {
                if (this.closed) return this;
                this.state = n;
                const i = this.id, r = this.scheduler;
                return null != i && (this.id = this.recycleAsyncId(r, i, e)), this.pending = !0, this.delay = e, this.id = this.id || this.requestAsyncId(r, this.id, e), this
            }

            requestAsyncId(n, e, i = 0) {
                return setInterval(n.flush.bind(n, this), i)
            }

            recycleAsyncId(n, e, i = 0) {
                if (null !== i && this.delay === i && !1 === this.pending) return e;
                clearInterval(e)
            }

            execute(n, e) {
                if (this.closed) return new Error("executing a cancelled action");
                this.pending = !1;
                const i = this._execute(n, e);
                if (i) return i;
                !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
            }

            _execute(n, e) {
                let r, i = !1;
                try {
                    this.work(n)
                } catch (o) {
                    i = !0, r = !!o && o || new Error(o)
                }
                if (i) return this.unsubscribe(), r
            }

            _unsubscribe() {
                const n = this.id, e = this.scheduler, i = e.actions, r = i.indexOf(this);
                this.work = null, this.state = null, this.pending = !1, this.scheduler = null, -1 !== r && i.splice(r, 1), null != n && (this.id = this.recycleAsyncId(e, n, null)), this.delay = null
            }
        }), Ob = {leading: !0, trailing: !1};

        function Ib(t, n = MF, e = Ob) {
            return i => i.lift(new IF(t, n, e.leading, e.trailing))
        }

        class IF {
            constructor(n, e, i, r) {
                this.duration = n, this.scheduler = e, this.leading = i, this.trailing = r
            }

            call(n, e) {
                return e.subscribe(new AF(n, this.duration, this.scheduler, this.leading, this.trailing))
            }
        }

        class AF extends Bt {
            constructor(n, e, i, r, o) {
                super(n), this.duration = e, this.scheduler = i, this.leading = r, this.trailing = o, this._hasTrailingValue = !1, this._trailingValue = null
            }

            _next(n) {
                this.throttled ? this.trailing && (this._trailingValue = n, this._hasTrailingValue = !0) : (this.add(this.throttled = this.scheduler.schedule(PF, this.duration, {subscriber: this})), this.leading ? this.destination.next(n) : this.trailing && (this._trailingValue = n, this._hasTrailingValue = !0))
            }

            _complete() {
                this._hasTrailingValue ? (this.destination.next(this._trailingValue), this.destination.complete()) : this.destination.complete()
            }

            clearThrottle() {
                const n = this.throttled;
                n && (this.trailing && this._hasTrailingValue && (this.destination.next(this._trailingValue), this._trailingValue = null, this._hasTrailingValue = !1), n.unsubscribe(), this.remove(n), this.throttled = null)
            }
        }

        function PF(t) {
            const {subscriber: n} = t;
            n.clearThrottle()
        }

        function ai() {
        }

        function Ab(t, n, e) {
            return function (r) {
                return r.lift(new FF(t, n, e))
            }
        }

        class FF {
            constructor(n, e, i) {
                this.nextOrObserver = n, this.error = e, this.complete = i
            }

            call(n, e) {
                return e.subscribe(new kF(n, this.nextOrObserver, this.error, this.complete))
            }
        }

        class kF extends Bt {
            constructor(n, e, i, r) {
                super(n), this._tapNext = ai, this._tapError = ai, this._tapComplete = ai, this._tapError = i || ai, this._tapComplete = r || ai, Ga(e) ? (this._context = this, this._tapNext = e) : e && (this._context = e, this._tapNext = e.next || ai, this._tapError = e.error || ai, this._tapComplete = e.complete || ai)
            }

            _next(n) {
                try {
                    this._tapNext.call(this._context, n)
                } catch (e) {
                    return void this.destination.error(e)
                }
                this.destination.next(n)
            }

            _error(n) {
                try {
                    this._tapError.call(this._context, n)
                } catch (e) {
                    return void this.destination.error(e)
                }
                this.destination.error(n)
            }

            _complete() {
                try {
                    this._tapComplete.call(this._context)
                } catch (n) {
                    return void this.destination.error(n)
                }
                return this.destination.complete()
            }
        }

        function Pb(t, n) {
            return e => e.lift(new NF(t, n))
        }

        class NF {
            constructor(n, e) {
                this.compare = n, this.keySelector = e
            }

            call(n, e) {
                return e.subscribe(new LF(n, this.compare, this.keySelector))
            }
        }

        class LF extends Bt {
            constructor(n, e, i) {
                super(n), this.keySelector = i, this.hasKey = !1, "function" == typeof e && (this.compare = e)
            }

            compare(n, e) {
                return n === e
            }

            _next(n) {
                let e;
                try {
                    const {keySelector: r} = this;
                    e = r ? r(n) : n
                } catch (r) {
                    return this.destination.error(r)
                }
                let i = !1;
                if (this.hasKey) try {
                    const {compare: r} = this;
                    i = r(this.key, e)
                } catch (r) {
                    return this.destination.error(r)
                } else this.hasKey = !0;
                i || (this.key = e, this.destination.next(n))
            }
        }

        class VF {
            constructor(n, e) {
                this.predicate = n, this.thisArg = e
            }

            call(n, e) {
                return e.subscribe(new BF(n, this.predicate, this.thisArg))
            }
        }

        class BF extends Bt {
            constructor(n, e, i) {
                super(n), this.predicate = e, this.thisArg = i, this.count = 0
            }

            _next(n) {
                let e;
                try {
                    e = this.predicate.call(this.thisArg, n, this.count++)
                } catch (i) {
                    return void this.destination.error(i)
                }
                e && this.destination.next(n)
            }
        }

        var Ht = typeof window < "u" ? window : {screen: {}, navigator: {}}, Sr = (Ht.matchMedia || function () {
            return {matches: !1}
        }).bind(Ht), Fb = !1, kb = function () {
        };
        Ht.addEventListener && Ht.addEventListener("p", kb, {
            get passive() {
                return Fb = !0
            }
        }), Ht.removeEventListener && Ht.removeEventListener("p", kb, !1);
        var Nb = Fb, Ud = "ontouchstart" in Ht,
            Rb = (Ud || "TouchEvent" in Ht && Sr("(any-pointer: coarse)"), Ht.navigator.userAgent || "");
        Sr("(pointer: coarse)").matches && /iPad|Macintosh/.test(Rb) && Math.min(Ht.screen.width || 0, Ht.screen.height || 0);
        (Sr("(pointer: coarse)").matches || !Sr("(pointer: fine)").matches && Ud) && /Windows.*Firefox/.test(Rb), Sr("(any-pointer: fine)").matches || Sr("(any-hover: hover)");
        const GF = ["tooltipTemplate"], WF = ["leftOuterSelectionBar"], qF = ["rightOuterSelectionBar"],
            YF = ["fullBar"], KF = ["selectionBar"], ZF = ["minHandle"], QF = ["maxHandle"], XF = ["floorLabel"],
            JF = ["ceilLabel"], ek = ["minHandleLabel"], tk = ["maxHandleLabel"], nk = ["combinedLabel"],
            ik = ["ticksElement"];

        function rk(t, n) {
            if (1 & t && k(0, "ngx-slider-tooltip-wrapper", 31), 2 & t) {
                const e = P().$implicit;
                v("template", P().tooltipTemplate)("tooltip", e.valueTooltip)("placement", e.valueTooltipPlacement)("content", e.value)
            }
        }

        function ok(t, n) {
            1 & t && k(0, "span", 32), 2 & t && v("innerHTML", P().$implicit.legend, an)
        }

        const sk = function (t) {
            return {"ngx-slider-selected": t}
        };

        function ak(t, n) {
            if (1 & t && (S(0, "span", 27), k(1, "ngx-slider-tooltip-wrapper", 28), O(2, rk, 1, 4, "ngx-slider-tooltip-wrapper", 29), O(3, ok, 1, 1, "span", 30), E()), 2 & t) {
                const e = n.$implicit, i = P();
                v("ngClass", Ei(7, sk, e.selected))("ngStyle", e.style), _(1), v("template", i.tooltipTemplate)("tooltip", e.tooltip)("placement", e.tooltipPlacement), _(1), v("ngIf", null != e.value), _(1), v("ngIf", null != e.legend)
            }
        }

        function lk(t, n) {
        }

        function ck(t, n) {
            1 & t && O(0, lk, 0, 0, "ng-template")
        }

        const uk = function (t, n, e) {
            return {tooltip: t, placement: n, content: e}
        };

        function dk(t, n) {
            if (1 & t && (Te(0), O(1, ck, 1, 0, null, 1), Oe()), 2 & t) {
                const e = P();
                _(1), v("ngTemplateOutlet", e.template)("ngTemplateOutletContext", du(2, uk, e.tooltip, e.placement, e.content))
            }
        }

        function hk(t, n) {
            if (1 & t && (Te(0), S(1, "div", 2), Ie(2), E(), Oe()), 2 & t) {
                const e = P();
                _(1), $e("title", e.tooltip)("data-tooltip-placement", e.placement), _(1), Zt(" ", e.content, " ")
            }
        }

        const qe = {Low: 0, High: 1, Floor: 2, Ceil: 3, TickValue: 4};
        qe[qe.Low] = "Low", qe[qe.High] = "High", qe[qe.Floor] = "Floor", qe[qe.Ceil] = "Ceil", qe[qe.TickValue] = "TickValue";

        class Ka {
            constructor() {
                this.floor = 0, this.ceil = null, this.step = 1, this.minRange = null, this.maxRange = null, this.pushRange = !1, this.minLimit = null, this.maxLimit = null, this.translate = null, this.combineLabels = null, this.getLegend = null, this.getStepLegend = null, this.stepsArray = null, this.bindIndexForStepsArray = !1, this.draggableRange = !1, this.draggableRangeOnly = !1, this.showSelectionBar = !1, this.showSelectionBarEnd = !1, this.showSelectionBarFromValue = null, this.showOuterSelectionBars = !1, this.hidePointerLabels = !1, this.hideLimitLabels = !1, this.autoHideLimitLabels = !0, this.readOnly = !1, this.disabled = !1, this.showTicks = !1, this.showTicksValues = !1, this.tickStep = null, this.tickValueStep = null, this.ticksArray = null, this.ticksTooltip = null, this.ticksValuesTooltip = null, this.vertical = !1, this.getSelectionBarColor = null, this.getTickColor = null, this.getPointerColor = null, this.keyboardSupport = !0, this.scale = 1, this.rotate = 0, this.enforceStep = !0, this.enforceRange = !0, this.enforceStepsArray = !0, this.noSwitching = !1, this.onlyBindHandles = !1, this.rightToLeft = !1, this.reversedControls = !1, this.boundPointerLabels = !0, this.logScale = !1, this.customValueToPosition = null, this.customPositionToValue = null, this.precisionLimit = 12, this.selectionBarGradient = null, this.ariaLabel = "ngx-slider", this.ariaLabelledBy = null, this.ariaLabelHigh = "ngx-slider-max", this.ariaLabelledByHigh = null, this.handleDimension = null, this.barDimension = null, this.animate = !0, this.animateOnMove = !1
            }
        }

        const F = {Min: 0, Max: 1};
        F[F.Min] = "Min", F[F.Max] = "Max";

        class fk {
        }

        class C {
            static isNullOrUndefined(n) {
                return null == n
            }

            static areArraysEqual(n, e) {
                if (n.length !== e.length) return !1;
                for (let i = 0; i < n.length; ++i) if (n[i] !== e[i]) return !1;
                return !0
            }

            static linearValueToPosition(n, e, i) {
                return (n - e) / (i - e)
            }

            static logValueToPosition(n, e, i) {
                return ((n = Math.log(n)) - (e = Math.log(e))) / ((i = Math.log(i)) - e)
            }

            static linearPositionToValue(n, e, i) {
                return n * (i - e) + e
            }

            static logPositionToValue(n, e, i) {
                return e = Math.log(e), i = Math.log(i), Math.exp(n * (i - e) + e)
            }

            static findStepIndex(n, e) {
                const i = e.map(o => Math.abs(n - o.value));
                let r = 0;
                for (let o = 0; o < e.length; o++) i[o] !== i[r] && i[o] < i[r] && (r = o);
                return r
            }
        }

        class li {
            static isTouchEvent(n) {
                return void 0 !== window.TouchEvent ? n instanceof TouchEvent : void 0 !== n.touches
            }

            static isResizeObserverAvailable() {
                return void 0 !== window.ResizeObserver
            }
        }

        class Ne {
            static roundToPrecisionLimit(n, e) {
                return +n.toPrecision(e)
            }

            static isModuloWithinPrecisionLimit(n, e, i) {
                const r = Math.pow(10, -i);
                return Math.abs(n % e) <= r || Math.abs(Math.abs(n % e) - e) <= r
            }

            static clampToRange(n, e, i) {
                return Math.min(Math.max(n, e), i)
            }
        }

        class Hb {
            constructor() {
                this.eventName = null, this.events = null, this.eventsSubscription = null, this.teardownCallback = null
            }
        }

        class jb {
            constructor(n) {
                this.renderer = n
            }

            attachPassiveEventListener(n, e, i, r) {
                if (!0 !== Nb) return this.attachEventListener(n, e, i, r);
                const o = new Hb;
                o.eventName = e, o.events = new Ho;
                const s = a => {
                    o.events.next(a)
                };
                return n.addEventListener(e, s, {passive: !0, capture: !1}), o.teardownCallback = () => {
                    n.removeEventListener(e, s, {passive: !0, capture: !1})
                }, o.eventsSubscription = o.events.pipe(C.isNullOrUndefined(r) ? Ab(() => {
                }) : Ib(r, void 0, {leading: !0, trailing: !0})).subscribe(a => {
                    i(a)
                }), o
            }

            detachEventListener(n) {
                C.isNullOrUndefined(n.eventsSubscription) || (n.eventsSubscription.unsubscribe(), n.eventsSubscription = null), C.isNullOrUndefined(n.events) || (n.events.complete(), n.events = null), C.isNullOrUndefined(n.teardownCallback) || (n.teardownCallback(), n.teardownCallback = null)
            }

            attachEventListener(n, e, i, r) {
                const o = new Hb;
                return o.eventName = e, o.events = new Ho, o.teardownCallback = this.renderer.listen(n, e, a => {
                    o.events.next(a)
                }), o.eventsSubscription = o.events.pipe(C.isNullOrUndefined(r) ? Ab(() => {
                }) : Ib(r, void 0, {leading: !0, trailing: !0})).subscribe(a => {
                    i(a)
                }), o
            }
        }

        let ci = (() => {
            class t {
                constructor(e, i, r) {
                    this.elemRef = e, this.renderer = i, this.changeDetectionRef = r, this._position = 0, this._dimension = 0, this._alwaysHide = !1, this._vertical = !1, this._scale = 1, this._rotate = 0, this.opacity = 1, this.visibility = "visible", this.left = "", this.bottom = "", this.height = "", this.width = "", this.transform = "", this.eventListeners = [], this.eventListenerHelper = new jb(this.renderer)
                }

                get position() {
                    return this._position
                }

                get dimension() {
                    return this._dimension
                }

                get alwaysHide() {
                    return this._alwaysHide
                }

                get vertical() {
                    return this._vertical
                }

                get scale() {
                    return this._scale
                }

                get rotate() {
                    return this._rotate
                }

                setAlwaysHide(e) {
                    this._alwaysHide = e, this.visibility = e ? "hidden" : "visible"
                }

                hide() {
                    this.opacity = 0
                }

                show() {
                    this.alwaysHide || (this.opacity = 1)
                }

                isVisible() {
                    return !this.alwaysHide && 0 !== this.opacity
                }

                setVertical(e) {
                    this._vertical = e, this._vertical ? (this.left = "", this.width = "") : (this.bottom = "", this.height = "")
                }

                setScale(e) {
                    this._scale = e
                }

                setRotate(e) {
                    this._rotate = e, this.transform = "rotate(" + e + "deg)"
                }

                getRotate() {
                    return this._rotate
                }

                setPosition(e) {
                    this._position !== e && !this.isRefDestroyed() && this.changeDetectionRef.markForCheck(), this._position = e, this._vertical ? this.bottom = Math.round(e) + "px" : this.left = Math.round(e) + "px"
                }

                calculateDimension() {
                    const e = this.getBoundingClientRect();
                    this._dimension = this.vertical ? (e.bottom - e.top) * this.scale : (e.right - e.left) * this.scale
                }

                setDimension(e) {
                    this._dimension !== e && !this.isRefDestroyed() && this.changeDetectionRef.markForCheck(), this._dimension = e, this._vertical ? this.height = Math.round(e) + "px" : this.width = Math.round(e) + "px"
                }

                getBoundingClientRect() {
                    return this.elemRef.nativeElement.getBoundingClientRect()
                }

                on(e, i, r) {
                    const o = this.eventListenerHelper.attachEventListener(this.elemRef.nativeElement, e, i, r);
                    this.eventListeners.push(o)
                }

                onPassive(e, i, r) {
                    const o = this.eventListenerHelper.attachPassiveEventListener(this.elemRef.nativeElement, e, i, r);
                    this.eventListeners.push(o)
                }

                off(e) {
                    let i, r;
                    C.isNullOrUndefined(e) ? (i = [], r = this.eventListeners) : (i = this.eventListeners.filter(o => o.eventName !== e), r = this.eventListeners.filter(o => o.eventName === e));
                    for (const o of r) this.eventListenerHelper.detachEventListener(o);
                    this.eventListeners = i
                }

                isRefDestroyed() {
                    return C.isNullOrUndefined(this.changeDetectionRef) || this.changeDetectionRef.destroyed
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he), g(Ot), g(Xn))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngxSliderElement", ""]],
                hostVars: 14,
                hostBindings: function (e, i) {
                    2 & e && Ws("opacity", i.opacity)("visibility", i.visibility)("left", i.left)("bottom", i.bottom)("height", i.height)("width", i.width)("transform", i.transform)
                }
            }), t
        })(), $d = (() => {
            class t extends ci {
                constructor(e, i, r) {
                    super(e, i, r), this.active = !1, this.role = "", this.tabindex = "", this.ariaOrientation = "", this.ariaLabel = "", this.ariaLabelledBy = "", this.ariaValueNow = "", this.ariaValueText = "", this.ariaValueMin = "", this.ariaValueMax = ""
                }

                focus() {
                    this.elemRef.nativeElement.focus()
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he), g(Ot), g(Xn))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "ngxSliderHandle", ""]],
                hostVars: 11,
                hostBindings: function (e, i) {
                    2 & e && ($e("role", i.role)("tabindex", i.tabindex)("aria-orientation", i.ariaOrientation)("aria-label", i.ariaLabel)("aria-labelledby", i.ariaLabelledBy)("aria-valuenow", i.ariaValueNow)("aria-valuetext", i.ariaValueText)("aria-valuemin", i.ariaValueMin)("aria-valuemax", i.ariaValueMax), we("ngx-slider-active", i.active))
                },
                features: [R]
            }), t
        })(), xr = (() => {
            class t extends ci {
                constructor(e, i, r) {
                    super(e, i, r), this._value = null
                }

                get value() {
                    return this._value
                }

                setValue(e) {
                    let i = !1;
                    !this.alwaysHide && (C.isNullOrUndefined(this.value) || this.value.length !== e.length || this.value.length > 0 && 0 === this.dimension) && (i = !0), this._value = e, this.elemRef.nativeElement.innerHTML = e, i && this.calculateDimension()
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he), g(Ot), g(Xn))
            }, t.\u0275dir = I({type: t, selectors: [["", "ngxSliderLabel", ""]], features: [R]}), t
        })();

        class pk {
            constructor() {
                this.selected = !1, this.style = {}, this.tooltip = null, this.tooltipPlacement = null, this.value = null, this.valueTooltip = null, this.valueTooltipPlacement = null, this.legend = null
            }
        }

        class Ub {
            constructor() {
                this.active = !1, this.value = 0, this.difference = 0, this.position = 0, this.lowLimit = 0, this.highLimit = 0
            }
        }

        class Za {
            static compare(n, e) {
                return !(C.isNullOrUndefined(n) && C.isNullOrUndefined(e) || C.isNullOrUndefined(n) !== C.isNullOrUndefined(e)) && n.value === e.value && n.highValue === e.highValue
            }
        }

        class $b extends Za {
            static compare(n, e) {
                return !(C.isNullOrUndefined(n) && C.isNullOrUndefined(e) || C.isNullOrUndefined(n) !== C.isNullOrUndefined(e)) && n.value === e.value && n.highValue === e.highValue && n.forceChange === e.forceChange
            }
        }

        const gk = {provide: Ct, useExisting: ie(() => Qa), multi: !0};
        let Qa = (() => {
            class t {
                constructor(e, i, r, o) {
                    this.renderer = e, this.elementRef = i, this.changeDetectionRef = r, this.zone = o, this.value = null, this.valueChange = new G, this.highValue = null, this.highValueChange = new G, this.options = new Ka, this.userChangeStart = new G, this.userChange = new G, this.userChangeEnd = new G, this.initHasRun = !1, this.inputModelChangeSubject = new Ho, this.inputModelChangeSubscription = null, this.outputModelChangeSubject = new Ho, this.outputModelChangeSubscription = null, this.viewLowValue = null, this.viewHighValue = null, this.viewOptions = new Ka, this.handleHalfDimension = 0, this.maxHandlePosition = 0, this.currentTrackingPointer = null, this.currentFocusPointer = null, this.firstKeyDown = !1, this.touchId = null, this.dragging = new Ub, this.sliderElementVerticalClass = !1, this.sliderElementAnimateClass = !1, this.sliderElementWithLegendClass = !1, this.sliderElementDisabledAttr = null, this.sliderElementAriaLabel = "ngx-slider", this.barStyle = {}, this.minPointerStyle = {}, this.maxPointerStyle = {}, this.fullBarTransparentClass = !1, this.selectionBarDraggableClass = !1, this.ticksUnderValuesClass = !1, this.intermediateTicks = !1, this.ticks = [], this.eventListenerHelper = null, this.onMoveEventListener = null, this.onEndEventListener = null, this.moving = !1, this.resizeObserver = null, this.onTouchedCallback = null, this.onChangeCallback = null, this.eventListenerHelper = new jb(this.renderer)
                }

                set manualRefresh(e) {
                    this.unsubscribeManualRefresh(), this.manualRefreshSubscription = e.subscribe(() => {
                        setTimeout(() => this.calculateViewDimensionsAndDetectChanges())
                    })
                }

                set triggerFocus(e) {
                    this.unsubscribeTriggerFocus(), this.triggerFocusSubscription = e.subscribe(i => {
                        this.focusPointer(i)
                    })
                }

                get range() {
                    return !C.isNullOrUndefined(this.value) && !C.isNullOrUndefined(this.highValue)
                }

                get showTicks() {
                    return this.viewOptions.showTicks
                }

                ngOnInit() {
                    this.viewOptions = new Ka, Object.assign(this.viewOptions, this.options), this.updateDisabledState(), this.updateVerticalState(), this.updateAriaLabel()
                }

                ngAfterViewInit() {
                    this.applyOptions(), this.subscribeInputModelChangeSubject(), this.subscribeOutputModelChangeSubject(), this.renormaliseModelValues(), this.viewLowValue = this.modelValueToViewValue(this.value), this.viewHighValue = this.range ? this.modelValueToViewValue(this.highValue) : null, this.updateVerticalState(), this.manageElementsStyle(), this.updateDisabledState(), this.calculateViewDimensions(), this.addAccessibility(), this.updateCeilLabel(), this.updateFloorLabel(), this.initHandles(), this.manageEventsBindings(), this.updateAriaLabel(), this.subscribeResizeObserver(), this.initHasRun = !0, this.isRefDestroyed() || this.changeDetectionRef.detectChanges()
                }

                ngOnChanges(e) {
                    !C.isNullOrUndefined(e.options) && JSON.stringify(e.options.previousValue) !== JSON.stringify(e.options.currentValue) && this.onChangeOptions(), (!C.isNullOrUndefined(e.value) || !C.isNullOrUndefined(e.highValue)) && this.inputModelChangeSubject.next({
                        value: this.value,
                        highValue: this.highValue,
                        forceChange: !1,
                        internalChange: !1
                    })
                }

                ngOnDestroy() {
                    this.unbindEvents(), this.unsubscribeResizeObserver(), this.unsubscribeInputModelChangeSubject(), this.unsubscribeOutputModelChangeSubject(), this.unsubscribeManualRefresh(), this.unsubscribeTriggerFocus()
                }

                writeValue(e) {
                    e instanceof Array ? (this.value = e[0], this.highValue = e[1]) : this.value = e, this.inputModelChangeSubject.next({
                        value: this.value,
                        highValue: this.highValue,
                        forceChange: !1,
                        internalChange: !1
                    })
                }

                registerOnChange(e) {
                    this.onChangeCallback = e
                }

                registerOnTouched(e) {
                    this.onTouchedCallback = e
                }

                setDisabledState(e) {
                    this.viewOptions.disabled = e, this.updateDisabledState()
                }

                setAriaLabel(e) {
                    this.viewOptions.ariaLabel = e, this.updateAriaLabel()
                }

                onResize(e) {
                    this.calculateViewDimensionsAndDetectChanges()
                }

                subscribeInputModelChangeSubject() {
                    this.inputModelChangeSubscription = this.inputModelChangeSubject.pipe(Pb($b.compare), function RF(t, n) {
                        return function (i) {
                            return i.lift(new VF(t, n))
                        }
                    }(e => !e.forceChange && !e.internalChange)).subscribe(e => this.applyInputModelChange(e))
                }

                subscribeOutputModelChangeSubject() {
                    this.outputModelChangeSubscription = this.outputModelChangeSubject.pipe(Pb($b.compare)).subscribe(e => this.publishOutputModelChange(e))
                }

                subscribeResizeObserver() {
                    li.isResizeObserverAvailable() && (this.resizeObserver = new ResizeObserver(() => this.calculateViewDimensionsAndDetectChanges()), this.resizeObserver.observe(this.elementRef.nativeElement))
                }

                unsubscribeResizeObserver() {
                    li.isResizeObserverAvailable() && null !== this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null)
                }

                unsubscribeOnMove() {
                    C.isNullOrUndefined(this.onMoveEventListener) || (this.eventListenerHelper.detachEventListener(this.onMoveEventListener), this.onMoveEventListener = null)
                }

                unsubscribeOnEnd() {
                    C.isNullOrUndefined(this.onEndEventListener) || (this.eventListenerHelper.detachEventListener(this.onEndEventListener), this.onEndEventListener = null)
                }

                unsubscribeInputModelChangeSubject() {
                    C.isNullOrUndefined(this.inputModelChangeSubscription) || (this.inputModelChangeSubscription.unsubscribe(), this.inputModelChangeSubscription = null)
                }

                unsubscribeOutputModelChangeSubject() {
                    C.isNullOrUndefined(this.outputModelChangeSubscription) || (this.outputModelChangeSubscription.unsubscribe(), this.outputModelChangeSubscription = null)
                }

                unsubscribeManualRefresh() {
                    C.isNullOrUndefined(this.manualRefreshSubscription) || (this.manualRefreshSubscription.unsubscribe(), this.manualRefreshSubscription = null)
                }

                unsubscribeTriggerFocus() {
                    C.isNullOrUndefined(this.triggerFocusSubscription) || (this.triggerFocusSubscription.unsubscribe(), this.triggerFocusSubscription = null)
                }

                getPointerElement(e) {
                    return e === F.Min ? this.minHandleElement : e === F.Max ? this.maxHandleElement : null
                }

                getCurrentTrackingValue() {
                    return this.currentTrackingPointer === F.Min ? this.viewLowValue : this.currentTrackingPointer === F.Max ? this.viewHighValue : null
                }

                modelValueToViewValue(e) {
                    return C.isNullOrUndefined(e) ? NaN : C.isNullOrUndefined(this.viewOptions.stepsArray) || this.viewOptions.bindIndexForStepsArray ? +e : C.findStepIndex(+e, this.viewOptions.stepsArray)
                }

                viewValueToModelValue(e) {
                    return C.isNullOrUndefined(this.viewOptions.stepsArray) || this.viewOptions.bindIndexForStepsArray ? e : this.getStepValue(e)
                }

                getStepValue(e) {
                    const i = this.viewOptions.stepsArray[e];
                    return C.isNullOrUndefined(i) ? NaN : i.value
                }

                applyViewChange() {
                    this.value = this.viewValueToModelValue(this.viewLowValue), this.range && (this.highValue = this.viewValueToModelValue(this.viewHighValue)), this.outputModelChangeSubject.next({
                        value: this.value,
                        highValue: this.highValue,
                        userEventInitiated: !0,
                        forceChange: !1
                    }), this.inputModelChangeSubject.next({
                        value: this.value,
                        highValue: this.highValue,
                        forceChange: !1,
                        internalChange: !0
                    })
                }

                applyInputModelChange(e) {
                    const i = this.normaliseModelValues(e), r = !Za.compare(e, i);
                    r && (this.value = i.value, this.highValue = i.highValue), this.viewLowValue = this.modelValueToViewValue(i.value), this.viewHighValue = this.range ? this.modelValueToViewValue(i.highValue) : null, this.updateLowHandle(this.valueToPosition(this.viewLowValue)), this.range && this.updateHighHandle(this.valueToPosition(this.viewHighValue)), this.updateSelectionBar(), this.updateTicksScale(), this.updateAriaAttributes(), this.range && this.updateCombinedLabel(), this.outputModelChangeSubject.next({
                        value: i.value,
                        highValue: i.highValue,
                        forceChange: r,
                        userEventInitiated: !1
                    })
                }

                publishOutputModelChange(e) {
                    const i = () => {
                        this.valueChange.emit(e.value), this.range && this.highValueChange.emit(e.highValue), C.isNullOrUndefined(this.onChangeCallback) || this.onChangeCallback(this.range ? [e.value, e.highValue] : e.value), C.isNullOrUndefined(this.onTouchedCallback) || this.onTouchedCallback(this.range ? [e.value, e.highValue] : e.value)
                    };
                    e.userEventInitiated ? (i(), this.userChange.emit(this.getChangeContext())) : setTimeout(() => {
                        i()
                    })
                }

                normaliseModelValues(e) {
                    const i = new Za;
                    if (i.value = e.value, i.highValue = e.highValue, !C.isNullOrUndefined(this.viewOptions.stepsArray)) {
                        if (this.viewOptions.enforceStepsArray) {
                            const r = C.findStepIndex(i.value, this.viewOptions.stepsArray);
                            if (i.value = this.viewOptions.stepsArray[r].value, this.range) {
                                const o = C.findStepIndex(i.highValue, this.viewOptions.stepsArray);
                                i.highValue = this.viewOptions.stepsArray[o].value
                            }
                        }
                        return i
                    }
                    if (this.viewOptions.enforceStep && (i.value = this.roundStep(i.value), this.range && (i.highValue = this.roundStep(i.highValue))), this.viewOptions.enforceRange && (i.value = Ne.clampToRange(i.value, this.viewOptions.floor, this.viewOptions.ceil), this.range && (i.highValue = Ne.clampToRange(i.highValue, this.viewOptions.floor, this.viewOptions.ceil)), this.range && e.value > e.highValue)) if (this.viewOptions.noSwitching) i.value = i.highValue; else {
                        const r = e.value;
                        i.value = e.highValue, i.highValue = r
                    }
                    return i
                }

                renormaliseModelValues() {
                    const e = {value: this.value, highValue: this.highValue}, i = this.normaliseModelValues(e);
                    Za.compare(i, e) || (this.value = i.value, this.highValue = i.highValue, this.outputModelChangeSubject.next({
                        value: this.value,
                        highValue: this.highValue,
                        forceChange: !0,
                        userEventInitiated: !1
                    }))
                }

                onChangeOptions() {
                    if (!this.initHasRun) return;
                    const e = this.getOptionsInfluencingEventBindings(this.viewOptions);
                    this.applyOptions();
                    const i = this.getOptionsInfluencingEventBindings(this.viewOptions), r = !C.areArraysEqual(e, i);
                    this.renormaliseModelValues(), this.viewLowValue = this.modelValueToViewValue(this.value), this.viewHighValue = this.range ? this.modelValueToViewValue(this.highValue) : null, this.resetSlider(r)
                }

                applyOptions() {
                    if (this.viewOptions = new Ka, Object.assign(this.viewOptions, this.options), this.viewOptions.draggableRange = this.range && this.viewOptions.draggableRange, this.viewOptions.draggableRangeOnly = this.range && this.viewOptions.draggableRangeOnly, this.viewOptions.draggableRangeOnly && (this.viewOptions.draggableRange = !0), this.viewOptions.showTicks = this.viewOptions.showTicks || this.viewOptions.showTicksValues || !C.isNullOrUndefined(this.viewOptions.ticksArray), this.viewOptions.showTicks && (!C.isNullOrUndefined(this.viewOptions.tickStep) || !C.isNullOrUndefined(this.viewOptions.ticksArray)) && (this.intermediateTicks = !0), this.viewOptions.showSelectionBar = this.viewOptions.showSelectionBar || this.viewOptions.showSelectionBarEnd || !C.isNullOrUndefined(this.viewOptions.showSelectionBarFromValue), C.isNullOrUndefined(this.viewOptions.stepsArray) ? this.applyFloorCeilOptions() : this.applyStepsArrayOptions(), C.isNullOrUndefined(this.viewOptions.combineLabels) && (this.viewOptions.combineLabels = (e, i) => e + " - " + i), this.viewOptions.logScale && 0 === this.viewOptions.floor) throw Error("Can't use floor=0 with logarithmic scale")
                }

                applyStepsArrayOptions() {
                    this.viewOptions.floor = 0, this.viewOptions.ceil = this.viewOptions.stepsArray.length - 1, this.viewOptions.step = 1, C.isNullOrUndefined(this.viewOptions.translate) && (this.viewOptions.translate = e => String(this.viewOptions.bindIndexForStepsArray ? this.getStepValue(e) : e))
                }

                applyFloorCeilOptions() {
                    if (C.isNullOrUndefined(this.viewOptions.step) ? this.viewOptions.step = 1 : (this.viewOptions.step = +this.viewOptions.step, this.viewOptions.step <= 0 && (this.viewOptions.step = 1)), C.isNullOrUndefined(this.viewOptions.ceil) || C.isNullOrUndefined(this.viewOptions.floor)) throw Error("floor and ceil options must be supplied");
                    this.viewOptions.ceil = +this.viewOptions.ceil, this.viewOptions.floor = +this.viewOptions.floor, C.isNullOrUndefined(this.viewOptions.translate) && (this.viewOptions.translate = e => String(e))
                }

                resetSlider(e = !0) {
                    this.manageElementsStyle(), this.addAccessibility(), this.updateCeilLabel(), this.updateFloorLabel(), e && (this.unbindEvents(), this.manageEventsBindings()), this.updateDisabledState(), this.updateAriaLabel(), this.calculateViewDimensions(), this.refocusPointerIfNeeded()
                }

                focusPointer(e) {
                    e !== F.Min && e !== F.Max && (e = F.Min), e === F.Min ? this.minHandleElement.focus() : this.range && e === F.Max && this.maxHandleElement.focus()
                }

                refocusPointerIfNeeded() {
                    C.isNullOrUndefined(this.currentFocusPointer) || (this.onPointerFocus(this.currentFocusPointer), this.getPointerElement(this.currentFocusPointer).focus())
                }

                manageElementsStyle() {
                    this.updateScale(), this.floorLabelElement.setAlwaysHide(this.viewOptions.showTicksValues || this.viewOptions.hideLimitLabels), this.ceilLabelElement.setAlwaysHide(this.viewOptions.showTicksValues || this.viewOptions.hideLimitLabels);
                    const e = this.viewOptions.showTicksValues && !this.intermediateTicks;
                    this.minHandleLabelElement.setAlwaysHide(e || this.viewOptions.hidePointerLabels), this.maxHandleLabelElement.setAlwaysHide(e || !this.range || this.viewOptions.hidePointerLabels), this.combinedLabelElement.setAlwaysHide(e || !this.range || this.viewOptions.hidePointerLabels), this.selectionBarElement.setAlwaysHide(!this.range && !this.viewOptions.showSelectionBar), this.leftOuterSelectionBarElement.setAlwaysHide(!this.range || !this.viewOptions.showOuterSelectionBars), this.rightOuterSelectionBarElement.setAlwaysHide(!this.range || !this.viewOptions.showOuterSelectionBars), this.fullBarTransparentClass = this.range && this.viewOptions.showOuterSelectionBars, this.selectionBarDraggableClass = this.viewOptions.draggableRange && !this.viewOptions.onlyBindHandles, this.ticksUnderValuesClass = this.intermediateTicks && this.options.showTicksValues, this.sliderElementVerticalClass !== this.viewOptions.vertical && (this.updateVerticalState(), setTimeout(() => {
                        this.resetSlider()
                    })), this.sliderElementAnimateClass !== this.viewOptions.animate && setTimeout(() => {
                        this.sliderElementAnimateClass = this.viewOptions.animate
                    }), this.updateRotate()
                }

                manageEventsBindings() {
                    this.viewOptions.disabled || this.viewOptions.readOnly ? this.unbindEvents() : this.bindEvents()
                }

                updateDisabledState() {
                    this.sliderElementDisabledAttr = this.viewOptions.disabled ? "disabled" : null
                }

                updateAriaLabel() {
                    this.sliderElementAriaLabel = this.viewOptions.ariaLabel || "nxg-slider"
                }

                updateVerticalState() {
                    this.sliderElementVerticalClass = this.viewOptions.vertical;
                    for (const e of this.getAllSliderElements()) C.isNullOrUndefined(e) || e.setVertical(this.viewOptions.vertical)
                }

                updateScale() {
                    for (const e of this.getAllSliderElements()) e.setScale(this.viewOptions.scale)
                }

                updateRotate() {
                    for (const e of this.getAllSliderElements()) e.setRotate(this.viewOptions.rotate)
                }

                getAllSliderElements() {
                    return [this.leftOuterSelectionBarElement, this.rightOuterSelectionBarElement, this.fullBarElement, this.selectionBarElement, this.minHandleElement, this.maxHandleElement, this.floorLabelElement, this.ceilLabelElement, this.minHandleLabelElement, this.maxHandleLabelElement, this.combinedLabelElement, this.ticksElement]
                }

                initHandles() {
                    this.updateLowHandle(this.valueToPosition(this.viewLowValue)), this.range && this.updateHighHandle(this.valueToPosition(this.viewHighValue)), this.updateSelectionBar(), this.range && this.updateCombinedLabel(), this.updateTicksScale()
                }

                addAccessibility() {
                    this.updateAriaAttributes(), this.minHandleElement.role = "slider", this.minHandleElement.tabindex = !this.viewOptions.keyboardSupport || this.viewOptions.readOnly || this.viewOptions.disabled ? "" : "0", this.minHandleElement.ariaOrientation = this.viewOptions.vertical || 0 !== this.viewOptions.rotate ? "vertical" : "horizontal", C.isNullOrUndefined(this.viewOptions.ariaLabel) ? C.isNullOrUndefined(this.viewOptions.ariaLabelledBy) || (this.minHandleElement.ariaLabelledBy = this.viewOptions.ariaLabelledBy) : this.minHandleElement.ariaLabel = this.viewOptions.ariaLabel, this.range && (this.maxHandleElement.role = "slider", this.maxHandleElement.tabindex = !this.viewOptions.keyboardSupport || this.viewOptions.readOnly || this.viewOptions.disabled ? "" : "0", this.maxHandleElement.ariaOrientation = this.viewOptions.vertical || 0 !== this.viewOptions.rotate ? "vertical" : "horizontal", C.isNullOrUndefined(this.viewOptions.ariaLabelHigh) ? C.isNullOrUndefined(this.viewOptions.ariaLabelledByHigh) || (this.maxHandleElement.ariaLabelledBy = this.viewOptions.ariaLabelledByHigh) : this.maxHandleElement.ariaLabel = this.viewOptions.ariaLabelHigh)
                }

                updateAriaAttributes() {
                    this.minHandleElement.ariaValueNow = (+this.value).toString(), this.minHandleElement.ariaValueText = this.viewOptions.translate(+this.value, qe.Low), this.minHandleElement.ariaValueMin = this.viewOptions.floor.toString(), this.minHandleElement.ariaValueMax = this.viewOptions.ceil.toString(), this.range && (this.maxHandleElement.ariaValueNow = (+this.highValue).toString(), this.maxHandleElement.ariaValueText = this.viewOptions.translate(+this.highValue, qe.High), this.maxHandleElement.ariaValueMin = this.viewOptions.floor.toString(), this.maxHandleElement.ariaValueMax = this.viewOptions.ceil.toString())
                }

                calculateViewDimensions() {
                    C.isNullOrUndefined(this.viewOptions.handleDimension) ? this.minHandleElement.calculateDimension() : this.minHandleElement.setDimension(this.viewOptions.handleDimension);
                    const e = this.minHandleElement.dimension;
                    this.handleHalfDimension = e / 2, C.isNullOrUndefined(this.viewOptions.barDimension) ? this.fullBarElement.calculateDimension() : this.fullBarElement.setDimension(this.viewOptions.barDimension), this.maxHandlePosition = this.fullBarElement.dimension - e, this.initHasRun && (this.updateFloorLabel(), this.updateCeilLabel(), this.initHandles())
                }

                calculateViewDimensionsAndDetectChanges() {
                    this.calculateViewDimensions(), this.isRefDestroyed() || this.changeDetectionRef.detectChanges()
                }

                isRefDestroyed() {
                    return this.changeDetectionRef.destroyed
                }

                updateTicksScale() {
                    if (!this.viewOptions.showTicks) return void setTimeout(() => {
                        this.sliderElementWithLegendClass = !1
                    });
                    const e = C.isNullOrUndefined(this.viewOptions.ticksArray) ? this.getTicksArray() : this.viewOptions.ticksArray,
                        i = this.viewOptions.vertical ? "translateY" : "translateX";
                    this.viewOptions.rightToLeft && e.reverse();
                    const r = C.isNullOrUndefined(this.viewOptions.tickValueStep) ? C.isNullOrUndefined(this.viewOptions.tickStep) ? this.viewOptions.step : this.viewOptions.tickStep : this.viewOptions.tickValueStep;
                    let o = !1;
                    const s = e.map(a => {
                        let l = this.valueToPosition(a);
                        this.viewOptions.vertical && (l = this.maxHandlePosition - l);
                        const c = i + "(" + Math.round(l) + "px)", u = new pk;
                        u.selected = this.isTickSelected(a), u.style = {
                            "-webkit-transform": c,
                            "-moz-transform": c,
                            "-o-transform": c,
                            "-ms-transform": c,
                            transform: c
                        }, u.selected && !C.isNullOrUndefined(this.viewOptions.getSelectionBarColor) && (u.style["background-color"] = this.getSelectionBarColor()), !u.selected && !C.isNullOrUndefined(this.viewOptions.getTickColor) && (u.style["background-color"] = this.getTickColor(a)), C.isNullOrUndefined(this.viewOptions.ticksTooltip) || (u.tooltip = this.viewOptions.ticksTooltip(a), u.tooltipPlacement = this.viewOptions.vertical ? "right" : "top"), this.viewOptions.showTicksValues && !C.isNullOrUndefined(r) && Ne.isModuloWithinPrecisionLimit(a, r, this.viewOptions.precisionLimit) && (u.value = this.getDisplayValue(a, qe.TickValue), C.isNullOrUndefined(this.viewOptions.ticksValuesTooltip) || (u.valueTooltip = this.viewOptions.ticksValuesTooltip(a), u.valueTooltipPlacement = this.viewOptions.vertical ? "right" : "top"));
                        let d = null;
                        if (C.isNullOrUndefined(this.viewOptions.stepsArray)) C.isNullOrUndefined(this.viewOptions.getLegend) || (d = this.viewOptions.getLegend(a)); else {
                            const h = this.viewOptions.stepsArray[a];
                            C.isNullOrUndefined(this.viewOptions.getStepLegend) ? C.isNullOrUndefined(h) || (d = h.legend) : d = this.viewOptions.getStepLegend(h)
                        }
                        return C.isNullOrUndefined(d) || (u.legend = d, o = !0), u
                    });
                    if (setTimeout(() => {
                        this.sliderElementWithLegendClass = o
                    }), C.isNullOrUndefined(this.ticks) || this.ticks.length !== s.length) this.ticks = s; else for (let a = 0; a < s.length; ++a) Object.assign(this.ticks[a], s[a]);
                    this.isRefDestroyed() || this.changeDetectionRef.detectChanges()
                }

                getTicksArray() {
                    const e = C.isNullOrUndefined(this.viewOptions.tickStep) ? this.viewOptions.step : this.viewOptions.tickStep,
                        i = [],
                        r = 1 + Math.floor(Ne.roundToPrecisionLimit(Math.abs(this.viewOptions.ceil - this.viewOptions.floor) / e, this.viewOptions.precisionLimit));
                    for (let o = 0; o < r; ++o) i.push(Ne.roundToPrecisionLimit(this.viewOptions.floor + e * o, this.viewOptions.precisionLimit));
                    return i
                }

                isTickSelected(e) {
                    if (!this.range) if (C.isNullOrUndefined(this.viewOptions.showSelectionBarFromValue)) {
                        if (this.viewOptions.showSelectionBarEnd) {
                            if (e >= this.viewLowValue) return !0
                        } else if (this.viewOptions.showSelectionBar && e <= this.viewLowValue) return !0
                    } else {
                        const i = this.viewOptions.showSelectionBarFromValue;
                        if (this.viewLowValue > i && e >= i && e <= this.viewLowValue) return !0;
                        if (this.viewLowValue < i && e <= i && e >= this.viewLowValue) return !0
                    }
                    return !!(this.range && e >= this.viewLowValue && e <= this.viewHighValue)
                }

                updateFloorLabel() {
                    this.floorLabelElement.alwaysHide || (this.floorLabelElement.setValue(this.getDisplayValue(this.viewOptions.floor, qe.Floor)), this.floorLabelElement.calculateDimension(), this.floorLabelElement.setPosition(this.viewOptions.rightToLeft ? this.fullBarElement.dimension - this.floorLabelElement.dimension : 0))
                }

                updateCeilLabel() {
                    this.ceilLabelElement.alwaysHide || (this.ceilLabelElement.setValue(this.getDisplayValue(this.viewOptions.ceil, qe.Ceil)), this.ceilLabelElement.calculateDimension(), this.ceilLabelElement.setPosition(this.viewOptions.rightToLeft ? 0 : this.fullBarElement.dimension - this.ceilLabelElement.dimension))
                }

                updateHandles(e, i) {
                    e === F.Min ? this.updateLowHandle(i) : e === F.Max && this.updateHighHandle(i), this.updateSelectionBar(), this.updateTicksScale(), this.range && this.updateCombinedLabel()
                }

                getHandleLabelPos(e, i) {
                    const r = e === F.Min ? this.minHandleLabelElement.dimension : this.maxHandleLabelElement.dimension,
                        o = i - r / 2 + this.handleHalfDimension, s = this.fullBarElement.dimension - r;
                    return this.viewOptions.boundPointerLabels ? this.viewOptions.rightToLeft && e === F.Min || !this.viewOptions.rightToLeft && e === F.Max ? Math.min(o, s) : Math.min(Math.max(o, 0), s) : o
                }

                updateLowHandle(e) {
                    this.minHandleElement.setPosition(e), this.minHandleLabelElement.setValue(this.getDisplayValue(this.viewLowValue, qe.Low)), this.minHandleLabelElement.setPosition(this.getHandleLabelPos(F.Min, e)), C.isNullOrUndefined(this.viewOptions.getPointerColor) || (this.minPointerStyle = {backgroundColor: this.getPointerColor(F.Min)}), this.viewOptions.autoHideLimitLabels && this.updateFloorAndCeilLabelsVisibility()
                }

                updateHighHandle(e) {
                    this.maxHandleElement.setPosition(e), this.maxHandleLabelElement.setValue(this.getDisplayValue(this.viewHighValue, qe.High)), this.maxHandleLabelElement.setPosition(this.getHandleLabelPos(F.Max, e)), C.isNullOrUndefined(this.viewOptions.getPointerColor) || (this.maxPointerStyle = {backgroundColor: this.getPointerColor(F.Max)}), this.viewOptions.autoHideLimitLabels && this.updateFloorAndCeilLabelsVisibility()
                }

                updateFloorAndCeilLabelsVisibility() {
                    if (this.viewOptions.hidePointerLabels) return;
                    let e = !1, i = !1;
                    const r = this.isLabelBelowFloorLabel(this.minHandleLabelElement),
                        o = this.isLabelAboveCeilLabel(this.minHandleLabelElement),
                        s = this.isLabelAboveCeilLabel(this.maxHandleLabelElement),
                        a = this.isLabelBelowFloorLabel(this.combinedLabelElement),
                        l = this.isLabelAboveCeilLabel(this.combinedLabelElement);
                    if (r ? (e = !0, this.floorLabelElement.hide()) : (e = !1, this.floorLabelElement.show()), o ? (i = !0, this.ceilLabelElement.hide()) : (i = !1, this.ceilLabelElement.show()), this.range) {
                        const c = this.combinedLabelElement.isVisible() ? l : s,
                            u = this.combinedLabelElement.isVisible() ? a : r;
                        c ? this.ceilLabelElement.hide() : i || this.ceilLabelElement.show(), u ? this.floorLabelElement.hide() : e || this.floorLabelElement.show()
                    }
                }

                isLabelBelowFloorLabel(e) {
                    const i = e.position, o = this.floorLabelElement.position;
                    return this.viewOptions.rightToLeft ? i + e.dimension >= o - 2 : i <= o + this.floorLabelElement.dimension + 2
                }

                isLabelAboveCeilLabel(e) {
                    const i = e.position, o = this.ceilLabelElement.position;
                    return this.viewOptions.rightToLeft ? i <= o + this.ceilLabelElement.dimension + 2 : i + e.dimension >= o - 2
                }

                updateSelectionBar() {
                    let e = 0, i = 0;
                    const r = this.viewOptions.rightToLeft ? !this.viewOptions.showSelectionBarEnd : this.viewOptions.showSelectionBarEnd,
                        o = this.viewOptions.rightToLeft ? this.maxHandleElement.position + this.handleHalfDimension : this.minHandleElement.position + this.handleHalfDimension;
                    if (this.range) i = Math.abs(this.maxHandleElement.position - this.minHandleElement.position), e = o; else if (C.isNullOrUndefined(this.viewOptions.showSelectionBarFromValue)) r ? (i = Math.ceil(Math.abs(this.maxHandlePosition - this.minHandleElement.position) + this.handleHalfDimension), e = Math.floor(this.minHandleElement.position + this.handleHalfDimension)) : (i = this.minHandleElement.position + this.handleHalfDimension, e = 0); else {
                        const s = this.viewOptions.showSelectionBarFromValue, a = this.valueToPosition(s);
                        (this.viewOptions.rightToLeft ? this.viewLowValue <= s : this.viewLowValue > s) ? (i = this.minHandleElement.position - a, e = a + this.handleHalfDimension) : (i = a - this.minHandleElement.position, e = this.minHandleElement.position + this.handleHalfDimension)
                    }
                    if (this.selectionBarElement.setDimension(i), this.selectionBarElement.setPosition(e), this.range && this.viewOptions.showOuterSelectionBars && (this.viewOptions.rightToLeft ? (this.rightOuterSelectionBarElement.setDimension(e), this.rightOuterSelectionBarElement.setPosition(0), this.fullBarElement.calculateDimension(), this.leftOuterSelectionBarElement.setDimension(this.fullBarElement.dimension - (e + i)), this.leftOuterSelectionBarElement.setPosition(e + i)) : (this.leftOuterSelectionBarElement.setDimension(e), this.leftOuterSelectionBarElement.setPosition(0), this.fullBarElement.calculateDimension(), this.rightOuterSelectionBarElement.setDimension(this.fullBarElement.dimension - (e + i)), this.rightOuterSelectionBarElement.setPosition(e + i))), C.isNullOrUndefined(this.viewOptions.getSelectionBarColor)) {
                        if (!C.isNullOrUndefined(this.viewOptions.selectionBarGradient)) {
                            const s = C.isNullOrUndefined(this.viewOptions.showSelectionBarFromValue) ? 0 : this.valueToPosition(this.viewOptions.showSelectionBarFromValue),
                                a = s - e > 0 && !r || s - e <= 0 && r;
                            this.barStyle = {backgroundImage: "linear-gradient(to " + (this.viewOptions.vertical ? a ? "bottom" : "top" : a ? "left" : "right") + ", " + this.viewOptions.selectionBarGradient.from + " 0%," + this.viewOptions.selectionBarGradient.to + " 100%)"}, this.viewOptions.vertical ? (this.barStyle.backgroundPosition = "center " + (s + i + e + (a ? -this.handleHalfDimension : 0)) + "px", this.barStyle.backgroundSize = "100% " + (this.fullBarElement.dimension - this.handleHalfDimension) + "px") : (this.barStyle.backgroundPosition = s - e + (a ? this.handleHalfDimension : 0) + "px center", this.barStyle.backgroundSize = this.fullBarElement.dimension - this.handleHalfDimension + "px 100%")
                        }
                    } else {
                        const s = this.getSelectionBarColor();
                        this.barStyle = {backgroundColor: s}
                    }
                }

                getSelectionBarColor() {
                    return this.range ? this.viewOptions.getSelectionBarColor(this.value, this.highValue) : this.viewOptions.getSelectionBarColor(this.value)
                }

                getPointerColor(e) {
                    return this.viewOptions.getPointerColor(e === F.Max ? this.highValue : this.value, e)
                }

                getTickColor(e) {
                    return this.viewOptions.getTickColor(e)
                }

                updateCombinedLabel() {
                    let e = null;
                    if (e = this.viewOptions.rightToLeft ? this.minHandleLabelElement.position - this.minHandleLabelElement.dimension - 10 <= this.maxHandleLabelElement.position : this.minHandleLabelElement.position + this.minHandleLabelElement.dimension + 10 >= this.maxHandleLabelElement.position, e) {
                        const i = this.getDisplayValue(this.viewLowValue, qe.Low),
                            r = this.getDisplayValue(this.viewHighValue, qe.High),
                            o = this.viewOptions.rightToLeft ? this.viewOptions.combineLabels(r, i) : this.viewOptions.combineLabels(i, r);
                        this.combinedLabelElement.setValue(o);
                        const s = this.viewOptions.boundPointerLabels ? Math.min(Math.max(this.selectionBarElement.position + this.selectionBarElement.dimension / 2 - this.combinedLabelElement.dimension / 2, 0), this.fullBarElement.dimension - this.combinedLabelElement.dimension) : this.selectionBarElement.position + this.selectionBarElement.dimension / 2 - this.combinedLabelElement.dimension / 2;
                        this.combinedLabelElement.setPosition(s), this.minHandleLabelElement.hide(), this.maxHandleLabelElement.hide(), this.combinedLabelElement.show()
                    } else this.updateHighHandle(this.valueToPosition(this.viewHighValue)), this.updateLowHandle(this.valueToPosition(this.viewLowValue)), this.maxHandleLabelElement.show(), this.minHandleLabelElement.show(), this.combinedLabelElement.hide();
                    this.viewOptions.autoHideLimitLabels && this.updateFloorAndCeilLabelsVisibility()
                }

                getDisplayValue(e, i) {
                    return !C.isNullOrUndefined(this.viewOptions.stepsArray) && !this.viewOptions.bindIndexForStepsArray && (e = this.getStepValue(e)), this.viewOptions.translate(e, i)
                }

                roundStep(e, i) {
                    const r = C.isNullOrUndefined(i) ? this.viewOptions.step : i;
                    let o = Ne.roundToPrecisionLimit((e - this.viewOptions.floor) / r, this.viewOptions.precisionLimit);
                    return o = Math.round(o) * r, Ne.roundToPrecisionLimit(this.viewOptions.floor + o, this.viewOptions.precisionLimit)
                }

                valueToPosition(e) {
                    let i = C.linearValueToPosition;
                    C.isNullOrUndefined(this.viewOptions.customValueToPosition) ? this.viewOptions.logScale && (i = C.logValueToPosition) : i = this.viewOptions.customValueToPosition;
                    let r = i(e = Ne.clampToRange(e, this.viewOptions.floor, this.viewOptions.ceil), this.viewOptions.floor, this.viewOptions.ceil);
                    return C.isNullOrUndefined(r) && (r = 0), this.viewOptions.rightToLeft && (r = 1 - r), r * this.maxHandlePosition
                }

                positionToValue(e) {
                    let i = e / this.maxHandlePosition;
                    this.viewOptions.rightToLeft && (i = 1 - i);
                    let r = C.linearPositionToValue;
                    C.isNullOrUndefined(this.viewOptions.customPositionToValue) ? this.viewOptions.logScale && (r = C.logPositionToValue) : r = this.viewOptions.customPositionToValue;
                    const o = r(i, this.viewOptions.floor, this.viewOptions.ceil);
                    return C.isNullOrUndefined(o) ? 0 : o
                }

                getEventXY(e, i) {
                    if (e instanceof MouseEvent) return this.viewOptions.vertical || 0 !== this.viewOptions.rotate ? e.clientY : e.clientX;
                    let r = 0;
                    const o = e.touches;
                    if (!C.isNullOrUndefined(i)) for (let s = 0; s < o.length; s++) if (o[s].identifier === i) {
                        r = s;
                        break
                    }
                    return this.viewOptions.vertical || 0 !== this.viewOptions.rotate ? o[r].clientY : o[r].clientX
                }

                getEventPosition(e, i) {
                    const r = this.elementRef.nativeElement.getBoundingClientRect(),
                        o = this.viewOptions.vertical || 0 !== this.viewOptions.rotate ? r.bottom : r.left;
                    let s = 0;
                    return s = this.viewOptions.vertical || 0 !== this.viewOptions.rotate ? -this.getEventXY(e, i) + o : this.getEventXY(e, i) - o, s * this.viewOptions.scale - this.handleHalfDimension
                }

                getNearestHandle(e) {
                    if (!this.range) return F.Min;
                    const i = this.getEventPosition(e), r = Math.abs(i - this.minHandleElement.position),
                        o = Math.abs(i - this.maxHandleElement.position);
                    return r < o ? F.Min : r > o ? F.Max : this.viewOptions.rightToLeft ? i > this.minHandleElement.position ? F.Min : F.Max : i < this.minHandleElement.position ? F.Min : F.Max
                }

                bindEvents() {
                    const e = this.viewOptions.draggableRange;
                    this.viewOptions.onlyBindHandles || this.selectionBarElement.on("mousedown", i => this.onBarStart(null, e, i, !0, !0, !0)), this.viewOptions.draggableRangeOnly ? (this.minHandleElement.on("mousedown", i => this.onBarStart(F.Min, e, i, !0, !0)), this.maxHandleElement.on("mousedown", i => this.onBarStart(F.Max, e, i, !0, !0))) : (this.minHandleElement.on("mousedown", i => this.onStart(F.Min, i, !0, !0)), this.range && this.maxHandleElement.on("mousedown", i => this.onStart(F.Max, i, !0, !0)), this.viewOptions.onlyBindHandles || (this.fullBarElement.on("mousedown", i => this.onStart(null, i, !0, !0, !0)), this.ticksElement.on("mousedown", i => this.onStart(null, i, !0, !0, !0, !0)))), this.viewOptions.onlyBindHandles || this.selectionBarElement.onPassive("touchstart", i => this.onBarStart(null, e, i, !0, !0, !0)), this.viewOptions.draggableRangeOnly ? (this.minHandleElement.onPassive("touchstart", i => this.onBarStart(F.Min, e, i, !0, !0)), this.maxHandleElement.onPassive("touchstart", i => this.onBarStart(F.Max, e, i, !0, !0))) : (this.minHandleElement.onPassive("touchstart", i => this.onStart(F.Min, i, !0, !0)), this.range && this.maxHandleElement.onPassive("touchstart", i => this.onStart(F.Max, i, !0, !0)), this.viewOptions.onlyBindHandles || (this.fullBarElement.onPassive("touchstart", i => this.onStart(null, i, !0, !0, !0)), this.ticksElement.onPassive("touchstart", i => this.onStart(null, i, !1, !1, !0, !0)))), this.viewOptions.keyboardSupport && (this.minHandleElement.on("focus", () => this.onPointerFocus(F.Min)), this.range && this.maxHandleElement.on("focus", () => this.onPointerFocus(F.Max)))
                }

                getOptionsInfluencingEventBindings(e) {
                    return [e.disabled, e.readOnly, e.draggableRange, e.draggableRangeOnly, e.onlyBindHandles, e.keyboardSupport]
                }

                unbindEvents() {
                    this.unsubscribeOnMove(), this.unsubscribeOnEnd();
                    for (const e of this.getAllSliderElements()) C.isNullOrUndefined(e) || e.off()
                }

                onBarStart(e, i, r, o, s, a, l) {
                    i ? this.onDragStart(e, r, o, s) : this.onStart(e, r, o, s, a, l)
                }

                onStart(e, i, r, o, s, a) {
                    i.stopPropagation(), !li.isTouchEvent(i) && !Nb && i.preventDefault(), this.moving = !1, this.calculateViewDimensions(), C.isNullOrUndefined(e) && (e = this.getNearestHandle(i)), this.currentTrackingPointer = e;
                    const l = this.getPointerElement(e);
                    if (l.active = !0, this.viewOptions.keyboardSupport && l.focus(), r) {
                        this.unsubscribeOnMove();
                        const c = u => this.dragging.active ? this.onDragMove(u) : this.onMove(u);
                        this.onMoveEventListener = li.isTouchEvent(i) ? this.eventListenerHelper.attachPassiveEventListener(document, "touchmove", c) : this.eventListenerHelper.attachEventListener(document, "mousemove", c)
                    }
                    if (o) {
                        this.unsubscribeOnEnd();
                        const c = u => this.onEnd(u);
                        this.onEndEventListener = li.isTouchEvent(i) ? this.eventListenerHelper.attachPassiveEventListener(document, "touchend", c) : this.eventListenerHelper.attachEventListener(document, "mouseup", c)
                    }
                    this.userChangeStart.emit(this.getChangeContext()), li.isTouchEvent(i) && !C.isNullOrUndefined(i.changedTouches) && C.isNullOrUndefined(this.touchId) && (this.touchId = i.changedTouches[0].identifier), s && this.onMove(i, !0), a && this.onEnd(i)
                }

                onMove(e, i) {
                    let r = null;
                    if (li.isTouchEvent(e)) {
                        const c = e.changedTouches;
                        for (let u = 0; u < c.length; u++) if (c[u].identifier === this.touchId) {
                            r = c[u];
                            break
                        }
                        if (C.isNullOrUndefined(r)) return
                    }
                    this.viewOptions.animate && !this.viewOptions.animateOnMove && this.moving && (this.sliderElementAnimateClass = !1), this.moving = !0;
                    const o = C.isNullOrUndefined(r) ? this.getEventPosition(e) : this.getEventPosition(e, r.identifier);
                    let s;
                    o <= 0 ? s = this.viewOptions.rightToLeft ? this.viewOptions.ceil : this.viewOptions.floor : o >= this.maxHandlePosition ? s = this.viewOptions.rightToLeft ? this.viewOptions.floor : this.viewOptions.ceil : (s = this.positionToValue(o), s = i && !C.isNullOrUndefined(this.viewOptions.tickStep) ? this.roundStep(s, this.viewOptions.tickStep) : this.roundStep(s)), this.positionTrackingHandle(s)
                }

                onEnd(e) {
                    li.isTouchEvent(e) && e.changedTouches[0].identifier !== this.touchId || (this.moving = !1, this.viewOptions.animate && (this.sliderElementAnimateClass = !0), this.touchId = null, this.viewOptions.keyboardSupport || (this.minHandleElement.active = !1, this.maxHandleElement.active = !1, this.currentTrackingPointer = null), this.dragging.active = !1, this.unsubscribeOnMove(), this.unsubscribeOnEnd(), this.userChangeEnd.emit(this.getChangeContext()))
                }

                onPointerFocus(e) {
                    const i = this.getPointerElement(e);
                    i.on("blur", () => this.onPointerBlur(i)), i.on("keydown", r => this.onKeyboardEvent(r)), i.on("keyup", () => this.onKeyUp()), i.active = !0, this.currentTrackingPointer = e, this.currentFocusPointer = e, this.firstKeyDown = !0
                }

                onKeyUp() {
                    this.firstKeyDown = !0, this.userChangeEnd.emit(this.getChangeContext())
                }

                onPointerBlur(e) {
                    e.off("blur"), e.off("keydown"), e.off("keyup"), e.active = !1, C.isNullOrUndefined(this.touchId) && (this.currentTrackingPointer = null, this.currentFocusPointer = null)
                }

                getKeyActions(e) {
                    const i = this.viewOptions.ceil - this.viewOptions.floor;
                    let r = e + this.viewOptions.step, o = e - this.viewOptions.step, s = e + i / 10, a = e - i / 10;
                    this.viewOptions.reversedControls && (r = e - this.viewOptions.step, o = e + this.viewOptions.step, s = e - i / 10, a = e + i / 10);
                    const l = {
                        UP: r,
                        DOWN: o,
                        LEFT: o,
                        RIGHT: r,
                        PAGEUP: s,
                        PAGEDOWN: a,
                        HOME: this.viewOptions.reversedControls ? this.viewOptions.ceil : this.viewOptions.floor,
                        END: this.viewOptions.reversedControls ? this.viewOptions.floor : this.viewOptions.ceil
                    };
                    return this.viewOptions.rightToLeft && (l.LEFT = r, l.RIGHT = o, (this.viewOptions.vertical || 0 !== this.viewOptions.rotate) && (l.UP = o, l.DOWN = r)), l
                }

                onKeyboardEvent(e) {
                    const i = this.getCurrentTrackingValue(), r = C.isNullOrUndefined(e.keyCode) ? e.which : e.keyCode,
                        l = this.getKeyActions(i)[{
                            38: "UP",
                            40: "DOWN",
                            37: "LEFT",
                            39: "RIGHT",
                            33: "PAGEUP",
                            34: "PAGEDOWN",
                            36: "HOME",
                            35: "END"
                        }[r]];
                    if (C.isNullOrUndefined(l) || C.isNullOrUndefined(this.currentTrackingPointer)) return;
                    e.preventDefault(), this.firstKeyDown && (this.firstKeyDown = !1, this.userChangeStart.emit(this.getChangeContext()));
                    const c = Ne.clampToRange(l, this.viewOptions.floor, this.viewOptions.ceil), u = this.roundStep(c);
                    if (this.viewOptions.draggableRangeOnly) {
                        const d = this.viewHighValue - this.viewLowValue;
                        let h, f;
                        this.currentTrackingPointer === F.Min ? (h = u, f = u + d, f > this.viewOptions.ceil && (f = this.viewOptions.ceil, h = f - d)) : this.currentTrackingPointer === F.Max && (f = u, h = u - d, h < this.viewOptions.floor && (h = this.viewOptions.floor, f = h + d)), this.positionTrackingBar(h, f)
                    } else this.positionTrackingHandle(u)
                }

                onDragStart(e, i, r, o) {
                    const s = this.getEventPosition(i);
                    this.dragging = new Ub, this.dragging.active = !0, this.dragging.value = this.positionToValue(s), this.dragging.difference = this.viewHighValue - this.viewLowValue, this.dragging.lowLimit = this.viewOptions.rightToLeft ? this.minHandleElement.position - s : s - this.minHandleElement.position, this.dragging.highLimit = this.viewOptions.rightToLeft ? s - this.maxHandleElement.position : this.maxHandleElement.position - s, this.onStart(e, i, r, o)
                }

                getMinValue(e, i, r) {
                    const o = this.viewOptions.rightToLeft;
                    let s = null;
                    return s = i ? r ? o ? this.viewOptions.floor : this.viewOptions.ceil - this.dragging.difference : o ? this.viewOptions.ceil - this.dragging.difference : this.viewOptions.floor : this.positionToValue(o ? e + this.dragging.lowLimit : e - this.dragging.lowLimit), this.roundStep(s)
                }

                getMaxValue(e, i, r) {
                    const o = this.viewOptions.rightToLeft;
                    let s = null;
                    return s = i ? r ? o ? this.viewOptions.floor + this.dragging.difference : this.viewOptions.ceil : o ? this.viewOptions.ceil : this.viewOptions.floor + this.dragging.difference : o ? this.positionToValue(e + this.dragging.lowLimit) + this.dragging.difference : this.positionToValue(e - this.dragging.lowLimit) + this.dragging.difference, this.roundStep(s)
                }

                onDragMove(e) {
                    const i = this.getEventPosition(e);
                    let r, o, s, a;
                    this.viewOptions.animate && !this.viewOptions.animateOnMove && this.moving && (this.sliderElementAnimateClass = !1), this.moving = !0, this.viewOptions.rightToLeft ? (r = this.dragging.lowLimit, o = this.dragging.highLimit, s = this.maxHandleElement, a = this.minHandleElement) : (r = this.dragging.highLimit, o = this.dragging.lowLimit, s = this.minHandleElement, a = this.maxHandleElement);
                    const c = i >= this.maxHandlePosition - r;
                    let u, d;
                    if (i <= o) {
                        if (0 === s.position) return;
                        u = this.getMinValue(i, !0, !1), d = this.getMaxValue(i, !0, !1)
                    } else if (c) {
                        if (a.position === this.maxHandlePosition) return;
                        d = this.getMaxValue(i, !0, !0), u = this.getMinValue(i, !0, !0)
                    } else u = this.getMinValue(i, !1, !1), d = this.getMaxValue(i, !1, !1);
                    this.positionTrackingBar(u, d)
                }

                positionTrackingBar(e, i) {
                    !C.isNullOrUndefined(this.viewOptions.minLimit) && e < this.viewOptions.minLimit && (i = Ne.roundToPrecisionLimit((e = this.viewOptions.minLimit) + this.dragging.difference, this.viewOptions.precisionLimit)), !C.isNullOrUndefined(this.viewOptions.maxLimit) && i > this.viewOptions.maxLimit && (e = Ne.roundToPrecisionLimit((i = this.viewOptions.maxLimit) - this.dragging.difference, this.viewOptions.precisionLimit)), this.viewLowValue = e, this.viewHighValue = i, this.applyViewChange(), this.updateHandles(F.Min, this.valueToPosition(e)), this.updateHandles(F.Max, this.valueToPosition(i))
                }

                positionTrackingHandle(e) {
                    e = this.applyMinMaxLimit(e), this.range && (this.viewOptions.pushRange ? e = this.applyPushRange(e) : (this.viewOptions.noSwitching && (this.currentTrackingPointer === F.Min && e > this.viewHighValue ? e = this.applyMinMaxRange(this.viewHighValue) : this.currentTrackingPointer === F.Max && e < this.viewLowValue && (e = this.applyMinMaxRange(this.viewLowValue))), e = this.applyMinMaxRange(e), this.currentTrackingPointer === F.Min && e > this.viewHighValue ? (this.viewLowValue = this.viewHighValue, this.applyViewChange(), this.updateHandles(F.Min, this.maxHandleElement.position), this.updateAriaAttributes(), this.currentTrackingPointer = F.Max, this.minHandleElement.active = !1, this.maxHandleElement.active = !0, this.viewOptions.keyboardSupport && this.maxHandleElement.focus()) : this.currentTrackingPointer === F.Max && e < this.viewLowValue && (this.viewHighValue = this.viewLowValue, this.applyViewChange(), this.updateHandles(F.Max, this.minHandleElement.position), this.updateAriaAttributes(), this.currentTrackingPointer = F.Min, this.maxHandleElement.active = !1, this.minHandleElement.active = !0, this.viewOptions.keyboardSupport && this.minHandleElement.focus()))), this.getCurrentTrackingValue() !== e && (this.currentTrackingPointer === F.Min ? (this.viewLowValue = e, this.applyViewChange()) : this.currentTrackingPointer === F.Max && (this.viewHighValue = e, this.applyViewChange()), this.updateHandles(this.currentTrackingPointer, this.valueToPosition(e)), this.updateAriaAttributes())
                }

                applyMinMaxLimit(e) {
                    return !C.isNullOrUndefined(this.viewOptions.minLimit) && e < this.viewOptions.minLimit ? this.viewOptions.minLimit : !C.isNullOrUndefined(this.viewOptions.maxLimit) && e > this.viewOptions.maxLimit ? this.viewOptions.maxLimit : e
                }

                applyMinMaxRange(e) {
                    const r = Math.abs(e - (this.currentTrackingPointer === F.Min ? this.viewHighValue : this.viewLowValue));
                    if (!C.isNullOrUndefined(this.viewOptions.minRange) && r < this.viewOptions.minRange) {
                        if (this.currentTrackingPointer === F.Min) return Ne.roundToPrecisionLimit(this.viewHighValue - this.viewOptions.minRange, this.viewOptions.precisionLimit);
                        if (this.currentTrackingPointer === F.Max) return Ne.roundToPrecisionLimit(this.viewLowValue + this.viewOptions.minRange, this.viewOptions.precisionLimit)
                    }
                    if (!C.isNullOrUndefined(this.viewOptions.maxRange) && r > this.viewOptions.maxRange) {
                        if (this.currentTrackingPointer === F.Min) return Ne.roundToPrecisionLimit(this.viewHighValue - this.viewOptions.maxRange, this.viewOptions.precisionLimit);
                        if (this.currentTrackingPointer === F.Max) return Ne.roundToPrecisionLimit(this.viewLowValue + this.viewOptions.maxRange, this.viewOptions.precisionLimit)
                    }
                    return e
                }

                applyPushRange(e) {
                    const i = this.currentTrackingPointer === F.Min ? this.viewHighValue - e : e - this.viewLowValue,
                        r = C.isNullOrUndefined(this.viewOptions.minRange) ? this.viewOptions.step : this.viewOptions.minRange,
                        o = this.viewOptions.maxRange;
                    return i < r ? (this.currentTrackingPointer === F.Min ? (this.viewHighValue = Ne.roundToPrecisionLimit(Math.min(e + r, this.viewOptions.ceil), this.viewOptions.precisionLimit), e = Ne.roundToPrecisionLimit(this.viewHighValue - r, this.viewOptions.precisionLimit), this.applyViewChange(), this.updateHandles(F.Max, this.valueToPosition(this.viewHighValue))) : this.currentTrackingPointer === F.Max && (this.viewLowValue = Ne.roundToPrecisionLimit(Math.max(e - r, this.viewOptions.floor), this.viewOptions.precisionLimit), e = Ne.roundToPrecisionLimit(this.viewLowValue + r, this.viewOptions.precisionLimit), this.applyViewChange(), this.updateHandles(F.Min, this.valueToPosition(this.viewLowValue))), this.updateAriaAttributes()) : !C.isNullOrUndefined(o) && i > o && (this.currentTrackingPointer === F.Min ? (this.viewHighValue = Ne.roundToPrecisionLimit(e + o, this.viewOptions.precisionLimit), this.applyViewChange(), this.updateHandles(F.Max, this.valueToPosition(this.viewHighValue))) : this.currentTrackingPointer === F.Max && (this.viewLowValue = Ne.roundToPrecisionLimit(e - o, this.viewOptions.precisionLimit), this.applyViewChange(), this.updateHandles(F.Min, this.valueToPosition(this.viewLowValue))), this.updateAriaAttributes()), e
                }

                getChangeContext() {
                    const e = new fk;
                    return e.pointerType = this.currentTrackingPointer, e.value = +this.value, this.range && (e.highValue = +this.highValue), e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Ot), g(he), g(Xn), g(Ge))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["ngx-slider"]],
                contentQueries: function (e, i, r) {
                    if (1 & e && ht(r, GF, 5), 2 & e) {
                        let o;
                        Z(o = Q()) && (i.tooltipTemplate = o.first)
                    }
                },
                viewQuery: function (e, i) {
                    if (1 & e && (ye(WF, 5, ci), ye(qF, 5, ci), ye(YF, 5, ci), ye(KF, 5, ci), ye(ZF, 5, $d), ye(QF, 5, $d), ye(XF, 5, xr), ye(JF, 5, xr), ye(ek, 5, xr), ye(tk, 5, xr), ye(nk, 5, xr), ye(ik, 5, ci)), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.leftOuterSelectionBarElement = r.first), Z(r = Q()) && (i.rightOuterSelectionBarElement = r.first), Z(r = Q()) && (i.fullBarElement = r.first), Z(r = Q()) && (i.selectionBarElement = r.first), Z(r = Q()) && (i.minHandleElement = r.first), Z(r = Q()) && (i.maxHandleElement = r.first), Z(r = Q()) && (i.floorLabelElement = r.first), Z(r = Q()) && (i.ceilLabelElement = r.first), Z(r = Q()) && (i.minHandleLabelElement = r.first), Z(r = Q()) && (i.maxHandleLabelElement = r.first), Z(r = Q()) && (i.combinedLabelElement = r.first), Z(r = Q()) && (i.ticksElement = r.first)
                    }
                },
                hostAttrs: [1, "ngx-slider"],
                hostVars: 8,
                hostBindings: function (e, i) {
                    1 & e && ce("resize", function (o) {
                        return i.onResize(o)
                    }, 0, Sp), 2 & e && ($e("disabled", i.sliderElementDisabledAttr)("aria-label", i.sliderElementAriaLabel), we("vertical", i.sliderElementVerticalClass)("animate", i.sliderElementAnimateClass)("with-legend", i.sliderElementWithLegendClass))
                },
                inputs: {
                    value: "value",
                    highValue: "highValue",
                    options: "options",
                    manualRefresh: "manualRefresh",
                    triggerFocus: "triggerFocus"
                },
                outputs: {
                    valueChange: "valueChange",
                    highValueChange: "highValueChange",
                    userChangeStart: "userChangeStart",
                    userChange: "userChange",
                    userChangeEnd: "userChangeEnd"
                },
                features: [ue([gk]), nt],
                decls: 29,
                vars: 13,
                consts: [["ngxSliderElement", "", 1, "ngx-slider-span", "ngx-slider-bar-wrapper", "ngx-slider-left-out-selection"], ["leftOuterSelectionBar", ""], [1, "ngx-slider-span", "ngx-slider-bar"], ["ngxSliderElement", "", 1, "ngx-slider-span", "ngx-slider-bar-wrapper", "ngx-slider-right-out-selection"], ["rightOuterSelectionBar", ""], ["ngxSliderElement", "", 1, "ngx-slider-span", "ngx-slider-bar-wrapper", "ngx-slider-full-bar"], ["fullBar", ""], ["ngxSliderElement", "", 1, "ngx-slider-span", "ngx-slider-bar-wrapper", "ngx-slider-selection-bar"], ["selectionBar", ""], [1, "ngx-slider-span", "ngx-slider-bar", "ngx-slider-selection", 3, "ngStyle"], ["ngxSliderHandle", "", 1, "ngx-slider-span", "ngx-slider-pointer", "ngx-slider-pointer-min", 3, "ngStyle"], ["minHandle", ""], ["ngxSliderHandle", "", 1, "ngx-slider-span", "ngx-slider-pointer", "ngx-slider-pointer-max", 3, "ngStyle"], ["maxHandle", ""], ["ngxSliderLabel", "", 1, "ngx-slider-span", "ngx-slider-bubble", "ngx-slider-limit", "ngx-slider-floor"], ["floorLabel", ""], ["ngxSliderLabel", "", 1, "ngx-slider-span", "ngx-slider-bubble", "ngx-slider-limit", "ngx-slider-ceil"], ["ceilLabel", ""], ["ngxSliderLabel", "", 1, "ngx-slider-span", "ngx-slider-bubble", "ngx-slider-model-value"], ["minHandleLabel", ""], ["ngxSliderLabel", "", 1, "ngx-slider-span", "ngx-slider-bubble", "ngx-slider-model-high"], ["maxHandleLabel", ""], ["ngxSliderLabel", "", 1, "ngx-slider-span", "ngx-slider-bubble", "ngx-slider-combined"], ["combinedLabel", ""], ["ngxSliderElement", "", 1, "ngx-slider-ticks", 3, "hidden"], ["ticksElement", ""], ["class", "ngx-slider-tick", 3, "ngClass", "ngStyle", 4, "ngFor", "ngForOf"], [1, "ngx-slider-tick", 3, "ngClass", "ngStyle"], [3, "template", "tooltip", "placement"], ["class", "ngx-slider-span ngx-slider-tick-value", 3, "template", "tooltip", "placement", "content", 4, "ngIf"], ["class", "ngx-slider-span ngx-slider-tick-legend", 3, "innerHTML", 4, "ngIf"], [1, "ngx-slider-span", "ngx-slider-tick-value", 3, "template", "tooltip", "placement", "content"], [1, "ngx-slider-span", "ngx-slider-tick-legend", 3, "innerHTML"]],
                template: function (e, i) {
                    1 & e && (S(0, "span", 0, 1), k(2, "span", 2), E(), S(3, "span", 3, 4), k(5, "span", 2), E(), S(6, "span", 5, 6), k(8, "span", 2), E(), S(9, "span", 7, 8), k(11, "span", 9), E(), k(12, "span", 10, 11)(14, "span", 12, 13)(16, "span", 14, 15)(18, "span", 16, 17)(20, "span", 18, 19)(22, "span", 20, 21)(24, "span", 22, 23), S(26, "span", 24, 25), O(28, ak, 4, 9, "span", 26), E()), 2 & e && (_(6), we("ngx-slider-transparent", i.fullBarTransparentClass), _(3), we("ngx-slider-draggable", i.selectionBarDraggableClass), _(2), v("ngStyle", i.barStyle), _(1), v("ngStyle", i.minPointerStyle), _(2), Ws("display", i.range ? "inherit" : "none"), v("ngStyle", i.maxPointerStyle), _(12), we("ngx-slider-ticks-values-under", i.ticksUnderValuesClass), v("hidden", !i.showTicks), _(2), v("ngForOf", i.ticks))
                },
                dependencies: function () {
                    return [Jn, _a, ot, m_, ci, $d, xr, mk]
                },
                styles: [".ngx-slider{display:inline-block;position:relative;height:4px;width:100%;margin:35px 0 15px;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:pan-y}  .ngx-slider.with-legend{margin-bottom:40px}  .ngx-slider[disabled]{cursor:not-allowed}  .ngx-slider[disabled] .ngx-slider-pointer{cursor:not-allowed;background-color:#d8e0f3}  .ngx-slider[disabled] .ngx-slider-draggable{cursor:not-allowed}  .ngx-slider[disabled] .ngx-slider-selection{background:#8b91a2}  .ngx-slider[disabled] .ngx-slider-tick{cursor:not-allowed}  .ngx-slider[disabled] .ngx-slider-tick.ngx-slider-selected{background:#8b91a2}  .ngx-slider .ngx-slider-span{white-space:nowrap;position:absolute;display:inline-block}  .ngx-slider .ngx-slider-base{width:100%;height:100%;padding:0}  .ngx-slider .ngx-slider-bar-wrapper{left:0;box-sizing:border-box;margin-top:-16px;padding-top:16px;width:100%;height:32px;z-index:1}  .ngx-slider .ngx-slider-draggable{cursor:move}  .ngx-slider .ngx-slider-bar{left:0;width:100%;height:4px;z-index:1;background:#d8e0f3;border-radius:2px}  .ngx-slider .ngx-slider-bar-wrapper.ngx-slider-transparent .ngx-slider-bar{background:0 0}  .ngx-slider .ngx-slider-bar-wrapper.ngx-slider-left-out-selection .ngx-slider-bar{background:#df002d}  .ngx-slider .ngx-slider-bar-wrapper.ngx-slider-right-out-selection .ngx-slider-bar{background:#03a688}  .ngx-slider .ngx-slider-selection{z-index:2;background:#0db9f0;border-radius:2px}  .ngx-slider .ngx-slider-pointer{cursor:pointer;width:32px;height:32px;top:-14px;background-color:#0db9f0;z-index:3;border-radius:16px}  .ngx-slider .ngx-slider-pointer:after{content:'';width:8px;height:8px;position:absolute;top:12px;left:12px;border-radius:4px;background:#fff}  .ngx-slider .ngx-slider-pointer:hover:after{background-color:#fff}  .ngx-slider .ngx-slider-pointer.ngx-slider-active{z-index:4}  .ngx-slider .ngx-slider-pointer.ngx-slider-active:after{background-color:#451aff}  .ngx-slider .ngx-slider-bubble{cursor:default;bottom:16px;padding:1px 3px;color:#55637d;font-size:16px}  .ngx-slider .ngx-slider-bubble.ngx-slider-limit{color:#55637d}  .ngx-slider .ngx-slider-ticks{box-sizing:border-box;width:100%;height:0;position:absolute;left:0;top:-3px;margin:0;z-index:1;list-style:none}  .ngx-slider .ngx-slider-ticks-values-under .ngx-slider-tick-value{top:auto;bottom:-36px}  .ngx-slider .ngx-slider-tick{text-align:center;cursor:pointer;width:10px;height:10px;background:#d8e0f3;border-radius:50%;position:absolute;top:0;left:0;margin-left:11px}  .ngx-slider .ngx-slider-tick.ngx-slider-selected{background:#0db9f0}  .ngx-slider .ngx-slider-tick-value{position:absolute;top:-34px;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}  .ngx-slider .ngx-slider-tick-legend{position:absolute;top:24px;-webkit-transform:translate(-50%,0);transform:translate(-50%,0);max-width:50px;white-space:normal}  .ngx-slider.vertical{position:relative;width:4px;height:100%;margin:0 20px;padding:0;vertical-align:baseline;touch-action:pan-x}  .ngx-slider.vertical .ngx-slider-base{width:100%;height:100%;padding:0}  .ngx-slider.vertical .ngx-slider-bar-wrapper{top:auto;left:0;margin:0 0 0 -16px;padding:0 0 0 16px;height:100%;width:32px}  .ngx-slider.vertical .ngx-slider-bar{bottom:0;left:auto;width:4px;height:100%}  .ngx-slider.vertical .ngx-slider-pointer{left:-14px!important;top:auto;bottom:0}  .ngx-slider.vertical .ngx-slider-bubble{left:16px!important;bottom:0}  .ngx-slider.vertical .ngx-slider-ticks{height:100%;width:0;left:-3px;top:0;z-index:1}  .ngx-slider.vertical .ngx-slider-tick{vertical-align:middle;margin-left:auto;margin-top:11px}  .ngx-slider.vertical .ngx-slider-tick-value{left:24px;top:auto;-webkit-transform:translate(0,-28%);transform:translate(0,-28%)}  .ngx-slider.vertical .ngx-slider-tick-legend{top:auto;right:24px;-webkit-transform:translate(0,-28%);transform:translate(0,-28%);max-width:none;white-space:nowrap}  .ngx-slider.vertical .ngx-slider-ticks-values-under .ngx-slider-tick-value{bottom:auto;left:auto;right:24px}  .ngx-slider *{transition:none}  .ngx-slider.animate .ngx-slider-bar-wrapper{transition:.3s linear}  .ngx-slider.animate .ngx-slider-selection{transition:background-color .3s linear}  .ngx-slider.animate .ngx-slider-pointer{transition:.3s linear}  .ngx-slider.animate .ngx-slider-pointer:after{transition:.3s linear}  .ngx-slider.animate .ngx-slider-bubble{transition:.3s linear}  .ngx-slider.animate .ngx-slider-bubble.ngx-slider-limit{transition:opacity .3s linear}  .ngx-slider.animate .ngx-slider-bubble.ngx-slider-combined{transition:opacity .3s linear}  .ngx-slider.animate .ngx-slider-tick{transition:background-color .3s linear}"]
            }), t
        })(), mk = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["ngx-slider-tooltip-wrapper"]],
                inputs: {template: "template", tooltip: "tooltip", placement: "placement", content: "content"},
                decls: 2,
                vars: 2,
                consts: [[4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "ngx-slider-inner-tooltip"]],
                template: function (e, i) {
                    1 & e && (O(0, dk, 2, 6, "ng-container", 0), O(1, hk, 3, 3, "ng-container", 0)), 2 & e && (v("ngIf", i.template), _(1), v("ngIf", !i.template))
                },
                dependencies: [ot, wr],
                styles: [".ngx-slider-inner-tooltip[_ngcontent-%COMP%]{height:100%}"]
            }), t
        })(), vk = (() => {
            class t {
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({imports: [ya]}), t
        })();

        class be {
            static getGlobal(n, e = !1) {
                const i = Reflect.get(be.global, n);
                return void 0 === i ? e : i
            }

            static getBoolean(n, e = !1) {
                const i = Reflect.get(be.settings, n);
                return void 0 === i ? e : Boolean(i)
            }

            static getNumber(n, e = 0) {
                const i = Reflect.get(be.settings, n);
                return void 0 === i ? e : Number(i)
            }

            static getSetting(n, e = null) {
                const i = Reflect.get(be.settings, n);
                return void 0 === i ? e : i
            }
        }

        function Ai(t) {
            return et((n, e) => {
                let o, i = null, r = !1;
                i = n.subscribe(Ye(e, void 0, void 0, s => {
                    o = tt(t(s, Ai(t)(n))), i ? (i.unsubscribe(), i = null, o.subscribe(e)) : r = !0
                })), r && (i.unsubscribe(), i = null, o.subscribe(e))
            })
        }

        be.all = JSON.parse('{\n  "GLOBAL": {\n    "ALIAS": "mortgage",\n    "CREDIT_BACKEND_URL": "https://app.credit-nocode.tradedealer.su",\n    "TITLE": "\u041a\u0440\u0435\u0434\u0438\u0442\u043d\u044b\u0439 \u043a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440 \u0434\u043b\u044f Nocode"\n  }\n}\n'), be.global = {
            ALIAS: "mortgage",
            CREDIT_BACKEND_URL: "https://app.credit-nocode.tradedealer.su",
            TITLE: "\u041a\u0440\u0435\u0434\u0438\u0442\u043d\u044b\u0439 \u043a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440 \u0434\u043b\u044f Nocode",
            PUBLIC_PATH: ""
        }, be.settings = null, be.\u0275fac = function (n) {
            return new (n || be)
        }, be.\u0275prov = X({token: be, factory: be.\u0275fac, providedIn: "root"});

        class gt {
            constructor(n) {
                this.http = n
            }

            getSettings(n) {
                return console.debug("C-Nocode: SettingsApi - getSettings"), this.http.get(gt.path + gt.settingsEndpoint + "/" + n)
            }
        }

        gt.creditUrl = be.getGlobal("CREDIT_BACKEND_URL"), gt.version = 1, gt.path = `${gt.creditUrl}/api/v${gt.version}`, gt.settingsEndpoint = "/settings", gt.\u0275fac = function (n) {
            return new (n || gt)(W(gd))
        }, gt.\u0275prov = X({token: gt, factory: gt.\u0275fac, providedIn: "root"});
        let _k = (() => {
            class t {
                static create(e) {
                    const i = new ka({});
                    return i.addControl("product", new Oi(e.ProductId)), i
                }

                static filterForCalc(e, i) {
                    return e.ProductParametersArray.filter(r => r.ForCalc).some(r => r.Code === i)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })(), $n = (() => {
            class t {
                constructor() {
                    this.destroy$ = new nn
                }

                ngOnDestroy() {
                    this.destroy$.next(), this.destroy$.complete()
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275dir = I({type: t}), t
        })();
        var Xe = (() => (function (t) {
            t.success = "success", t.sending = "sending", t.pending = "pending", t.error = "error"
        }(Xe || (Xe = {})), Xe))();

        class bk extends nn {
            constructor(n = 1 / 0, e = 1 / 0, i = Rd) {
                super(), this._bufferSize = n, this._windowTime = e, this._timestampProvider = i, this._buffer = [], this._infiniteTimeWindow = !0, this._infiniteTimeWindow = e === 1 / 0, this._bufferSize = Math.max(1, n), this._windowTime = Math.max(1, e)
            }

            next(n) {
                const {isStopped: e, _buffer: i, _infiniteTimeWindow: r, _timestampProvider: o, _windowTime: s} = this;
                e || (i.push(n), !r && i.push(o.now() + s)), this._trimBuffer(), super.next(n)
            }

            _subscribe(n) {
                this._throwIfClosed(), this._trimBuffer();
                const e = this._innerSubscribe(n), {_infiniteTimeWindow: i, _buffer: r} = this, o = r.slice();
                for (let s = 0; s < o.length && !n.closed; s += i ? 1 : 2) n.next(o[s]);
                return this._checkFinalizedStatuses(n), e
            }

            _trimBuffer() {
                const {_bufferSize: n, _timestampProvider: e, _buffer: i, _infiniteTimeWindow: r} = this,
                    o = (r ? 1 : 2) * n;
                if (n < 1 / 0 && o < i.length && i.splice(0, i.length - o), !r) {
                    const s = e.now();
                    let a = 0;
                    for (let l = 1; l < i.length && i[l] <= s; l += 2) a = l;
                    a && i.splice(0, a + 1)
                }
            }
        }

        function Ck(t, n) {
            return t === n
        }

        let zd = (() => {
            class t {
                constructor() {
                    this.product$ = new bk(1)
                }

                get product() {
                    return this.product$.asObservable().pipe(function wk(t, n = Ar) {
                        return t = t ?? Ck, et((e, i) => {
                            let r, o = !0;
                            e.subscribe(Ye(i, s => {
                                const a = n(s);
                                (o || !t(r, a)) && (o = !1, r = a, i.next(s))
                            }))
                        })
                    }(), dl())
                }

                nextProduct(e) {
                    this.product$.next(e)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })();

        function zb(t, n = new FormData) {
            for (const e in t) if (t.hasOwnProperty(e)) {
                const i = t[e];
                switch (!0) {
                    case void 0 === i:
                    case null === i:
                    case"null" === i:
                        n.set(e, "");
                        break;
                    case i instanceof Date:
                        n.set(e, i.toISOString());
                        break;
                    case i instanceof File:
                        n.append(e, i);
                        break;
                    case"object" == typeof i:
                        zb(i, n);
                        break;
                    default:
                        n.set(e, i)
                }
            }
            return n
        }

        class Je {
            constructor(n) {
                this.http = n
            }

            getProducts(n) {
                return console.debug(`C-Nocode: CreditApi - getProduct {${n}}`), this.http.get(Je.path + Je.productsEndpoint + "/" + n)
            }

            calculate(n) {
                return console.debug("C-Nocode: CreditApi - calculate"), this.http.post(Je.path + Je.calculateEndpoint, n)
            }
        }

        Je.creditUrl = be.getGlobal("CREDIT_BACKEND_URL"), Je.version = 1, Je.path = `${Je.creditUrl}/api/v${Je.version}`, Je.productsEndpoint = "/products", Je.calculateEndpoint = "/credit/calculate", Je.\u0275fac = function (n) {
            return new (n || Je)(W(gd))
        }, Je.\u0275prov = X({token: Je, factory: Je.\u0275fac, providedIn: "root"});
        let Xa = (() => {
            class t {
                constructor(e) {
                    this.api = e, this.calculateResult$ = new nn, this.status$ = new nn
                }

                recalculate(e) {
                    return this.api.calculate(zb(e)).pipe(Ai(i => (console.error("[CreditService] \u041e\u0448\u0438\u0431\u043a\u0430:", i), this.status$.next(Xe.error), this.calculateResult$.error(i), Cr(null))))
                }

                getProducts() {
                    return this.api.getProducts(be.getGlobal("ALIAS"))
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(W(Je))
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })();

        function Ek(t, n) {
            1 & t && (S(0, "div", 4), Ui(), S(1, "svg", 5), k(2, "path", 6), E()())
        }

        const Sk = ["*"];
        let xk = (() => {
            class t extends $n {
                constructor() {
                    super(...arguments), this.type = "primary", this.size = "m", this.loading = !1, this.disabled = !1
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["c-button"], ["", "c-button", ""]],
                inputs: {type: "type", size: "size", loading: "loading", disabled: "disabled"},
                features: [R],
                ngContentSelectors: Sk,
                decls: 5,
                vars: 5,
                consts: [["type", "button"], [1, "c-btn__content"], ["class", "c-btn__icon c-btn__icon_left", 4, "ngIf"], [1, "c-btn__text"], [1, "c-btn__icon", "c-btn__icon_left"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "c-btn__loader"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M19.2881 12C19.2881 16.4183 15.7064 20 11.2881 20C8.80148 20 6.57982 18.8655 5.11252 17.0858L3.56862 18.3573C5.40274 20.5818 8.17982 22 11.2881 22C16.811 22 21.2881 17.5228 21.2881 12C21.2881 6.47715 16.811 2 11.2881 2C7.6472 2 4.46074 3.94581 2.71191 6.85427L4.42716 7.88341C5.82622 5.55665 8.37539 4 11.2881 4C15.7064 4 19.2881 7.58172 19.2881 12Z", "fill", "currentColor"]],
                template: function (e, i) {
                    1 & e && (Yn(), S(0, "button", 0)(1, "span", 1), O(2, Ek, 3, 0, "div", 2), S(3, "div", 3), Vt(4), E()()()), 2 & e && (function em(t, n, e, i, r) {
                        un(Lt, Sn, ar(D(), t, n, e, i, r), !0)
                    }("c-btn c-btn-default_", i.type, " c-btn_", i.size, ""), _(2), v("ngIf", i.loading))
                },
                dependencies: [ot],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}[_nghost-%COMP%]{display:inline-block;line-height:0}[_nghost-%COMP%]:not(:first-of-type){margin:0 0 0 12px}[is-full-size=true][_nghost-%COMP%]{width:100%}@media (max-width: 767px){[is-full-size=true][_nghost-%COMP%]:not(:first-of-type){margin:0}[is-full-size=true][_nghost-%COMP%]:not(:last-of-type){margin:0 0 12px}}@media (min-width: 768px){[is-full-size=true][_nghost-%COMP%]{width:auto}.c-btn_full-size[_ngcontent-%COMP%], .c-btn_type_full-size[_ngcontent-%COMP%]{width:auto}.c-btn_full-size[_ngcontent-%COMP%]   .c-btn__content[_ngcontent-%COMP%], .c-btn_type_full-size[_ngcontent-%COMP%]   .c-btn__content[_ngcontent-%COMP%]{justify-content:center}}.c-btn[_ngcontent-%COMP%]{position:relative;cursor:pointer;font-size:var(--btn-primary-font-size);font-family:var(--btn-font-family);text-align:center;white-space:nowrap;border-radius:var(--btn-primary-radius);flex-shrink:0;height:var(--btn-size);line-height:calc(var(--btn-size) - 2px * 2);padding:0 calc(var(--btn-size) / 2);width:100%}.c-btn__content[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;margin-left:-4px;margin-right:-4px}.c-btn__content[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{margin-left:4px;margin-right:4px}.c-btn__icon[_ngcontent-%COMP%]{width:24px;height:24px;transition:transform .3s ease}.c-btn__icon_left[_ngcontent-%COMP%]{order:1}.c-btn__icon_right[_ngcontent-%COMP%]{order:3}.c-btn__text[_ngcontent-%COMP%]{order:2}.c-btn__loader[_ngcontent-%COMP%]{transition:all .1s ease;animation:_ngcontent-%COMP%_rotate 1s linear infinite;fill:var(--color-icon)}@keyframes _ngcontent-%COMP%_rotate{0%{transform:rotate(-360deg)}}.is-disabled[_nghost-%COMP%]{opacity:.5;pointer-events:none;-webkit-user-select:none;user-select:none}.c-btn-default_primary[_ngcontent-%COMP%]{background-color:var(--btn-primary-bg-color);color:var(--btn-primary-text-color);transition:color .3s ease,box-shadow .3s ease,background-color .3s ease,border .3s ease;border:none;box-shadow:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.c-btn-default_primary[_ngcontent-%COMP%]   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color)}.c-btn-default_primary[_ngcontent-%COMP%]:hover, .c-btn-default_primary.hover[_ngcontent-%COMP%]{background-color:var(--btn-primary-bg-hover);color:var(--btn-primary-text-color-hover);border-color:transparent;box-shadow:var(--btn-primary-shadow-hover)}.c-btn-default_primary[_ngcontent-%COMP%]:hover   .ui-btn-default__icon[_ngcontent-%COMP%], .c-btn-default_primary.hover[_ngcontent-%COMP%]   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color-hover)}.c-btn-default_primary[_ngcontent-%COMP%]:focus{background-color:var(--btn-primary-bg-color);color:var(--btn-primary-text-color-focus);border-color:none;box-shadow:var(--btn-primary-shadow-focus);outline:none}.c-btn-default_primary[_ngcontent-%COMP%]:focus   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color-focus)}.c-btn-default_primary[_ngcontent-%COMP%]:focus:not(:focus-visible){background-color:var(--btn-primary-bg-color);color:var(--btn-primary-text-color);transition:color .3s ease,box-shadow .3s ease,background-color .3s ease,border .3s ease;border:none;box-shadow:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.c-btn-default_primary[_ngcontent-%COMP%]:focus:not(:focus-visible)   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color)}.c-btn-default_primary[_ngcontent-%COMP%]:focus-visible{background-color:var(--btn-primary-bg-color);color:var(--btn-primary-text-color-focus);border-color:none;box-shadow:var(--btn-primary-shadow-focus);outline:none}.c-btn-default_primary[_ngcontent-%COMP%]:focus-visible   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color-focus)}.c-btn-default_primary[_ngcontent-%COMP%]:active{background-color:var(--btn-primary-bg-active);color:var(--btn-primary-text-color-active);border-color:transparent;box-shadow:none}.c-btn-default_primary[_ngcontent-%COMP%]:active   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color-active)}.c-btn-default_primary[_ngcontent-%COMP%]:active:focus:not(:focus-visible){background-color:var(--btn-primary-bg-active);color:var(--btn-primary-text-color-active);border-color:transparent;box-shadow:none}.c-btn-default_primary[_ngcontent-%COMP%]:active:focus:not(:focus-visible)   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color-active)}.c-btn-default_primary[disabled][_ngcontent-%COMP%], .c-btn-default_primary.disabled[_ngcontent-%COMP%], .c-btn-default_primary.is-disabled[_ngcontent-%COMP%], .c-btn-default_primary.isDisabled[_ngcontent-%COMP%]{background-color:var(--btn-primary-bg-color-disabled);color:var(--btn-primary-text-color-disabled);border:var(--btn-primary-border-disabled);box-shadow:none;cursor:default;pointer-events:none;transition-duration:unset}.c-btn-default_primary[disabled][_ngcontent-%COMP%]   .ui-btn-default__icon[_ngcontent-%COMP%], .c-btn-default_primary.disabled[_ngcontent-%COMP%]   .ui-btn-default__icon[_ngcontent-%COMP%], .c-btn-default_primary.is-disabled[_ngcontent-%COMP%]   .ui-btn-default__icon[_ngcontent-%COMP%], .c-btn-default_primary.isDisabled[_ngcontent-%COMP%]   .ui-btn-default__icon[_ngcontent-%COMP%]{fill:var(--btn-primary-text-color-disabled)}']
            }), t
        })(), Mk = (() => {
            class t {
                constructor() {
                    this.isReadonly = !0
                }

                get isLabelString() {
                    let e = !0;
                    return "string" != typeof this.label && (e = !1), e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275dir = I({
                type: t,
                inputs: {
                    controlId: "controlId",
                    showRequired: "showRequired",
                    isReadonly: "isReadonly",
                    isActive: "isActive",
                    label: "label"
                }
            }), t
        })();

        function Tk(t, n) {
            1 & t && k(0, "span", 3), 2 & t && v("innerHTML", P(2).label, an)
        }

        function Ok(t, n) {
            1 & t && (S(0, "span"), Ie(1, " *"), E())
        }

        const Ik = function (t, n) {
            return {"is-readonly": t, "is-active": n}
        };

        function Ak(t, n) {
            if (1 & t && (Te(0), S(1, "label", 1), O(2, Tk, 1, 1, "span", 2), O(3, Ok, 2, 0, "span", 0), Vt(4), E(), Oe()), 2 & t) {
                const e = P();
                _(1), v("for", e.controlId)("ngClass", uu(4, Ik, e.isReadonly, e.isActive)), _(1), v("ngIf", e.isLabelString), _(1), v("ngIf", e.showRequired)
            }
        }

        const Pk = ["*"];
        let Mr = (() => {
            class t extends Mk {
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["c-control-label"]],
                features: [R],
                ngContentSelectors: Pk,
                decls: 1,
                vars: 1,
                consts: [[4, "ngIf"], [1, "c-control-label", 3, "for", "ngClass"], [3, "innerHTML", 4, "ngIf"], [3, "innerHTML"]],
                template: function (e, i) {
                    1 & e && (Yn(), O(0, Ak, 5, 7, "ng-container", 0)), 2 & e && v("ngIf", i.label)
                },
                dependencies: [Jn, ot],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}.c-control-label[_ngcontent-%COMP%]{font-family:var(--medium);font-size:14px;line-height:20px;letter-spacing:0;word-wrap:break-word;overflow-wrap:break-word;word-break:break-word;color:var(--form-label-color);cursor:pointer;position:relative}.c-control-label.is-readonly[_ngcontent-%COMP%]{cursor:default}.c-control-label.is-active[_ngcontent-%COMP%]{color:var(--form-label-color-active)}.c-control-label[_ngcontent-%COMP%]     a{font-family:var(--medium);line-height:var(--base-line-height);font-size:var(--base-font-size);position:relative;color:var(--color-primary);outline:none;transition:color .3s ease-in-out;cursor:pointer}.c-control-label[_ngcontent-%COMP%]     a:before{content:"";position:absolute;inset:0 -2px;box-shadow:0 0 0 1px rgba(var(--color-secondary-rgb),.2);opacity:0}.c-control-label[_ngcontent-%COMP%]     a   svg{fill:var(--color-primary);transition:fill .3s ease-in-out}.c-control-label[_ngcontent-%COMP%]     a:hover{color:var(--link-primary-color-hover)}.c-control-label[_ngcontent-%COMP%]     a:hover   svg{fill:var(--link-primary-color-hover)}.c-control-label[_ngcontent-%COMP%]     a:focus{color:var(--link-primary-color-focus)}.c-control-label[_ngcontent-%COMP%]     a:focus:before{opacity:1}.c-control-label[_ngcontent-%COMP%]     a:focus   svg{fill:var(--link-primary-color-focus)}.c-control-label[_ngcontent-%COMP%]     a:focus:not(:focus-visible):before{opacity:0}.c-control-label[_ngcontent-%COMP%]     a:focus-visible{color:var(--link-primary-color-focus)}.c-control-label[_ngcontent-%COMP%]     a:focus-visible:before{opacity:1}.c-control-label[_ngcontent-%COMP%]     a:focus-visible   svg{fill:var(--link-primary-color-focus)}.c-control-label[_ngcontent-%COMP%]     a:active{color:var(--link-primary-color-active)}.c-control-label[_ngcontent-%COMP%]     a:active:before{opacity:0}.c-control-label[_ngcontent-%COMP%]     a:active   svg{fill:var(--link-primary-color-active)}.c-control-label[_ngcontent-%COMP%]     a:active:focus:not(:focus-visible){color:var(--link-primary-color-active)}.c-control-label[_ngcontent-%COMP%]     a:active:focus:not(:focus-visible):before{opacity:0}.c-control-label[_ngcontent-%COMP%]     a:active:focus:not(:focus-visible)   svg{fill:var(--link-primary-color-active)}']
            }), t
        })();
        const Fk = ["*"];
        let kk = (() => {
            class t extends $n {
                get iconType() {
                    return this._iconType
                }

                get tipType() {
                    return this._tipType
                }

                set iconType(e) {
                    this._iconType = e
                }

                set tipType(e) {
                    const i = e || "default";
                    i !== this._tipType && (this._tipType && this.elementRef.nativeElement.classList.remove(`tr-${this._tipType}`), i && this.elementRef.nativeElement.classList.add(`tr-${i}`), this._tipType = i)
                }

                constructor(e) {
                    super(), this.elementRef = e
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["tr-tip"], ["", "tr-tip", ""]],
                inputs: {iconType: "iconType", tipType: "tipType"},
                features: [R],
                ngContentSelectors: Fk,
                decls: 7,
                vars: 0,
                consts: [[1, "tr-ref"], ["ref", ""], [1, "c-control-message-icon"], [1, "c-control-message-icon__wrapper"], ["type", "button", 1, "c-control-message-icon__svg", "c-control-message-icon__svg_tooltip"]],
                template: function (e, i) {
                    1 & e && (Yn(), S(0, "span", 0, 1), Vt(2), E(), S(3, "div", 2)(4, "div", 3)(5, "button", 4), Ie(6, "?"), E()()())
                },
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}.c-control-message-icon[_ngcontent-%COMP%]{max-height:var(--tooltip-height)}.c-control-message-icon__wrapper[_ngcontent-%COMP%]{width:var(--tooltip-width);min-width:var(--tooltip-width);height:var(--tooltip-height);display:flex;align-items:center;justify-content:center}.c-control-message-icon__svg[_ngcontent-%COMP%]{cursor:pointer}.c-control-message-icon__svg_error[_ngcontent-%COMP%]{fill:var(--color-error)}.c-control-message-icon__svg_tooltip[_ngcontent-%COMP%]{background-color:var(--tooltip-bg);border:1px solid var(--tooltip-border-color);color:var(--tooltip-color);font-family:var(--tooltip-ff);font-size:var(--tooltip-fs);border-radius:50%;width:var(--tooltip-width);min-width:var(--tooltip-width);height:var(--tooltip-height);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color .3s ease,border-color .3s ease,color .3s ease}.c-control-message-icon__svg_tooltip[_ngcontent-%COMP%]:hover, .c-control-message-icon__svg_tooltip[_ngcontent-%COMP%]:focus, .c-control-message-icon__svg_tooltip.is-active[_ngcontent-%COMP%]{background-color:var(--tooltip-bg-active);border:var(--tooltip-border-color-active);color:var(--tooltip-color-active)}'],
                changeDetection: 0
            }), t
        })();
        const Lk = /\s+/, Gb = new class Nk {
            getAllStyles(n) {
                return window.getComputedStyle(n)
            }

            getStyle(n, e) {
                return this.getAllStyles(n)[e]
            }

            isStaticPositioned(n) {
                return "static" === (this.getStyle(n, "position") || "static")
            }

            offsetParent(n) {
                let e = n.offsetParent || document.documentElement;
                for (; e && e !== document.documentElement && this.isStaticPositioned(e);) e = e.offsetParent;
                return e || document.documentElement
            }

            position(n, e = !0) {
                let i, r = {
                    width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0, x: 0, y: 0, toJSON() {
                    }
                };
                if ("fixed" === this.getStyle(n, "position")) i = n.getBoundingClientRect(), i = {
                    top: i.top,
                    bottom: i.bottom,
                    left: i.left,
                    right: i.right,
                    height: i.height,
                    width: i.width,
                    x: i.top,
                    y: i.bottom,
                    toJSON() {
                    }
                }; else {
                    const o = this.offsetParent(n);
                    i = this.offset(n, !1), o !== document.documentElement && (r = this.offset(o, !1)), r.top += o.clientTop, r.left += o.clientLeft
                }
                return i.top -= r.top, i.bottom -= r.top, i.left -= r.left, i.right -= r.left, e && (i.top = Math.round(i.top), i.bottom = Math.round(i.bottom), i.left = Math.round(i.left), i.right = Math.round(i.right)), i
            }

            offset(n, e = !0) {
                const i = n.getBoundingClientRect(), r_top = window.pageYOffset - document.documentElement.clientTop,
                    r_left = window.pageXOffset - document.documentElement.clientLeft;
                let o = {
                    height: i.height || n.offsetHeight,
                    width: i.width || n.offsetWidth,
                    top: i.top + r_top,
                    x: i.top + r_top,
                    bottom: i.bottom + r_top,
                    y: i.bottom + r_top,
                    left: i.left + r_left,
                    right: i.right + r_left,
                    toJSON() {
                    }
                };
                return e && (o.height = Math.round(o.height), o.width = Math.round(o.width), o.top = Math.round(o.top), o.bottom = Math.round(o.bottom), o.left = Math.round(o.left), o.right = Math.round(o.right)), o
            }

            positionElements(n, e, i, r) {
                const [o = "top", s = "center"] = i.split("-"), a = r ? this.offset(n, !1) : this.position(n, !1),
                    l = this.getAllStyles(e), c = parseFloat(l.marginTop), u = parseFloat(l.marginBottom),
                    d = parseFloat(l.marginLeft), h = parseFloat(l.marginRight);
                let f = 0, p = 0;
                switch (o) {
                    case"top":
                        f = a.top - (e.offsetHeight + c + u);
                        break;
                    case"bottom":
                        f = a.top + a.height;
                        break;
                    case"left":
                        p = a.left - (e.offsetWidth + d + h);
                        break;
                    case"right":
                        p = a.left + a.width
                }
                switch (s) {
                    case"top":
                        f = a.top;
                        break;
                    case"bottom":
                        f = a.top + a.height - e.offsetHeight;
                        break;
                    case"left":
                        p = a.left;
                        break;
                    case"right":
                        p = a.left + a.width - e.offsetWidth;
                        break;
                    case"center":
                        "top" === o || "bottom" === o ? p = a.left + a.width / 2 - e.offsetWidth / 2 : f = a.top + a.height / 2 - e.offsetHeight / 2
                }
                const m = e.style;
                m.position = "absolute", m.left = `${Math.round(p)}px`, m.top = `${Math.round(f)}px`, m["will-change"] = "left, top";
                const b = e.getBoundingClientRect(), w = document.documentElement,
                    x = window.innerHeight || w.clientHeight, y = window.innerWidth || w.clientWidth;
                return b.left >= 0 && b.top >= 0 && b.right <= y && b.bottom <= x
            }
        };

        class Gd {
            constructor(n, e, i) {
                this.nodes = n, this.viewRef = e, this.componentRef = i
            }
        }

        class Vk {
            constructor(n, e, i, r, o, s) {
                this._type = n, this._injector = e, this._viewContainerRef = i, this._renderer = r, this._componentFactoryResolver = o, this._applicationRef = s
            }

            open(n, e) {
                return this._windowRef || (this._contentRef = this._getContentRef(n, e), this._windowRef = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(this._type), 0, this._injector, this._contentRef.nodes)), this._windowRef
            }

            close() {
                this._windowRef && (this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView)), this._windowRef = null, this._contentRef.viewRef && (this._applicationRef.detachView(this._contentRef.viewRef), this._contentRef.viewRef.destroy(), this._contentRef = null))
            }

            _getContentRef(n, e) {
                if (n) {
                    if (n instanceof te) {
                        const i = n.createEmbeddedView(e);
                        return this._applicationRef.attachView(i), new Gd([i.rootNodes], i)
                    }
                    return new Gd([[this._renderer.createText(`${n}`)]])
                }
                return new Gd([])
            }
        }

        const {isArray: Bk} = Array;

        function Wb(t) {
            return t <= 0 ? () => cl : et((n, e) => {
                let i = 0;
                n.subscribe(Ye(e, r => {
                    ++i <= t && (e.next(r), t <= i && e.complete())
                }))
            })
        }

        function qb(t, n) {
            return n ? e => Bd(n.pipe(Wb(1), function zk() {
                return et((t, n) => {
                    t.subscribe(Ye(n, Or))
                })
            }()), e.pipe(qb(t))) : Fi((e, i) => tt(t(e, i)).pipe(Wb(1), function Gk(t) {
                return mt(() => t)
            }(e)))
        }

        function Yb(t, n = Ha) {
            const e = cb(t, n);
            return qb(() => e)
        }

        var Ja = (() => (function (t) {
            t[t.Tab = 9] = "Tab", t[t.Enter = 13] = "Enter", t[t.Escape = 27] = "Escape", t[t.Space = 32] = "Space", t[t.PageUp = 33] = "PageUp", t[t.PageDown = 34] = "PageDown", t[t.End = 35] = "End", t[t.Home = 36] = "Home", t[t.ArrowLeft = 37] = "ArrowLeft", t[t.ArrowUp = 38] = "ArrowUp", t[t.ArrowRight = 39] = "ArrowRight", t[t.ArrowDown = 40] = "ArrowDown"
        }(Ja || (Ja = {})), Ja))();
        const el = (t, n) => !!n && n.some(e => e.contains(t)), Kb = (t, n) => !n || null != function Wk(t, n) {
            return n ? t.closest(n) : null
        }(t, n);
        let tl = !1;

        function qk(t, n, e, i, r, o, s, a) {
            e && t.runOutsideAngular(() => {
                const c = Un(n, "keydown").pipe(Qe(r), tn(h => h.which === Ja.Escape)),
                    u = Un(n, tl ? "touchstart" : "mousedown").pipe(mt(h => {
                        const f = h.target;
                        return !(h instanceof MouseEvent && 2 === h.button || el(f, s)) && ("inside" === e ? el(f, o) && Kb(f, a) : "outside" === e ? !el(f, o) : Kb(f, a) || !el(f, o))
                    }), Qe(r)), d = Un(n, tl ? "touchend" : "mouseup").pipe(function $k(...t) {
                        const n = ph(t);
                        return et((e, i) => {
                            const r = t.length, o = new Array(r);
                            let s = t.map(() => !1), a = !1;
                            for (let l = 0; l < r; l++) tt(t[l]).subscribe(Ye(i, c => {
                                o[l] = c, !a && !s[l] && (s[l] = !0, (a = s.every(Ar)) && (s = null))
                            }, Or));
                            e.subscribe(Ye(i, l => {
                                if (a) {
                                    const c = [l, ...o];
                                    i.next(n ? n(...c) : c)
                                }
                            }))
                        })
                    }(u), tn(([h, f]) => f), Yb(tl ? 16 : 0), Qe(r));
                (function jk(...t) {
                    return 1 === (t = function Hk(t) {
                        return 1 === t.length && Bk(t[0]) ? t[0] : t
                    }(t)).length ? tt(t[0]) : new Re(function Uk(t) {
                        return n => {
                            let e = [];
                            for (let i = 0; e && !n.closed && i < t.length; i++) e.push(tt(t[i]).subscribe(Ye(n, r => {
                                if (e) {
                                    for (let o = 0; o < e.length; o++) o !== i && e[o].unsubscribe();
                                    e = null
                                }
                                n.next(r)
                            })))
                        }
                    }(t))
                })([c, d]).subscribe(() => t.run(i))
            })
        }

        typeof navigator < "u" && (tl = !!navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent));

        class Yk {
            constructor(n, e) {
                this.open = n, this.close = e, e || (this.close = n)
            }

            isManual() {
                return "manual" === this.open || "manual" === this.close
            }
        }

        const Kk = {hover: ["mouseenter", "mouseleave"], focus: ["focusin", "focusout"]},
            Zb = t => t > 0 ? Yb(t) : n => n;

        function eN(t, n) {
            1 & t && Ie(0), 2 & t && Zn(P(2).title)
        }

        function tN(t, n) {
        }

        function nN(t, n) {
            if (1 & t && (S(0, "h3", 4), O(1, eN, 1, 1, "ng-template", null, 5, ft), O(3, tN, 0, 0, "ng-template", 6), E()), 2 & t) {
                const e = Me(2), i = P();
                _(3), v("ngTemplateOutlet", i.isTitleTemplate() ? i.titleTemplateRef : e)("ngTemplateOutletContext", i.context)
            }
        }

        const iN = ["*"];
        let rN = (() => {
            class t {
                get popoverClassFormatted() {
                    return "tr-popover" + (this.popoverClass ? " " + this.popoverClass : "")
                }

                get role() {
                    return "tooltip"
                }

                isTitleTemplate() {
                    return this.title instanceof te
                }

                get titleTemplateRef() {
                    return this.title
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["tr-popover-window"]],
                hostVars: 4,
                hostBindings: function (e, i) {
                    2 & e && ($e("id", i.id)("role", i.role), function Bg(t) {
                        un(V1, Sn, t, !0)
                    }(i.popoverClassFormatted))
                },
                inputs: {id: "id", title: "title", popoverClass: "popoverClass", context: "context"},
                ngContentSelectors: iN,
                decls: 5,
                vars: 1,
                consts: [[1, "tr-arrow"], [1, "tr-popover-container"], ["class", "tr-popover-header", 4, "ngIf"], [1, "tr-popover-body"], [1, "tr-popover-header"], ["simpleTitle", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"]],
                template: function (e, i) {
                    1 & e && (Yn(), k(0, "div", 0), S(1, "div", 1), O(2, nN, 4, 2, "h3", 2), S(3, "div", 3), Vt(4), E()()), 2 & e && (_(2), v("ngIf", null != i.title))
                },
                dependencies: [ot, wr],
                styles: ['@charset "UTF-8";@keyframes loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){:root{--grid-gutter-width: 24px}}@keyframes wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}.tr-popover{position:absolute;white-space:initial}.tr-popover p:last-of-type{margin-bottom:0}.tr-popover.tr-popover-form-error{min-width:200px;max-width:400px}.tr-popover.tr-popover-error-fixed{max-width:200px;width:200px}.tr-popover.tr-leasing-popover{min-width:200px;max-width:240px}.tr-popover{z-index:999;max-width:var(--main-tooltip-wrapper-width);filter:drop-shadow(0px 2px 10px rgba(0,0,0,.15));display:block;box-sizing:border-box}.tr-popover>.tr-arrow{position:absolute;width:15px;height:15px;transform:rotate(45deg);background-color:var(--tooltip-bg-active);border:1px solid var(--tooltip-border-color-active);border-radius:2px;z-index:2}.tr-popover-top{margin-bottom:15px}.tr-popover-right{margin-left:15px}.tr-popover-left{margin-right:15px}.tr-popover-bottom{margin-top:15px}.tr-popover-top .tr-arrow,.tr-popover-bottom .tr-arrow{left:50%;margin-left:-.5rem}.tr-popover-top-left .tr-arrow,.tr-popover-bottom-left .tr-arrow{left:2em}.tr-popover-top-right .tr-arrow,.tr-popover-bottom-right .tr-arrow{left:auto;right:2em}.tr-popover-left .tr-arrow,.tr-popover-right .tr-arrow{top:50%;margin-top:-.5rem}.tr-popover-left-top .tr-arrow,.tr-popover-right-top .tr-arrow{top:.7em}.tr-popover-left-bottom .tr-arrow,.tr-popover-right-bottom .tr-arrow{top:auto;bottom:.7em}.tr-popover.tr-popover-top-left,.tr-popover.tr-popover-bottom-left{margin-left:-15px}.tr-popover.tr-popover-top-right,.tr-popover.tr-popover-bottom-right{margin-left:15px}.tr-popover.tr-popover-left-top,.tr-popover.tr-popover-right-top{margin-top:-8px}.tr-popover.tr-popover-left-bottom,.tr-popover.tr-popover-right-bottom{margin-top:8px}.tr-popover-grid{min-height:130px;display:flex}.tr-popover-info{width:75%;display:flex;flex-direction:column;align-items:flex-start}.tr-popover-button{margin-top:auto}.tr-popover-media{position:absolute;top:23px;bottom:0;right:0;width:40%;overflow:hidden;text-align:center}.tr-popover-top>.tr-arrow{bottom:-7px;border-top-width:0;border-left-width:0}.tr-popover-bottom>.tr-arrow{top:-7px;border-bottom-width:0;border-right-width:0}.tr-popover-right>.tr-arrow{left:-7px;border-top-width:0;border-right-width:0}.tr-popover-left>.tr-arrow{right:-7px;border-bottom-width:0;border-left-width:0}.tr-popover.tr-popover-top-left .tr-arrow,.tr-popover.tr-popover-bottom-left .tr-arrow{margin-left:0;left:15px}.tr-popover.tr-popover-top-right .tr-arrow,.tr-popover.tr-popover-bottom-right .tr-arrow{margin-right:0;right:15px}.tr-popover.tr-popover-left-top .tr-arrow,.tr-popover.tr-popover-right-top .tr-arrow{margin-top:0;top:15px}.tr-popover.tr-popover-left-bottom .tr-arrow,.tr-popover.tr-popover--right-bottom .tr-arrow{margin-top:0;top:auto;bottom:15px}.tr-popover-with-cross .tr-popover-container{padding-right:40px}.tr-popover-close{position:absolute;top:5px;right:5px}.tr-popover.tr-popover-in-modal{position:fixed!important}.tr-popover.tr-popover-align-right,.tr-popover.tr-popover-align-left{margin-left:0}.tr-popover p{font-size:inherit;line-height:inherit}.tr-popover-container{padding:var(--main-tooltip-corner-vertical-indent-from-edge) var(--main-tooltip-corner-horizontal-indent-from-edge);border-radius:var(--ab-border-radius);background-color:var(--tooltip-bg-active);border:1px solid var(--tooltip-border-color-active);color:var(--tooltip-color-active);font-family:var(--regular);font-size:14px;line-height:22px;letter-spacing:0}@media (min-width: 768px){.tr-popover-container{min-width:280px}}\n'],
                encapsulation: 2,
                changeDetection: 0
            }), t
        })(), oN = (() => {
            class t {
                constructor() {
                    this.autoClose = !0, this.placement = "auto", this.triggers = "click", this.disablePopover = !1, this.openDelay = 0, this.closeDelay = 0
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275prov = X({token: t, factory: t.\u0275fac, providedIn: "root"}), t
        })(), sN = 0, aN = (() => {
            class t {
                constructor(e, i, r, o, s, a, l, c, u, d) {
                    this._elementRef = e, this._renderer = i, this._ngZone = l, this._document = c, this._changeDetector = u, this._applicationRef = d, this.shown = new G, this.hidden = new G, this._PopoverWindowId = "tr-popover-" + sN++, this.autoClose = a.autoClose, this.placement = a.placement, this.triggers = a.triggers, this.container = a.container, this.disablePopover = a.disablePopover, this.popoverClass = a.popoverClass, this.openDelay = a.openDelay, this.closeDelay = a.closeDelay, this._popupService = this.createPopupService(r, s, i, o, d), this._zoneSubscription = l.onStable.subscribe(() => {
                        this._windowRef && function Rk(t, n, e, i, r) {
                            let o = Array.isArray(e) ? e : e.split(Lk);
                            const s = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "left-top", "left-bottom", "right-top", "right-bottom"],
                                a = n.classList, l = h => {
                                    const [f, p] = h.split("-"), m = [];
                                    return r && (m.push(`${r}-${f}`), p && m.push(`${r}-${f}-${p}`), m.forEach(b => {
                                        a.add(b)
                                    })), m
                                };
                            r && s.forEach(h => {
                                a.remove(`${r}-${h}`)
                            });
                            let c = o.findIndex(h => "auto" === h);
                            c >= 0 && s.forEach(function (h) {
                                null == o.find(f => -1 !== f.search("^" + h)) && o.splice(c++, 1, h)
                            });
                            let u = null, d = !1;
                            for (u of o) {
                                let h = l(u);
                                if (Gb.positionElements(t, n, u, i)) {
                                    d = !0;
                                    break
                                }
                                r && h.forEach(f => {
                                    a.remove(f)
                                })
                            }
                            d || (u = o[0], l(u), Gb.positionElements(t, n, u, i))
                        }(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, "body" === this.container, "tr-popover")
                    })
                }

                _isDisabled() {
                    return !(!this.disablePopover && (this.trPopover || this.popoverTitle))
                }

                createPopupService(e, i, r, o, s) {
                    return new Vk(rN, e, i, r, o, s)
                }

                open(e) {
                    if (!this._windowRef && !this._isDisabled()) {
                        const i = document.querySelector("tr-popover-window");
                        i && i.remove(), this._windowRef = this._popupService.open(this.trPopover, e), this._windowRef.instance.title = this.popoverTitle, this._windowRef.instance.context = e, this._windowRef.instance.popoverClass = this.popoverClass, this._windowRef.instance.id = this._PopoverWindowId, this._renderer.setAttribute(this._elementRef.nativeElement, "aria-describedby", this._PopoverWindowId), this.containerRef ? this.containerRef.appendChild(this._windowRef.location.nativeElement) : document.querySelector(this.container) && document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement), this._windowRef.changeDetectorRef.detectChanges(), this._windowRef.changeDetectorRef.markForCheck(), qk(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [this._windowRef.location.nativeElement]), this.shown.emit()
                    }
                }

                close() {
                    this._windowRef && (this._renderer.removeAttribute(this._elementRef.nativeElement, "aria-describedby"), this._popupService.close(), this._windowRef = null, this.hidden.emit(), this._changeDetector.markForCheck())
                }

                toggle() {
                    this._windowRef ? this.close() : this.open()
                }

                isOpen() {
                    return null != this._windowRef
                }

                ngOnInit() {
                    this._unregisterListenersFn = function Jk(t, n, e, i, r, o, s = 0, a = 0) {
                        const l = function Zk(t, n = Kk) {
                            const e = (t || "").trim();
                            if (0 === e.length) return [];
                            const i = e.split(/\s+/).map(o => o.split(":")).map(o => {
                                let s = n[o[0]] || o;
                                return new Yk(s[0], s[1])
                            }), r = i.filter(o => o.isManual());
                            if (r.length > 1) throw"Triggers parse error: only one manual trigger is allowed";
                            if (1 === r.length && i.length > 1) throw"Triggers parse error: manual trigger can't be mixed with other triggers";
                            return i
                        }(e);
                        if (1 === l.length && l[0].isManual()) return () => {
                        };
                        const c = function Qk(t, n, e, i) {
                            return new Re(r => {
                                const o = [], s = () => r.next(!0), a = () => r.next(!1), l = () => r.next(!i());
                                return e.forEach(c => {
                                    c.open === c.close ? o.push(t.listen(n, c.open, l)) : o.push(t.listen(n, c.open, s), t.listen(n, c.close, a))
                                }), () => {
                                    o.forEach(c => c())
                                }
                            })
                        }(t, n, l, i).pipe(function Xk(t, n, e) {
                            return i => {
                                let r = null;
                                const o = i.pipe(mt(l => ({open: l})), tn(l => {
                                    const c = e();
                                    return c === l.open || r && r.open !== c ? (r && r.open !== l.open && (r = null), !1) : (r = l, !0)
                                }), dl());
                                return Pr(o.pipe(tn(l => l.open), Zb(t)), o.pipe(tn(l => !l.open), Zb(n))).pipe(tn(l => l === r && (r = null, l.open !== e())), mt(l => l.open))
                            }
                        }(s, a, i)).subscribe(u => u ? r() : o());
                        return () => c.unsubscribe()
                    }(this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay)
                }

                ngOnChanges(e) {
                    (e.trPopover || e.popoverTitle || e.disablePopover) && this._isDisabled() && this.close()
                }

                ngOnDestroy() {
                    this.close(), this._unregisterListenersFn && this._unregisterListenersFn(), this._zoneSubscription.unsubscribe()
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he), g(Ot), g(Ln), g(io), g(Qt), g(oN), g(Ge), g(Xt), g(Xn), g(ra))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "trPopover", ""]],
                inputs: {
                    autoClose: "autoClose",
                    trPopover: "trPopover",
                    popoverTitle: "popoverTitle",
                    placement: "placement",
                    triggers: "triggers",
                    container: "container",
                    containerRef: "containerRef",
                    disablePopover: "disablePopover",
                    popoverClass: "popoverClass",
                    openDelay: "openDelay",
                    closeDelay: "closeDelay"
                },
                outputs: {shown: "shown", hidden: "hidden"},
                exportAs: ["trPopover"],
                features: [nt]
            }), t
        })();
        const lN = ["popover"];

        function cN(t, n) {
            1 & t && k(0, "div", 4), 2 & t && v("innerHTML", P().showingTooltipsText, an)
        }

        let Tr = (() => {
            class t extends $n {
                constructor() {
                    super(), this.placement = "top-right bottom-right", this.text = "", this.tooltipLimit = 280, this.showMore = !1, this.priceModalClass = "tr-position-side tr-position-side-right  tr-modal-lg", this.defaultConfig = {htmlTag: "button"}
                }

                getConfig(e) {
                    return this.defaultConfig[e]
                }

                close() {
                    this.popover.first.close()
                }

                stopPropagation(e) {
                    e.stopPropagation()
                }

                openPriceModal() {
                    this.popover.first.close()
                }

                getStringWithGroupedPrices(e) {
                    return e.replace(/((\d+)\s)?(\d+)\s(\d+)\s/gi, (r, o, s, a, l) => {
                        let c = "";
                        return s && (c += s + "&nbsp;"), c += a + "&nbsp;" + l + "&nbsp;", c
                    })
                }

                ngOnInit() {
                    this.shortText()
                }

                ngOnChanges(e) {
                    this.shortText()
                }

                shortText() {
                    this.text = this.getStringWithGroupedPrices(this.text), this.showMore = !1, this.showingTooltipsText = this.text, this.text.length > this.tooltipLimit && (this.showMore = !0, this.showingTooltipsText = this.text.slice(0, this.tooltipLimit) + "...")
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["tr-popover-tip"]],
                viewQuery: function (e, i) {
                    if (1 & e && ye(lN, 5), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.popover = r)
                    }
                },
                inputs: {placement: "placement", text: "text"},
                features: [R, nt],
                decls: 6,
                vars: 2,
                consts: [["type", "button", "tr-tip", "", "triggers", "mouseenter:mouseleave", "container", "portal", 1, "tr-tip-btn", 3, "placement", "trPopover", "click"], ["popover", "trPopover"], ["portal", ""], ["popoverContent", ""], [3, "innerHTML"]],
                template: function (e, i) {
                    if (1 & e && (S(0, "button", 0, 1), ce("click", function (o) {
                        return i.stopPropagation(o)
                    }), E(), k(2, "div", null, 2), O(4, cN, 1, 1, "ng-template", null, 3, ft)), 2 & e) {
                        const r = Me(5);
                        v("placement", i.placement)("trPopover", r)
                    }
                },
                dependencies: [kk, aN],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}[_nghost-%COMP%]{position:relative;width:var(--tooltip-width);min-width:var(--tooltip-width);height:var(--tooltip-height);display:inline-block;vertical-align:top;pointer-events:auto}.tr-tip-btn[_ngcontent-%COMP%]{margin:0;vertical-align:top;display:block;padding:0}']
            }), t
        })();

        function uN(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "div", 15)(1, "ngx-slider", 16), ce("userChange", function (r) {
                    return Ke(e), Ze(P(2).onSliderMove(r))
                }), E()()
            }
            if (2 & t) {
                const e = P(2);
                v("formGroup", e.form), _(1), we("c-disabled", "error" === e.status), v("value", e.form.get("LoanPeriodMonthly").value)("options", e.slider.options)
            }
        }

        function dN(t, n) {
            if (1 & t && (S(0, "div", 17)(1, "div", 4)(2, "div", 5), k(3, "c-control-label", 6), E(), S(4, "div", 7), k(5, "tr-popover-tip", 18), E()(), S(6, "div", 9), Ie(7), mo(8, "number"), E()()), 2 & t) {
                const e = P(2);
                _(3), v("label", "\u041f\u0440\u043e\u0446\u0435\u043d\u0442\u043d\u0430\u044f \u0441\u0442\u0430\u0432\u043a\u0430"), _(4), Zt(" ", hu(8, 2, e.LoanRate.Value.replace(",", "."), ".1-1"), "% ")
            }
        }

        const hN = function () {
            return {
                "=0": "# \u043c\u0435\u0441\u044f\u0446\u0435\u0432",
                one: "# \u043c\u0435\u0441\u044f\u0446",
                few: "# \u043c\u0435\u0441\u044f\u0446\u0435\u0432",
                many: "# \u043c\u0435\u0441\u044f\u0446\u0435\u0432"
            }
        };

        function fN(t, n) {
            if (1 & t && (S(0, "div", 17)(1, "div", 4)(2, "div", 5), k(3, "c-control-label", 6), E()(), S(4, "div", 9), Ie(5), mo(6, "i18nPlural"), E()()), 2 & t) {
                const e = P(2);
                _(3), v("label", "\u0421\u0440\u043e\u043a \u043a\u0440\u0435\u0434\u0438\u0442\u0430"), _(2), Zt(" ", hu(6, 2, e.form.get("LoanPeriodMonthly").value, cu(5, hN)), " ")
            }
        }

        function pN(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "div")(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5), k(5, "c-control-label", 6), E(), S(6, "div", 7), k(7, "tr-popover-tip", 8), E()(), S(8, "div", 9), Ie(9), mo(10, "currency"), E(), O(11, uN, 2, 5, "div", 10), E(), O(12, dN, 9, 5, "div", 11), O(13, fN, 7, 6, "div", 11), S(14, "div", 12)(15, "div", 4)(16, "div", 5), k(17, "c-control-label", 6), E()(), S(18, "div", 9), Ie(19), mo(20, "currency"), E()()(), S(21, "div", 13)(22, "c-button", 14), ce("click", function () {
                    return Ke(e), Ze(P().submit())
                }), Ie(23), E()()()
            }
            if (2 & t) {
                const e = P();
                _(5), v("label", "\u0415\u0436\u0435\u043c\u0435\u0441\u044f\u0447\u043d\u044b\u0439 \u043f\u043b\u0430\u0442\u0451\u0436"), _(4), Zt(" ", fu(10, 11, e.calculationResult.payMonth, "RUB", "symbol", ".0-0"), " "), _(2), v("ngIf", e.slider && e.form.get("LoanPeriodMonthly")), _(1), v("ngIf", e.LoanRate && (null == e.LoanRate ? null : e.LoanRate.Value)), _(1), v("ngIf", e.form.get("LoanPeriodMonthly")), _(4), v("label", "\u0421\u0443\u043c\u043c\u0430 \u043a\u0440\u0435\u0434\u0438\u0442\u0430"), _(2), Zt(" ", fu(20, 16, e.calculationResult.loanAmount, "RUB", "symbol", ".0-0"), " "), _(3), we("is-disabled", "sending" === e.status), v("loading", "sending" === e.status), _(1), Zt(" ", "sending" === e.status ? "\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c \u0437\u0430\u044f\u0432\u043a\u0443" : "\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c", " ")
            }
        }

        function gN(t, n) {
            1 & t && (S(0, "div", 19), k(1, "div", 20), E(), S(2, "div", 19), k(3, "div", 21)(4, "div", 22)(5, "div", 21)(6, "div", 22)(7, "div", 22), E(), S(8, "div", 19), k(9, "div", 21)(10, "div", 22)(11, "div", 21), E(), S(12, "div", 19), k(13, "div", 22), E())
        }

        const mN = function () {
            return ["success", "error", "sending"]
        };
        let vN = (() => {
            class t extends $n {
                constructor(e, i) {
                    super(), this.creditService = e, this.productService = i, this.status = Xe.pending, this.payMonthIcon = be.getSetting("", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto consectetur consequuntur, cupiditate dolores eum maxime mollitia, necessitatibus nemo nisi quidem quod reiciendis saepe sunt, temporibus velit voluptatum. Dolore, sunt?"), this.percentFromIcon = be.getSetting("", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci architecto consectetur consequuntur, cupiditate dolores eum maxime mollitia, necessitatibus nemo nisi quidem quod reiciendis saepe sunt, temporibus velit voluptatum. Dolore, sunt?")
                }

                ngOnInit() {
                    console.debug("C-Nocode: CalculationResultComponent - ngOnInit"), this.creditService.status$.subscribe(e => {
                        this.status = e;
                        const i = this.getParameter(this.product, "LoanPeriodMonthly");
                        i && (this.slider = this.initSlider(i))
                    }), this.creditService.calculateResult$.subscribe(e => this.calculationResult = e), this.productService.product.pipe(Qe(this.destroy$), mt(e => {
                        console.debug("C-Nocode: CalculationResultComponent - productService.product"), this.product = e;
                        const i = this.getParameter(e, "LoanRate");
                        i && (i.Value = i.Value.replace(",", "."), this.LoanRate = i);
                        const r = this.getParameter(e, "LoanPeriodMonthly");
                        r && (this.slider = this.initSlider(r))
                    }), Ai(e => this.catchError(e))).subscribe()
                }

                onSliderMove(e) {
                    this.form.get("LoanPeriodMonthly").setValue(e.value)
                }

                submit() {
                    this.creditService.status$.next(this.status === Xe.sending ? Xe.success : Xe.sending)
                }

                getParameter(e, i) {
                    return e.ProductParametersArray.find(r => r.Code === i)
                }

                initSlider(e) {
                    return {
                        value: this.slider?.value ? this.slider.value : Number(e.Value ? e.Value : e.ValueMin),
                        options: {
                            floor: e.ValueMin,
                            ceil: e.ValueMax,
                            disabled: this.status === Xe.sending,
                            animate: !1,
                            hidePointerLabels: !0,
                            showSelectionBar: !0,
                            hideLimitLabels: !0
                        }
                    }
                }

                catchError(e) {
                    return console.error("[CalculationResultComponent] \u041e\u0448\u0438\u0431\u043a\u0430:", e), this.creditService.status$.next(Xe.error), Cr(null)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Xa), g(zd))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["c-calculation-result"]],
                inputs: {form: "form"},
                features: [R],
                decls: 3,
                vars: 3,
                consts: [[4, "ngIf", "ngIfElse"], ["skeleton", ""], [1, "c-result-items"], [1, "c-result-item", "c-block", "c-total"], [1, "c-result-label", "c-form-control-container__label-container"], [1, "c-form-control-container__label"], [3, "label"], [1, "c-control-message-icon-wrap"], ["text", "\u0421\u0443\u043c\u043c\u0430, \u043a\u043e\u0442\u043e\u0440\u0443\u044e \u0437\u0430\u0435\u043c\u0449\u0438\u043a \u043f\u043e \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u0443 \u0432\u043d\u043e\u0441\u0438\u0442 \u043d\u0430 \u0441\u0447\u0435\u0442 \u0434\u043b\u044f \u043f\u043e\u0433\u0430\u0448\u0435\u043d\u0438\u044f \u0434\u043e\u043b\u0433\u0430 \u0432 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0439 \u0441\u0440\u043e\u043a.", "placement", "bottom bottom-left bottom-right"], [1, "c-result-value"], ["class", "c-combo-control-grid c-with-slider", 3, "formGroup", 4, "ngIf"], ["class", "c-result-item", 4, "ngIf"], [1, "c-result-item", "c-block"], [1, "c-footer"], ["type", "primary", 3, "loading", "click"], [1, "c-combo-control-grid", "c-with-slider", 3, "formGroup"], [1, "c-combo-control-slider", 3, "value", "options", "userChange"], [1, "c-result-item"], ["text", "\u0421\u0443\u043c\u043c\u0430, \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u0430\u044f \u0432 \u0432\u044b\u0440\u0430\u0436\u0435\u043d\u0438\u0438 \u043a \u0441\u0443\u043c\u043c\u0435 \u043a\u0440\u0435\u0434\u0438\u0442\u0430, \u043a\u043e\u0442\u043e\u0440\u0443\u044e \u043f\u043b\u0430\u0442\u0438\u0442 \u043f\u043e\u043b\u0443\u0447\u0430\u0442\u0435\u043b\u044c \u043a\u0440\u0435\u0434\u0438\u0442\u0430 \u0437\u0430 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0438\u043c \u0432 \u0440\u0430\u0441\u0447\u0451\u0442\u0435 \u043d\u0430 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0451\u043d\u043d\u044b\u0439 \u043f\u0435\u0440\u0438\u043e\u0434.", "placement", "bottom"], [1, "c-skeleton-group"], [1, "c-skeleton-head"], [1, "c-skeleton-line", "c-skeleton-line-wide"], [1, "c-skeleton-line"]],
                template: function (e, i) {
                    if (1 & e && (O(0, pN, 24, 21, "div", 0), O(1, gN, 14, 0, "ng-template", null, 1, ft)), 2 & e) {
                        const r = Me(2);
                        v("ngIf", -1 !== cu(2, mN).indexOf(i.status) && i.calculationResult)("ngIfElse", r)
                    }
                },
                dependencies: [ot, oi, Mn, Qa, xk, Mr, Tr, y_, b_, v_],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}.c-result-item[_ngcontent-%COMP%]{margin-bottom:16px}.c-result-item.c-block[_ngcontent-%COMP%]{width:100%}.c-combo-control-grid[_ngcontent-%COMP%]{min-height:16px;max-width:190px}.c-result-label[_ngcontent-%COMP%]{margin-bottom:8px}.c-result-value[_ngcontent-%COMP%]{font-weight:400;letter-spacing:0;color:var(--heading-color);font-family:var(--make-ff_h3);font-size:var(--make-fs-h3);line-height:var(--make-lh-h3)}.c-total[_ngcontent-%COMP%]   .c-result-value[_ngcontent-%COMP%]{font-weight:400;letter-spacing:0;color:var(--heading-color);font-family:var(--make-ff_h2);font-size:var(--make-fs-h2);line-height:var(--make-lh-h2)}.c-footer[_ngcontent-%COMP%]{margin-top:32px}.c-skeleton-group[_ngcontent-%COMP%]{margin-bottom:24px}.c-skeleton-group[_ngcontent-%COMP%]:last-child{margin-bottom:0;margin-top:48px}.c-skeleton-head[_ngcontent-%COMP%]{width:166px;height:23px;background-color:var(--skeleton-primary);opacity:1;border-radius:var(--skeleton-border-radius);pointer-events:none;animation:_ngcontent-%COMP%_wave 1.6s infinite}.c-result-item[_ngcontent-%COMP%]   .c-skeleton-head[_ngcontent-%COMP%]{width:166px;height:30px;background-color:var(--skeleton-primary);opacity:1;border-radius:var(--skeleton-border-radius);pointer-events:none;animation:_ngcontent-%COMP%_wave 1.6s infinite}.c-skeleton-line[_ngcontent-%COMP%]{width:166px;height:16px;background-color:var(--skeleton-primary);opacity:1;border-radius:var(--skeleton-border-radius);pointer-events:none;animation:_ngcontent-%COMP%_wave 1.6s infinite;margin-bottom:16px}.c-result-item[_ngcontent-%COMP%]   .c-skeleton-line[_ngcontent-%COMP%]{width:166px;height:24px;background-color:var(--skeleton-primary);opacity:1;border-radius:var(--skeleton-border-radius);pointer-events:none;animation:_ngcontent-%COMP%_wave 1.6s infinite}.c-skeleton-line.c-skeleton-line-wide[_ngcontent-%COMP%]{width:100%}.c-skeleton-line[_ngcontent-%COMP%]:last-child{margin-bottom:0}@media (max-width: 1023px){.c-combo-control-grid[_ngcontent-%COMP%]{max-width:100%}.c-footer[_ngcontent-%COMP%]   c-button[_ngcontent-%COMP%]{width:100%}}']
            }), t
        })();
        const _N = ["start"], yN = ["end"];
        let bN = (() => {
            class t extends $n {
                get type() {
                    return this._type
                }

                set type(e) {
                    const i = e || this.defaultType;
                    i !== this._type && (this._type && this.elementRef.nativeElement.classList.remove(`tr-type-${this._type}`), i && this.elementRef.nativeElement.classList.add(`tr-type-${i}`), this._type = i)
                }

                constructor(e) {
                    super(), this.elementRef = e, this.counter = null, this.hasHoverStates = !0, this.hasValidation = !0, this.hasArrow = !1, this.focus = !1, this.active = !1, this.defaultType = "base"
                }

                get validControl() {
                    return !!this.control && this.hasValidation && this.control.valid && null != this.control.value && "" !== this.control.value
                }

                get hasLabel() {
                    return function Dk(t) {
                        return !(!t || !t.nativeElement.childNodes.length) && Array.prototype.slice.call(t.nativeElement.childNodes).some(e => e.nodeType === Node.ELEMENT_NODE || e.nodeType === Node.TEXT_NODE)
                    }(this.labelEl)
                }

                get noLabel() {
                    return !this.hasLabel
                }

                get hasHoverStatesClass() {
                    return this.hasHoverStates
                }

                get hasSelect() {
                    return this.input && "SELECT" === this.input.element.nativeElement.tagName
                }

                get isActive() {
                    return this.active
                }

                hasChilds(e) {
                    return e.nativeElement.childNodes.length
                }

                ngAfterContentInit() {
                    this.hasSelect && this.hasLabel && this.validControl && (this.floatedLabel = !0)
                }

                ngOnInit() {
                    this.input && (this.hasLabel && this.input.floatedLabelChange.pipe(Qe(this.destroy$)).subscribe(e => this.floatedLabel = e), this.hasHoverStates && this.input.focusChange.pipe(Qe(this.destroy$)).subscribe(e => this.focus = e)), this.setType()
                }

                ngOnChanges(e) {
                    this.setType()
                }

                setType() {
                    this.elementRef.nativeElement.classList.add("tr-type-" + this.type)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he))
            }, t.\u0275dir = I({
                type: t,
                viewQuery: function (e, i) {
                    if (1 & e && (ye(_N, 5), ye(yN, 5)), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.startRef = r.first), Z(r = Q()) && (i.endRef = r.first)
                    }
                },
                hostVars: 6,
                hostBindings: function (e, i) {
                    2 & e && we("tr-has-label", i.hasLabel)("tr-no-label", i.noLabel)("tr-has-select", i.hasSelect)
                },
                inputs: {
                    counter: "counter",
                    hasHoverStates: "hasHoverStates",
                    hasValidation: "hasValidation",
                    hasArrow: "hasArrow",
                    focus: "focus",
                    active: "active",
                    type: "type"
                },
                features: [R, nt]
            }), t
        })(), Wd = (() => {
            class t {
                constructor(e) {
                    this.element = e, this.floatedLabelChange = new G(!0), this.focusChange = new G(!0), this.zeroValueAllowed = !1
                }

                ngAfterViewInit() {
                    this.focused = this.element.nativeElement === document.activeElement;
                    try {
                        this.element.nativeElement.value && (this.floatedLabel = this.focused || this.element.nativeElement.value.length > 0, this.floatedLabel && this.floatedLabelChange.emit(!0))
                    } catch (e) {
                        console.error("Element", this.element.nativeElement, "have error:\n", e)
                    }
                }

                onFocus() {
                    this.floatedLabelChange.emit(!0), this.floatedLabel = !0, this.focused = !0, this.focusChange.emit(!0)
                }

                onBlur() {
                    this.focused = !1, this.focusChange.emit(!1), "" === this.element.nativeElement.value && (this.floatedLabel = !1, this.floatedLabelChange.emit(!1))
                }

                onChange() {
                    this.changeHandler(this.element.nativeElement.value)
                }

                onNgModelChange(e) {
                    this.changeHandler(e)
                }

                up() {
                    this.floatedLabel = !0, this.floatedLabelChange.emit(!0)
                }

                down() {
                    this.floatedLabel = !1, this.floatedLabelChange.emit(!1)
                }

                changeHandler(e) {
                    if (this.focused) return this.floatedLabel = !0, void this.floatedLabelChange.emit(!0);
                    const i = !(!this.zeroValueAllowed || "number" != typeof e) || Boolean(e);
                    this.floatedLabel !== i && (this.floatedLabel = i, this.floatedLabelChange.emit(i))
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(he))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", 8, "tr-input"], ["tr-input-number-format"], ["tr-input-phone"], ["tr-input-float-format"]],
                hostBindings: function (e, i) {
                    1 & e && ce("focus", function () {
                        return i.onFocus()
                    })("blur", function () {
                        return i.onBlur()
                    })("change", function () {
                        return i.onChange()
                    })("ngModelChange", function (o) {
                        return i.onNgModelChange(o)
                    })("up", function () {
                        return i.up()
                    })("down", function () {
                        return i.down()
                    })
                },
                inputs: {zeroValueAllowed: "zeroValueAllowed"},
                outputs: {floatedLabelChange: "floatedLabelChange", focusChange: "focusChange"}
            }), t
        })();
        const wN = ["formattedValue"], CN = ["label"];

        function DN(t, n) {
            if (1 & t && (S(0, "span", 12), Ie(1), E()), 2 & t) {
                const e = P();
                _(1), Zt(" ", e.counter, " ")
            }
        }

        function EN(t, n) {
            1 & t && (S(0, "span", 14), Ui(), k(1, "svg", 15), E())
        }

        function SN(t, n) {
            if (1 & t && (Te(0), O(1, EN, 2, 0, "span", 13), Oe()), 2 & t) {
                const e = P(), i = Me(17);
                _(1), v("ngIf", e.validControl)("ngIfElse", i)
            }
        }

        function xN(t, n) {
            1 & t && Vt(0, 5)
        }

        const MN = [[["start-slot"]], [["input"]], [["label"]], [["formatted-value"]], [["value"]], [["end-slot"]]],
            TN = ["start-slot", "input", "label", "formatted-value", "value", "end-slot"];
        let jo = (() => {
            class t extends bN {
                constructor() {
                    super(...arguments), this.disabled = !1, this.floatedLabel = !1, this.error = !1
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["tr-control"], ["", "tr-control", ""]],
                contentQueries: function (e, i, r) {
                    if (1 & e && (ht(r, Wd, 7), ht(r, jn, 7)), 2 & e) {
                        let o;
                        Z(o = Q()) && (i.input = o.first), Z(o = Q()) && (i.control = o.first)
                    }
                },
                viewQuery: function (e, i) {
                    if (1 & e && (ye(wN, 7), ye(CN, 7)), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.formattedValueEl = r.first), Z(r = Q()) && (i.labelEl = r.first)
                    }
                },
                hostVars: 10,
                hostBindings: function (e, i) {
                    2 & e && we("c-disabled", i.disabled)("c-floated-label", i.floatedLabel)("c-error", i.error)("c-focused", i.focusStateClass)("c-has-formatted-value", i.hasFormattedValue)
                },
                inputs: {disabled: "disabled", floatedLabel: "floatedLabel", error: "error"},
                features: [R],
                ngContentSelectors: TN,
                decls: 18,
                vars: 3,
                consts: [[1, "c-slot", "c-start-slot"], [1, "c-input-slot"], [1, "c-label"], ["label", ""], ["class", "c-counter", 4, "ngIf"], [1, "c-formatted-value"], ["formattedValue", ""], [1, "c-value"], [1, "c-slot", "c-end-slot"], ["end", ""], [4, "ngIf", "ngIfElse"], ["endSlotTemplate", ""], [1, "c-counter"], ["class", "c-valid-icon c-icon c-icon-size-default", 4, "ngIf", "ngIfElse"], [1, "c-valid-icon", "c-icon", "c-icon-size-default"], ["icon", "check", "width", "30", "height", "30", 1, "c-svg-icon", "c-stroke-accent"]],
                template: function (e, i) {
                    if (1 & e && (Yn(MN), S(0, "div", 0), Vt(1), E(), S(2, "div", 1), Vt(3, 1), E(), S(4, "div", 2, 3), Vt(6, 2), O(7, DN, 2, 1, "span", 4), E(), S(8, "div", 5, 6), Vt(10, 3), E(), S(11, "div", 7), Vt(12, 4), E(), S(13, "div", 8, 9), O(15, SN, 2, 2, "ng-container", 10), O(16, xN, 1, 0, "ng-template", null, 11, ft), E()), 2 & e) {
                        const r = Me(17);
                        _(7), v("ngIf", null !== i.counter), _(8), v("ngIf", i.hasValidation && i.control && !i.hasArrow)("ngIfElse", r)
                    }
                },
                dependencies: [ot],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}[_nghost-%COMP%]{display:block;position:relative}[_nghost-%COMP%]:hover   .form-control__input[_ngcontent-%COMP%]{box-shadow:0 0 0 1px var(--input-box-shadow-color-hover)}[_nghost-%COMP%]   .c-slot[_ngcontent-%COMP%]{position:absolute;height:40px;width:40px;display:flex;align-items:center;justify-content:center}[_nghost-%COMP%]   .c-end-slot[_ngcontent-%COMP%]{bottom:0;right:0;pointer-events:none}[_nghost-%COMP%]   .c-input-slot[_ngcontent-%COMP%]{position:relative}[_nghost-%COMP%]   .c-input-slot[_ngcontent-%COMP%]     .ngx-slider{position:absolute;bottom:-8px;left:0;width:100%}.c-has-end-slot[_nghost-%COMP%]   .c-end-slot[_ngcontent-%COMP%]{pointer-events:auto}.c-has-label[_nghost-%COMP%]{position:relative;padding-top:24px}.c-has-label[_nghost-%COMP%]   .c-label[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}']
            }), t
        })(), Uo = (() => {
            class t extends $n {
                constructor(e) {
                    super(), this.creditService = e, this.controlSize = "m", this.disabled = !1
                }

                ngOnInit() {
                    this.addControl(), this.disable(), this.createValueObservable()
                }

                addControl() {
                    this.field = new Oi(this.initValue(), this.getBaseValidatorFnsField()), this.form.addControl(this.fieldSettings.Code, this.field)
                }

                createValueObservable() {
                    this.field.valueChanges.pipe(Qe(this.destroy$), db(250)).subscribe(e => {
                        console.debug("C-Nocode: BaseFieldComponent - creditService recalculate"), this.creditService.recalculate(this.form.getRawValue()).pipe(Qe(this.destroy$), tn(i => !!i)).subscribe(i => {
                            this.creditService.status$.next(Xe.success), this.creditService.calculateResult$.next(i)
                        })
                    })
                }

                getBaseValidatorFnsField() {
                    return []
                }

                getConstraintField(e) {
                    return []
                }

                setLabelStars(e) {
                    "required" === e.type && (this.fieldSettings.Name += " *")
                }

                initValue() {
                    return this.fieldSettings.Value || this.fieldSettings.ValueMin || null
                }

                disable() {
                    this.fieldSettings.ValueMin && this.fieldSettings.ValueMax && this.fieldSettings.ValueMin === this.fieldSettings.ValueMax && (this.field.disable(), this.disabled = !0)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Xa))
            }, t.\u0275dir = I({
                type: t,
                inputs: {form: "form", fieldSettings: "fieldSettings", controlSize: "controlSize"},
                features: [R]
            }), t
        })();
        const ON = ["inputElement"];
        let Qb = (() => {
            class t {
                constructor(e, i) {
                    this.renderer = e, this.element = i, this.focus = new G, this.blur = new G, this.options = {maximumFractionDigits: 0}, this.onChange = () => {
                    }, this.onTouched = () => {
                    }, this.renderer.setProperty(this.element.nativeElement, "value", "")
                }

                registerOnChange(e) {
                    this.onChange = e
                }

                registerOnTouched(e) {
                    this.onTouched = e
                }

                setDisabledState(e) {
                    this.disabled = e
                }

                writeValue(e) {
                    let i;
                    e || 0 === e ? (i = new Event("up"), this.updateValue(e)) : (this.updateValue(""), i = new Event("down")), this.element.nativeElement.dispatchEvent(i)
                }

                changeValue(e) {
                    e = e.replace(/\D/g, ""), this.renderer.setProperty(this.element.nativeElement, "value", e);
                    const i = this.input.nativeElement;
                    e && (Number(e) > Number(this.max) && (e = this.max.toString()), Number(e) < Number(this.min) && (e = this.min.toString()), i.value = e), this.onChange(e)
                }

                updateValue(e) {
                    const i = this.input.nativeElement;
                    i.value = e, this.renderer.setProperty(this.element.nativeElement, "value", i.value)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Ot), g(he))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["tr-input-number-format"]],
                viewQuery: function (e, i) {
                    if (1 & e && ye(ON, 7), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.input = r.first)
                    }
                },
                inputs: {
                    controlSize: "controlSize",
                    id: "id",
                    min: "min",
                    max: "max",
                    step: "step",
                    disabled: "disabled",
                    options: "options",
                    additionalClass: "additionalClass",
                    placeholder: "placeholder",
                    autocomplete: "autocomplete"
                },
                outputs: {focus: "focus", blur: "blur"},
                features: [ue([{provide: Ct, useExisting: ie(() => t), multi: !0}])],
                decls: 2,
                vars: 10,
                consts: [["type", "number", 3, "ngClass", "id", "disabled", "placeholder", "autocomplete", "min", "max", "focus", "blur", "input"], ["inputElement", ""]],
                template: function (e, i) {
                    if (1 & e) {
                        const r = Kt();
                        S(0, "input", 0, 1), ce("focus", function (s) {
                            return i.focus.emit(s)
                        })("blur", function (s) {
                            return i.blur.emit(s)
                        })("input", function () {
                            Ke(r);
                            const s = Me(1);
                            return Ze(i.changeValue(s.value))
                        }), E()
                    }
                    2 & e && (Ys("c-input c-input_size-", i.controlSize, ""), v("ngClass", i.additionalClass)("id", i.id)("disabled", i.disabled)("placeholder", i.placeholder || "")("autocomplete", i.autocomplete || "off")("min", i.min)("max", i.max))
                },
                dependencies: [Jn],
                encapsulation: 2
            }), t
        })();

        function IN(t, n) {
            if (1 & t && (S(0, "div", 9), k(1, "tr-popover-tip", 10), E()), 2 & t) {
                const e = P();
                _(1), v("text", (null == e.fieldSettings.ExternalOptions ? null : e.fieldSettings.ExternalOptions.Description) || "")("placement", "bottom")
            }
        }

        function AN(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "ngx-slider", 11), ce("userChange", function (r) {
                    return Ke(e), Ze(P().onSliderMove(r))
                }), E()
            }
            if (2 & t) {
                const e = P();
                v("value", e.field.value)("options", e.slider.options)
            }
        }

        let Xb = (() => {
            class t extends Uo {
                constructor() {
                    super(...arguments), this.step = 1
                }

                ngOnInit() {
                    super.ngOnInit(), this.initSlider(this.fieldSettings)
                }

                addControl() {
                    this.field = new Oi(Number(this.initValue()), this.getBaseValidatorFnsField()), this.form.addControl(this.fieldSettings.Code, this.field)
                }

                onSliderMove(e) {
                    this.form.get(this.fieldSettings.Code).setValue(e.value)
                }

                initSlider(e) {
                    e.ValueMin === e.ValueMax && (e.Value = e.ValueMin.toString()), this.slider = {
                        value: this.slider?.value ? this.slider.value : Number(e.Value ? e.Value : e.ValueMin),
                        options: {
                            floor: Number(e.ValueMin),
                            ceil: Number(e.ValueMax),
                            step: this.step,
                            animate: !1,
                            disabled: this.disabled,
                            hidePointerLabels: !0,
                            showSelectionBar: !0,
                            hideLimitLabels: !0
                        }
                    }
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-component"]],
                features: [R],
                decls: 9,
                vars: 15,
                consts: [[1, "c-form-control-container__label-container"], [1, "c-form-control-container__label"], [3, "label", "controlId"], ["class", "c-control-message-icon-wrap", 4, "ngIf"], [1, "c-white", 3, "hasArrow", "formGroup", "error"], ["ngProjectAs", "input", 5, ["input"]], [3, "id", "controlSize", "formControlName", "additionalClass", "placeholder", "min", "max", "step"], ["class", "c-combo-control-slider", 3, "value", "options", "userChange", 4, "ngIf"], ["ngProjectAs", "end-slot", 5, ["end-slot"]], [1, "c-control-message-icon-wrap"], [3, "text", "placement"], [1, "c-combo-control-slider", 3, "value", "options", "userChange"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0)(1, "div", 1), k(2, "c-control-label", 2), E(), O(3, IN, 2, 2, "div", 3), E(), S(4, "tr-control", 4), Te(5, 5), k(6, "tr-input-number-format", 6), O(7, AN, 1, 2, "ngx-slider", 7), Oe(), Yt(8, 8), E()), 2 & e && (_(2), v("label", i.fieldSettings.Name)("controlId", i.fieldSettings.Code), _(1), v("ngIf", null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Description), _(1), v("hasArrow", !0)("formGroup", i.form)("error", i.field.invalid && (i.field.dirty || i.field.touched)), _(2), v("id", i.fieldSettings.Code)("controlSize", i.controlSize)("formControlName", i.fieldSettings.Code)("additionalClass", i.disabled ? "is-disabled" : "")("placeholder", (null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Placeholder) || "")("min", i.fieldSettings.ValueMin)("max", i.fieldSettings.ValueMax)("step", i.step), _(1), v("ngIf", i.fieldSettings.ValueMax !== i.fieldSettings.ValueMin))
                },
                dependencies: [ot, Mi, oi, Mn, jn, Qa, Wd, jo, Qb, Mr, Tr],
                styles: [".tr-span-require[_ngcontent-%COMP%]{font-size:12px}"]
            }), t
        })(), PN = (() => {
            class t extends Qb {
                constructor() {
                    super(...arguments), this.options = {maximumFractionDigits: 2}
                }

                writeValue(e) {
                    let i;
                    e || 0 === e ? (i = new Event("up"), this.updateValue(e)) : (this.updateValue(""), i = new Event("down")), this.element.nativeElement.dispatchEvent(i)
                }

                changeValue(e) {
                    const i = this.input.nativeElement;
                    if (this.renderer.setProperty(this.element.nativeElement, "value", e), e) {
                        const r = this.max.toString().replace(",", ".");
                        Number(e) > Number(r) && (e = r);
                        const o = this.min.toString().replace(",", ".");
                        Number(e) < Number(o) && (e = o), i.value = e
                    }
                    this.onChange(e)
                }

                updateValue(e) {
                    this.input.nativeElement.value = e, this.renderer.setProperty(this.element.nativeElement, "value", e)
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["tr-input-float-format"]],
                inputs: {options: "options"},
                features: [ue([{provide: Ct, useExisting: ie(() => t), multi: !0}]), R],
                decls: 2,
                vars: 11,
                consts: [["type", "number", 3, "ngClass", "id", "disabled", "placeholder", "autocomplete", "min", "max", "step", "focus", "blur", "input"], ["inputElement", ""]],
                template: function (e, i) {
                    if (1 & e) {
                        const r = Kt();
                        S(0, "input", 0, 1), ce("focus", function (s) {
                            return i.focus.emit(s)
                        })("blur", function (s) {
                            return i.blur.emit(s)
                        })("input", function () {
                            Ke(r);
                            const s = Me(1);
                            return Ze(i.changeValue(s.value))
                        }), E()
                    }
                    2 & e && (Ys("c-input c-input_size-", i.controlSize, ""), v("ngClass", i.additionalClass)("id", i.id)("disabled", i.disabled)("placeholder", i.placeholder || "")("autocomplete", i.autocomplete || "off")("min", i.min)("max", i.max)("step", i.step))
                },
                dependencies: [Jn],
                encapsulation: 2
            }), t
        })();

        function FN(t, n) {
            if (1 & t && (S(0, "div", 9), k(1, "tr-popover-tip", 10), E()), 2 & t) {
                const e = P();
                _(1), v("text", (null == e.fieldSettings.ExternalOptions ? null : e.fieldSettings.ExternalOptions.Description) || "")("placement", "bottom")
            }
        }

        function kN(t, n) {
            if (1 & t) {
                const e = Kt();
                S(0, "ngx-slider", 11), ce("userChange", function (r) {
                    return Ke(e), Ze(P().onSliderMove(r))
                }), E()
            }
            if (2 & t) {
                const e = P();
                v("value", e.field.value)("options", e.slider.options)
            }
        }

        let NN = (() => {
            class t extends Xb {
                constructor() {
                    super(...arguments), this.step = .01
                }

                addControl() {
                    this.field = new Oi(Number(this.initValue().toString().replace(",", ".")), this.getBaseValidatorFnsField()), this.form.addControl(this.fieldSettings.Code, this.field)
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-component"]],
                features: [R],
                decls: 9,
                vars: 15,
                consts: [[1, "c-form-control-container__label-container"], [1, "c-form-control-container__label"], [3, "label", "controlId"], ["class", "c-control-message-icon-wrap", 4, "ngIf"], [1, "tr-white", 3, "hasArrow", "formGroup", "error"], ["ngProjectAs", "input", 5, ["input"]], [3, "id", "controlSize", "formControlName", "additionalClass", "placeholder", "min", "max", "step"], ["class", "c-combo-control-slider", 3, "value", "options", "userChange", 4, "ngIf"], ["ngProjectAs", "end-slot", 5, ["end-slot"]], [1, "c-control-message-icon-wrap"], [3, "text", "placement"], [1, "c-combo-control-slider", 3, "value", "options", "userChange"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0)(1, "div", 1), k(2, "c-control-label", 2), E(), O(3, FN, 2, 2, "div", 3), E(), S(4, "tr-control", 4), Te(5, 5), k(6, "tr-input-float-format", 6), O(7, kN, 1, 2, "ngx-slider", 7), Oe(), Yt(8, 8), E()), 2 & e && (_(2), v("label", i.fieldSettings.Name)("controlId", i.fieldSettings.Code), _(1), v("ngIf", null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Description), _(1), v("hasArrow", !0)("formGroup", i.form)("error", i.field.invalid && (i.field.dirty || i.field.touched)), _(2), v("id", i.fieldSettings.Code)("controlSize", i.controlSize)("formControlName", i.fieldSettings.Code)("additionalClass", i.disabled ? "is-disabled" : "")("placeholder", (null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Placeholder) || "")("min", i.fieldSettings.ValueMin)("max", i.fieldSettings.ValueMax)("step", i.step), _(1), v("ngIf", i.fieldSettings.ValueMax !== i.fieldSettings.ValueMin))
                },
                dependencies: [ot, Mi, oi, Mn, jn, Qa, Wd, jo, PN, Mr, Tr],
                styles: [".tr-span-require[_ngcontent-%COMP%]{font-size:12px}"]
            }), t
        })();
        const LN = ["nativeCheckbox"];
        let RN = (() => {
            class t extends $n {
                get fill() {
                    return this._fill
                }

                set fill(e) {
                    const i = e || this.defaultFill;
                    i !== this._fill && (this._fill && this.elementRef.nativeElement.classList.remove(`tr-fill-${this._fill}`), i && this.elementRef.nativeElement.classList.add(`tr-fill-${i}`), this._fill = i)
                }

                constructor(e, i) {
                    super(), this.controlContainer = e, this.elementRef = i, this.defaultFill = "white", this.id = "", this.autofocus = null, this.view = "default", this.change = new G, this._disabled = !1, this.checked = !1, this.setDefaults()
                }

                setDefaults() {
                    this.fill = this.defaultFill
                }

                toggle(e) {
                    e.stopPropagation(), !this._disabled && (this.writeValue(!this.checked), this.onChangeCallback && this.onChangeCallback(this.checked), this.change.emit(this.checked))
                }

                writeValue(e) {
                    this.checked = e, this.nativeCheckboxRef?.nativeElement && (this.nativeCheckboxRef.nativeElement.checked = e)
                }

                registerOnChange(e) {
                    this.onChangeCallback = e
                }

                registerOnTouched(e) {
                    this.onTouchedCallback = e
                }

                validate(e) {
                    return null
                }

                ngOnInit() {
                    this.controlContainer ? this.formControlName ? (this.control = this.controlContainer.control.get(this.formControlName), this.control && this.control.valueChanges.subscribe(e => {
                        this.writeValue(e)
                    })) : console.warn("Missing FormControlName directive from host element of the component") : console.warn("Can't find parent FormGroup directive")
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(pt, 13), g(he))
            }, t.\u0275dir = I({
                type: t,
                viewQuery: function (e, i) {
                    if (1 & e && ye(LN, 7), 2 & e) {
                        let r;
                        Z(r = Q()) && (i.nativeCheckboxRef = r.first)
                    }
                },
                hostVars: 6,
                hostBindings: function (e, i) {
                    2 & e && we("c-switcher", i.view)("is-disabled", i._disabled)("is-checked", i.checked)
                },
                inputs: {
                    id: "id",
                    value: "value",
                    autofocus: "autofocus",
                    formControlName: "formControlName",
                    view: "view",
                    _disabled: "_disabled",
                    checked: "checked",
                    fill: "fill"
                },
                outputs: {change: "change"},
                features: [R]
            }), t
        })();

        function VN(t, n) {
            1 & t && (Te(0), S(1, "div", 4)(2, "div", 5), Ui(), S(3, "svg", 6), k(4, "path", 7), E(), Nl(), k(5, "div", 8), E()(), Oe())
        }

        function BN(t, n) {
            if (1 & t && (S(0, "div", 9), Ui(), S(1, "svg", 10), k(2, "path", 7), E()(), Nl(), k(3, "label", 11)), 2 & t) {
                const e = P();
                _(3), v("for", e.id)
            }
        }

        let HN = (() => {
            class t extends RN {
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["c-checkbox"]],
                features: [ue([{provide: Ct, useExisting: ie(() => t), multi: !0}, {
                    provide: st,
                    useExisting: ie(() => t),
                    multi: !0
                }]), R],
                decls: 5,
                vars: 6,
                consts: [["type", "checkbox", 1, "c-native-checkbox", 3, "id", "checked", "value", "change"], ["nativeCheckbox", ""], [4, "ngIf", "ngIfElse"], ["defaultViewTemplate", ""], [1, "toggle", "toggle_m"], [1, "toggle__container"], ["width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "toggle__svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.7071 4.70711L7 12.4142L2.29289 7.70711L3.70711 6.29289L7 9.58579L13.2929 3.29289L14.7071 4.70711Z", "fill", "white"], [1, "toggle__circle"], [1, "c-checkbox-control__input"], ["width", "16", "height", "16", "viewBox", "0 0 16 16", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "c-checkbox-control__svg"], [1, "c-overlay", 3, "for"]],
                template: function (e, i) {
                    if (1 & e && (S(0, "input", 0, 1), ce("change", function (o) {
                        return i.toggle(o)
                    }), E(), O(2, VN, 6, 0, "ng-container", 2), O(3, BN, 4, 1, "ng-template", null, 3, ft)), 2 & e) {
                        const r = Me(4);
                        v("id", i.id)("checked", i.checked)("value", i.value), $e("trAutofocus", i.autofocus), _(2), v("ngIf", "toggle" !== i.view)("ngIfElse", r)
                    }
                },
                dependencies: [ot],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}[_nghost-%COMP%]{display:block;position:relative}input[type=checkbox][_ngcontent-%COMP%]{-webkit-appearance:none;appearance:none;position:absolute;top:0;left:0;opacity:0}.c-checkbox-control__input[_ngcontent-%COMP%]{flex-shrink:0;transition-property:all;transition-duration:.3s;transition-timing-function:ease-in-out;position:relative;display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;border:1px solid var(--color-line-border);background-color:var(--color-global)}.is-checked[_nghost-%COMP%]   .c-checkbox-control__input[_ngcontent-%COMP%]{background-color:var(--checkbox-bg-checked);border-color:var(--checkbox-border-color-checked)}.is-checked[_nghost-%COMP%]   .c-checkbox-control__input[_ngcontent-%COMP%]   .c-checkbox-control__svg[_ngcontent-%COMP%]{opacity:1}.is-checked.is-disabled[_nghost-%COMP%]   .c-checkbox-control__input[_ngcontent-%COMP%]{opacity:.5}.is-disabled[_nghost-%COMP%]:not(.is-checked)   .c-checkbox-control__input[_ngcontent-%COMP%]{background-color:var(--color-bg-disabled);cursor:default}.is-invalid[_nghost-%COMP%]   .c-checkbox-control__input[_ngcontent-%COMP%]{border-color:var(--color-error)}.c-checkbox-control__svg[_ngcontent-%COMP%]{transition-property:opacity;transition-duration:.3s;transition-timing-function:ease-in-out;fill:var(--color-global);width:16px;height:16px;opacity:0}.c-switcher[_nghost-%COMP%]   .toggle[_ngcontent-%COMP%]{transition-property:all;transition-duration:.3s;transition-timing-function:ease-in-out;border-radius:24px;background-color:var(--color-line-border);box-shadow:0 0 0 1px var(--color-line-border);display:flex;align-items:center;overflow:hidden;position:relative;margin-top:2px;cursor:pointer}.c-switcher[_nghost-%COMP%]   .toggle__container[_ngcontent-%COMP%]{display:flex;align-items:center;transition-property:transform;transition-duration:.3s;transition-timing-function:ease-in-out}.c-switcher[_nghost-%COMP%]   .toggle__svg[_ngcontent-%COMP%]{transition-property:opacity;transition-duration:.3s;transition-timing-function:ease-in-out;opacity:0;width:16px;height:16px;fill:var(--color-global)}.c-switcher[_nghost-%COMP%]   .toggle__circle[_ngcontent-%COMP%]{border-radius:50%;background-color:var(--color-global);border:1px solid var(--color-line-border);box-shadow:0 2px 4px rgba(var(--color-text-primary-rgb),.04)}.c-switcher[_nghost-%COMP%]   .toggle_m[_ngcontent-%COMP%]{width:var(--toggle-width-m);min-width:var(--toggle-width-m);height:var(--toggle-height-m)}.c-switcher[_nghost-%COMP%]   .toggle_m[_ngcontent-%COMP%]   .toggle__container[_ngcontent-%COMP%]{transform:translate(var(--toggle-translate-m))}.c-switcher[_nghost-%COMP%]   .toggle_m[_ngcontent-%COMP%]   .toggle__circle[_ngcontent-%COMP%]{width:var(--toggle-circle-width-m);height:var(--toggle-circle-height-m)}.c-switcher.is-checked[_nghost-%COMP%]   .toggle[_ngcontent-%COMP%]{background-color:var(--toggle-bg-checked);box-shadow:var(--color-primary)}.c-switcher.is-checked[_nghost-%COMP%]   .toggle[_ngcontent-%COMP%]   .toggle__circle[_ngcontent-%COMP%]{border-color:var(--toggle-border-checked)}.c-switcher.is-checked[_nghost-%COMP%]   .toggle[_ngcontent-%COMP%]   .toggle__svg[_ngcontent-%COMP%]{opacity:1}.c-switcher.is-checked[_nghost-%COMP%]   .toggle_m[_ngcontent-%COMP%]   .toggle__container[_ngcontent-%COMP%]{transform:translate(var(--toggle-translate-m-checked))}.c-switcher.is-checked.is-disabled[_nghost-%COMP%]   .toggle[_ngcontent-%COMP%]{opacity:.5}.c-switcher.is-disabled[_nghost-%COMP%]:not(.is-checked)   .toggle[_ngcontent-%COMP%]{background-color:var(--color-bg-disabled)}.c-switcher.is-disabled[_nghost-%COMP%]:not(.is-checked)   .toggle[_ngcontent-%COMP%]   .toggle__circle[_ngcontent-%COMP%]{border-color:var(--color-line)}'],
                changeDetection: 0
            }), t
        })();

        function jN(t, n) {
            if (1 & t && (S(0, "div", 4), k(1, "tr-popover-tip", 5), E()), 2 & t) {
                const e = P();
                _(1), v("text", (null == e.fieldSettings.ExternalOptions ? null : e.fieldSettings.ExternalOptions.Description) || "")("placement", "bottom")
            }
        }

        let UN = (() => {
            class t extends Uo {
                addControl() {
                    this.field = new Oi(Boolean(this.initValue()), this.getBaseValidatorFnsField()), this.form.addControl(this.fieldSettings.Code, this.field)
                }

                initValue() {
                    return !1
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-component"]],
                features: [R],
                decls: 4,
                vars: 8,
                consts: [[1, "c-checkbox-control", 3, "formGroup"], ["size", "sm", "value", "false", 1, "c-checkbox-control__input-container", 3, "id", "formControlName", "_disabled", "checked"], [1, "c-checkbox-control__label", 3, "for", "innerHTML"], ["class", "c-control-message-icon-wrap", 4, "ngIf"], [1, "c-control-message-icon-wrap"], [3, "text", "placement"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0), k(1, "c-checkbox", 1)(2, "label", 2), O(3, jN, 2, 2, "div", 3), E()), 2 & e && (v("formGroup", i.form), _(1), v("id", i.fieldSettings.Code)("formControlName", i.fieldSettings.Code)("_disabled", i.disabled)("checked", !1), _(1), v("for", i.fieldSettings.Code)("innerHTML", i.fieldSettings.Name, an), _(1), v("ngIf", null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Description))
                },
                dependencies: [ot, Mi, oi, Mn, jn, HN, Tr],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}.c-col-2   [_nghost-%COMP%], .c-col-3   [_nghost-%COMP%], .c-col-4   [_nghost-%COMP%]{display:flex;height:100%;align-items:flex-end;padding-bottom:10px}.c-checkbox-control[_ngcontent-%COMP%]{position:relative;display:inline-flex;align-items:flex-start;vertical-align:top}.c-checkbox-control__input-container[_ngcontent-%COMP%]{flex-shrink:0;margin-right:12px}.c-checkbox-control__input-container.c-switcher[_ngcontent-%COMP%]{margin-right:8px}.c-checkbox-control__label[_ngcontent-%COMP%]{font-family:var(--medium);line-height:var(--base-line-height);font-size:var(--base-font-size-mobile);display:inline-block;cursor:pointer}.c-checkbox-control__label[_ngcontent-%COMP%]:before{content:"";display:block;position:absolute;top:0;left:0;width:100%;height:100%}.c-checkbox-control[_ngcontent-%COMP%]:hover   .c-checkbox-control__input-container[_ngcontent-%COMP%]:not(.is-disabled, .is-checked)[_ngcontent-%COMP%]     .toggle{background-color:var(--color-bg-body);box-shadow:0 0 0 1px var(--toggle-box-shadow-color-hover)}.c-checkbox-control[_ngcontent-%COMP%]:hover   .c-checkbox-control__input-container[_ngcontent-%COMP%]:not(.is-disabled, .is-checked)[_ngcontent-%COMP%]     .toggle__container{transform:translate(-11px)}']
            }), t
        })();

        function $N(t, n) {
            if (1 & t && (S(0, "div", 8), k(1, "tr-popover-tip", 9), E()), 2 & t) {
                const e = P();
                _(1), v("text", (null == e.fieldSettings.ExternalOptions ? null : e.fieldSettings.ExternalOptions.Description) || "")("placement", "bottom")
            }
        }

        let Jb = (() => {
            class t extends Uo {
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-component"]],
                features: [R],
                decls: 8,
                vars: 9,
                consts: [[1, "c-form-control-container__label-container"], [1, "c-form-control-container__label"], [3, "label", "controlId"], ["class", "c-control-message-icon-wrap", 4, "ngIf"], [1, "\u0441-white", 3, "formGroup", "error"], ["ngProjectAs", "input", 5, ["input"]], ["type", "text", 3, "formControlName"], ["ngProjectAs", "end-slot", 5, ["end-slot"]], [1, "c-control-message-icon-wrap"], [3, "text", "placement"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0)(1, "div", 1), k(2, "c-control-label", 2), E(), O(3, $N, 2, 2, "div", 3), E(), S(4, "tr-control", 4), Te(5, 5), k(6, "input", 6), Oe(), Yt(7, 7), E()), 2 & e && (_(2), v("label", i.fieldSettings.Name)("controlId", i.fieldSettings.Code), _(1), v("ngIf", null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Description), _(1), v("formGroup", i.form)("error", i.field.invalid && (i.field.dirty || i.field.touched)), _(2), Ys("c-input c-input_size-", i.controlSize, ""), v("formControlName", i.fieldSettings.Code))
                },
                dependencies: [ot, Ta, Mi, oi, Mn, jn, jo, Mr, Tr],
                styles: [".tr-span-require[_ngcontent-%COMP%]{font-size:12px}"]
            }), t
        })();

        function zN(t, n) {
            if (1 & t && (S(0, "div", 8), k(1, "tr-popover-tip", 9), E()), 2 & t) {
                const e = P();
                _(1), v("text", (null == e.fieldSettings.ExternalOptions ? null : e.fieldSettings.ExternalOptions.Description) || "")("placement", "bottom")
            }
        }

        let GN = (() => {
            class t extends Uo {
                constructor() {
                    super(...arguments), this.items = []
                }

                ngOnInit() {
                    this.items = this.fieldSettings.SetParametersValuesArray.map(e => ({
                        title: e.ValueOfSet,
                        value: e.ValueOfSetId
                    })), super.ngOnInit()
                }

                initValue() {
                    return 1 === this.items.length ? this.items[0].value : null
                }

                setOptionsChoices(e) {
                    this.fieldSettings.SetParametersValuesArray = e
                }

                getValueChanges() {
                    return this.field.valueChanges.pipe(ub(""), mt(e => e ? this.filter(e) : this.items.slice()))
                }

                filter(e) {
                    return this.items.filter(i => -1 !== i.title.toLowerCase().indexOf(e.toLowerCase()))
                }

                disable() {
                    1 === this.items.length && (this.field.disable(), this.disabled = !0)
                }
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-component"]],
                features: [R],
                decls: 8,
                vars: 15,
                consts: [[1, "c-form-control-container__label-container"], [1, "c-form-control-container__label"], [3, "label", "controlId"], [3, "ngSwitch"], ["class", "c-control-message-icon-wrap", 4, "ngIf"], [1, "tr-white", 3, "formGroup", "error"], ["ngProjectAs", "input", 5, ["input"]], ["bindLabel", "title", "bindValue", "value", 1, "c-input-select", "c-no-label", 3, "id", "formControlName", "readonly", "placeholder", "items", "clearable", "searchable"], [1, "c-control-message-icon-wrap"], [3, "text", "placement"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0)(1, "div", 1), k(2, "c-control-label", 2), Yt(3, 3), E(), O(4, zN, 2, 2, "div", 4), E(), S(5, "tr-control", 5), Te(6, 6), k(7, "ng-select", 7), Oe(), E()), 2 & e && (_(2), v("label", i.fieldSettings.Name)("controlId", i.fieldSettings.Code), _(1), v("ngSwitch", i.field.invalid && (i.field.dirty || i.field.touched)), _(1), v("ngIf", null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Description), _(1), v("formGroup", i.form)("error", i.field.invalid && (i.field.dirty || i.field.touched)), _(2), we("is-disabled", i.disabled), v("id", i.fieldSettings.Code)("formControlName", i.fieldSettings.Code)("readonly", i.disabled)("placeholder", (null == i.fieldSettings.ExternalOptions ? null : i.fieldSettings.ExternalOptions.Placeholder) || "")("items", i.items)("clearable", !1)("searchable", !1))
                },
                dependencies: [ot, Do, wb, Mi, oi, Mn, jn, jo, Mr, Tr],
                styles: [".ng-select[_ngcontent-%COMP%]   .ng-has-value[_ngcontent-%COMP%]   .ng-placeholder[_ngcontent-%COMP%]{display:none}"]
            }), t
        })(), WN = (() => {
            class t extends Uo {
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["ng-component"]],
                features: [R],
                decls: 2,
                vars: 1,
                template: function (e, i) {
                    1 & e && (Te(0), Ie(1), Oe()), 2 & e && (_(1), Zt(" ", i.fieldSettings.Value, "\n"))
                }
            }), t
        })(), qN = (() => {
            class t {
                constructor(e) {
                    this.container = e, this.controlSize = "m", this.fieldComponentRef = null, this.componentMapper = {
                        MediumText: Jb,
                        String: Jb,
                        Lookup: GN,
                        Integer: Xb,
                        Float: NN,
                        Boolean: UN,
                        ExtTextBlock: WN
                    }
                }

                ngOnInit() {
                    const e = this.componentMapper[this.field.Type] ?? null;
                    e ? (this.fieldComponentRef = this.container.createComponent(e), this.fieldComponentRef.instance.form = this.form, this.fieldComponentRef.instance.fieldSettings = this.field, this.fieldComponentRef.instance.controlSize = this.controlSize) : console.debug(`C-Nocode: DynamicFieldDirective - \u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0442\u0438\u043f\u0430 \u043f\u043e\u043b\u044f: ${this.field.Type}`)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(Qt))
            }, t.\u0275dir = I({
                type: t,
                selectors: [["", "dynamicField", ""]],
                inputs: {field: "field", form: "form", controlSize: "controlSize"}
            }), t
        })();

        function YN(t, n) {
            if (1 & t && (S(0, "div", 10), Yt(1, 11), E()), 2 & t) {
                const e = n.$implicit, i = P();
                v("ngClass", "c-col-" + (null != e.ExternalOptions && e.ExternalOptions.Col ? null == e.ExternalOptions ? null : e.ExternalOptions.Col : "12")), _(1), v("field", e)("form", i.form)
            }
        }

        let KN = (() => {
            class t extends $n {
                constructor(e, i) {
                    super(), this.productService = e, this.creditService = i, this.fields = [], this.status = Xe.pending, this.products = []
                }

                ngOnInit() {
                    console.debug("C-Nocode: FieldsComponent - ngOnInit"), this.creditService.status$.subscribe(e => this.status = e), this.productService.product.pipe(Qe(this.destroy$), mt(e => {
                        console.debug("C-Nocode: FieldsComponent - productService.product"), this.product = e, this.fields = e.ProductParametersArray.filter(i => -1 !== ["1", !0, "on"].indexOf(i.Display))
                    }), Ai(e => this.catchError(e))).subscribe(), setTimeout(() => {
                        this.creditService.recalculate(this.form.getRawValue()).pipe(Qe(this.destroy$), tn(e => !!e)).subscribe(e => {
                            this.creditService.status$.next(Xe.success), this.creditService.calculateResult$.next(e)
                        })
                    })
                }

                setProduct(e) {
                    const i = this.products.findIndex(r => r.ProductId === e.ProductId);
                    this.productService.nextProduct(this.products[i])
                }

                catchError(e) {
                    return console.error("[FieldsComponent] \u041e\u0448\u0438\u0431\u043a\u0430:", e), Cr(null)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(zd), g(Xa))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["c-fields"]],
                inputs: {form: "form", products: "products"},
                features: [R],
                decls: 10,
                vars: 9,
                consts: [[3, "formGroup"], [1, "c-row"], [1, "c-form-control-container", "c-col-12"], [1, "c-form-control-container__label-container"], [1, "c-form-control-container__label"], ["label", "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430 \u043a\u0440\u0435\u0434\u0438\u0442\u043e\u0432\u0430\u043d\u0438\u044f", "controlId", "product"], [1, "\u0441-white"], ["ngProjectAs", "input", 5, ["input"]], ["formControlName", "product", "bindLabel", "ProductName", "bindValue", "ProductId", 1, "c-input-select", "tr-no-label", 3, "readonly", "clearable", "searchable", "virtualScroll", "items", "change"], ["class", "c-form-control-container", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "c-form-control-container", 3, "ngClass"], ["dynamicField", "", 3, "field", "form"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4), k(5, "c-control-label", 5), E()(), S(6, "tr-control", 6), Te(7, 7), S(8, "ng-select", 8), ce("change", function (o) {
                        return i.setProduct(o)
                    }), E(), Oe(), E()(), O(9, YN, 2, 3, "div", 9), E()()), 2 & e && (v("formGroup", i.form), _(8), we("is-disabled", "sending" === i.status), v("readonly", "sending" === i.status)("clearable", !1)("searchable", !1)("virtualScroll", !0)("items", i.products), _(1), v("ngForOf", i.fields))
                },
                dependencies: [Jn, _a, wb, Mi, oi, Mn, jn, jo, Mr, qN],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}[_nghost-%COMP%]{display:block}.c-row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;margin-right:-8px;margin-left:-8px}@media screen and (min-width: 1920px){.c-row[_ngcontent-%COMP%]{margin-right:-12px;margin-left:-12px}}.c-col-1[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 8.3333333333%;max-width:8.3333333333%}@media screen and (min-width: 1920px){.c-col-1[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-2[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 16.6666666667%;max-width:16.6666666667%}@media screen and (min-width: 1920px){.c-col-2[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-3[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 25%;max-width:25%}@media screen and (min-width: 1920px){.c-col-3[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-4[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 33.3333333333%;max-width:33.3333333333%}@media screen and (min-width: 1920px){.c-col-4[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-5[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 41.6666666667%;max-width:41.6666666667%}@media screen and (min-width: 1920px){.c-col-5[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-6[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 50%;max-width:50%}@media screen and (min-width: 1920px){.c-col-6[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-7[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 58.3333333333%;max-width:58.3333333333%}@media screen and (min-width: 1920px){.c-col-7[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-8[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 66.6666666667%;max-width:66.6666666667%}@media screen and (min-width: 1920px){.c-col-8[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-9[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 75%;max-width:75%}@media screen and (min-width: 1920px){.c-col-9[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-10[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 83.3333333333%;max-width:83.3333333333%}@media screen and (min-width: 1920px){.c-col-10[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-11[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 91.6666666667%;max-width:91.6666666667%}@media screen and (min-width: 1920px){.c-col-11[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}.c-col-12[_ngcontent-%COMP%]{position:relative;width:100%;min-height:1px;padding-right:8px;padding-left:8px;flex:0 0 100%;max-width:100%}@media screen and (min-width: 1920px){.c-col-12[_ngcontent-%COMP%]{padding-right:12px;padding-left:12px}}@media (max-width: 1023px){[_nghost-%COMP%]{width:100%}.c-col-1[_ngcontent-%COMP%], .c-col-2[_ngcontent-%COMP%], .c-col-3[_ngcontent-%COMP%], .c-col-4[_ngcontent-%COMP%], .c-col-5[_ngcontent-%COMP%], .c-col-6[_ngcontent-%COMP%], .c-col-7[_ngcontent-%COMP%], .c-col-8[_ngcontent-%COMP%], .c-col-9[_ngcontent-%COMP%], .c-col-10[_ngcontent-%COMP%], .c-col-11[_ngcontent-%COMP%], .c-col-12[_ngcontent-%COMP%]{flex:0 0 100%;max-width:100%}}']
            }), t
        })(), ZN = (() => {
            class t {
                constructor() {
                    this.circleRadius = 30
                }

                getStrokeDasharrayString() {
                    return "0 " + 2 * Math.PI * this.circleRadius
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275dir = I({type: t}), t
        })(), QN = (() => {
            class t extends ZN {
            }

            return t.\u0275fac = function () {
                let n;
                return function (i) {
                    return (n || (n = de(t)))(i || t)
                }
            }(), t.\u0275cmp = ge({
                type: t,
                selectors: [["c-loader"]],
                features: [R],
                decls: 4,
                vars: 3,
                consts: [[1, "c-loader"], ["width", "72", "height", "72", 1, "c-loader__loader"], ["cx", "36", "cy", "36", "fill", "none", "stroke-width", "4", 1, "c-loader__loader-back"], ["cx", "36", "cy", "36", "fill", "none", "stroke-width", "4", 1, "c-loader__loader-front"]],
                template: function (e, i) {
                    1 & e && (S(0, "div", 0), Ui(), S(1, "svg", 1), k(2, "circle", 2)(3, "circle", 3), E()()), 2 & e && (_(2), $e("r", i.circleRadius), _(1), $e("r", i.circleRadius)("stroke-dasharray", i.getStrokeDasharrayString()))
                },
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_ngcontent-%COMP%]:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){[_ngcontent-%COMP%]:root{--grid-gutter-width: 24px}}@keyframes _ngcontent-%COMP%_wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}[_nghost-%COMP%]{width:72px;height:72px;display:inline-flex;vertical-align:top}.c-loader[_ngcontent-%COMP%]{width:72px;height:72px;display:inline-flex;align-items:center;justify-content:center;text-align:center;position:relative}.c-loader__loader[_ngcontent-%COMP%]{position:absolute}.c-loader__loader-back[_ngcontent-%COMP%]{stroke:var(--color-line)}.c-loader__loader-front[_ngcontent-%COMP%]{stroke:var(--color-primary);transform:rotate(0);transform-origin:center;stroke-dasharray:94.25 188.5;stroke-dashoffset:0;transition:all .1s ease;animation:_ngcontent-%COMP%_rotate 1s linear infinite}@keyframes _ngcontent-%COMP%_rotate{0%{transform:rotate(-360deg)}}@keyframes _ngcontent-%COMP%_stroke-dasharray-animation{0%{stroke-dasharray:0 188.5;stroke-dashoffset:0}75%{stroke-dasharray:160 188.5;stroke-dashoffset:0}to{stroke-dasharray:186 188.5;stroke-dashoffset:0}}']
            }), t
        })();

        function XN(t, n) {
            if (1 & t && (Te(0), k(1, "c-fields", 14), Oe()), 2 & t) {
                const e = P();
                _(1), v("form", e.form)("products", e.products)
            }
        }

        function JN(t, n) {
            1 & t && Yt(0, 15), 2 & t && (P(), v("ngTemplateOutlet", Me(15)))
        }

        function eL(t, n) {
            1 & t && Yt(0, 15), 2 & t && (P(), v("ngTemplateOutlet", Me(17)))
        }

        function tL(t, n) {
            1 & t && Yt(0, 15), 2 & t && (P(), v("ngTemplateOutlet", Me(19)))
        }

        function nL(t, n) {
            if (1 & t && (S(0, "div", 16)(1, "div", 17)(2, "div", 18), k(3, "c-loader"), E(), k(4, "h3", 19)(5, "p", 19), E()()), 2 & t) {
                const e = P();
                _(4), v("innerHTML", e.bankTitle, an), _(1), v("innerHTML", e.bankLoadingSubtitle, an)
            }
        }

        function iL(t, n) {
            if (1 & t && (S(0, "div", 16)(1, "div", 17)(2, "div", 18), k(3, "c-loader"), E(), k(4, "h3", 19)(5, "p", 19), E()()), 2 & t) {
                const e = P();
                _(4), v("innerHTML", e.bankTitle, an), _(1), v("innerHTML", e.bankErrorSubtitle, an)
            }
        }

        function rL(t, n) {
            1 & t && (S(0, "div", 16)(1, "div", 17)(2, "div", 18), k(3, "c-loader"), E(), S(4, "h3", 20), Ie(5, "\u0417\u0430\u044f\u0432\u043a\u0430 \u0441 \u0440\u0430\u0441\u0447\u0451\u0442\u0430\u043c\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u0432 \u0431\u0430\u043d\u043a..."), E()()())
        }

        let oL = (() => {
            class t extends $n {
                constructor(e, i, r) {
                    super(), this.productService = e, this.apiSettings = i, this.creditService = r, this.products = [], this.status = Xe.pending, this.title = be.getSetting("", "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0439\u0442\u0435 \u0434\u0435\u0442\u0430\u043b\u0438 \u0438\u043f\u043e\u0442\u0435\u043a\u0438"), this.description = be.getSetting("", "\u0420\u0430\u0441\u0447\u0435\u0442 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u043a\u0440\u0435\u0434\u0438\u0442\u0430 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043f\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u043c.<br>\u041e\u043a\u043e\u043d\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0443\u0441\u043b\u043e\u0432\u0438\u044f \u0431\u0443\u0434\u0443\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u043f\u043e\u0441\u043b\u0435 \u043e\u0434\u043e\u0431\u0440\u0435\u043d\u0438\u044f \u0437\u0430\u044f\u0432\u043a\u0438 \u0431\u0430\u043d\u043a\u043e\u043c."), this.bankTitle = be.getSetting("", "\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435 \u043e\u0442\u0432\u0435\u0442\u0430 \u043e\u0442 \u0431\u0430\u043d\u043a\u0430"), this.bankLoadingSubtitle = be.getSetting("", "\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0435 \u043e\u0442 \u0431\u0430\u043d\u043a\u0430 \u0438 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442 \u0440\u0430\u0441\u0447\u0451\u0442\u044b..."), this.bankErrorSubtitle = be.getSetting("", "\u0414\u0430\u043d\u043d\u044b\u0435 \u043e \u043a\u0440\u0435\u0434\u0438\u0442\u043d\u044b\u0445 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u0430\u0445 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b. \u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435. <br>\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443 \u043d\u0430 \u043e\u0434\u043e\u0431\u0440\u0435\u043d\u0438\u0435 \u043a\u0440\u0435\u0434\u0438\u0442\u0430 \u0441 \u0440\u0430\u043d\u0435\u0435 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u043d\u044b\u043c\u0438 \u0440\u0430\u0441\u0447\u0451\u0442\u0430\u043c\u0438.")
                }

                ngOnInit() {
                    console.debug("C-Nocode: IndexComponent - ngOnInit"), this.creditService.status$.subscribe(e => this.status = e), this.productService.product.pipe(Qe(this.destroy$), Ai(e => this.catchError(e)), tn(e => !!e && !this.checkError()), function yk(t) {
                        return et((n, e) => {
                            try {
                                n.subscribe(e)
                            } finally {
                                e.add(t)
                            }
                        })
                    }(() => console.debug("C-Nocode: IndexComponent - productService.subscribe"))).subscribe(e => {
                        this.form = _k.create(e)
                    }), this.creditService.getProducts().pipe(Qe(this.destroy$), Ai(e => this.catchError(e)), tn(e => !!e && !this.checkError())).subscribe(e => {
                        console.debug("C-Nocode: IndexComponent - creditService.subscribe"), this.products = e;
                        const i = this.products.find(r => "{DFFE0396-B18D-8C6A-E053-0B00640A688B}" === r.ProductId);
                        this.productService.nextProduct(i || e[0]), this.creditService.status$.next(Xe.success)
                    })
                }

                setError() {
                    this.creditService.status$.next(Xe.error)
                }

                checkError() {
                    return this.status === Xe.error
                }

                catchError(e) {
                    return console.error("[IndexComponent] \u041e\u0448\u0438\u0431\u043a\u0430:", e), this.creditService.status$.next(Xe.error), Cr(null)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(zd), g(gt), g(Xa))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["c-index"]],
                features: [R],
                decls: 20,
                vars: 9,
                consts: [["rel", "stylesheet", "href", "https://credit-nocode.tradedealer.su/styles.6e841dbc68adf961.css"], [1, "c-main", 3, "ngClass"], [1, "c-content"], [1, "c-layout"], [1, "c-title", 3, "innerHTML"], [1, "c-description", 3, "innerHTML"], [3, "ngSwitch"], [4, "ngSwitchCase"], [3, "ngTemplateOutlet", 4, "ngSwitchCase"], [1, "c-aside"], [3, "form"], ["pending", ""], ["error", ""], ["sending", ""], [3, "form", "products"], [3, "ngTemplateOutlet"], [1, "c-waiting"], [1, "c-waiting__content"], [1, "c-indent-lg"], [1, "c-indent-sm", 3, "innerHTML"], [1, "c-indent-sm"]],
                template: function (e, i) {
                    1 & e && (k(0, "link", 0), S(1, "div", 1)(2, "div", 2)(3, "div", 3), k(4, "h3", 4)(5, "div", 5), S(6, "div", 6), O(7, XN, 2, 2, "ng-container", 7), O(8, JN, 1, 1, "ng-container", 8), O(9, eL, 1, 1, "ng-container", 8), O(10, tL, 1, 1, "ng-container", 8), E()()(), S(11, "div", 9)(12, "div", 3), k(13, "c-calculation-result", 10), E()()(), O(14, nL, 6, 2, "ng-template", null, 11, ft), O(16, iL, 6, 2, "ng-template", null, 12, ft), O(18, rL, 6, 0, "ng-template", null, 13, ft)), 2 & e && (_(1), v("ngClass", "c-main_status-" + i.status), _(3), v("innerHTML", i.title, an), _(1), v("innerHTML", i.description, an), _(1), v("ngSwitch", !0), _(1), v("ngSwitchCase", "success" === i.status), _(1), v("ngSwitchCase", "pending" === i.status), _(1), v("ngSwitchCase", "error" === i.status), _(1), v("ngSwitchCase", "sending" === i.status), _(3), v("form", i.form))
                },
                dependencies: [Jn, wr, Do, p_, vN, KN, QN],
                styles: ['@charset "UTF-8";@keyframes loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}:root{--grid-gutter-width: 16px}@media screen and (min-width: 1920px){:root{--grid-gutter-width: 24px}}@keyframes wave{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}:host{display:block;position:relative}.c-main{display:flex;align-items:flex-start;gap:16px}.c-content{flex-grow:1}.c-aside{width:30.7692307692%;flex-shrink:0;position:sticky;top:0}.c-aside .c-layout{padding-top:24px;padding-bottom:24px}.c-layout{background:var(--color-bg-page);padding:32px;border:1px solid var(--color-line-border);box-shadow:var(--shadow-z4);border-radius:var(--ab-border-radius)}.c-title{margin-bottom:8px}.c-description{font-family:var(--regular);font-size:14px;line-height:22px;letter-spacing:0;color:var(--color-text-tertiary);margin-bottom:24px}.c-waiting{display:flex;align-items:center;justify-content:center;min-height:416px;text-align:center}.c-waiting__content{max-width:424px}.c-waiting__content p{font-family:var(--medium);font-size:14px;line-height:20px;letter-spacing:0}@media (max-width: 1023px){.c-main{flex-direction:column;max-width:100%}.c-content{width:100%}.c-content .c-layout{padding:0;border-radius:0;border:none;box-shadow:none}.c-aside{width:100%;position:relative;margin-top:24px}.c-main_status-pending .c-aside{display:none}.c-waiting__content{max-width:312px}}\n'],
                encapsulation: 3
            }), t
        })();

        function sL(t, n) {
            1 & t && k(0, "c-index")
        }

        let ew = (() => {
            class t {
                constructor(e) {
                    this.settingsApi = e, this.title = "credit-nocode-frontend", this.status = !1
                }

                ngOnInit() {
                    this.settingsApi.getSettings(be.getGlobal("ALIAS")).pipe(Ai(e => (console.error("[AppComponent] \u041e\u0448\u0438\u0431\u043a\u0430:", e), Cr({})))).subscribe(e => {
                        be.settings = e, this.status = !0
                    })
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)(g(gt))
            }, t.\u0275cmp = ge({
                type: t,
                selectors: [["app-root"]],
                decls: 1,
                vars: 1,
                consts: [[4, "ngIf"]],
                template: function (e, i) {
                    1 & e && O(0, sL, 1, 0, "c-index", 0), 2 & e && v("ngIf", i.status)
                },
                dependencies: [ot, oL],
                styles: ['@charset "UTF-8";@keyframes _ngcontent-%COMP%_loader-anim{0%{transform:rotate(0)}to{transform:rotate(360deg)}}[_nghost-%COMP%]{--indent-base: 8px;--color-primary: #2e62d9;--color-secondary: #2ca2fd;--color-secondary-rgb: 44, 162, 253;--color-accent: #fc5454;--color-global: #ffffff;--color-bg-ionic-app: #f5f7f9;--color-global-rgb: 255, 255, 255;--color-text-primary: #222835;--color-text-primary-rgb: 34, 40, 53;--color-text-secondary: #434854;--color-text-secondary-rgb: 67, 72, 84;--color-text-tertiary: #868a95;--color-text-tertiary-rgb: 134, 138, 149;--color-link-primary: #2e62d9;--color-link-secondary: #868a95;--color-bg-body: #f6f8f9;--color-bg-page: #ffffff;--color-bg-block: #fbfcfc;--color-bg-disabled: #f6f8f9;--color-bg-secondary: #868a95;--color-bg-card: #e4f8ff;--color-bg-small-element-light: #e7ebf4;--color-bg-small-element-dark: #cfd8e1;--color-text-disable: #ABAEB5;--color-bg-row-hover: #f6f8f9;--color-bg-row-selection: #f4faff;--color-line: #e7ebf4;--color-line-border: #cfd8e1;--color-line-states: #cfd8e1;--color-icon: #babfcb;--color-icon-secondary: #babfcb;--fill-color-icon: #e7ebf4;--fill-color-icon-error: #fc5454;--color-icon-hover: #61616a;--skeleton-primary: #e9edf5;--skeleton-secondary: #f7f9fd;--skeleton-bg: #f5f7f9;--color-success: #42c28c;--color-success-rgb: 66, 194, 140;--color-success-bg: #f5fcf9;--color-success-stroke: #c7eddd;--color-success-stroke-rgb: 199, 237, 221;--color-attention: #ffa733;--color-attention-bg: #fff7eb;--color-attention-stroke: #ffdfb4;--color-attention-stroke-rgb: 255, 223, 180;--color-info: #2ca2fd;--color-info-bg: #f4faff;--message-info-border-radius: 4px;--color-info-stroke: #c0e3ff;--color-info-stroke-rgb: 192, 227, 255;--color-error: #fc5454;--color-error-bg: #fff6f6;--color-error-stroke: #fecccc;--color-wait: #e8d7fe;--color-wait-bg: #f9f4ff;--color-wait-stroke: #e8d7fe;--color-status-new: #caf2ff;--color-status-new-rgb: 202, 242, 255;--color-status-success: #dcf89f;--color-status-success-rgb: 220, 248, 159;--color-status-success-2: #c0ebd9;--color-status-success-no-paper: #c0ebd9;--color-status-waiting: #ffdf8f;--color-status-process: #fefcc6;--color-status-fail: #fecccc;--color-status-blocked: #cfd8e1;--color-status-additional: #e8d7fe;--regular: Montserrat-regular, sans-serif;--medium: Montserrat-medium, sans-serif;--semi-bold: Montserrat-semibold, sans-serif;--bold: Montserrat-bold, sans-serif;--extra-bold: Montserrat-extrabold, sans-serif;--base-font-family: var(--regular);--base-font-size-mobile: 14px;--base-font-size: 14px;--base-line-height: 20px;--shadow-z1: 0 16px 20px #d2d3d5;--shadow-z4: 0px 2px 4px rgba(34, 40, 53, .04);--radius: 4px;--modal-radius: 0;--skeleton-border-radius: 2px;--color-select-hover: #f6f8f9;--message-inner-padding: 16px 12px;--message-info-bg: var(--color-info-bg);--message-info-bd-color: var(--color-info-stroke);--message-border-radius: var(--radius);--message-success-bg: var(--color-success-bg);--message-success-bd-color: var(--color-success-stroke);--message-attention-bg: var(--color-attention-bg);--message-attention-bd-color: var(--color-attention-stroke);--message-error-bg: var(--color-error-bg);--message-error-bd-color: var(--color-error-stroke);--heading-color: var(--color-text-primary);--make-ff_h0: var(--semi-bold);--make-fs-h0: 48px;--make-lh-h0: 58px;--make-ff_h1: var(--medium);--make-fs-h1: 30px;--make-lh-h1: 40px;--make-ff_h2: var(--medium);--make-fs-h2: 24px;--make-lh-h2: 30px;--make-ff_h3: var(--semi-bold);--make-fs-h3: 18px;--make-lh-h3: 24px;--make-ff_h4: var(--medium);--make-fs-h4: 16px;--make-lh-h4: 24px;--make-ff-h1-mobile: var(--bold);--make-fs-h1-mobile: 22px;--make-lh-h1-mobile: 28px;--make-ff_h2-mobile: var(--semi-bold);--make-fs-h2-mobile: 18px;--make-lh-h2-mobile: 26px;--make-ff-h3-mobile: var(--semi-bold);--make-fs-h3-mobile: 16px;--make-lh-h3-mobile: 24px;--make-ff-h4-mobile: var(--semi-bold);--make-fs-h4-mobile: 14px;--make-lh-h4-mobile: 20px;--input-font-size: var(--base-font-size);--input-font-size-mobile: var(--base-font-size-mobile);--input-font-family: var(--medium);--input-border-width: 1px;--input-border-color: var(--color-line-border);--input-border-radius: 4px;--input-height: 40px;--input-label-color: var(--color-text-secondary);--input-height-mobile: 40px;--input-padding: 16px;--input-text-color: var(--color-text-primary);--input-bg: var(--color-global);--input-box-shadow-color: var(--color-line-border);--input-box-shadow-color-invalid: var(--color-error);--input-placeholder: var(--color-text-tertiary);--select-padding: 0 64px 0 16px;--input-otp-width: 40px;--input-otp-height: 40px;--input-icon-down-color: var(--color-text-primary);--input-password-icon-hidden: var(--color-icon-secondary);--input-password-icon-shown: var(--color-text-primary);--input-height-s: 32px;--input-height-l: 48px;--input-height-xl: 56px;--textarea-padding-block: 8px;--textarea-padding-block-mobile: 10px;--textarea-count-color: var(--color-text-tertiary);--select-control-descr-padding: 10px;--select-control-option-height: 40px;--input-box-shadow-color-hover: var(--color-secondary);--input-box-shadow-color-active: var(--color-primary);--input-bg-disabled: var(--color-bg-body);--input-text-color-disabled: var(--color-text-tertiary);--input-text-disabled: #abaeb5;--form-label-fs: 14px;--form-label-ff: var(--medium);--form-label-lh: 20px;--form-label-color: var(--color-text-secondary);--form-label-color-readonly: var(--color-text-tertiary);--form-label-color-active: var(--color-text-primary);--date-picker-control-size: 40px;--date-picker-calendar-focus-color: var(--color-secondary);--date-picker-control-color-disabled: var(--color-icon);--date-picker-icon-calendar-fill: var(--color-text-secondary);--date-picker-icon-is-readonly: var(--color-icon);--date-picker-calendar-raduis: 20px;--date-picker-calendar-month-width: 72px;--date-picker-calendar-month-height: 40px;--date-picker-inner-container-padding: 2px 20px 0;--date-picker-control-overflow: hidden;--tooltip-bg: var(--color-bg-body);--tooltip-border-color: var(--color-line-border);--tooltip-color: var(--color-text-primary);--tooltip-ff: var(--regular);--tooltip-fs: 12px;--tooltip-width: 16px;--tooltip-height: 16px;--tooltip-bg-active: var(--color-text-primary);--tooltip-border-color-active: var(--color-text-primary);--tooltip-color-active: var(--color-global);--main-tooltip-background-color-dark-theme: var(--color-text-primary);--main-tooltip-border-color-dark-theme: var(--color-text-primary);--main-tooltip-background-color-light-theme: var(--color-global);--main-tooltip-border-color-light-theme: var(--color-line);--main-tooltip-border-width: 1px;--main-tooltip-corner-vertical-indent-from-edge: 12px;--main-tooltip-corner-horizontal-indent-from-edge: 20px;--main-tooltip-corner-triangle-base-length: 12px;--main-tooltip-corner-triangle-height: 8px;--main-tooltip-wrapper-width: 320px;--toggle-width-m: 36px;--toggle-height-m: 20px;--toggle-circle-width-m: 16px;--toggle-circle-height-m: 16px;--toggle-translate-m-checked: 2px;--toggle-translate-m: -13px;--btn-size: 40px;--btn-size-mobile: 40px;--btn-font-family: var(--medium);--l-btn-font-size: 16px;--btn-primary-radius: 4px;--btn-primary-size: 40px;--btn-primary-font-size: var(--base-font-size);--btn-primary-text-color: #fff;--btn-primary-bg-color: var(--color-primary);--btn-primary-bg-hover: var(--color-secondary);--btn-primary-bg-focus: var(--color-primary);--btn-primary-bg-active: #2898ef;--btn-primary-icon-color: #fff;--btn-primary-shadow-hover: none;--btn-primary-shadow-focus: 0 0 0 3px rgba(var(--color-secondary-rgb), .5);--btn-primary-text-color-hover: #fff;--btn-primary-text-color-active: #fff;--btn-primary-text-color-focus: #fff;--btn-primary-bg-color-disabled: var(--color-line-border);--btn-primary-text-color-disabled: #fff;--btn-primary-border-disabled: none;--btn-primary-text-color-danger: #fff;--btn-primary-bg-danger: var(--color-error);--btn-primary-bg-danger-hover: #ef4f4f;--btn-primary-shadow-danger-focus: 0 0 0 3px var(--color-error-stroke);--btn-primary-bg-danger-active: #e34b4b;--btn-primary-bg-color-inversion: #ffffff;--btn-primary-text-color-inversion: var(--color-primary);--btn-primary-text-hover-inversion: #ffffff;--btn-primary-shadow-focus-inversion: var(--btn-primary-shadow-focus);--btn-primary-text-color-hover-inversion: var(--btn-primary-text-hover-inversion);--btn-primary-bg-hover-inversion: var(--color-secondary);--btn-primary-bg-active-inversion: #2898ef;--btn-primary-text-color-disabled-inversion: rgba(255, 255, 255, .4);--btn-primary-bg-disabled-inversion: rgba(255, 255, 255, .1);--btn-primary-bg-color-danger-inversion: var(--color-error);--btn-primary-text-color-danger-inversion: #ffffff;--btn-primary-shadow-focus-danger-inversion: 0 0 0 3px var(--color-error-stroke);--btn-primary-bg-color-hover-danger-inversion: #ef4f4f;--btn-primary-bg-color-active-danger-inversion: #e34b4b;--btn-multi-bg-color-primary: #2a51a8;--btn-multi-bg-secondary-inversion-disabled: rgba(207, 216, 225, .1);--btn-secondary-border-size: 2px;--btn-secondary-border-color: var(--color-info-stroke);--btn-secondary-border-size-hover: 2px;--btn-secondary-border-hover: var(--color-secondary);--btn-secondary-border-focus: var(--color-secondary);--btn-secondary-border-size-active: 2px;--btn-secondary-border-active: var(--color-secondary);--btn-secondary-border-size-disabled: 2px;--btn-secondary-border-disabled: 2px solid var(--color-line-border);--btn-secondary-bg-color-hover: transparent;--btn-secondary-bg-color-active: var(--color-bg-row-selection);--btn-secondary-text-color: var(--color-primary);--btn-secondary-text-color-hover: var(--color-primary);--btn-secondary-text-color-active: var(--color-primary);--btn-secondary-text-color-focus: var(--color-primary);--btn-secondary-text-color-disabled: var(--color-text-tertiary);--btn-secondary-border-color-disabled: var(--color-line-border);--btn-secondary-text-color-danger: var(--color-error);--btn-secondary-border-color-danger: var(--color-error-stroke);--btn-secondary-border-color-danger-hover: var(--color-error);--btn-secondary-border-color-danger-focus: var(--color-error);--btn-secondary-border-color-danger-active: var(--color-error);--btn-secondary-bg-danger-active: var(--color-error-bg);--btn-secondary-text-color-inversion: #ffffff;--btn-secondary-border-color-inversion: rgba(192, 227, 255, .4);--btn-secondary-border-color-inversion-focus: #ffffff;--btn-secondary-border-color-inversion-hover: #ffffff;--btn-secondary-border-color-inversion-active: #ffffff;--btn-secondary-text-color-disabled-inversion: rgba(255, 255, 255, .4);--btn-secondary-border-color-disabled-inversion: rgba(255, 255, 255, .1);--btn-secondary-text-color-danger-inversion: #ffffff;--btn-secondary-border-color-danger-inversion: rgba(254, 204, 204, .4);--btn-secondary-border-color-danger-inversion-hover: var(--color-error);--btn-secondary-border-color-danger-inversion-focus: var(--color-error);--btn-secondary-border-color-danger-inversion-active: var(--color-error);--btn-secondary-border-color-danger-inversion-disabled: rgba(255, 255, 255, .1);--link-color-disabled: #abaeb5;--btn-link-secondary-text-color: var(--color-text-tertiary);--btn-link-bg-color-hover: var(--color-bg-disabled);--btn-link-bg-color-active: var(--color-bg-disabled);--btn-link-shadow-color-focus: var(--color-info-stroke);--btn-link-shadow-color-hover: var(--color-info-stroke);--btn-link-bg-color-focus: transparent;--btn-link-primary-color: var(--color-primary);--btn-link-primary-color-hover: var(--color-primary);--btn-link-primary-color-active: var(--color-primary);--btn-link-primary-color-focus: var(--color-link-primary);--btn-link-secondary-color: var(--color-text-tertiary);--btn-link-icon-color: var(--color-primary);--btn-link-icon-secondary-color: var(--btn-link-secondary-color);--btn-link-icon-color-hover: var(--color-primary);--btn-link-icon-color-active: var(--color-primary);--btn-link-icon-color-focus: rgba(44, 162, 253, .3);--btn-link-icon-secondary-color-focus: var(--color-primary);--btn-link-icon-color-disabled: var(--link-color-disabled);--btn-link-outline-border-color: var(--btn-link-icon-color-focus);--btn-link-icon-color-disabled: var(--color-icon);--btn-link-shadow-color: var(--color-info-stroke);--btn-link-text-color-danger: var(--color-error);--btn-link-bg-danger: transparent;--btn-link-bg-color-danger-active: var(--color-error-bg);--btn-link-bg-color-danger-hover: var(--color-error-bg);--btn-link-shadow-danger-focus: inset 0 0 0 2px var(--color-error-stroke);--btn-link-shadow-danger-hover: var(--color-error-bg);--btn-link-text-color-inversion: rgba(255, 255, 255, 1);--btn-link-bg-color-inversion: rgba(0, 0, 0, .1);--btn-link-outline-border-inversion: 0 0 0 2px rgba(255, 255, 255, .3);--btn-link-text-color-disabled-inversion: rgba(255, 255, 255, .5);--btn-link-text-color-danger-inversion: rgb(252, 84, 84);--btn-link-shadow-danger-focus-inversion: 0 0 0 2px rgba(252, 84, 84, .3);--btn-link-bg-danger-inversion: rgba(252, 84, 84, .1);--btn-loader-primary-color: #fff;--btn-loader-secondary-color: var(--color-text-secondary);--btn-loader-link-color: var(--color-link-primary);--link-primary-color-hover: var(--color-secondary);--link-primary-color-active: var(--color-secondary);--link-primary-color-focus: var(--color-secondary);--radio-field-border-color: var(--color-line-border);--radio-field-size: 20px;--radio-field-border-color-hover: var(--color-secondary);--radio-field-border-color-focus: var(--color-secondary);--radio-field-bg-color-checked: var(--color-primary);--radio-field-border-color-disabled: var(--color-line-border);--radio-field-bg-color-disabled: var(--color-bg-disabled);--radio-field-bg-color-disabled-checked: var(--color-primary);--radio-checkmark-bg-color-disabled-checked: var(--color-global);--radio-checkmark-size: 8px;--radio-label-padding-left: 28px;--radio-label-padding-right: 28px;--radio-label-color: var(--color-text-secondary);--radio-label-bg-color: var(--color-global);--radio-label-checkmark-left: 6px;--radio-label-checkmark-top: 8px;--drop-down-list-min-width: 242px;--drop-down-list-padding: 8px 0;--select-control-bg-color: var(--color-global);--select-control-bg-color-hover: var(--color-bg-body);--select-control-bg-color-focus: var(--color-bg-row-selection);--select-control-bg-color-active: var(--color-bg-row-selection);--select-control-option-bg-color-hover: var(--color-option-hover);--select-control-option-bg-color-active: var(--color-bg-row-selection);--drop-down-list-bg-color: var(--color-bg-page);--select-control-icon-fill: #2e62d9;--select-control-option-icon-color: var(--color-primary);--select-control-placeholder-text-color: var(--color-text-tertiary);--select-control-options-text-color: var(--color-text-secondary);--checkbox-border-color-hover: var(--color-secondary);--checkbox-bg-checked: var(--color-primary);--checkbox-border-color-checked: var(--color-primary);--checkbox-label-text-color: var(--color-text-secondary);--toggle-box-shadow-color-hover: var(--color-secondary);--toggle-bg-checked: var(--color-primary);--toggle-border-checked: var(--color-primary);--hint-width: 320px;--hint-max-width: 512px;--hint-max-height: 270px;--hint-mobile-max-height: 100px;--hint-box-shadow: 0 8px 8px rgba(var(--color-text-primary-rgb), .04);--color-multiselect-tags: #e7ebf4;--color-multiselect-count: #f6f8f9;--input-bg-error: var(--color-error-bg);--badge-count-color: var(--color-text-primary);--badge-count-color-primary: var(--color-global);--badge-count-color-secondary: var(--color-text-secondary);--badge-bg-primary: var(--color-primary);--badge-bg-new: var(--color-status-new);--badge-bg-waiting: var(--color-status-waiting);--badge-bg-process: var(--color-status-process);--badge-bg-fail: var(--color-status-fail);--badge-bg-error: var(--color-status-error);--badge-bg-additional: var(--color-status-additional);--badge-bg-blocked: var(--color-status-blocked);--badge-bg-success: var(--color-status-success);--badge-bg-account: var(--color-bg-body);--table-bg: var(--color-bg-block);--table-title-text-color: var(--color-text-secondary);--table-mobile-title-text-color: var(--color-text-tertiary);--table-text-color: var(--color-text-primary);--table-border: 1px solid var(--color-line);--table-row-hover: var(--color-bg-body);--table-border-radius: 0px;--ion-back-icon: url(/assets/images/tab-home.svg);--date-picker-toggle: #f6f8f9;--date-picker-table-td-hover: #f6f8f9;--date-picker-title-color: var(--color-primary);--date-picker-calendar-actual-date-underline-color: var(--color-primary);--date-picker-calendar-active-bg: var(--color-primary);--date-picker-calendar-is-range: linear-gradient(0deg, #edf7ff, #edf7ff), #f4faff;--date-picker-period-color: var(--color-primary);--date-picker-period-bg: transparent;--date-picker-period-box-shadow: inset 0 0 0 2px var(--color-info-stroke);--date-picker-calendar-icon-fill: var(--color-text-secondary);--date-picker-period-selected-color: var(--color-bg-page);--date-picker-period-selected-bg: var(--color-primary);--select-icon-checked: var(--color-primary);--ab-border-radius: 4px;--ab-safe-zone-top: 0px}@media (min-width: 1920px){[_nghost-%COMP%]{--base-font-size: 16px;--base-line-height: 24px}}@media (min-width: 360px){[_nghost-%COMP%]{--base-font-size-mobile: 16px;--base-line-height: 24px}}@media (min-width: 768px) and (max-width: 1024px){[_nghost-%COMP%]{--make-fs-h0: 32px;--make-lh-h0: 40px}}@media (max-width: 767px){[_nghost-%COMP%]{--make-fs-h0: 24px;--make-lh-h0: 30px}}@media (min-width: 768px) and (max-width: 1024px){[_nghost-%COMP%]{--make-fs-h1: 30px;--make-lh-h1: 40px}}@media (max-width: 767px){[_nghost-%COMP%]{--make-fs-h1: 24px;--make-lh-h1: 30px}}@media (max-width: 767px){[_nghost-%COMP%]{--make-fs-h2: 18px;--make-lh-h2: 24px;--make-ff_h2: var(--semi-bold)}}@media (max-width: 767px){[_nghost-%COMP%]{--make-fs-h3: 16px;--make-lh-h3: 24px}}@media (min-width: 360px){[_nghost-%COMP%]{--make-fs-h1-mobile: 24px;--make-lh-h1-mobile: 30px}}@media (min-width: 1920px){[_nghost-%COMP%]{--input-height: 48px;--textarea-padding-block: 12px;--select-control-option-height: 48px;--select-control-descr-padding: 12px;--input-otp-width: 44px;--input-otp-height: 44px}}@media (min-width: 1920px){[_nghost-%COMP%]{--select-control-option-height: 48px;--select-control-descr-padding: 12px}}@media (min-width: 360px){[_nghost-%COMP%]{--input-height-mobile: 48px;--textarea-padding-block-mobile: 12px}}@media (min-width: 360px) and (max-width: 1023px){[_nghost-%COMP%]{--select-control-descr-padding: 12px;--select-control-option-height: 48px}}@media (min-width: 375px) and (max-width: 767px){[_nghost-%COMP%]{--input-otp-width: 48px;--input-otp-height: 48px}}@media (min-width: 360px){[_nghost-%COMP%]{--btn-size-mobile: 48px}}@media (min-width: 1920px){[_nghost-%COMP%]{--btn-size: 48px}}@media (max-width: 359px){[_nghost-%COMP%]{--hint-width: 100%}}[_nghost-%COMP%]{overflow-x:hidden;font-size:var(--base-font-size);font-family:var(--base-font-family);line-height:var(--base-line-height);color:var(--color-text-secondary);box-sizing:border-box;height:100%;margin:0;max-width:100%}']
            }), t
        })();
        !function xT(t, n, e) {
            (function oS(t, n, e) {
                "string" != typeof n && (e = n, n = t[T.LocaleId]), n = n.toLowerCase().replace(/_/g, "-"), gr[n] = t, e && (gr[n][T.ExtraData] = e)
            })(t, n, e)
        }(sI, "ru", [[["\u043f\u043e\u043b\u043d.", "\u043f\u043e\u043b\u0434.", "\u0443\u0442\u0440\u0430", "\u0434\u043d\u044f", "\u0432\u0435\u0447.", "\u043d\u043e\u0447\u0438"], ["\u043f\u043e\u043b\u043d.", "\u043f\u043e\u043b\u0434.", "\u0443\u0442\u0440\u0430", "\u0434\u043d\u044f", "\u0432\u0435\u0447\u0435\u0440\u0430", "\u043d\u043e\u0447\u0438"], ["\u043f\u043e\u043b\u043d\u043e\u0447\u044c", "\u043f\u043e\u043b\u0434\u0435\u043d\u044c", "\u0443\u0442\u0440\u0430", "\u0434\u043d\u044f", "\u0432\u0435\u0447\u0435\u0440\u0430", "\u043d\u043e\u0447\u0438"]], [["\u043f\u043e\u043b\u043d.", "\u043f\u043e\u043b\u0434.", "\u0443\u0442\u0440\u043e", "\u0434\u0435\u043d\u044c", "\u0432\u0435\u0447.", "\u043d\u043e\u0447\u044c"], void 0, ["\u043f\u043e\u043b\u043d\u043e\u0447\u044c", "\u043f\u043e\u043b\u0434\u0435\u043d\u044c", "\u0443\u0442\u0440\u043e", "\u0434\u0435\u043d\u044c", "\u0432\u0435\u0447\u0435\u0440", "\u043d\u043e\u0447\u044c"]], ["00:00", "12:00", ["04:00", "12:00"], ["12:00", "18:00"], ["18:00", "22:00"], ["22:00", "04:00"]]]);
        let aL = (() => {
            class t {
                ngDoBootstrap(e) {
                    console.debug("C-Nocode: AppModule - ngDoBootstrap"), typeof getEswNamespace < "u" ? e.bootstrap(ew, getEswNamespace().renderRoot) : e.bootstrap(ew, window.renderElementRef)
                }
            }

            return t.\u0275fac = function (e) {
                return new (e || t)
            }, t.\u0275mod = zt({type: t}), t.\u0275inj = Pt({
                providers: [{provide: xn, useValue: "ru"}],
                imports: [ya, ZO, mF, HA, jA, II, vk]
            }), t
        })();
        console.debug("C-Nocode: bootstrapModule"), KO().bootstrapModule(aL).catch(t => console.error(t))
    }
}, ne => {
    ne(ne.s = 824)
}]);
