import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import {
  ADMINISTRATOR_MAIL,
  ADMINISTRATOR_PASSWORD,
  CoreConfigService,
} from 'src/common/config/core/core.service';
import { UserRole, UserSigningBy } from 'src/common/enum';
import { SubscriptionService } from 'src/subscription/service/subscription.service';
import { CreateSystemAdministratorDto } from '../../auth/mail-connection/dto/create-system-administrator.dto';
import { createApiResponse } from '../../common/constants/create-api.response';
import {
  DATA_FOUND,
  FAILED_RESPONSE,
  NO_DATA_FOUND,
  SOMETHING_WENT_WRONG,
  SUCCESS_RESPONSE,
  USER_ALREADY_EXIST,
  USER_UPDATE_SUCCESSFUL,
} from '../../common/constants/message.response';
import { SortBy } from '../../common/enum/enum-sort-by';
import { ResourceDeleteService } from '../../common/module/resource-delete/resource-delete.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Initialization } from '../entities/initialization.entity';
import { User } from '../entities/user.entity';
import { removeSwaggerEmptyValues } from 'src/common/utils/removeSwaggerEmptyValues';
import { LogService } from 'src/log/service/log.service';
import { uploadDir } from 'src/common/utils/upload-dir';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Initialization.name)
    private initializationModel: Model<Initialization>,
    private jwtService: JwtService,
    private resourceDeleteService: ResourceDeleteService,
    private readonly config: CoreConfigService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    private readonly logService: LogService,
  ) { }

  //==============================================================================
  // Initialization and Setup
  //==============================================================================

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const initRecord = await this.initializationModel
      .findOne({ initialized: true })
      .exec();

    if (!initRecord) {
      const adminEmail = this.config.get(ADMINISTRATOR_MAIL);
      const adminPassword = this.config.get(ADMINISTRATOR_PASSWORD);
      const adminUser = await this.userModel
        .findOne({ email: adminEmail })
        .exec();
      if (!adminUser) {
        const newAdmin = new this.userModel({
          firstName: 'Admin',
          lastName: 'User',
          email: adminEmail,
          password: await this.hashPassword(adminPassword),
          termsAndCondition: true,
          role: UserRole.ADMINISTRATOR,
          isActive: true,
          signingBy: UserSigningBy.DEFAULT_CONNECTION,
          profileImage: '',
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }

      const newInitRecord = new this.initializationModel({ initialized: true });
      await newInitRecord.save();
    } else {
      console.log('Initialization already completed');
    }
  }

  //==============================================================================
  // User Creation and Authentication
  //==============================================================================

  async createSystemAdministrator(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    const userExist = await this.checkUserByEmail(
      createSystemAdministrator.email,
    );

    if (userExist.length > 0)
      throw new HttpException(USER_ALREADY_EXIST, HttpStatus.CONFLICT);

    const encryptedPassword = await this.hashPassword(
      createSystemAdministrator.password,
    );

    const user = new this.userModel();
    user.fullName = createSystemAdministrator.fullName;
    user.email = createSystemAdministrator.email;
    user.password = encryptedPassword;
    user.role = createSystemAdministrator.roles;
    return await user.save();
  }

  async createUser(createUserData: CreateUserDto) {
    const userExist = await this.checkUserByEmail(createUserData.email);

    if (userExist.length > 0)
      throw new HttpException(USER_ALREADY_EXIST, HttpStatus.CONFLICT);

    const encryptedPassword = await this.hashPassword(createUserData.password);
    const expiryDateTime = new Date();
    expiryDateTime.setDate(expiryDateTime.getDate() + 7);

    const user = new this.userModel({
      ...createUserData,
      isActive: true,
      password: encryptedPassword,
      roles: [createUserData.role],
    });

    const userData = await user.save()
    console.log(userData)
    const trialSubscription = await this.subscriptionService.addTrailSubscription(user)
    console.log("Trial Subscription Data", trialSubscription)

    return { userData, trialSubscription };
  }

  async createGoogleAuthUser({ email, fullName, password, profileImage }) {
    const encryptedPassword = await this.hashPassword(password);

    try {
      const user = new this.userModel({
        email,
        fullName,
        password: encryptedPassword,
        roles: [UserRole.USER],
        profileImage,
      });
      await this.subscriptionService.addTrailSubscription(user)
      return user.save();
    } catch (error) {
      return error;
    }
  }

  //==============================================================================
  // User Retrieval and Search
  //==============================================================================

  async findAll(
    page: number,
    limit: number,
    order: string,
    sort: SortBy,
    search: string,
    fields: string,
    startDate: Date,
    endDate: Date,
  ) {
    try {
      const pipeline: any[] = [];
      const matchStage: any = {};
      const additionalFields: any = {};

      if (fields) {
        const fieldsArray = fields.split(',');
        fieldsArray.forEach((field) => {
          const firstCharacter = field.trim().charAt(0);
          if (firstCharacter == '-') {
            additionalFields[field.trim().slice(1)] = null;
          } else {
            additionalFields[field.trim()] = 1;
          }
        });
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        const allFields = Object.keys(this.userModel.schema.obj);

        matchStage.$or = allFields.map((field) => ({
          [field]: { $regex: searchRegex },
        }));
      }

      if (startDate && endDate) {
        const startDateObject = new Date(startDate);
        const endDateObject = new Date(endDate);

        matchStage.createdAt = {
          $gte: startDateObject,
          $lt: endDateObject,
        };
      }

      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      // pipeline.push({
      //   $lookup: {
      //     from: 'subscriptions',
      //     let: { userId: { $toString: '$_id' } },
      //     pipeline: [
      //       { $match: { $expr: { $eq: ['$userId', '$$userId'] } } }
      //     ],
      //     as: 'subscription'
      //   }
      // });

      // pipeline.push({
      //   $unwind: {
      //     path: '$subscription',
      //     preserveNullAndEmptyArrays: true
      //   }
      // });

      pipeline.push({
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          mobileNumber: { $ifNull: ['$mobileNumber', null] },
          address: { $ifNull: ['$address', null] },
          status: { $ifNull: ['$status', null] },
          role: 1,
          signinBy: 1,
          country: 1,
          profileImage: { $ifNull: ['$profileImage', null] },
          sentMail: 1,
          token: 1,
          createdAt: 1,
          updatedAt: 1,
          // subscription: {
          //   $cond: {
          //     if: { $ifNull: ['$subscription', false] },
          //     then: '$subscription',
          //     else: null
          //   }
          // }
        }
      });

      pipeline.push({ $count: 'total' });

      const totalResult = await this.userModel.aggregate(pipeline);
      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      pipeline.pop();

      const startIndex = (page - 1) * limit;





      pipeline.push(
        { $skip: startIndex },
        { $limit: parseInt(limit.toString(), 10) },
      );

      const sortStage: any = {};
      sortStage[order] = sort === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sortStage });

      const data = await this.userModel.aggregate(pipeline);

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? Number(page) + 1 : null;
      const prevPage = hasPrevPage ? Number(page) - 1 : null;

      if (data.length > 0) {
        return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, {
          data,
          pagination: {
            total,
            totalPages,
            currentPage: Number(page),
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage,
          },
        });
      } else {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          NO_DATA_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAILED_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

  async findOne(id: string) {
    try {
      const pipeline = [
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'subscriptions',
            let: { userId: { $toString: '$_id' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$userId', '$$userId'] } } }
            ],
            as: 'subscription'
          }
        },
        {
          $unwind: {
            path: '$subscription',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            email: 1,
            mobileNumber: { $ifNull: ['$mobileNumber', null] },
            address: { $ifNull: ['$address', null] },
            status: { $ifNull: ['$status', null] },
            role: 1,
            signinBy: 1,
            country: 1,
            profileImage: { $ifNull: ['$profileImage', null] },
            sentMail: 1,
            token: 1,
            createdAt: 1,
            updatedAt: 1,
            subscription: {
              $cond: {
                if: { $ifNull: ['$subscription', false] },
                then: '$subscription',
                else: null
              }
            }
          }
        }
      ];

      const data = await this.userModel.aggregate(pipeline);
      if (data) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          DATA_FOUND,
          data,
        );
      } else {
        return createApiResponse(
          HttpStatus.NOT_FOUND,
          SUCCESS_RESPONSE,
          NO_DATA_FOUND,
        );
      }
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAILED_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email }).select('-password');
  }

  async getUserByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: Types.ObjectId) {
    return await this.userModel.findById(id).exec();
  }

  async findAllUserForNotify(user_ids: string[]) {
    let userIds: any = [...user_ids];
    userIds = userIds.map((item: string) => {
      return new Types.ObjectId(item);
    });
    return await this.userModel
      .find({ _id: { $in: userIds } })
      .select('_id token email allowPushNotification allowEmailNotification');
  }

  //==============================================================================
  // User Update and Deletion
  //==============================================================================

  async update(
    id: any,
    updateUserDto: UpdateUserDto,
    profileImage: any = null,
  ) {
    try {
      // clear swagger empty values
      removeSwaggerEmptyValues(updateUserDto);

      const user = await this.userModel.findById(id);

      if (!!user?.profileImage && profileImage) {
        console.log("User profile image found");
        await this.deleteProfileImage(user.profileImage);
      }

      if (profileImage != undefined || profileImage != null) {
        updateUserDto.profileImage = `${profileImage}`;
      }

      const data = await this.userModel
        .findByIdAndUpdate(id, {
          ...updateUserDto,
          fullName: `${updateUserDto?.firstName ?? ''} ${updateUserDto?.lastName ?? ''}`.trim(),
        }, { new: true })
        .select('-password')
        .exec();


      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        USER_UPDATE_SUCCESSFUL,
        data,
      );
    } catch (err) {
      if (profileImage != undefined || profileImage != null) {
        const path = `uploads/user-profile-image/${profileImage.filename}`;
        this.deleteProfileImage(path);
      }
      console.log(err);
      throw err;
    }
  }

  async updateExistingPassword(id: any, data: { password: string }) {
    try {
      if (data.password) {
        data.password = await this.hashPassword(data.password);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          id,
          { password: data.password },
          { new: true },
        )
        .select('-password')
        .exec();

      return updatedUser;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: string) {
    try {
      const data = await this.userModel
        .findByIdAndDelete(id)
        .select('-password')
        .exec();
      if (data) {
        return createApiResponse(
          HttpStatus.OK,
          SUCCESS_RESPONSE,
          DATA_FOUND,
          data,
        );
      }
      return createApiResponse(
        HttpStatus.NOT_FOUND,
        FAILED_RESPONSE,
        NO_DATA_FOUND,
      );
    } catch (error) {
      return createApiResponse(
        HttpStatus.BAD_REQUEST,
        FAILED_RESPONSE,
        SOMETHING_WENT_WRONG,
        error,
      );
    }
  }

  //==============================================================================
  // User Validation and Checks
  //==============================================================================

  async checkUserByEmail(email: string) {
    return await this.userModel.find({ email });
  }

  async checkUserByRoles(roles) {
    return await this.userModel.find({ roles });
  }

  async isExist(id: any) {
    return await this.userModel.exists({ _id: id });
  }

  async IsUserIdsExist(
    userIds: string[],
  ): Promise<{ [key: string]: boolean }[]> {
    const objectIds = userIds.map((id) => new Types.ObjectId(id));

    const existingUsers = await this.userModel
      .find({
        _id: { $in: objectIds },
      })
      .select('_id')
      .exec();

    const existingUserIds = existingUsers.map((user) => user._id.toString());

    return userIds.map((id) => {
      return {
        [id]: existingUserIds.includes(id),
      };
    });
  }

  async checkSystemAdministratorUser(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    return await this.checkUserByRoles(createSystemAdministrator.roles);
  }

  //==============================================================================
  // Authentication and Token Management
  //==============================================================================

  async getAccessToken(response) {
    const payload = {
      sub: (await response)._id,
      fullName: (await response).fullName,
      email: (await response).email,
      roles: (await response).roles,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return { data: payload, access_token };
  }

  async updateAccessToken(sub: string, access_token: string) {
    console.log('access token : ', sub, access_token);
    const data = await this.userModel.findByIdAndUpdate(sub, {
      currentToken: access_token,
    });

    console.log(data);
    return data;
  }

  async getAccessTokenByUserID(id: string) {
    try {
      const response = await this.userModel.findById(id).exec();
      const payload = {
        sub: response._id,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      };

      const access_token = await this.jwtService.signAsync(payload);
      return { data: payload, access_token };
    } catch (err) {
      throw err.message;
    }
  }

  //==============================================================================
  // User Profile Management
  //==============================================================================

  private async deleteProfileImage(filepath: string) {
    try {
      let fullPath = path.join(uploadDir(), 'user-profile-image', filepath);
      return await this.resourceDeleteService.delete(fullPath);
    } catch (err) {
      this.logService.error(
        'UserService.deleteProfileImage',
        err,
      );
    }
  }

  //==============================================================================
  // User Statistics and Metrics
  //==============================================================================

  async getDashbordCounting() {
    const result = await this.userModel.countDocuments({});
    return result;
  }

  //==============================================================================
  // User Financial Operations
  //==============================================================================

  async increseReserveFund(order: any) {
    try {
      const userId = order.orderBy.toString();
      let amount = order?.amount ? Number(order?.amount) : 0;
      amount = Math.abs(amount);

      return await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { reserveFund: amount } },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  async decreaseReserveFund(amount: number, userId: string) {
    try {
      amount = Math.abs(amount) * -1;

      return await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { reserveFund: amount } },
        { new: true },
      );
    } catch (err) {
      throw err;
    }
  }

  //==============================================================================
  // Utility Methods
  //==============================================================================

  async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}

