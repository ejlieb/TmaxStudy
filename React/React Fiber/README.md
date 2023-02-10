# React Fiber



##### What is React Fiber?

Fiber는 React v16에서 리액트의 핵심알고리즘을 재구성 재조정(Reconciliation) 엔진이다.

Fiber의 목표는 애니메이션, 레이아웃, 제스처, 중단 또는 재사용 기능과 같은 영역에 대한 적합성을 높이고 다양한 유형의 업데이트에 우선 순위를 지정하는 것이다.



**가장 핵심 기능은 렌더링을 증분하는 것 = 렌더링 작업을 여러 덩어리로 나누어 여러 프레임에 분산하는 기능**



i) 중단 가능한 작업을 덩어리로 나누기

ii) 진행 중인 작업의 우선순위를 지정하고, 리베이스하고 재사용

iii) 리액트의 레이아웃을 지원하기 위한 부모 자식 간의 yield back and forth

iv) `redner()`로부터 다수 엘리먼트들을 반환

v) 에러 바운더리에 대한 더 나은 지원



##### Virtual DOM

Virtual DOM은 Real DOM의 in-memory 표현

UI 표현이 메모리에 저장되며 Real DOM과 동기화

이러한 전체 과정을 재조정(Reconciliation)이라고 한다.



Virtual DOM은 기술보다는 패턴에 가깝고, React에서는 UI를 나타내는 객체로 통용되어 React elements와 연관된다.



React는 컴포넌트 트리에 대한 추가정보를 포함하기 위해  **fibers**라는 내부 객체를 사용한다.

Virtual DOM은 브라우저 API위에 있는 Javascript 라이브러리에서 구현되는 개념!

 

##### Reconciliation

React가 변경해야 할 부분을 결정하기 위해 한 트리를 다른 트리와 비교하는 데 사용하는 알고리즘



React API의 핵심 아이디어는 업데이트를 통해 전체 앱을 다시 렌더링하도록 하는 것

이를 통해 개발자는 앱을 다른상태로 효율적으로 전환하는 방법에 대해서는 걱정하지 않고 선언적 개발이 가능하다.



하지만 문제는 각 변경사항마다 전체앱을 재렌더하면 성능이 저하된다는 점이다.



그렇기 때문에 성능을 유지하면서 전체 앱을 리렌더링할 수 있는 최적화 방법이 재조정 과정에 포함되었다.



1. React 애플리케이션을 렌더하면 앱을 묘사하는 노드의 트리가 생성되어 메모리에 저장
2. 트리는 렌더링 환경으로 전달( ex) 브라우저 환경이라면 DOM 조작으로 변환) 
3. 앱이 업데이트되면 새 트리가 생성 / 새 트리는 이전의 트리와 구분된다



이때 알고리즘은 다음과 같다

- 컴포넌트 타입이 다르면 실질적으로 다른 트리를 생성한다고 가정. 따라서 리액트는 이를 구분하지 않고 이전의 트리를 완전히 교체
- 목록은 kety를 통해 구분. 따라서 key는 안정적이고 예측가능하고 유니크해야한다.



##### Reconciliation과 Rendering

React에서는 재조정과 렌더링의 단계가 별개이다.

- Reconciler는 트리의 어떤 부분이 변경되었는지를 계산

- 이후 Render는 계산된 정보를 통해 앱을 실제로 업데이트



이렇게 둘을 분리하게 되면 React DOM과 React Native가 React Core에서 제공하는 동일한 Reconciler를 공유하면서 자체적인 Renderer를 사용할 수 있다.



Fiber는 Reconciler를 재구현하는 역할이다.

- UI에서 모든 업데이트를 즉시 적용할 필요는 없다
- 다른 유형의 업데이트들은 우선순위가 다르다
- push 기반 접근법은 개발자가 스케쥴 일정을 결정해야하지만 pull 기반 접근법은 react가 대신한다.



그래서 스케쥴링의 이점을 활용하기 위해 React의 핵심 알고리즘을 정비하는 것이 Fiber이다.



##### Fiber

Fiber는 구체적으로 다음과 같은 일을 수행한다

- 일을 잠시 멈추고 나중에 다시 돌아오기
- 다른 유형의 일에 우선권 부여하기
- 이전에 완성한 작업을 재상요하기
- 더이상 필요하지 않은 작업을 중단하기



이를 위해 단위별로 세분화해야하며 이 모든 과정을 Fiber라고 할 수 있다.

Fiber는 이처럼 작업의 한 단위를 나타낸다.



데이터의 함수로서 React Component는 보통 다음과 같다

```javascript
v = f(d)
// view는 data에 대한 function의 결과
```



React앱을 렌더링하는 것은 다른 함수들을 호출하는 body를 가진 함수를 호출하는 것과 동일하다고 볼 수 있다.

컴퓨터가 프로그램 실행을 추적할 때 일반적으로 Call Stack을 이용한다. 함수가 실행되면 스택에 새 stack frame이 추가된다

UI 렌더링에 최적화되도록 Call Stack의 동작을 사용자 지정하고 Call Stack과 Stack Frame을 조작할 수 있게 하는 것이 Fiber의 목적이다.



Fiber는 React Component에 특화된 Stack의 재구성이다. 하나의 Fiber가 곧 virtual stack frame과 같다.

Stack을 재구성함으로써ㅓ stack frame을 메모리에 보관하고 언제든지 실행하여 스케줄링 목표를 달성할 수 있다.

stack frame을 수동으로 처리하면 concurrency 및 error boundary와 같은 기능들에 대한 잠재력을 확보할 수도 있다.



##### Fiber 구조



Fiber는 Component 및 Componenet의 입출력에 대한 정보를 포함한 자바스크립트 객체이다

Fiber는 stack frame이기도 하지만 컴포넌트의 인스턴스이다.



Fiber의 주요 field들은 다음과 같다.



`type`과 `key`

Type과 Key는 재조정 시에 fiber가 재사용될 수 있는지 판단할 때 사용된다.



`child`와 `sibling`

다른 fiber들을 가리킨다. 재귀적 트리구조를 묘사한다.

child는 Component의 렌더 메서드에 의해 반환된 값들이다.

```react
function Parent() {
    return <Child />
}
```



sibling은 render가 여러 자식들을 반환하는 케이스를 설명한다.

```react
function Parent() {
    return <Child1 />, <Child2 />
}
```





