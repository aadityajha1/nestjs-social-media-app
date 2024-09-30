import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model, Schema } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';

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
    const currentUser = await this.userModule.findById(currentUserId);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir);
    }
    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(createWriteStream(join(uploadDir, `${filename}`)))
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
    return `This action returns all posts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  update(id: string, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
