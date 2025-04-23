console.log("Hello from script.js");

// functional
const log =
  (prefix) =>
  (...args) => {
    console.log(`${prefix}: `, ...args);
  };

const { of, from, take, map, takeUntil } = rxjs;
const { interval, fromEvent } = rxjs;
const { ajax } = rxjs.ajax;
// flatMap is deprecated, use mergeMap instead (v8)
const { flatMap, mergeMap } = rxjs.operators;
const { debounce, throttle } = rxjs.operators;
const { combineLatest } = rxjs.operators;

// of
const one$ = of(1);
one$.subscribe(log("of"));

// from
const two$ = from([1, 2, 3]);
two$.subscribe(log("from"));

// map
one$.pipe(map((x) => x * 2)).subscribe(log("map"));

// mergeMap
const three$ = from([1, 2, 3]);

three$
  .pipe(
    mergeMap((x) => {
      log("mergeMap...")(x);
      return from(Array.from({ length: x * 2 }).map((_, i) => i));
    })
  )
  .subscribe(log("mergeMap"));

// interval
interval(1000)
  .pipe(
    take(5),
    map((x) => x * 2)
  )
  .subscribe(log("interval take 5 map"));

// ajax
const posts$ = ajax("https://jsonplaceholder.typicode.com/posts");

const postsPer10$ = posts$.pipe(
  map(({ response }) => response.slice(0, 10))
  // take(1)
);

postsPer10$.subscribe(log("ajax"));

const post$ = posts$.pipe(
  map(({ response }) => response.slice(0, 10)),
  mergeMap((posts) => {
    return from(posts);
  }),
  map((post) => {
    return post.title;
  })
);

post$.subscribe(log("ajax mergeMap"));

// takeUntil
const destory$ = new rxjs.Subject();
const interval$ = interval(1000)
  .pipe(
    takeUntil(destory$),
    map((x) => x * 2)
  )
  .subscribe(log("interval takeUntil"));

setTimeout(() => {
  destory$.next();
  destory$.complete();
  console.log("destroy");
}, 10000);

// formEvent
const $input = document.querySelector("#input");

const fromInputEvent$ = fromEvent($input, "input", {
  capture: false,
}).pipe(
  map((e) => e.target.value),
  take(5)
);

fromInputEvent$.subscribe(log("input"));

setTimeout(() => {
  fromInputEvent$.subscribe(log("input timeout"));
}, 10000);

// debounce
const debounce$ = fromEvent($input, "input", {
  capture: false,
})
  .pipe(
    map((e) => e.target.value),
    debounce(() => interval(1000))
  )
  .subscribe(log("debounce"));

// throttle
// 연속 클릭한 경우 설정된 초동안 1번씩만 실행되도록 한다.
const $button = document.querySelector("#button");
const throttle$ = fromEvent($button, "click", {
  capture: false,
})
  .pipe(
    map((e) => e.target),
    throttle(() => interval(1000))
  )
  .subscribe(log("throttle"));

/**
 * subjects
 */
// 1. Subject : 구독할때 next를 설정한 값을 전달 - 구독 이후 next 값만 받을수 있음
const subj$ = new rxjs.Subject();

subj$.subscribe(log("subj$ 1"));

subj$.next(1); // subscribe 1
subj$.next(2); // subscribe 1

subj$.subscribe(log("subj$ 2")); // no default value
subj$.next(3); // subscribe 1, subscribe 2

// 2. BehaviorSubject : 구독할때 마지막 값(next 설정전 기본값을 파라미터로 설정)을 전달
const subj2$ = new rxjs.BehaviorSubject(0);

subj2$.subscribe(log("subj2$ 1")); // default value 0

subj2$.next(1); // subscribe 1
subj2$.next(2); // subscribe 1

subj2$.subscribe(log("subj2$ 2 subscribe 2")); // default value 2
subj2$.next(3); // subscribe 1, subscribe 2

// 3. ReplaySubject : 구독할때 이전값을 지정(파라미터로 설정)한 만큼 전달
const subj3$ = new rxjs.ReplaySubject(2);

subj3$.subscribe(log("subj3$ 1")); // no default value

subj3$.next(1); // subscribe 1
subj3$.next(2); // subscribe 1
subj3$.next(3); // subscribe 1
subj3$.next(4); // subscribe 1
subj3$.next(5); // subscribe 1

subj3$.subscribe(log("subj3$ 2")); // default value 4, 5

subj3$.next(6); // subscribe 1, subscribe 2
subj3$.next(7); // subscribe 1, subscribe 2
subj3$.next(8); // subscribe 1, subscribe 2

// 4. AsyncSubject : 마지막 값(next 설정전 기본값을 파라미터로 설정)을 전달
// 구독이 완료(complte)될때까지 next값을 전달하지 않음
const subj4$ = new rxjs.AsyncSubject();
subj4$.subscribe(log("subj4$ 1")); // no default value
subj4$.next(1); // no value
subj4$.next(2); // no value
subj4$.next(3); // no value
subj4$.next(4); // no value

subj4$.subscribe(log("subj4$ 2")); // no default value
subj4$.next(5); // no value
subj4$.next(6); // no value

subj4$.complete(); // subscribe 1, subscribe 2

// 5. as Observable : Subject를 Observable로 변환 - 구독용 객체
const subj5$ = new rxjs.Subject();
const obs$ = subj5$.asObservable();
obs$.subscribe(log("obs$ 1")); // no default value
obs$.subscribe(log("obs$ 2")); // no default value
subj5$.next(1); // subscribe 1, subscribe 2
subj5$.next(2); // subscribe 1, subscribe 2
subj5$.next(3); // subscribe 1, subscribe 2
