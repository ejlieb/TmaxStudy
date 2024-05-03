# AWS CDK



#### Constructs

Constructs는 AWS CDK 앱의 가장 기본적인 빌딩 블락이다. Cloud component를 대표하며, cloudformation이 컴포넌트를 생성하는 데 필요한 모든 것을 캡슐화한다.

Constructs는 단일 AWS 리소스(예를 들어 S3 bucket)을 대표할수도 있고, 여러 AWS 리소스가 결합되어 있는 좀 더 고수준의 추상화일 수도 있다.

- Parameters

  - scope: 해당 Construct의 Parent나 Owner. Stack 혹은 다른 Construct가 건내져야 한다. 보통은 this를 건낸다.
  - id: identifier, unique해야 한다.
  - props: construct의 초기 config를 define하는 props.

```typescript
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

class HelloCdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true
    });
  }
}

const app = new App();
new HelloCdkStack(app, "HelloCdkStack");
```

#### App

App은 Stack을 위한 Container다. Stack의 Scope로 기능한다.
```typescript
class MyFirstStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyFirstBucket');
  }
} 
```

#### Stacks

AWS CDK deployment의 유닛이다. 하나의 스택은 하나의 유닛으로 프로비전 된다.

AWS CDK Stack은 AWS Cloudformation Stack으로 대응되기 떄문에 Cloudformation과 같은 limitation을 가진다.

```typescript
const app = new App();

new MyFirstStack(app, 'stack1');
 
app.synth();
```

#### Environments

모든 Stacks는 암묵적으로든, 명시적으로든 environment와 관련되어 있다. Environment는 스택이 Deploy될 타겟 AWS Account와 Region 이다.



