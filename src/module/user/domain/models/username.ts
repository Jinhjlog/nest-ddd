/**
 * Username Value Object
 *
 * @description
 * 1. 5자 이상 14자 이하
 * 2. 공백 포함 불가
 * 3. 특수문자 포함 불가
 * 4. 한글 포함 불가
 * 5. 영문, 숫자 조합
 * 6. 대문자, 소문자 구분
 */

/**
 * Username Value Object
 */
import { ValueObject } from '@lib/domain';
import { Result, ok, err } from 'neverthrow';

interface UsernameProps {
  value: string;
}

export const UsernameError = {
  UsernameRequired: 'username은 필수 입력값입니다',
  UsernameTooShort: 'username을 5자 이상 입력해주세요',
  UsernameTooLong: 'username을 14자 이하로 입력해주세요',
  UsernameContainsWhitespace: 'username에 공백을 포함할 수 없습니다',
  UsernameContainsSpecialCharacter: 'username에 특수문자를 포함할 수 없습니다',
  UsernameContainsKorean: 'username에 한글을 포함할 수 없습니다',
} as const;

type UsernameErrorType = (typeof UsernameError)[keyof typeof UsernameError];

export class Username extends ValueObject<UsernameProps> {
  private constructor(props: UsernameProps) {
    super(props);
  }

  private static readonly WHITESPACE_REGEX = /\s/;
  private static readonly SPECIAL_CHAR_REGEX = /[^a-zA-Z0-9]/;
  private static readonly KOREAN_REGEX = /[가-힣]/;

  static create(username?: string): Result<Username, UsernameErrorType> {
    if (!username) {
      return err(UsernameError.UsernameRequired);
    }

    if (username.length < 5) {
      return err(UsernameError.UsernameTooShort);
    }

    if (username.length > 14) {
      return err(UsernameError.UsernameTooLong);
    }

    // 공백 포함 여부 검사
    if (this.WHITESPACE_REGEX.test(username)) {
      return err(UsernameError.UsernameContainsWhitespace);
    }

    // 한글 포함 여부 검사
    if (this.KOREAN_REGEX.test(username)) {
      return err(UsernameError.UsernameContainsKorean);
    }

    // 특수문자 포함 여부 검사
    if (this.SPECIAL_CHAR_REGEX.test(username)) {
      return err(UsernameError.UsernameContainsSpecialCharacter);
    }

    return ok(new Username({ value: username }));
  }

  static unsafeCreate(username: string) {
    return new Username({ value: username });
  }
}
