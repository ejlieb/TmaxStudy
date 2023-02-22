# Docker Jenkins 설정



1. Plugin 설치(Node)

Home 좌측 메뉴의 Jenkins 관리 -> 플러그인 관리 -> Available plugin에서 Node.js 설치

Jenkins 관리 => global tool configuration => Node.js 환경 생성



2. Github 등록

Jenkins관리 -> 시스템설정 -> Github 칸에서 추가

Credentials add에서 Secret text 선택 후 Secret란에 github access code 넣기.

저장 후 test connection을 통해 확인

- Github Webhook 설정
  - 해당 레포지토리 Settings의 webhook에서 add webhook
  - payload url 에 http://[jenkins url(ec2 open ip:포트번호)]/github-webhook/
  - content type은 json



3. 새로운 item 생성

- 생성 후 General에서 github project 체크
- project url에 레포지토리 url

- 소스 코드 관리에서 Git 선택 후 Repository url 입력

- Credentials add

  - username: 깃헙 유저네임
  - password: 깃헙 패스워드
  - ID: 젠킨스에서 사용할 별도 Id

- 빌드 유발에서 Github hook trigger for GITScm polling 선택

- 빌드 환경에서 Provide Node & npm bin 선택

- build steps에서 shell 선택 후 (프론트엔드)

  - ```shell
    cd /var/jenkins_home/workspace/[프로젝트 이름]
    npm install
    npm run build
    \cp -r -f build /var/build
    ```

- build steps에서 invoke gradle script(백엔드)
