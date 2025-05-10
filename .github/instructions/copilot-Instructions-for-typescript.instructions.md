---
applyTo: '**'
---

Coding standards, domain knowledge, and preferences that AI should follow.

# Copilot Instructions for TypeScript

## 명명 규칙

- 변수명, 함수명: camelCase 사용
- 클래스명: PascalCase 사용
- 클래스 멤버, 메서드: camelCase 사용
- 인터페이스명: PascalCase (I 접두사 금지)
- 타입명: PascalCase, 멤버는 camelCase
- 네임스페이스: PascalCase
- Enum: 이름과 멤버 모두 PascalCase
- 파일명: 기본적으로 camelCase (React 컴포넌트는 PascalCase)

## null vs undefined

- 값이 없음을 표현할 때는 둘 다 사용 자제
- 일반적으로 undefined 선호
- API나 Node.js 콜백에서는 null 사용 가능
- null/undefined 체크는 truthy 체크 사용 (if (error))
- 두 값 모두 체크할 때는 == null 사용

## 타입 정의

- 배열: Foo[] 형태 사용 (Array<Foo> 대신)
- 유니언/인터섹션 필요시: type 사용
- extends/implements 필요시: interface 사용
- 그 외엔 자유롭게 선택

## 코드 스타일

- 문자열: 홑따옴표 ' 사용 (이스케이프 필요시만 겹따옴표)
- 복잡한 문자열: 백틱 `` 사용
- 들여쓰기: 2칸 스페이스 (탭 금지)
- 세미콜론: 항상 사용
- 비교 연산자: === 사용 권장

## 구조적 표현

- optional 필드는 ? 사용: { x: number, y?: number }
- undefined 직접 할당보다 구조로 표현

## 예시

```typescript
// 변수와 함수
const fooVar = 'hello';
function barFunc() {}

// 클래스
class Foo {
  bar: number;
  baz() {}
}

// 인터페이스 (I 접두사 없음)
interface User {
  name: string;
  age?: number;
}

// 타입
type Point = {
  x: number;
  y: number;
};

// Enum
enum Color {
  Red,
  Blue,
  Green,
}

// 배열
const numbers: number[] = [1, 2, 3];

// null/undefined 체크
if (error) {
  // 에러 처리
}

// 문자열
const message = 'Hello World';
const template = `Name: ${name}`;
```
