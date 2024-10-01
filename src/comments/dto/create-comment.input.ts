import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String, {
    description: 'Post Id in which comment is to be created',
  })
  postId: string;

  @Field(() => String, { description: 'Content of the comment' })
  content: string;
}
