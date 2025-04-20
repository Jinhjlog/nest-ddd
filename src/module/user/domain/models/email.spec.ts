import { Email, EmailError } from './email';

describe('Email', () => {
  describe('create', () => {
    describe('성공 케이스', () => {
      it('유효한 이메일로 생성 시 성공 결과를 반환해야 함', () => {
        // given
        const validEmail = 'test@example.com';

        // when
        const result = Email.create(validEmail);

        // then
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value).toBeInstanceOf(Email);
          expect(result.value['props'].value).toBe(validEmail);
        }
      });
    });

    describe('실패 케이스', () => {
      it('undefined 값이 전달되면 EmailRequired 에러를 반환해야 함', () => {
        // when
        const result = Email.create(undefined);

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(EmailError.EmailRequired);
        }
      });

      it('빈 문자열이 전달되면 EmailRequired 에러를 반환해야 함', () => {
        // when
        const result = Email.create('');

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(EmailError.EmailRequired);
        }
      });

      describe('유효하지 않은 이메일 형식은 오류를 반환해야 함', () => {
        const INVALID_EMAIL_CASES = [
          { description: '@ 기호 누락', value: 'userexample.com' },
          { description: '도메인 누락', value: 'user@' },
          { description: '최상위 도메인 누락', value: 'user@example' },
          { description: '공백 포함', value: 'user name@example.com' },
          {
            description: '허용되지 않는 특수문자 포함',
            value: 'user<>@example.com',
          },
        ];

        test.each(INVALID_EMAIL_CASES)('$description', ({ value }) => {
          // when
          const result = Email.create(value);

          // then
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe(EmailError.InvalidEmail);
          }
        });
      });
    });
  });
});
