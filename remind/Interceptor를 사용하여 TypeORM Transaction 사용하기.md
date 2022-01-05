# 일반적인 TypeORM의 Transaction

TypeORM을 사용하면서 Transation을 적용하려면 코드가 매우 지져분해진다.  
Spring처럼 @Transactional을 사용하여 간단하게 적용할 수 있지만, 모든 Repository manager에 동일하게 적용되지 않기 때문에 사용하지 않는 것을 추천한다.

따라서 일반적으로 TypeORM을 사용하면서 Transaction을 적용하려면 다음과 같이 사용해야 한다.

```typescript
public testMethoad() {
  const queryRunner = this.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction(); 

  try {
    await queryRunner.manager.getRepository(Entity).save(...);
    await queryRunner.manager.getRepository(Entity2).save(...);
    await quertRunner.commitTransaction();
  } catch(err) {
    console.error(err);
    await runner.rollbackTransaction();
  } finally {
    await runnner.release()
  }
}
```

이렇게 try catch finally문이 모든 service문에 포함되어야 한다.  
상상만해도 지져분한 코드가 예상된다..

# Interceptor

위 문제를 interceptor를 통해 해결할 수 있다.  
그럼 간단하게 Interceptor가 뭔지 알아보자.

> 인터셉터에는 AOP(Aspect Oriented Programming) 기술에서 영감을 받은 유용한 기능 세트가 있습니다. 이를 통해 다음을 수행할 수 있습니다.  
> [NestJs Document](https://docs.nestjs.kr/interceptors)

Interceptor는 아래의 기능들을 제공한다.

-   메소드 실행 전/후 추가 로직 바인딩
-   함수에서 던져진 예외 변환
-   기본 기능 동작 확장
-   함수에서 반환된 결과를 변환
-   특정 조건에 따라 기능을 완전히 재정의합니다(예: 캐싱 목적)

우리는 위 기능들 중 1 ~ 3번을 통해 이 문제를 해결할 것이다.

# Interceptor를 적용한 TypeORM의 Transaction

그럼 이 Interceptor를 어떻게 활용하여 적용이 가능한가?  
AOP의 개념을 알고 있다면 바로 이해가 될 것 이다.  
맨 위 코드를 보면 transaction을 위해 **공통적으로 같은 queryRunner 인스턴스를** 사용하는 것을 알 수 있다.  
그리고 사실상 service method의 로직은 try문에 모여있는 것을 알 수 있다.

따라서 service로직을 수행하기 전 transaction을 시작하는 로직을 수행하고 service에 queryRunner.manager를 넘겨준다.  
service로직이 끝나면 수행 여부에 따라 commit 또는 rollback을 수행하고 connection을 release한다.  
하지만 manager를 service에 바로 넘겨주기는 불가능하다.  
따라서 감싸는 범위를 controller로 하여 request에 manager를 추가하여 받을 수 있도록 한다.

### Transaction Interceptor

그럼 Transaction Interceptor을 만들어 보자.

```typescript
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private connection: Connection) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    req.manager = queryRunner.manager;
    return next.handle().pipe(
      catchError(async (err) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        if (err instanceof HttpException) {
          throw new HttpException(err.getResponse(), err.getStatus());
        } else {
          throw new InternalServerErrorException(SEVER_ERROR);
        }
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}
```

전체 코드는 위와 같고 이제 메인 라인을 보자.

-   **Get QueryRunner && Start Transaction**

    ```typescript
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    ```

    DI로 주입된 connection을 통해 queryRunner를 얻는다.  
    queryRunner로 transaction을 시작한다.
-   **Set manager In Request**

    ```typescript
    req.manager = queryRunner.manager;
    ```

    request에 manager를 추가한다.
-   **Method 수행 및 Transaction 처리**

    ```typescript
    return next.handle().pipe(
        catchError(async (err) => {
          await queryRunner.rollbackTransaction();
          await queryRunner.release();
          if (err instanceof HttpException) {
            throw new HttpException(err.getResponse(), err.getStatus());
          } else {
            throw new InternalServerErrorException(SEVER_ERROR);
          }
        }),
        tap(async () => {
          await queryRunner.commitTransaction();
          await queryRunner.release();
        }),
      );
    ```

    interceptor의 handle()은 감싸진 메서드를 수행하는 것 이고, Pipe()는 handle()의 수행 결과에 따라 수행되는 부분이다.  
    catchError()은 Method에서 에러가 발생하면 핸들링하는 부분이다.  
    보면 우선 rollback처리 후, connection을 반납한다.  
    이후 에러에 대한 처리를 한다.  
    여기서 에러 처리를 하는 이유는?  
    감싸진 method에서 발생하는 모든 에러는 커스텀으로 만든 예외 핸들러가 존재하여도 1차적으로 여기에 걸린다.  
    따라서 각 에러에 대한 분기처리를 하여 그에 맞는 예외를 한번 더 throw해야 한다.  
    본인은 HttpException과 서버 자체 에러 두 분류로 나누어 처리를 하였다.  
    tab()은 Method가 정상 수행된 후 수행되는 부분이다.  
    정상적으로 수행하였기 때문에 commit을 하고 connection을 반납한다.

### Get Manager By Decorator

Interceptor를 통해 manager를 Request에 등록하였다.  
그러면 이제 꺼내써야하는데 어떻게 쓰나?  
매우 간단하다. Controller에서 Method의 매개변수를 받을 때, @Req() request: Request로 받은 뒤 request.manager를 꺼내 사용하면 된다.

본인은 위 과정을 Decorator를 만들어 매개변수로 바로 받을 수 있도록 하였다.

```typescript
export const EntityManager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.manager;
  },
);
```

이렇게 @EntityManager를 만들었고 다음과 같이 사용이 가능하다.

```typescript
@Post('/')
@UseInterceptors(TransactionInterceptor)
public async testMethod(@EntityManager() manager): Promise<void> {
  return ResponseEntity.OK_WITH(
    await this.testService.testMethod(manager),
  );
}
```

Method 매개변수에 위 처럼 사용하여 manager를 바로 받을 수 있다.  
그리고 @UseInterceptors를 통해 위에서 만든 TransactionInterceptor를 사용하도록 설정하면 된다.

# Interceptor 적용 결과

### 적용 전 Service Method

```typescript
public testMethoad() {
  const queryRunner = this.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction(); 

  try {
    await queryRunner.manager.getRepository(Entity).save(...);
    await queryRunner.manager.getRepository(Entity2).save(...);
    await quertRunner.commitTransaction();
  } catch(err) {
    console.error(err);
    await runner.rollbackTransaction();
  } finally {
    await runnner.release()
  }
}
```

### 적용 후 Service Method

```typescript
public testMethoad(manager: EntityManager) {
  await queryRunner.manager.getRepository(Entity).save(...);
  await queryRunner.manager.getRepository(Entity2).save(...);                                                   
}
```

짠! 코드가 정말 간략해지고 가독성이 매우 좋아졌다!!  
스프링의 Transactional처럼 완벽하게 깔끔하지는 않지만, 그래도 깔끔하게 해결할 수 있다.  
모든 Controller에서 Transaction을 남발하지 말고, CUD가 발생하는 로직에만 적용하도록 한다.