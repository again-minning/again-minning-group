TypeORM을 사용하고 Transation을 적용한다면 대부분 Connection을 통해 직접 Transaction을 시작 및 롤백 처리를 할 것 이다.  
이렇게 작성 된 service객체를 테스트 한다면 Connection 또한 mocking을 해야한다. 그리고 Connection의 메서드들 또한 Stubbing 해야한다.  

Transation을 적용한다면 connection을 통해 꺼내고 꺼내서 getRepository(...)를 통해 query를 작성할 것이다.  
따라서 getRepository를 꺼내기 까지의 모든 메서드를 가짜로 만들어야 한다.  
추가로 getRepository를 통해 어떤 Entity의 Repository를 꺼낼지에 따라 각각에 맞는 mockRepository를 반환해야 한다.  

위 내용을 정리하면 아래와 같다.  

```typescript
const mockConnection = () => ({
    transaction: jest.fn(),
    createQueryRunner: () => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: (r) => r,
        getRepository: (r) => {
          if (r == MyGroup) {
            return mockMyGroupRepository;
          } else if (r == MyGroupWeek) {
            return mockMyGroupWeekRepository;
          }
        },
      },
    }),
  });

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ...,
      { provide: Connection, useValue: mockConnection() },
    ],
  }).compile();
});
```

providers에 Connection을 mockConnection()으로 사용한다고 명시한다.  
이제 mockConnection()을 만들면 된다. service에서 사용하는 모든 Connection 메서드를 가짜로 만들면 된다.  

깊게 볼 부분 중 하나인 getRepository()를 보면 파라미터에 따라 다른 mockRepository()를 응답하도록 되어있다.  
실제로 service에서 manager.getRepository(...)를 통해 여러 Repository를 꺼내기 때문에 여기서도 위와 같이 반영한다.  
Repository를 분기에 따라 꺼내는 방식은 단순히 본인이 생각한 방식이며 혹시나 더 깔끔한 방식이 있다면 언제든 반영할 계획이다. 
