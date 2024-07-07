import { UserResDto } from './user-res.dto';

export class FollowListResDto {
  data: UserResDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
