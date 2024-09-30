import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  isFollowing: boolean;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => Date)
  @Prop({ required: true })
  dob: Date;

  @Field({ nullable: true })
  @Prop()
  profile_picture: string;

  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field({ nullable: true })
  @Prop()
  bio: string;

  @Field(() => [ID], { defaultValue: [] })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  followers: UserDocument['_id'][];

  @Field(() => [ID], { defaultValue: [] })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  following: UserDocument['_id'][];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
