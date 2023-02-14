# Typescript

### 타입스크립트는 무엇인가?

타입스크립트는 자바스크립트를 기반으로 레이어하고 있다. 자바스크립트의 기능들을 제공하면서 그 위에 자체 레이어를 추가한다. 그 레이어가 타입스크립트 타입 시스템이다.



### 왜 타입스크립트를 사용하는가?

자바스크립트로 작성되는 프로그램의 크기와 범위가 기하급수적으로 증가하였으나 서로 다른 코드 단위 간의 관계를 표현하는 자바스크립트 언어 자체의 능력을 그렇지 못했다. 또한 자바스크립트의 런타임 의미 체계는 자바스크립트 개발을 규모에 맞게 관리하기 어렵게 만들었다.



### 타입스크립트는 어떤 목표를 가지고 있는가

타입 스크립트는 자바 스크립트의 static typechecker로 기능하는 것이다. 여기서 static이라는 정적의 뜻은 자바스크립가 실행되기 전에 타입이 맞는 지 체크한다는 뜻이다.



### 타입

가장 기본적인 타입 표현법

``` typescript
let mynum: number = 21
```

##### 변수에 대한 타입 표기

const, let, var 등을 사용하여 변수를 표기할 때 타입 표기는 선택사항이다. 보통 자동으로 추론해준다.

##### 함수에 대한 타입 표기

1. 매개변수 타입 표기

   함수를 선언할 때 함수가 허용할 매개변수 타입을 표기. 

   ```typescript
   // 매개변수 타입 표기
   function greet(name: string) {
     console.log("Hello, " + name.toUpperCase() + "!!");
   }
   ```

2. 반환 타입 표기

   반환타입을 표기. 그러나 변수와 마찬가지로 선택적이다. 

   ```typescript
   function getFavoriteNumber(): number {
     return 26;
   }
   ```

3. 익명 함수

​	함수가 코드상에서 위치한 곳을 보고 해당 함수가 어떻게 호출될지 알아낼 수 있다면 해당 함수의 매개 변수에 자동으로 타입을 부여



##### Primitive types

1. string, number, boolean
   - 각각 문자열, 숫자, 불린 타입
2. array
   - 배열의 타입을 지정할 때는 `Array<type>`의 형태로 작성 가능하고 `type[]` 형태로도 작성 가능하다.
3. any
   - 타입스크립트의 만능 해결키.. 남발하지 말자



##### Object types

오브젝트는 후에 따로 인터페이스나 타입을 사용하여 정의하기도 한다.

```typescript
// 매개 변수의 타입은 객체로 표기되고 있습니다.
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```



- Optional Properties

  - object 타입에서는 프로퍼티를 옵션으로 지정할 수 있다. 프로퍼티명 뒤에 `?`를 붙여준다.

  - ```typescript
    function printName(obj: { first: string; last?: string }) {
      // ...
    }
    // Both OK
    printName({ first: "Bob" });
    printName({ first: "Alice", last: "Alisson" });
    ```

  - 자바스크립트에서 없는 프로퍼티에 접근하고자 하면 undefined를 반환하기 때문에 옵셔널 프로퍼티를 이용할 때는 항상 체크해주자.

##### Union Types

타입스크립트 시스템에서 여러가지 타입들을 조합할 수 있도록 한다.

```typescript
unction printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
```

유니온을 쓸 경우 타입스크립트는 유니온 된 모든 타입들에서 가능한 것들만 허용한다는 점을 유의해야 한다.

예를 들어 `string | number`일 경우 string에서만 허용되는 메소드는 허용되지 않고 string과 number 모두에서 허용되는 메소드만 허용된다.



##### Intersection Types

Union Types가 여러가지 타입들을 조합하는 Or의 느낌이라면 Intersection Types는 모든 타입을 만족하는 And의 느낌이다.

```typescript
type Programmer = { favoriteLanguage: string };
const programmer: Programmer = { favoriteLanguage: 'TypeScript' };

type BeerLover = { favoriteBeer: string };
const beerLover: BeerLover = { favoriteBeer: 'Imperial Stout' };

type BeerLovingProgrammer = Programmar & BeerLover;
```

이런식으로 프로그래머 타입과 Beerlover타입을 모두 만족하는 타입을 표현할 때 &를 사용하여 표현한다.

`A & B` 타입은 A와 B 모두에 할당 가능해 한다. 만약 A,B가 객체타입이라면  `A & B` 타입의 객체는  A와 B에 정의된 속성 모두를 가져야 한다.



인터색션에서는 어떠한 값도 만족하지 않을 수도 있다.

```typescript
type Infeasible = string & number
```

문자열인 동시에 숫자인 타입은 없으므로 Infeasible 타입은 실제로 어떤 값도 가질수 없다.



#### Utility Types

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



##### Type Aliases

type은 타입을 재사용하기 위해서 사용한다. 앞의 방식처럼 변수나 함수 등에 직접 타입을 명시할 수도 있지만 type을 사용하면 재사용이 더욱 편리해진다.



```typescript
type Point = {
  x: number;
  y: number;
};
 
// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```

Object 형태가 아니어도 된다.

```typescript
type ID = number | string;
```



##### Interface

인터페이스도 타입과 거의 동일한 역할을 수행한다.

둘의 차이는 인터페이스는 항상 확장가능하다는 점이다.

```typescript
interface Point {
  x: number;
  y: number;
}
 
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```

```typescript
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear() 
bear.name
bear.honey

-------------------------------------------------------------------------------

interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

이 때 인터페이스는 다수를 동시에 확장할 수 있다. 이 경우 확장 대상이 되는 인터페이스들은  `,`  로 구분한다. 새로 정의할 인터페이스는 모든 확장 대상 인터페이스의 속성에 자신의 속성을 더한 타입을 갖는다.



##### Callable

Callable은 타입 또는 인터페이스의 일부가 될 때 타입을 붙일(annotate) 수 있다.

- Callable은 `()`을 말한다.

```typescript
interface ReturnString {
  (): string
}

declare const foo: ReturnString;
const bar = foo(); // bar는 문자열 타입인 것으로 추론됨
```



##### Narrowing

타입스크립트에서는 타입을 한정해야하는 경우가 있다. 대표적으로 Union을 사용하는 경우를 예시로 보자.

```typescript
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;
}
```

이런 코드가 있다면

`Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.`

라는 에러가 발생할 것이다. 

이럴 경우

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

와 같이 해결할 수 있다.



이러한 narrowing이 없다면 타입스크립트는 불필요한 런타임 검사를 계속해야할 것이다.



##### Type Guard

특정 스코프 내에서 Narrowing을 유발하는 표현을 타입가드라고 한다. 특정 조건이 만족될 때만 코드를 실행하거나, 순차적 실행을 가능하게 하는 제어 구조를 제공한다. 대표적으로

`if, else if, else`

`while, for`

`switch, case`

`break, continue`

`return`

등이 있다.

컴파일러는 이런 제어구조로부터 코드의 특정 시점에서 갖는 상태에 대한 정보를 얻을 수 있다. 이 정보를 이용해 control flow analysis를 진행해 특정 값의 타입을 좁혀낼 수 있다.



#### Type 추론

Compiler는 타입 추론을 통해 명시적인 타입 표기 없이도 타입 정보를 이해할 수 있다.



```typescript
let x:number = 3;

let x = 3;  // number 타입 추론
```



하나의 값에 대한 타입 추론은 단순하나 여러 값이 연관된 타입을 추론할 때는 **최적 공통 타입**이라는 접근법을 사용한다. 모든 가능한 타입의 유니온 타입을 사용하는 것이다.



```typescript
interface Animal {
    legs: number;
}

interface Dog extends Animal {
    bark(): void;
}

interface Car extends Animal {
    meow(): void;
}

let dog: Dog;
let cat: Cat;
const dogAndCat = [dog, cat];  // Array<Dog | Cat>
```



할당이 일어날 때 타입추론은 할당 반는 값(왼쪽 항) 뿐만 아니라 할당하는 값(오른쪽 항)

의 타입에 대해서도 일어난다. 이것을 `Contextual Type`이라고 한다.



#### Type Assertion

컴파일러가 가진 정보를 무시하고 프로그래머가 임의로 타입을 할당하는 행위이다.

보통 

`value as Type` 의 형태로 타입을 단언한다.



```typescript
interface Dog {
    legs: 4;
   	bark(): void;
}

interface Insect {
    legs: number;
    creepy: boolean;
}

interface Fish {
    swim(): void;
}

type Animal = Dog | Insect | Fish;

function doSOmethingWithAnimal(animal: Animal) {
    (animal as Fish).swim();
}
```

Type Assertion은 타입 에러를 없애줄 뿐 런타임 에러를 막아주지 않는다.



다중 단언을 하는 방법도 있다.

```typescript
interface Dog {
    legs: 4;
   	bark(): void;
}

interface Insect {
    legs: number;
    creepy: boolean;
}

const dog:Dog = {
    legs: 4,
    bark() {
        console.log('bark');
    } 
}

const insect: Insect = dog as Insect;

// error TS2352: Type 'Dog' cannot be converted to type 'Insect'.
//   Property 'creepy' is missing in type 'Dog'.


const insect2: Insect = (dog as any) as Insect; // ok
```









