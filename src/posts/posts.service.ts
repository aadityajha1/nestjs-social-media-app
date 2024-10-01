import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path, { join } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model, Schema } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import fs from 'fs';
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModule: Model<UserDocument>,
  ) {}
  async create(createPostInput: CreatePostInput, currentUserId: string) {
    const { description, file } = createPostInput;
    const { createReadStream, filename } = await file;
    const uploadDir = join(process.cwd(), './uploads');
    const name = filename.split('.')[0];
    const ext = filename.split('.').pop();
    const newFilename = `${name}-${Date.now()}.${ext}`;
    const currentUser = await this.userModule.findById(currentUserId);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir);
    }
    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(createWriteStream(join(uploadDir, `${newFilename}`)))
        .on('finish', () => {
          const post = new this.postModel({
            description,
            imageUrl: filename,
            userId: currentUser._id,
          });
          post.save().then((p) => {
            resolve(p);
          });
        })
        .on('error', () => {
          throw new BadRequestException('Error uploading file');
        });
    });
  }

  findAll() {
    return this.postModel.find({ isDeleted: false }).exec();
  }

  findOne(id: string) {
    return this.postModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePostInput: UpdatePostInput,
    currentUserId: string,
  ) {
    const { description, file } = updatePostInput;
    const post = await this.postModel.findById(id);

    if (!post) throw new BadRequestException('Post not found');
    if (post.userId.toString() !== currentUserId)
      throw new HttpException('Unauthorized', 403);

    if (description) {
      post.description = description;
    }
    if (file) {
      const { createReadStream, filename } = await file;
      const uploadDir = join(process.cwd(), './uploads');
      const name = filename.split('.')[0];
      const ext = filename.split('.').pop();
      const newFilename = `${name}-${Date.now()}.${ext}`;
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir);
      }
      return new Promise(async (resolve) => {
        createReadStream()
          .pipe(createWriteStream(join(uploadDir, `${newFilename}`)))
          .on('finish', () => {
            fs.unlink(path.join(uploadDir, post.imageUrl), function (err) {
              if (err) {
                throw err;
              } else {
                console.log('Successfully deleted the file.');
              }
            });
            post.imageUrl = filename;
            post.save().then((p) => {
              resolve(p);
            });
          })
          .on('error', () => {
            throw new BadRequestException('Error uploading file');
          });
      });
    }
    return post.save();
  }

  async remove(id: string, currentUserId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new BadRequestException('Post not found');
    if (post.userId.toString() !== currentUserId)
      throw new HttpException('Unauthorized', 403);
    post.isDeleted = true;
    await post.save();
    return post;
  }

  async getPostFeeds(
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    filter: any = {},
  ) {
    const skip = (page - 1) * limit;

    const followingUsers = await this.userModule
      .findById(currentUserId)
      .select('following');
    // .lean();

    if (!followingUsers || followingUsers.following.length === 0) {
      return [];
    }

    const followingIds = followingUsers.following;

    const pipeline = [
      {
        $match: {
          userId: { $in: followingIds },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: '$userId',
      },
      {
        $project: {
          _id: 1,
          description: 1,
          imageUrl: 1,
          createdAt: 1,
          'userId._id': 1,
          'userId.name': 1,
          'userId.profile_picture': 1,
        },
      },
      {
        $sample: { size: limit }, // Randomize the posts by shuffling
      },
    ];

    // Execute the aggregation pipeline with pagination
    const userFeed = await this.postModel.aggregate(pipeline).exec();
    return userFeed;
  }
}
