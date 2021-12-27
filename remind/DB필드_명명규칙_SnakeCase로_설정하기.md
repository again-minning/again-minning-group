## DB 테이블의 필드 명명 규칙 SnakeCase로 설정하기
일반적으로 DB 테이블의 필드 명명 규칙은 SnakeCase이다. 하지만 어플리케이션의 개발 코드에서는 변수 명명 규칙이 CamelCase이다.
따라서 Entity를 작성할 때, 변수 명을 CamelCase로 작성하면 DB에도 CamelCase로 생성된다.

기존 Spring Framework에서 JPA를 사용할 때는 자동으로 변환이 되었지만 TypeORM은 자동으로 변한해주지 않는다.

구러면 Entity를 작성할 때 변수 명을 SnakeCase로 작성해야 하는 것인가?  
혹은 DB 필드 명명 규칙을 CamelCase로 해야 하는 것인가?  
다행히도 이를 해결해주는 라이브러리가 존재한다!  
[typeorm-naming-strategies](https://www.npmjs.com/package/typeorm-naming-strategies) 라는 친구를 사용하면 된다.  
**위 라이브러리의 SnakeNamingStrategy를 사용하면 자동으로 DB에 SnakeCase 규칙으로 생성해준다.**

설정은 ormconfig.ts에만 적용하면 끝이다.

```typescript
// ormconfig.ts
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: TypeOrmModuleOptions = {
  ...,
  namingStrategy: new SnakeNamingStrategy(),
}
export = config;
```

## 정리
**[typeorm-naming-strategies](https://www.npmjs.com/package/typeorm-naming-strategies) 의 SnakeNamingStrategy를 사용하면 자동으로 DB에 SnakeCase 규칙으로 생성해준다.**

## 참고링크
[이동욱(향로)님 블로그](https://jojoldu.tistory.com/568)
