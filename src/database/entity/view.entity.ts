import { Entity, ManyToOne } from 'typeorm';

import { BaseModel } from './models/base.model';
import { PostEntity } from './post.entity';

@Entity('post_views')
export class PostViewEntity extends BaseModel {
  @ManyToOne(() => PostEntity, (post) => post.views)
  post: PostEntity;
}
