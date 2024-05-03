# Terraform #1 



## Terraform 기본 구성 요소

1. provider
   - 테라폼으로 생성할 인프라의 종류
2. resource
   - 테라폼으로 실제로 생성할 인프라 자원
3. state
   - 테라폼을 통해 생성한 자원의 상태 => 파일 형태로 존재하게 된다.
4. output
   - 테라폼으로 만든 자원을 변수 형태로 state에 저장하는 것
5. module
   - 공통적으로 활용할 수 있는 코드를 문자 그대로 모듈 형태로 정의
6. remote 
   - 다른 경로의 state를 참조하는 것, output 변수를 불러올 때 주로 사