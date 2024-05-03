# AWS CDK



#### CDK Pipeline

AWS 상에서 CI /CD를 구축할 때 고려해야하는 것은 가장 적은 컨트롤 권한을 부여하는 것이다.

이를 위해 사용할 수 있는 방법이몇가지 있다.

1.  Git을 통해 Artifact를 S3에 업로드하고 , CDK Pipeline을 통해 CI 와 CD를 진행한다
2. 다른 CI 툴(jenkins 등)을 통해 Artifact를 빌드하고, 이것을 S3에 업로드하여 CDK Pipeline을 통해 CD를 수행한다.
3. Artifact를 CodeCommit에 업로드하고, CDK Pipeline을 통해 CI CD를 진행한다.

![화면 캡처 2023-07-26 113633](C:\Users\Tmax\Downloads\화면 캡처 2023-07-26 113633.png)

![화면 캡처 2023-07-26 113624](C:\Users\Tmax\Downloads\화면 캡처 2023-07-26 113624.png)







