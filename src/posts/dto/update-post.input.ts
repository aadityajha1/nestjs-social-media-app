import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
// Ignore the import error
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => GraphQLUpload, {
    description: 'Url of the Image',
    nullable: true,
  })
  file: FileUpload;

  @Field(() => String)
  id: string;
}
