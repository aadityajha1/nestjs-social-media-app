import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async create(createCommentInput: CreateCommentInput, currentUserId: string) {
    const { postId, content } = createCommentInput;
    const post = await this.commentModel.findById(postId);
    if (!post) throw new BadRequestException('Post not found');
    const user = await this.userModel.findById(currentUserId);
    const comment = new this.commentModel({
      content,
      postId,
      userId: user._id,
    });

    return comment;
  }

  findAll() {
    return `This action returns all comments`;
  }

  async findOne(id: string) {
    const comment = await this.commentModel.findById(id);
    return comment;
  }

  async update(
    id: string,
    updateCommentInput: UpdateCommentInput,
    currentUserId: string,
  ) {
    const user = await this.userModel.findById(currentUserId);
    if (!user) throw new BadRequestException('User not found');
    const comment = await this.commentModel.findById(
      updateCommentInput.commentId,
    );
    if (!comment) throw new BadRequestException('Comment not found');
    if (comment.userId !== user._id)
      throw new BadRequestException('Unauthorized to update this comment');
    comment.content = updateCommentInput.content;
    await comment.save();
    return comment;
  }

  async remove(id: string, currentUserId: string) {
    const user = await this.userModel.findById(currentUserId);

    const comment = await this.commentModel.findById(id);
    if (!comment) throw new BadRequestException('Comment not found');
    if (comment.userId !== user._id)
      throw new BadRequestException('Unauthorized to delete this comment');
    return await this.commentModel.findByIdAndDelete(id);
  }
}
