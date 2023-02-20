# Docker app basic

1. 개발환경에서 개발
2. github에 소스를 push
3. feature branch 
4. pull requeust
5. master branch
6. Travis CI에서 마스터 브랜치에 푸쉬된 코드를 가져간 뒤 TEST
7. AWS를 활용하여 Hosting



##### 들어가기 앞서

- 개발 환경과 운영 환경을 위한 Dockerfile을 따로 만든다!



```yaml
version: "3"
services:
  react:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
     - "3000:3000"
    volumes:
     - /usr/src/app/node_modules
     - ./:/usr/src/app
    stdin_open: true
```

개발환경용 dockerfile



```yaml
FROM  node:alpine as builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "build"]

FROM nginx

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
```

배포환경용 dockerfile



배포환경용 도커파일은 build stage와 run stage(nginx를 가동)으로 나뉜다.



#### Travis CI

travis CI 는 github 레포지토리에 있는 프로젝트를 특정 이벤트에 따라 자동으로 테스트, 빌드하거나 배포할 수 있다.

- Local Git => GIthub => Travis CI => AWS



Travis.yml

1. 도커 환경에서 리액트앱을 실행하고 있으니 트래비스에서도 도커 환경 구성
2. 구성된 도커 환경에서 Dockerfile.dev를 이용해서 도커이미지 생성
3. 어떻게 테스트를 수행할 것인지 설정
4. 어떻게 AWS에 소스코드를 배포해줄 것인지 설정



```yaml
sudo: required  # 관리자 권한이 필요

language: generic

services:
  -docker
  
before_install:
  - echo "start Creating an image with dockerfile"
  - docker build -t minseokwon/docker-react-app -f Dockerfile.dev .
  
script:
  - docker run -e CI=true minseokwon/docker-react-app npm run test -- --coverage
  
afer_success:
  - echo "Test Success"

```

