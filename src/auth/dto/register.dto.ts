import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  username: string;

  @Field()
  dob: Date;

  @Field({ nullable: true })
  profile_picture?: string;

  @Field({ nullable: true })
  bio?: string;
}
