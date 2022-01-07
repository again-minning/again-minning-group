Validation을 하며 Exception을 던지는 응답이 void인 메서드를 테스트하는 경우 toThrow, thThrowError로 테스트가 안된다.

이런 경우에는 다음과 같이 진행하면 된다.
```typescript
it('수행요일이_아닌_경우_테스트', () => {
    const date = new Date('2022-01-02T06:00:00.000');
    try {
      myGroupService['checkDayIsInclude'](date, [Week.WED]);
    } catch (err) {
      expect(err).toEqual(new BadRequestException(INVALID_DATE));
    }
  });
```
위 처럼 try catch로 감싼뒤 catch되는 error가 예상하는 exception가 같은지 비교하면 된다.  
똑같은 Exception이라도 Message가 다르면 toEqual에 의해 실패처리가 된다.  
이유는 Exception을 비교하는 것이 아니라 객체를 비교하듯이 비교하기 때문이다.

---
참고자료  
https://hdevstudy.tistory.com/133