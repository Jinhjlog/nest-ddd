import { Phone, PhoneError } from './phone';

describe('Phone', () => {
  describe('create', () => {
    describe('성공 케이스', () => {
      it('유효한 전화번호로 생성 시 성공 결과를 반환해야 함', () => {
        // given
        const validPhone = '010-1234-5678';

        // when
        const result = Phone.create(validPhone);

        // then
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value).toBeInstanceOf(Phone);
          expect(result.value['props'].value).toBe(validPhone);
        }
      });

      it('다양한 유효한 전화번호 패턴이 허용되어야 함', () => {
        // given
        const validPhones = [
          '010-1234-5678',
          '070-1234-5678',
          '031-1234-5678',
          '021-1234-5678',
          '000-0000-0000',
          '999-9999-9999',
        ];

        // when & then
        validPhones.forEach((phone) => {
          const result = Phone.create(phone);
          expect(result.isOk()).toBe(true);
        });
      });
    });

    describe('실패 케이스', () => {
      it('undefined 값이 전달되면 PhoneRequired 에러를 반환해야 함', () => {
        // when
        const result = Phone.create(undefined);

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(PhoneError.PhoneRequired);
        }
      });

      it('빈 문자열이 전달되면 PhoneRequired 에러를 반환해야 함', () => {
        // when
        const result = Phone.create('');

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(PhoneError.PhoneRequired);
        }
      });

      describe('유효하지 않은 전화번호 형식은 오류를 반환해야 함', () => {
        const INVALID_PHONE_CASES = [
          { description: '하이픈(-) 누락', value: '01012345678' },
          { description: '첫 부분 자릿수 부족', value: '01-1234-5678' },
          { description: '가운데 부분 자릿수 부족', value: '010-123-5678' },
          { description: '마지막 부분 자릿수 부족', value: '010-1234-567' },
          { description: '첫 부분 자릿수 초과', value: '0101-1234-5678' },
          { description: '가운데 부분 자릿수 초과', value: '010-12345-5678' },
          { description: '마지막 부분 자릿수 초과', value: '010-1234-56789' },
          { description: '문자 포함', value: '010-abcd-5678' },
          { description: '특수문자 포함', value: '010-1234-56@8' },
          { description: '공백 포함', value: '010-1234 5678' },
          { description: '하이픈 위치 오류', value: '0101-234-5678' },
        ];

        test.each(INVALID_PHONE_CASES)('$description', ({ value }) => {
          // when
          const result = Phone.create(value);

          // then
          expect(result.isErr()).toBe(true);
          if (result.isErr()) {
            expect(result.error).toBe(PhoneError.InvalidPhone);
          }
        });
      });
    });
  });
});
