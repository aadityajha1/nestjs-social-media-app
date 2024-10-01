import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentsService.create(createCommentInput, currentUser.userId);
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.commentsService.findOne(id);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentsService.update(
      updateCommentInput.commentId,
      updateCommentInput,
      currentUser.userId,
    );
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  removeComment(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentsService.remove(id, currentUser.userId);
  }
}
