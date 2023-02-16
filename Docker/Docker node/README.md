# Docker & Node활용해서 어플리케이션 만들기



1. package.json : 프로젝트의 정보와 프로젝트에서 사용중인 패키지의 의존성을 관리하는 곳
2. server.js : Entry Point



#### Docker 환경에서 노드 실행하기

Nodejs앱을 도커 환경에서 실행하려면

1. 이미지 생성
2. 이미지를 이용하여 컨테이너 실행
3. 컨테이너 안에서 Nodejs 앱 실행



의 과정을 거쳐야 한다.



이 과정에서 COPY 명령어를 Dockerfile 에 작성하여 package.json과 server.js를 컨테이너 환경 안으로 복사해야 정상적으로 실행 가능하다.



이후 이미지를 통해 컨테이너를 실행할 때

`docker run -p <local port>:<container port> <이미지 이름> `

식으로 포트를 맞춰줘야 정상적으로 네트워크가 연결된다.



#### WORKDIR

워크디렉토리는 이미지 안에서 어플리케이션 소스를 갖고 있을 디렉토리를 생성하는 것

이 디렉토리가 어플리케이션의 working directory가 된다.



왜 사용하는가?!

로컬 파일 중에서 앱을 위해 COPY로 이미지 안으로 들어온 것들(package.json 등)

을 workdir을 지정하지 않고 카피하면 이러한 문제점들을 고려해야 한다.

1. 원래 이미지에 있던 파일과 이름이 같다면?
   - 덮어씌워 버린다.
2. 모든 파일이 한 디렉토리에 들어있어 정리가 어렵다!



workdir을 지정해준다면 그러한 copy 등으로 가져온 것이 다 workdir로 들어간다!(Root 디렉토리 대신)



#### 어플리케이션 소스 코드 변경 반영

소스코드를 계속 변경시켜 어플리케이션에 반영하려면

docker build, docker run으로 도커 이미지 생성, 컨테이너 생성후 실행을 계속 다시 실행시켜야 한다.



하지만 이 방법은 비효율적!



1. 모듈과 소스코드의 COPY 분리
   1. 이를 통해서 모듈의 변화가 있을 때만 npm install이 된다.



#### Docker Volume

COPY vs VOLUME

- 카피는 계속 로컬에 있는 파일을 컨테이너로 복사하지만
- 볼륨은 컨테이너쪽에서 로컬을 참조(Mapping) 함



Volume 명령어

`-v usr.src.app/node_modules`

- 호스트 디렉토리에 node_modules은 없기 때문에 컨테이너에 맵핑을 하지 말라는 뜻

`-v %cd%:/usr/src/app` -window cmd /  `-v $(pwd):/usr/src/app` - bash/mac/linux

- cd 경로에 있는 디렉토리 혹은 파일을 /usr/src/app 경로에서 참조



