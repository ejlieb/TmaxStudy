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











