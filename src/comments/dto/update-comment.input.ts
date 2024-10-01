import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => String, { description: 'Comment Id which is to be updated' })
  commentId: string;

  @Field(() => String, { description: 'Updated Content of the comment' })
  content: string;
}
