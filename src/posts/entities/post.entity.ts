import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';

export type PostDocument = Post & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Post extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: UserDocument['_id'];

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field({ nullable: true })
  @Prop()
  imageUrl: string;

  @Field({ defaultValue: false })
  @Prop({ default: false })
  isDeleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
