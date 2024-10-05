import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, ObjectId, Schema, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserInput: CreateUserInput) {
    const { name, dob, profile_picture, username, email, password, bio } =
      createUserInput;
    const userExists = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      throw new BadRequestException(
        'User with this username or email already exists.',
      );
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

    if (!passwordRegex.test(password)) {
      throw new BadRequestException(
        'Password must be at least 7 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      name,
      dob,
      profile_picture,
      username,
      email,
      password: hashedPassword,
      bio,
    });

    return newUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
    });

    return user;
  }

  async searchUsersByName(
    query: string,
    currentUserId: string,
  ): Promise<any[]> {
    const users = await this.userModel.find({
      name: { $regex: query, $options: 'i' },
    });
    console.log('Users', users);

    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      profile_picture: user.profile_picture,
      email: user.email,
      bio: user.bio,
      isFollowing: user.followers.some(
        (followerId) => followerId.toString() === currentUserId,
      ),
    }));
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async followUser(userId: string, currentUserId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    const userToFollow = await this.userModel.findById(userId);
    if (!userToFollow || !currentUser)
      throw new BadRequestException('User not found');
    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      await currentUser.save();
    }

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id);
      await userToFollow.save();
    }
    return userToFollow;
  }
}
