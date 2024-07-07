import { PostResDto } from './post.res.dto';

export class PostListResDto {
  data: PostResDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    averagePrice?: number;
  };
}
