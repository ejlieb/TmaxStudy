# Typescript_Intermediate

#### Utility Types - Basic

1. Record<K, T>

Record 타입은 두개의 제네릭 타입을 받을 수 있다.

K는 key값의 타입, T는 값의 타입으로 갖는 타입을 리턴한다.

```typescript
type Record<K, T> = {
    [P in K]: T;
};
```

```typescript
type IFieldValue = {
  name: string;
  value: number;
};

type IFormName = 'event' | 'point';

const x: Record<IFormName, IFieldValue> = {
  event: {
    name: 'foo',
    value: 0,
  },
  point: {
    name: 'foo',
    value: 30,
  }
}
```

Record 타입은 Index Signature 방식과 비슷하다. 인덱스 시그니처는 대괄호로 객체를 접근하는 방법이다.

```typescript
type humanInfo = { 
  [name: string]: number 
};

let human:humanInfo = {
  '홍길동': 20,
  '둘리': 30,
  '마이콜': 40
};
// Index Signature

type humanInfo = Record<string, number>

let human:humanInfo = {
  '홍길동': 20,
  '둘리': 30,
  '마이콜': 40
};

// Record Type
```

차이점은 인덱스 시그니처는 문자열 리터럴을 Key로 사용할 수 없다는 점이다.

Record 타입은 가능하다.

```typescript
type names = '홍길동' | '둘리' | '마이콜';

type humanInfo = Record<names, number>

let human:humanInfo = {
  '홍길동': 20,
  '둘리': 30,
  '마이콜': 40
};
```



2. Exclude<T, U>

Exclude타입은 2개의 제네릭 타입을 받을 수 있다.

첫번째 타입 T 중 두번째 타입 U와 겹치는 타일을 제외한 타입을 반환한다. (차집합과 비슷)

```typescript
type Exclude<T, U> = T extends U ? never: T;
```

타입 T가 U를 상속하거나 동일 타입이라면 무시하고 아닐 경우 타입 값을 리턴한다.

```typescript
type OnlyNumber = Exclude<string|number, string>;
// Onlynumber는 number 타입이다.
```



3. Extract<T, U>

첫번째 제네릭 타입 T에 대하여 제네릭 타입 U 중 할당 가능한 타입을 할당한다. Exclude와 반대되는 개념

```typescript
type Extract<T, U> = T extends U ? T: never;
```

T 타입에서 U타입과 겹치는 타입만을 추출하는 것

```typescript
type Event = {
  id: string;
  title: string;
};

type Point = {
  target: string;
  amount: number;
};

type PointInfo = Extract<Event|Point, Point>;
// PointInfo 타입과 Point 타입은 동일한 타입이다.
```



4. Pick<T, K>

T타입으로 부터 K 프로퍼티만을 추출한다.

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

T내에서 Union 타입 K라는 프로퍼티에 대한 타입을 뽑아낸다.

```typescript
interface Event {  
  id: string;
  title: string;
  isDone: boolean;
  startDate: string;
};

type BaseInfo = Pick<Event, 'id' | 'title'>;

interface PickedEvent {
  id: string;
  title: string;
};
// BaseInfo 타입과 PickedEvent 타입은 동일한 타입이다
```



5. Omit<T, K>

Omit은 T 타입으로부터 K key를 제외하고 반환한다. 이 때 K는 스트링 리터럴이나 스트링 리터럴 유니온 타입이다.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}
 
type TodoPreview = Omit<Todo, "description">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};
 
todo;
 
const todo: TodoPreview
 
type TodoInfo = Omit<Todo, "completed" | "createdAt">;
 
const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};
 
todoInfo;
   
const todoInfo: TodoInfo

```



#### Template Literal Type

Template Literal Type은 기존 String Literal Type을 기본으로 새로운 타입을 만드는 도구이다!



1. 가장 간단한 형태의 탬플릿 리터럴

```typescript
type Toss = 'toss';

// type TossPayments = 'toss payments';
type TossPayments = `${Toss} payments`;
```

'toss'타입을 바탕으로 'toss payments'타입을 만드는 경우 이전에는 이런 문자열 작업이 불가능했지만 탬플릿 리터럴 타입을 통해 가능해졌다.



2. 하나의 Union Type

```typescript
type Toss = 'toss';
type Companies = 'core' | 'bank' | 'securities' | 'payments' | 'insurance';

// type TossCompanies = 'toss core' | 'toss bank' | 'toss securities' | ...;
type TossCompanies = `${Toss} ${Companies}`
```

Union Type과 함께 사용하면 결과물도 Union Type이 된다.



3. 여러개의 Union Type

```typescript
type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

// type Alignment =
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"
type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`;
```

여러개의 Union Type을 연결할 수 있다. 원래는 중복해서 Alignment 타입을 다시 정의해야 했지만 탬플릿 리터럴 타입을 통해 더욱 간결해졌다.



#### Template Litertal Type with Conditional Type

탬플릿 리터럴 타입은 컨디셔널 타입과 함께 더 강력하게 사용할 수 있다.



##### Conditional Type

컨디셔널 타입은 삼항 연산자와 비슷하게 분기를 수행하면서 타입을 추론하는 방법이다.



1. 제네릭 타입 인자 꺼내오기

컨디셔널 타입을 가장 자주 사용하는 경우로, Promise<number>와 같은 타입에서 number를 꺼내오고 싶을 때

```typescript
type PromiseType<T> = T extends Promise<infer U> ? U : never;

// type A = number
type A = PromiseType<Promise<number>>;

// type B = string | boolean
type B = PromiseType<Promise<string | boolean>>;

// type C = never
type C = PromiseType<number>;
```

위코드를 살펴보면 `PromiseTypes<T>` 타입에 `Promise<number>`타입을 인자로 넘기면 number 타입을 얻는다.

삼항 연산자처럼 생긴 부분의 `T extends Promise<infer U>` 부분에서는 T타입의 변수가 Promise<infer U> 타입에 할당 될 수 있는지에 따라 참 값이 판별된다.

이 때 조건식이 참으로 평가되면 infer 키워드를 사용할 수 있다.

- `Promise<number> extends Promise<infer U>` 와 같은 경우 U타입은 number타입으로 추론된다.



2. Tuple 다루기

`[string, number, boolean]`과 같은 튜플 타입에서 `[number, boolean]`만 가져오고 싶을 때 Conditional Type과 Variadic Tuple Tpye을 이용해서 이를 구현할 수 있다.

```typescript
type TailOf<T> = T extends [unknown, ...infer U] ? U : [];

//type A = [boolean, number]
type A = TailOf<[string, boolean, number]>;

```



첫 요소를 제외하고  `...infer U` 구문을 이용해 뒤의 요소들을 모두 선택할 수 있다.



##### Conditional Type과 Template Literal Type을 함께 사용하기



1. 간단한 추론

```typescript
type InOrOut<T> = T extends `fade${infer R}` ? R : never;

// type I = "In"
type I = InOrOut<"fadeIn">
// type O = "Out"
type O = InOrOut<"fadeOut">
```

fadein fadeout에서 fade 접두사를 버리고 In, Out만 가져오고 싶을 때 이런식으로 활용할 수 있다.



2. 문자열에서 공백 없애기

```typescript
// type T = "Toss"
type T = TrimRight<"Toss     ">; 
```

TrimRight<T>타입은 재귀적 타입 선언을 활용한다.

```typescript
type TrimRight<T extends string> = 
	T extends `${infer R} `
	? TrimRight<R>
	: T;
```

위의 코드에서 ${infer R}뒤에 공백이 한칸 있다.

T타입의 오른쪽에 공백이 하나 있다면, 공백을 하나 빠뜨린 것을 R타입으로 추론하고 다시 TrimRight<R>을 호출한다.

공백이 더 이상 존재하지 않는다면 원래 주어진 타입 그대로를 반환한다.



3. 점으로 연결된 문자열 split 하기

```typescript
type Split<S extends string> = 
  S extends `${infer T}.${infer U}` 
    ? [T, ...Split<U>] 
    : [S];

// type S = ["foo", "bar", "baz"];
type S = Split<"foo.bar.baz">;
```

주어진 S타입에서 첫번째 .을 찾고 그 앞부분을 T, 뒷부분을 U로 추론한다. 이후 재귀적으로 하나씩 값을 이어나가면서 원하는 결과타입을 만들어나간다.



4. lodash.set()함수 타입 추론하기

`lodash.set()`은 문자열로 된 접근자를 이용하여 객체의 깊은 프로퍼티까지 수정할 수 있는 함수다.

```typescript
const someObject = {
    toss: {
        core: {
            client: {
                platform: "foo"
            }
        }
    }
};

// this is Ok
lodsahSet(someObject, "toss.core.client", {platform: 'bar'});

// Error: "bar"is not assignable to type "{platform: string}"
lodsahSet(someObject, "toss.core.client", bar)

```

Template Literal Type이 나오기 전에는 이런 함수는 타입-안전하게ㅔ 사용할 수 없어 세번째 인자를 any로 규정해야 했다. 하지만 타입 정의를 조합하면 lodash.set()을 더욱 안전하게 사용가능하다.



우선 `ValueOf<T, P>` 타입이 필요하다. 이는 객체 T와 접근 경로 P가 주어졌을 때 T를 P경로로 순서대로 접근했을 때 결과로 나오는 타입을 나타낸다.



```typescript
interface Foo {
    foo: {
        bar: {
            baz: string
        }
    }
};

// type A = { bar: { baz: string } };
type A = ValueOf<Foo, ['foo']>;

// type B = { baz: string };
type B = ValueOf<Foo, ['foo', 'bar']>;

// type C = string;
type C = ValueOf<Foo, ['foo', 'bar', 'baz']>;
```



만약 위와 같은 `ValueOf<T,P>가 있다면, 위에서 만들었던 Split<S>와 조홥하여 쉽게 lodash.set()함수에 타입을 부여할 수 있다.

