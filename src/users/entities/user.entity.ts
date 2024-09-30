import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Define the User document interface
export type UserDocument = User & Document;

// GraphQL ObjectType definition
@ObjectType() // This decorator makes the class part of the GraphQL schema
@Schema({ timestamps: true }) // Define the Mongoose schema with timestamps
export class User {
  @Field(() => ID) // GraphQL ID field for MongoDB _id
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  isFollowing: boolean;

  @Field() // Expose 'name' as a GraphQL field
  @Prop({ required: true })
  name: string;

  @Field(() => Date) // Expose 'dob' as a Date field in GraphQL
  @Prop({ required: true })
  dob: Date;

  @Field({ nullable: true }) // Profile picture can be null
  @Prop()
  profile_picture: string;

  @Field() // Expose 'username' as a GraphQL field
  @Prop({ required: true, unique: true })
  username: string;

  @Field() // Expose 'email' as a GraphQL field
  @Prop({ required: true, unique: true })
  email: string;

  // Do not expose 'password' to GraphQL for security reasons
  @Prop({ required: true })
  password: string;

  @Field({ nullable: true }) // Expose 'bio' as an optional field in GraphQL
  @Prop()
  bio: string;

  @Field(() => [ID], { defaultValue: [] }) // Expose 'followers' as a list of IDs
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  followers: UserDocument['_id'][];

  @Field(() => [ID], { defaultValue: [] }) // Expose 'followers' as a list of IDs
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  following: UserDocument['_id'][];
}

// Create the Mongoose schema factory
export const UserSchema = SchemaFactory.createForClass(User);

// Add methods directly on the schema instance (comparePassword)
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
