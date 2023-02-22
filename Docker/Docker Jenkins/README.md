# Docker Jenkins 자동배포



#### Intro

기본 개념

![742be8b5-a86d-4274-b20b-80d03049930d_cicd](C:\Users\Tmax\Desktop\TIL\TmaxStudy\Docker\Docker Jenkins\README.assets\742be8b5-a86d-4274-b20b-80d03049930d_cicd-1676880246542-2.png)

1. github push
2. github가 웹훅을 통 젠킨스로 요청을 보냄
3. 젠킨스는 파이프라인에 따라 도커를 사용하여 배포 및 빌드 수행



##### 자동배포 개념

![다운로드](C:\Users\Tmax\Desktop\TIL\TmaxStudy\Docker\Docker Jenkins\README.assets\다운로드-1676938410436-2.png)

1. Gitlab 저장소에 Push 한다.

2. webhook을 통해 Jenkins에서 Gitlab 레포지토리에 접근한다.

+) Gitlab과 Jenkins는 서버에서 도커 컨테이너로 설치. EC2 등 각각 상황에 맞는 환경에 젠킨스를 설치하면 된다.

3. Jenkins에서 프로젝트 빌드를 마친 후 jar 파일을 AWS EC2에 전송한다.

4. Nginx에서 프로젝트 포트 번호를 다르게 하면서 번갈아 무중단 배포한다.
(이전 프로젝트가 현재 9001 포트를 사용 중이라면 새로운 프로젝트를 9002 포트에 배포하고 9001 프로젝트 삭제)



##### 1. 백엔드 설정

```yaml
spring:
  profiles:
    group:
      development:
        - common
        - development_database
        - port_8080
      production-set1:
        - common
        - production_database
        - port_9001
      production-set2:
        - common
        - production_database
        - port_9002
 
---
 
spring:
  config:
    activate:
      on-profile: common
      ...
 
---
 
spring:
  config:
    activate:
      on-profile: development_database
  datasource:
    url: [테스트 DB]
 
---
 
spring:
  config:
    activate:
      on-profile: production_database
  datasource:
    url: [운영 DB]
 
---
 
spring:
  config:
    activate:
      on-profile: port_8080
 
server:
  port: 8080
 
---
 
spring:
  config:
    activate:
      on-profile: port_9001
 
server:
  port: 9001
 
---
 
spring:
  config:
    activate:
      on-profile: port_9002
 
server:
  port: 9002

```

1. 프로파일을 3개(dev, prod1, prod2)로 나누고, 공통 속성과 DB종류 포트번호를 지정해준다.



##### 2. Gitlab / Github 설정

1. Access Token 발행

User Settings - Access Tokens로 이동하여 토큰 발행

로컬 서버에서 작업을 진행하는 경우 젠킨스 연동이 안되는 경우가 있음. 이럴 경우 

**Admin - Settings - Network - Outbound requests - Allow request to the local network 부분들 체크**



##### 3. Jenkins 설치 및 설정

docker 환경에서 Jenkins를 설치한다.

`docker volume create [build folder]`

`docker run -itd --name jenkins -p 9000:8080 -v [build folder]:/[build 경로] jenkins/jenkins:lts-jdk11`



jenkins 컨테이너 내에서 volume 경로로 지정된 폴더의 소유자와 소유 그룹을 바꿔준다.(jenkins 컨테이너 일반 사용자로)

`chown` `chgrp` 사용





이후 젠킨스에 접속한다.

`192.168.xxx.xxx:9000`



젠킨스에 Gitlab 플러그인을 설치한다.

Jenkins 관리 - 플러그인 관리 - 설치 가능으로 이동하여 gitlab을 검색 후 설치한다.

![다운로드 (2)](C:\Users\Tmax\Desktop\TIL\TmaxStudy\Docker\Docker Jenkins\README.assets\다운로드 (2)-1676939793808-5.png)



Gitlab Credential을 추가한다.

Jenkins 관리 - Manage Credentials로 이동한다.

global에서 Add credentials를 클릭



`Kind: GitLab API token
Scope: Global
API token: [앞서 발급한 gitlab access token]
ID: [원하는 ID값]`

![다운로드 (3)](C:\Users\Tmax\Desktop\TIL\TmaxStudy\Docker\Docker Jenkins\README.assets\다운로드 (3)-1676940193310-9.png)



Jenkins 관리 - 시스템 설정으로 이동 후

Giutlab 부분에 생성한 Credentials 추가.

`Connection name: [원하는 connection name]
Gitlab host URL: [깃랩이 설치된 URL]
Credentials: [앞서 생성한 GitLab API token]`

후 Test Connection을 통해 연결 성공을 확인한다.

![다운로드 (4)](C:\Users\Tmax\Desktop\TIL\TmaxStudy\Docker\Docker Jenkins\README.assets\다운로드 (4)-1676940266102-12.png)



아이템을 생성한다.

Freestyle Project를 선택하여 아이템을 생성



이후 소스 코드 관리에서 Git을 선택하고 Repository URL 입력

![다운로드 (5)](C:\Users\Tmax\Desktop\TIL\TmaxStudy\Docker\Docker Jenkins\README.assets\다운로드 (5)-1676941253663-15.png)

Failed to connect to repository 에러가 나오는데 해당 URL이 아직 인증되지 않았다는 말이다.

저장소와 연동하기 위한 Credential을 따로 추가해줘야 한다. 아래 Credentials 부분에서 Add - Jenkins를 클릭하자.

`Kind: Username with password
Scope: Global
Username: [깃랩 아이디]
Password: [깃랩 비밀번호]`





##### Webhook 설정

