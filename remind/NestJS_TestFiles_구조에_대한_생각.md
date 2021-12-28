## 기본 Test 디렉토리 구조
nest-cli를 통해 프로젝트를 생성하면 아래와 같이 root디렉토리에서 src와 test디렉토리가 생성된다.  
```
root
|-src
|-test
|-|-app.e2e-spec.json
|-|-jest-e2e.json
```
nest-cli를 통해 Controller이나 Service를 만들면 해당 도메인 명으로 디렉토리가 생성되고 함께 *.service.spec.ts이라는 Test파일이 생성된다.  
```
src
|-user
|-|-user.controller.ts
|-|-user.controller.spec.ts
|-|-user.service.ts
|-|-user.service.spec.ts
...
```

## 변경된 Test 디렉토리 구조
e2e는 End to End 테스트 이고 controller, service test는 Unit 테스트이다.  
현재 e2e는 test디렉토리, Unit은 src 디렉토리에 있는 것을 알 수 있다.  

아직 TestCase 예시를 많이 찾아보지는 않았지만 Test파일이 한 곳에 모여있는 것이 좋다고 생각했다.  
그래서 초기 프로젝트 생성할 때 같이 생성된 test디렉토리로 모으기로 했다.  
```
root
|-src
|-|...
|-test
|-|-controller
|-|-|-app.controller.spec.ts
|-|-|-user.controller.spec.ts
|-|-service
|-|-|-app.service.spec.ts
|-|-|-user.service.spec.ts
|-|-e2e
|-|-|-app.e2e-spec.ts
|-|-|-user.e2e-spec.ts
|-|-jest-controller.json
|-|-jest-service.json
|-|-jest-e2e.json
```

위 디렉토리를 보면 controller, service, e2e로 나뉜 것을 확인할 수 있다.  
package.json에서 jest설정을 수정하여 통합적으로 실행시킬 수 있다.  
본인은 service 혹은 controller 단독 테스트를 간단하게 실행할 수 있도록 e2e 테스트 실행 방식을 unit 테스트에도 적용시켰다.  
적용은 다음과 같이 진행하였다.

## 변경된 Test 디렉토리 적용하기

그럼 기존 e2e 테스트 실행 방식이 뭔가?
미리 정의된 command인 npm run test:e2e를 통해 실행되고, 수행되는 command는 다음과 같다.
```shell
jest --config ./test/jest-e2e.json
```
이 명령어는 test 디렉토리에 있는 jest-e2e.json 설정파일을 기반으로 Test를 진행하는 것 이다.  
이 방식을 그대로 가져와 e2e가 아닌 controller 또는 service로 적용하여 Test를 진행할 수 있다.
1. jest-service.json 파일 생성
   1. "rootDir"은 Test 파일이 저장 된 경로
   2. "testRegex"는 실행시킬 파일 명의 형식
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "./service",
  "testEnvironment": "node",
  "testRegex": ".service.spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```
2. package.json script에 1번에서 작성한 설정파일로 Test를 진행하도록 command를 추가한다.  
```
"test:service": "jest --config ./test/jest-service.json"
```
3. ```npm run test:service```로 테스트를 수행한다.  

이렇게 테스트를 수행할 수 있다.  
만약 e2e, controller, service 모든 테스트를 수행하고싶다면 아래의 script를 추가하면 된다.  
```
"test:all": npm run test:service && npm run test:controller && npm run test:e2e"
```  
3개의 command를 실행하는 하나의 command를 추가로 작성하여 사용하는 방식이다.  
이렇게 테스트를 하나의 디렉토리에서 관리하고 통합적으로 실행할 수 있도록 환경을 구축하였다.  
이 방식은 테스트 관리에 대한 Best Practice를 아직 찾지 못 해서 개인적으로 생각한 방식이며 추후 더 좋은 방식을 찾으면 언제든 반영할 계획이다.

