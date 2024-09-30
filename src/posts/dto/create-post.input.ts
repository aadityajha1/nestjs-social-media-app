import { InputType, Int, Field } from '@nestjs/graphql';
// Ignore the import error
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Description for the post' })
  description: string;

  @Field(() => GraphQLUpload, { description: 'Url of the Image' })
  file: FileUpload;
}
