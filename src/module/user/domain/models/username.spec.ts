import { Username, UsernameError } from './username';

describe('Username', () => {
  describe('create', () => {
    describe('성공 케이스', () => {
      it('유효한 username으로 생성 시 성공 결과를 반환해야 함', () => {
        // given
        const validUsername = 'user123';

        // when
        const result = Username.create(validUsername);

        // then
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          expect(result.value).toBeInstanceOf(Username);
          expect(result.value['props'].value).toBe(validUsername);
        }
      });

      describe('다양한 유효한 username 패턴이 허용되어야 함', () => {
        const VALID_USERNAME_CASES = [
          { description: '최소 길이(5자) 영문자', value: 'abcde' },
          { description: '최대 길이(14자) 영문자', value: 'abcdefghijklmn' },
          { description: '영문 소문자만', value: 'abcdefg' },
          { description: '영문 대문자만', value: 'ABCDEFG' },
          { description: '숫자만', value: '12345678' },
          { description: '영문 + 숫자 조합', value: 'abc123xyz' },
          { description: '대소문자 혼합', value: 'AbCdEfG123' },
          { description: '경계값(5자)', value: 'abc12' },
          { description: '경계값(14자)', value: 'abcdefghijklmn' },
        ];

        test.each(VALID_USERNAME_CASES)('$description', ({ value }) => {
          // when
          const result = Username.create(value);

          // then
          expect(result.isOk()).toBe(true);
        });
      });
    });

    describe('실패 케이스', () => {
      it('undefined 값이 전달되면 UsernameRequired 에러를 반환해야 함', () => {
        // when
        const result = Username.create(undefined);

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(UsernameError.UsernameRequired);
        }
      });

      it('빈 문자열이 전달되면 UsernameRequired 에러를 반환해야 함', () => {
        // when
        const result = Username.create('');

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(UsernameError.UsernameRequired);
        }
      });

      it('5자 미만이면 UsernameTooShort 에러를 반환해야 함', () => {
        // given
        const shortUsername = 'abc1';

        // when
        const result = Username.create(shortUsername);

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(UsernameError.UsernameTooShort);
        }
      });

      it('14자 초과면 UsernameTooLong 에러를 반환해야 함', () => {
        // given
        const longUsername = 'abcdefghijklmno'; // 15자

        // when
        const result = Username.create(longUsername);

        // then
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error).toBe(UsernameError.UsernameTooLong);
        }
      });

      describe('다양한 제약 조건 위반 케이스', () => {
        const INVALID_USERNAME_CASES = [
          {
            description: '공백 포함',
            value: 'user name',
            expectedError: UsernameError.UsernameContainsWhitespace,
          },
          {
            description: '탭 문자 포함',
            value: 'user\tname',
            expectedError: UsernameError.UsernameContainsWhitespace,
          },
          {
            description: '개행 문자 포함',
            value: 'user\nname',
            expectedError: UsernameError.UsernameContainsWhitespace,
          },
          {
            description: '특수문자(-) 포함',
            value: 'user-name',
            expectedError: UsernameError.UsernameContainsSpecialCharacter,
          },
          {
            description: '특수문자(_) 포함',
            value: 'user_name',
            expectedError: UsernameError.UsernameContainsSpecialCharacter,
          },
          {
            description: '특수문자(@) 포함',
            value: 'user@name',
            expectedError: UsernameError.UsernameContainsSpecialCharacter,
          },
          {
            description: '한글 포함',
            value: 'user이름',
            expectedError: UsernameError.UsernameContainsKorean,
          },
          {
            description: '한글만',
            value: '사용자이름',
            expectedError: UsernameError.UsernameContainsKorean,
          },
        ];

        test.each(INVALID_USERNAME_CASES)(
          '$description',
          ({ value, expectedError }) => {
            // when
            const result = Username.create(value);

            // then
            expect(result.isErr()).toBe(true);
            if (result.isErr()) {
              expect(result.error).toBe(expectedError);
            }
          },
        );
      });
    });
  });
});
