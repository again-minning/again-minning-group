# private 메서드 호출하기
지만 작은 단위로 테스트를 하는 경우 private 메서드를 테스트할 수도 있다.  

그러면 어떻게 외부에서 private 메서드를 호출하지?  

방법은 매우 간단하다.  
```typescript
class BaseClass {
  private sayHello(): void{
    return 'Hello?';
  }
}
```  
위와 같은 클래스가 존재한다.  
다음과 같이 BaseClass 인스턴스를 생성해서 sayHello를 부르는 것은 불가능하다.
```typescript
const base: BaseClass = new BaseClass();
// base.sayHello(); 불가능
```
하지만 property로 꺼내는 것은 가능하다.  
```typescript
const result = base['sayHello']();
console.log(result); // result == 'Hello?'
```  
나는 처음 이 방식을 알고난 후 깜짝 놀랐다.  

어떻게 이게 가능한 것 인가?  
다음의 링크에서 이유를 알 수 있었다.  
[Do you unit test private methods?](https://dev.to/dan_mcm_/do-you-unit-test-private-methods-23eg)

이런 댓글이 달려있다.  
> It's JavaScript feature that you can access properties by using [property]. And in the end the TypeScript will be transpiled to pure javascript which has no public, private differences.  

property는 javascript의 기능이고, typescript는 결국 javascrip로 변환되기 때문이라고 한다.  
결국 javascript로 변환 되면서 접근 제어자가 없어진다는 것 이다.  

추가로 댓글에서 private 메서드 테스트를 하냐 마냐에 대해 의견이 나뉘었다.  

private 메서드를 테스트 함에 있어서 가장 큰 단점은 작성 해야하는 테스트가 너무 많고 비효율 적이라는 것이다.  
나는 private 메서드에 대한 테스트를 진행한다는 의견이지만 모든 메서드에 대한 테스트를 다 작성한다기 보다는 독단적인 메서드이거나 비교적 비중이 큰 메서드에 한하여 작성할 것 이다.


