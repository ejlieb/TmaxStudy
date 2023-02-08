# React Optimization



### Memo

1. `UseMemo()`

   - react hook

   - 불필요한 계산과 리렌더링 방지를 위해 사용

   - memoized 된 값 리턴한다.

   - ```javascript
     const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
     ```

   - 두번째 인자 deps의 값이 변경될 때만 값을 다시 계산한다.
   - 함수를 실행 후 결과를 반환하기 때문에 변수에 할당하지 않고 특정 값이 변경될때만 함수를 실행시키는 용도로 사용 가능
   - 성능최적화를 위해 사용하지만 의미상으로 보장이 있지는 않다. 추후에 메모이제이션된 값들의 일부를 삭제하고 다음 렌더링 시 재계산하는 방법을 채용할 수도 있다.

2. `UseCallback()`

   - react hook

   - memoized된 콜백을 리턴한다.

   - ```javascript
     const memoizedCallback = useCallback(
       () => {
         doSomething(a, b);
       },
       [a, b],
     );
     ```

   - `useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 같다.

   - 함수를 실행하지 않고 반환한다! => 보통의 경우 변수에 할당해서 사용

   - deps값이 변하면 새로운 함수를 반환하게 된다. 즉 이전의 함수와 함수 이름만 같을 뿐 메모리가 다른 함수를 반환한다.

   - 부모 컴포넌트에서 state가 변하여 리렌더링이 발생하면 안에서 정의된 함수가 새로운 메모리를 참조하기 때문에 자식 컴포넌트에 넘겨준 prop이 바뀌었다고 판단하여 자식 컴포넌트도 새롭게 렌더링하게 된다. 이를 방지하기 위해서 useCallback을 사용하여 함수를 작성하며 메모이즈된 함수(메모리 참조값이 같은 함수)가 prop으로 넘겨지기 때문에 부모 컴포넌트가 변경될 때 불필요하게 자식 컴포넌트가 리렌더 되는 것을 방지할 수 있다.

3. `React.Memo()`

   - React HOC(Higher-Order-Component) = 컴포넌트를 인자로 받아 새로운 컴포넌트 return 해준다.

   - ```javascript
     const MyComponent = React.memo(function MyComponent(props) {
       /* props를 사용하여 렌더링 */
     });
     ```

   - 동일한 props로 동일한 결과를 렌더한다면 결과를 메모이즈 해서 사용

   - prop의 변화에만 영향을 받음. 만약 컴포넌트 내부에서 state가 변화되어 리렌더링한다면 이것에는 영향을 주지 않는다.

   - 오직 성능 최적화를 위해 사용 / 렌더링 방지 용도로는 사용하지 말자



### Suspense

Suspenses는 기본적으로 컴포넌트의 로드 상태를 선언적으로 지정한다. Suspense를 사용하면 컴포넌트의 렌더링을 어떤 작업이 끝날 때까지 중단시키고 다른 컴포넌트를 먼저 렌더링 할 수 있다. 



- 비동기 데이터를 처리하는 데 있어서 효과

- Waterfall 현상을 완화시킬 수 있다.
- 컴포넌트가 각각 로딩 상태를 관리하게 해야했던 기존 방식 대신 원하는 만큼 묶어서 관리할 수 있다.
- React.lazy와 함께 사용하여 동적 import를 통해 Code split 구현 가능
- Suspense를 사용하게 되면 기존에 useEffect를 통해 데이터를 패칭해오는 경우 DOM이 마운트 된 이후 데이터를 가져오는 방법에서 컴포넌트를 렌더링하는 동안 데이터를 가져올 수 있다.
- SSR 방식에서는 데이터를 모두 패칭한 이후 html을 스트리밍(렌더링)할 수 있는데, Suspense를 사용하여 특정 컴포넌트를 기다리지 않고 나머지 페이지의 html을 스트리밍할 수 있게 한다.





### React.lazy

React.lazy를 통해 동적 import를 사용할 수 있다.

```javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

React 컴포넌트를 default export로 가진 모듈 객체가 이행되는 Promise를 반환한다

Lazy 컴포넌트는 반드시 Suspense 컴포넌트 하에서 렌더링 되어야 한다.





### Concurrent Rendering(React 18)

React 18은 concurrent 렌더링의 개념을 지원한다.

React는 동시에 여러개의 UI 인스턴스의 렌더링을 준비한다.

Concurrent 렌더링에서는 기존에 디바운싱 혹은 스로틀링으로 해결하던 문제를 해결하기 위한 새로운 Hook이 등장

1. `UseTransition`

함수 실행의 우선순위를 지정한다. UseTransition은 isPending과 StartTransition을 반환하는데 StartTransition의 인자로 넘어간 함수는 우선순위가 낮은 함수로 실행된다.

예를 들어 버튼을 눌러 Count가 1씩 증가되고 이를 보여주는 페이지가 있다면, StartTransition에 Count증가함수를 할당하면 다른 이벤트가 발생하는 동안 Count 증가 함수의 실행을 지연하고 그 동안 isPending에 할당된 Spinner를 보여주는 식이다.



2. `UseDefferedValue`

값의 업데이트의 우선순위를 지정한다. 우선순위가 높은 작업을 실행하는 동안 이전 값을 계속 들고 있으면서 업데이트를 지연한다.

그렇기 때문에 값의 setState함수에 대한 권한이 없는 / 위에서 전달되는 값에 대해 사용하면 유용하다.

UseMemo와 함께 사용하면 유용하다.

```javascript
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```



3. `Suspense SSR`

React 상에서 SSR을 지원하는 기존 방식의 가장 큰 문제점

1. 컴포넌트가 데이터를 기다리도록 하지 않는다.
   - html을 렌더하는 시점에서 서버에서 컴포넌트 렌더에 필요한 모든 데이터가 준비되어있어야 한다.
   - ex) 댓글이 있는 포스팅의 경우 댓글을 빠르게 보여주기 위해 댓글을 SSR에 포함시키고 싶지만, 댓글 데이터를 가져오는 부분에서 시간이 많이 걸릴 수도 있다. 이 경우 댓글 컴포넌트를 SSR에서 제외한다면 댓글 컴포넌트는 자바스크립트가 완전히 로딩 되어 리액트가 다시 DOM에 해당 컴포넌트를 그릴 때까지 볼 수 없다. 반대로 포함시킨다면 댓글 데이터를 가져오는 시간만큼 나머지 모든 HTML의 전송을 지연시킨다.
2.  Hydrate 전에 모든 자바스크립트가 로드되어 있어야 한다.
   - hydrate는 react가 로드되고 난 뒤 메모리에 컴포넌트를 렌더링하고 이벤트 핸들러를 붙이는 과정
   - 만약 댓글 컴포넌트의 자바스크립트를 로드하기 위해 꽤 많은 시간이 걸린다고 가정했을 때, 댓글관련 자바스크립트가 모두 로드 되기 전까지 페이지의 나머지 컴포넌트들 또한 하이드레이션이 불가능하다.
   - Code split을 통해 컴포넌트를 각각 로드할 수 있지만, Code split 한 컴포넌트는 최초 Hydration에서 제외된다.
3. Hydration과정은 멈추지 않는다.
   - 따라서 하이드레이션이 한번 시작되면 모든 하이드레이션이 완료되기 전까지 어떤 컴포넌트도 상호작용할 수 없다.
   - 전체 컴포넌트 트리가 하이드레이션되기 전까지 유저는 댓글 뿐만 아니라 모든 페이지에서 상호작용이 불가능하다.



이 세가지 문제점의 공통점은 Waterfall방식이라는 점이다. 하나가 완료되고 하나가 시작되는 형태는 Concurrent하지 못하다. 그렇기 때문에 Waterfall 방식의 SSR은 비효율적이다.



React 18에서는 이를 해결하기 위해 2가지 SSR Feature가 사용 가능하다.

1. Streaming HTML

   - Suspense 태그를 통해 특정 컴포넌트를 기다리지 않고 나머지 페이지가 HTML을 스트리밍할 수 있게 해준다.
   - ex) 댓글 컴포넌트의 데이터가 패칭되는 동안 댓글 컴포넌트는 fallback spinner를 띄우고 나머지 페이지를 스트리밍한다. 이후 데이터 패칭이 완료되면 댓글 컴포넌트를 렌더한다. 이를 통해 문제 1번을 해결할 수 있다.

2. Selective Hydration

   1. Hydrating Page before all the code is has loaded

      - Suspense태그를 통해 나머지 페이지 컴포넌트들에 대한 Hydration을 수행할 수 있다.

      - 이를 통해 무거운 자바스크립트 코드 파트가 나머지의 상호작용과 렌더를 방해하지 않도록 한다.

   2. Hydrating Page before all the HTML has been streamed

      - Suspense는 일관적으로 non-blocking하게 동작한다.
      - React는 먼저 도착한 것을 먼저 처리한다. 만약 HTML보다 나머지 부분의 자바스크립트가 먼저 로드되었다면 나머지 부분을 먼저 Hydration한다.
      - 이는 React의 선언적 속성이 적용된 것이다.

   3. Hydration이 브라우저를 완전히 점유하지 않는다.

      - 예를 들어 Suspense로 감싼 댓글컴포넌트가 Hydration되고 있을 때 네비게이션 바에서 상호작용할 수 있다.

### Tree shaking





