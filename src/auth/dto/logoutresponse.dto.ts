import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LogoutResponse {
  @Field(() => String, { nullable: true })
  access_token: string | null;
}
