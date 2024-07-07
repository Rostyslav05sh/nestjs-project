import { Entity, ManyToOne } from 'typeorm';

import { PostEntity } from '../post.entity';

@Entity('post_views')
export class PostViewEntity {
  @ManyToOne(() => PostEntity, (post) => post.views)
  post: PostEntity;
}
