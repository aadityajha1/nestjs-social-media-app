import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() currentUser: any,
  ) {
    return this.postsService.create(createPostInput, currentUser.userId);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.postsService.findOne(id);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() currentUser: any,
  ) {
    return this.postsService.update(
      updatePostInput.id,
      updatePostInput,
      currentUser.userId,
    );
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  removePost(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.postsService.remove(id, currentUser.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post], { name: 'searchPosts' })
  searchPosts(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('page', { type: () => Int, defaultValue: 0 }) page: number,
    @Args('query', { nullable: true }) query: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.postsService.getPostFeeds(currentUser.userId, page, limit);
  }
}
