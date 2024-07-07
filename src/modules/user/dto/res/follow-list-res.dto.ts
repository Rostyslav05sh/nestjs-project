import { UserResDto } from './user-res.dto';

export class FollowListResDto {
  followings: UserResDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    sortBy: string;
    sortOrder: string;
  };
}
