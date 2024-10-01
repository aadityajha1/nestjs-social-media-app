import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/posts/entities/post.entity';
export type CommentDocument = Comment & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Comment extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: UserDocument['_id'];

  @Field(() => Post)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  postId: PostDocument['_id'];

  @Field(() => String)
  @Prop({ type: String, required: true })
  content: string;
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
