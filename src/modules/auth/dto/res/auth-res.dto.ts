import { UserResDto } from '../../../user/dto/res/user-res.dto';
import { TokenResDto } from './token-res.dto';

export class AuthResDto {
  user: UserResDto;
  tokens: TokenResDto;
}
