import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Name of the user' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Date of birth of the user' })
  @IsDateString()
  dob: Date;

  @Field(() => String, {
    nullable: true,
    description: 'Profile picture URL of the user',
  })
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @Field(() => String, { description: 'Username of the user' })
  @IsString()
  username: string;

  @Field(() => String, { description: 'Email of the user' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Password of the user' })
  @IsString()
  password: string;

  @Field(() => String, { nullable: true, description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Followers of the user',
  })
  @IsOptional()
  @IsArray()
  followers?: Types.ObjectId[];
}
