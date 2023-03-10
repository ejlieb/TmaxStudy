# GitOps



#### What is GitOps?

GitOps는 Weaveworks라는 회사에서 처음 탄생시킨 개념으로 CI/CD 파이프라인 중 특히 Delivery에 초점을 가진다.



#### SSOT(Single Source of Truth)

GitOps를 이해하기 위해서 SSOT를 이해하면 좋다.

단일 진실의 원천이라는 뜻을 가지고 있는 SSOT는 결과의 원인이 오직 단일한 이유에서 비롯되었다는 것을 의미한다.



GitOps에서는 배포 상태의 모습을 항상 원천(배포 작업 정의서)에 동일하게 맞추려고 한다.

이러한 SSOT 방법을 통해 아래와 같은 장점을 얻을 수 있다.

1. 현재 배포환경의 상태를 쉽게 파악할 수 있다.  배포환경에 들어가서 상태를 파악할 필요 없이 배포 작업서만 살펴보면 되기 때문이다.
2. 빠르게 배포할 수 있다. 단일한 방법으로 소프트웨어를 배포하여 표준화시켰기 때문에 쉽게 배포 자동화가 가능하다.
3. 안정적으로 운영환경에 배포할 수 있다. 사람의 손을 거치지 않기 때문에 human error를 최소화 할 수 있다.



GitOps에서는 Git 저장소를 "원천"으로 사용한다.

소프트웨어를 배포할 때 Git

배포를 위한 작업 정의서를 기술하여 repo에 저장하면 GitOps 구현체가 배포 상태를 원천에 맞추기 위해 repo에 저장된 배포정의서를 읽어와서 운영 환경에 변경사항을 적용한다. 



