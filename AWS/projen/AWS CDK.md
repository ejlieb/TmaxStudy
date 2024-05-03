# AWS CDK



#### Project Structure using Projen

Projen은 Project Configuration management 툴이다. 모든 프로젝트 config를 간단한 자바스크립트 파일 하나로 관리하고, synthesize 할 수 있다. (package.json, .gitignore, .eslintrc.json 등등).

현재 CDK Project의 Standard와도 같다. 



#### Step 1

Prerequisites

- AWS 계정 & IAM User or Role
- AWS CLI
- Node.js(recommended ver 16)
- IDE
- Git



```sh
$ mkdir prod-ready-cdk && cd prod-ready-cdk
$ git init
$ npx projen new awscdk-app-ts
```

위 과정을 거치면 Project가 생성된다.



##### .projenrc.js

```javascript
import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'prod-ready-cdk',
  projenrcTs: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
```

라는 파일이 생성된다.

```javascript
import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'prod-ready-cdk',
  projenrcTs: true,
  repository: 'https://github.com/ejlieb/projen.git',
  keywords: [
    'AWS CDK',
    'projen',
    'Typescript',
    'Deployment',
  ],
   // keyword는 package.json에 keyword로 추가되는 것들

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
```

와 같이 repository와 Keyword를 추가해 주었다.



이후

```sh
$ npx projen
```

명령어를 통해 다시 적용시켜 준다.

이후 package.json을 살펴보면 keyword가 추가된 것을 볼 수 있다.



#### Step 2

`src/main.ts`에서 Lambda stack을 정의 한다.

```typescript
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'prod-ready-cdk-dev', { env: devEnv });
// new MyStack(app, 'prod-ready-cdk-prod', { env: prodEnv });

app.synth();
```

를 수정한다.

```typescript
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class MyStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, id, props);

        // define resources here...
        new lambda.Function(this, 'ExampleFunction', {
            functionName: 'example-lambda',
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hello.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
    }
}

// for development, use account/region from cdk cli
const devEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'prod-ready-cdk-dev', { env: devEnv });
// new MyStack(app, 'prod-ready-cdk-prod', { env: prodEnv });

app.synth();

```



이후 `lambda/hello.js`를 작성한다.

```javascript
exports.handler = function(event, context) {
  console.log('Hello, Cloudwatch!');
  context.succeed('Hello, World!');
};
```



이후 `npx projen synth` 명령어를 통해 Deploy Ready 상태의 CDK App을 얻을 수 있다.