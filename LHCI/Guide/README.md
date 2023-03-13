# LHCI Guide



#### 1. What is LHCI?

LHCI는 프론트엔드 퍼포먼스 체크 툴인 Lighthouse를 CI과정에서 사용할 수 있는 툴이다.

Github action, Jenkins, Gitlab 등 다양한 플랫폼에 연동 가능하다.

본 가이드는 Jenkins를 사용하는 경우를 가정한다.



#### STEP 1 

Project Root Folder에 Configuration을 추가한다.

파일명: `lighthouserc.js`

```javascript
module.exports = {
    ci: {
      collect: {
        // staticDistDir: "./build",
        url: ["http://localhost:3000/", "http://localhost:3000/second" ],
        startServerCommand: "npm run start", // 서버를 키는 명령어를 통해서도 실행 가능
        settings: {
            chromeFlags: "--no-sandbox --headless"
        },
        numberOfRuns: 50,
          },
      upload: {
        target: 'lhci',
        token:"489fea8f-34f0-411c-8634-ef252884b8f1",
        serverBaseUrl:"http://172.19.0.3:9001"
        // outputDir: './lhci_reports',
        // reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
      },
    },
  };
```

주의 사항 

1. staticDistDir은 build static 파일의 경로를 지정해주는 옵션이다. 이 옵션을 지정해줄 경우 자동으로 html하나로 구성된 정적페이지로 인식하게 된다. 따라서 SPA를 구성하는 경우에는 본 옵션을 해제해주어야 한다.

2. url은 성능을 측정할 url 옵션이다. staticDistDir을 사용하는 경우 포트번호를 제외하고 기재하면 된다. react의 경우 spa이므로 staticDistDir을 사용하지 않고, 포트번호까지 명시하여 라우팅 url을 모두 명시해준다.

3. startServerCommand:는 lhci를 시작할 때 실행할 명령어다. staticDistDir을 사용할 경우 자동으로 port를 열고 그곳에서 chrome을 통해 퍼포먼스 벤치마킹을 실행하지만 이 경우는 npm run start를 통해 3000번 포트에서 react앱을 실행시켜 주어야 한다.(3000번이 아니어도 된다.)

4. settings에서 chromeFlags 부분은 크롬 실행에 관한 설정을 관장한다. --no-sandbox와 헤드리스 옵션을 적용해준다. 만약 도커 환경이 아니라면 위 옵션을 적용하지 않아도 된다. 도커 환경에서는 유저 권한 문제로 chrome sandbox가 작동하지 않는다. 도커의 권한을 건드리기보다는 chrome sandbox를 꺼주는 편이 보안 이슈 상 낫다고 판단해 샌드박스를 off하였다.

5. numberOfRuns는 테스트를 돌릴 횟수이다.

6. upload 항목에서 target은 3가지가 있다.

   1. lhci(default)
   2. temporary-public-storage
   3. filesystem

   이다. 

   lhci의 경우 lhci 서버를 세팅하여 이곳에 결과를 저장하고 디스플레이 한다.

   temporary-public-storage의 경우 임시 서버에 결과를 저장하고 일정 시간 후 폐기한다.

   filesystem의 경우 로컬 파일시스템에 hmtl과 json 형태로 결과를 저장한다.

7. 만약 lhci 서버를 사용할 경우 token을 발급해야 한다. 이 부분은 뒤에서 자세히 설명한다.

8. serverBaseUrl은 lhci서버의 주소이다. 도커 컨테이너를 사용하여 lHCI 서버를 구성하였기 때문에 해당 컨테이너 IP, default 포트인 9001번을 사용하였다.





#### STEP 2

Jenkins에서 빌드 세팅 및 LHCI 구동 세팅을 진행한다.

기본적인 개념은 다음과 같다.



Jenkins 도커 컨테이너에서 Jenkins가 빌드 잡을 수행한 뒤 LHCI를 실행하여 결과를 생성한다.

이를 위해 Jenkins Job에 LHCI와 크롬 관련 설치, 세팅 설정을 해준다.

LHCI Server 컨테이너로 결과를 전송하고 9001번 포트를 통해 deploy한다.



1. Jenkins 컨테이너에 빌드 시 수행할 환경 세팅 쉘 스크립트 `machine-setup.sh`를 생성한다. 이후 해당 파일에 대한 실행 권한을 설정한다.

```shell
#!/bin/bash

set -euxo pipefail

# Add Chrome's apt-key
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee -a /etc/apt/sources.list.d/google.list
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -

# Add Node's apt-key
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install NodeJS and Google Chrome
sudo apt-get update
sudo apt-get install -y nodejs google-chrome-stable
```

```sh
chmod +x ./machine-setup.sh
```



Jenkins에서 빌드 과정에서 실행할 쉘을 정의한다.

```shell
#!/bin/bash
cd /var
./machine-setup.sh
cd /var/jenkins_home/workspace/lhci
npm install
npm run build
export CHROME_PATH=$(which google-chrome-stable)
export LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL="$BUILD_URL"
npm install -g @lhci/cli@0.11.x
export LHCI_BUILD_CONTEXT__CURRENT_BRANCH=master
lhci autorun

cd build
\cp -rf * /var/react/build
```

1. 생성한 machine-setup을 실행한다.
2. 빌드 경로로 이동해 프론트엔드를 빌드 한 후, 필요한 환경변수를 세팅한다.
3. 이후 jenkins 컨테이너에 lhci를 install하고 실행한다.



이후 jenkins 컨테이너에 접속한다.

```sh
lhci wizard --wizard=new-project
```

를 통해 token을 생성한다.



해당 명령어를 입력한 후 정보를 input 할 때 서버 주소는 이후 만들 LHCI 서버 도커 컨테이너 IP와 설정한 port를 사용하면 된다.





#### STEP 3

LHCI 서버를 세팅한다.

도커 환경에서 세팅하는 가이드이다.

```shell
docker volume create lhci-data
docker container run --publish 9001:9001 --mount='source=lhci-data,target=/data' --detach patrickhulce/lhci-server
```

를 통해 도커볼륨과 lhci 서버 및 클라이언트를 포함한 이미지로 컨테이너를 생성한다.



#### STEP 4

모든 세팅을 마쳤으면 프론트엔드 빌드를 진행 해 정상적으로 LHCI 리포트가 생성되어 서버에 전송되는지 확인한다.























