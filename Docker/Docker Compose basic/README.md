# Docker Compose basic

#### Docker Compose 란

docker compose는 다중 컨테이너 도커 어플리케이션을 정의하고 실행하기 위한 도구

ex) 서로 다른 컨테이너에 있는데 컨테이너 사이에 아무런 설정이 없는 경우 node.js앱에서 레디스 서버에 접근할 수 없다.

멀티 컨테이너 상황에서 쉽게 서로간의 네트워크 통신을 연결해주기 위해서 Docker Compose를 이용할 수 있다!





#### Docker compose 파일 구조

- version : 도커 컴포즈 버전

- services: 실행하려는 컨테이너들을 정의

  - container-name

    - image

    - build
    - ports

```yaml
version: "3"
services:
  redis-server:
    image: "redis"
  node-app:
    build: .
    ports:
     - "5000:8080"
```



- `docker-compose up`
  - -d : 백그라운드에서 실행
