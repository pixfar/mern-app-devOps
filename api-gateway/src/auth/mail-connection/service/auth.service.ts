import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  CoreConfigService,
  JWT_SECRECT_KEY,
  MAIL_VERIFICATION_HOST,
} from '../../../common/config/core/core.service';
import { createApiResponse } from '../../../common/constants/create-api.response';
import {
  AN_ERROR_OCCURRED_WHILE_LOGGING_OUT,
  AN_ERROR_OCCURRED_WHILE_SAVING_DATA,
  FAILED_TO_SEND_VERIFICATION_MAIL,
  INVALID_PASSWORD,
  SUCCESS_RESPONSE,
  USER_ALREADY_EXIST,
  USER_CREATED_SUCCESSFULLY,
  USER_LOGGED_OUT_SUCCESSFULLY,
  USER_LOGIN_SUCCESSFUL,
  USER_MAIL_NOT_EXIST,
  USER_NOT_EXIST,
  USER_PASSWORD_UPDATE_SUCCESS,
  VERIFICATION_MAIL_SENT_SUCCESSFULLY,
  VERIFICATION_MISMATCHED,
  VERIFICATION_TIME_EXPIRED,
} from '../../../common/constants/message.response';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { UserService } from '../../../user/service/user.service';
import { CreateSystemAdministratorDto } from '../dto/create-system-administrator.dto';
import { UserLoginDto } from '../dto/user-login.dto';

import * as bcrypt from 'bcrypt';

import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RequestEventEmitter } from 'src/common/event-emitter/event-emitter.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ValidateAndUpdateExistingPasswordDto } from '../dto/validate-and-update-existing-password.dto';
import { ValidateAndUpdatePasswordDto } from '../dto/validate-and-update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly config: CoreConfigService,
    private readonly eventEmitter: RequestEventEmitter,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) { }

  // This method verifies the registration code provided by the user
  // If the code matches, it creates a new user by calling the userService.createUser method
  // If the code doesn't match, it returns an expectation failed response

  async login(userLoginDto: UserLoginDto) {
    const userInfo = await this.userService.getUserByEmailWithPassword(
      userLoginDto.email,
    );

    console.log(userInfo);

    if (!userInfo)
      throw new HttpException(USER_MAIL_NOT_EXIST, HttpStatus.NOT_FOUND);
    const matchPassword = await this.compareHashPassword(
      userLoginDto.password,
      userInfo.password,
    );

    if (!matchPassword)
      throw new HttpException(INVALID_PASSWORD, HttpStatus.UNAUTHORIZED);
    console.log('Before Token');
    const { access_token, data } = await this.getAccessToken(userInfo);
    console.log('after Token');
    return createApiResponse(
      HttpStatus.OK,
      SUCCESS_RESPONSE,
      USER_LOGIN_SUCCESSFUL,
      { access_token, data },
    );
  }

  // This method creates a new user by first checking if the user already exists
  // If the user doesn't exist, it sends a registration verification code to the user's email
  // If the user already exists, it returns a conflict response
  async registerUser(createUserData: CreateUserDto, currentOriginUrl: string) {

    const userExist = await this.userService.checkUserByEmail(
      createUserData.email,
    );

    if (userExist.length !== 0) throw new HttpException(USER_ALREADY_EXIST, HttpStatus.CONFLICT);

    this.eventEmitter.emit('sendVerificationMail', createUserData, currentOriginUrl);

    // const response_payload =
    //   await this.sendUserRegistrationVerificationCodeMail(createUserData);

    return createApiResponse(
      HttpStatus.ACCEPTED,
      SUCCESS_RESPONSE,
      VERIFICATION_MAIL_SENT_SUCCESSFULLY,
      createUserData,
    );
  }

  // This method verifies the token provided for system administrator registration
  // If the token is valid, it creates a new system administrator by calling the userService.createSystemAdministrator method
  // If the token is invalid or expired, it returns an expectation failed response
  async verifyToken(token: string) {
    try {
      const verifyResponse = await this.tokenVerification(token);
      if (!verifyResponse)
        throw new HttpException(
          VERIFICATION_TIME_EXPIRED,
          HttpStatus.EXPECTATION_FAILED,
        );
      const { userData, trialSubscription } = await this.userService.createUser(verifyResponse);
      const { data, access_token } = await this.getAccessToken(userData);
      return createApiResponse(
        HttpStatus.CREATED,
        SUCCESS_RESPONSE,
        USER_CREATED_SUCCESSFULLY,
        { data, access_token },
      );
    } catch (error) {
      const errorMessage =
        error?.response?.message || error.message || VERIFICATION_TIME_EXPIRED;
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // TODO
  async updateExistingPassword(
    verificationData: ValidateAndUpdateExistingPasswordDto,
    user: any,
  ) {
    try {
      const { currentPassword, newPassword } = verificationData;

      const userInfo = await this.userService.checkUserByEmail(user.email);
      if (!userInfo.length)
        throw new HttpException(USER_MAIL_NOT_EXIST, HttpStatus.NOT_FOUND);
      const matchPassword = await this.compareHashPassword(
        currentPassword,
        userInfo[0].password,
      );

      if (!matchPassword)
        throw new HttpException(INVALID_PASSWORD, HttpStatus.UNAUTHORIZED);

      const { access_token, data } = await this.getAccessToken(userInfo[0]);

      await this.userService.updateExistingPassword(user.sub, {
        password: newPassword,
      });

      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        USER_PASSWORD_UPDATE_SUCCESS,
        { access_token, data },
      );
    } catch (error) {
      throw new HttpException(
        error.message || AN_ERROR_OCCURRED_WHILE_SAVING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(user: any) {
    try {
      console.log(user);
      await this.userService.updateAccessToken(user.sub, '');
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        USER_LOGGED_OUT_SUCCESSFULLY,
      );
    } catch (error) {
      throw new HttpException(
        error.message || AN_ERROR_OCCURRED_WHILE_LOGGING_OUT,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // This method validates and updates the user's password
  // It first checks if the verification code matches the provided code
  // If the codes match, it checks if the user exists
  // If the user exists, it updates the user's password and returns a success response
  // If the codes don't match or the user doesn't exist, it returns an appropriate error response
  async validateAndUpdatePassword(
    tokenData: any,
    resetPasswordDto: ValidateAndUpdatePasswordDto,
  ) {
    try {
      const { verificationCode, email } = tokenData;
      if (+verificationCode !== +resetPasswordDto.verificationCode)
        throw new HttpException(
          VERIFICATION_MISMATCHED,
          HttpStatus.EXPECTATION_FAILED,
        );

      const userExist = await this.userService.checkUserByEmail(email);
      if (userExist.length === 0)
        throw new HttpException(USER_NOT_EXIST, HttpStatus.NOT_FOUND);

      const { password } = resetPasswordDto;
      await this.userService.updateExistingPassword(userExist[0]._id, {
        password,
      });
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        USER_PASSWORD_UPDATE_SUCCESS,
      );
    } catch (error) {
      throw new HttpException(
        error.message || VERIFICATION_TIME_EXPIRED,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  // This method initiates the password reset process by sending a verification code to the user's email
  // It first checks if the user exists
  // If the user exists, it generates a verification code and sends it to the user's email
  // If the user doesn't exist, it returns a not found response
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email } = forgotPasswordDto;
      const userExist = await this.userService.checkUserByEmail(email);
      if (userExist.length === 0)
        throw new HttpException(USER_NOT_EXIST, HttpStatus.NOT_FOUND);

      const verificationCode = Math.floor(
        1000 + Math.random() * 9000,
      ).toString();

      const access_token = this.jwtService.sign({
        email,
        verificationCode,
      }, {
        expiresIn: '300s',
      });

      this.eventEmitter.emit('sendForgotPasswordMail', email, verificationCode);

      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        VERIFICATION_MAIL_SENT_SUCCESSFULLY,
        { email, access_token },
      );
    } catch (err) {
      throw new HttpException(
        err.message || AN_ERROR_OCCURRED_WHILE_SAVING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // This method sends a password reset verification code to the user's email
  // It generates a JWT token with the user's email and verification code
  // It sends an email with the verification code and returns a success response with the token
  async sendUserPasswordForgotVerificationCodeMail(
    email: string,
    verificationCode: string,
  ) {
    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Passwort zurücksetzen',
        text: 'Passwort Mail zum Zurücksetzen',
        html: `
          <p>Hi!</p>
          <p>Dein Verifikations-Code zum zum Passwort-Zurücksetzen ist:</p> <b>${verificationCode}</b>
        `,
      });

      const access_token_payload = {
        email,
        verificationCode,
      };

      console.log(access_token_payload);

      const access_token = await this.jwtService.sign(access_token_payload, {
        expiresIn: '300s',
      });

      const response_payload = {
        email,
        access_token,
      };

      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        VERIFICATION_MAIL_SENT_SUCCESSFULLY,
        response_payload,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // This method verifies the provided JWT token
  async tokenVerification(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.config.get(JWT_SECRECT_KEY),
    });
  }

  // This method sends a registration verification code to the user's email
  // It generates a JWT token with the user's data and verification code
  // It sends an email with the verification code and returns a success response with the token
  async sendUserRegistrationVerificationCodeMail(
    createUserData: CreateUserDto,
    currentOriginUrl: string
  ) {
    try {
      const payload = { ...createUserData };
      const accessToken = await this.jwtService.sign(payload, {
        expiresIn: '360s',
      });

      const verificationLink = `${currentOriginUrl}/api/verify?token=${accessToken}`;
      await this.mailService.sendMail({
        to: createUserData.email,
        subject: 'Account verifizieren',
        text: `Bitte verifiziere deinen Account durch Klicken auf den folgenden Link: ${verificationLink}`,
        html: `
          <p>Dear Hallo,</p>
          <p>Danke für Deine Anmeldung bei MeinJustus.de. Um sicher zu gehen, dass es sich bei der Registrierung um Deine Anfrage handelt, ersuchen wir Dich, Deinen Account hiermit zu verifizieren.</p>
          <p>Bitte klicke auf  folgenden Button:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Account verifizieren</a>
          <p>Aus Sicherheitsgründen verfällt dieser Link innerhalb von 6 Minuten.</p>
          <p>Wenn Du diese Accountanmeldung nicht durchgeführt hast, ignoriere bitte dieses Email.</p>
          <p>Beste Dank und liebe Grüße,<br>Dein MeinJustus -Sekretariat</p>
        `,
      });
      return {
        ...payload,
      };
    } catch (err) {
      throw new HttpException(
        err.message || FAILED_TO_SEND_VERIFICATION_MAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // This method sends a verification email to the system administrator's email
  // It first checks if the user already exists
  // If the user doesn't exist, it generates a JWT token with the user's data
  // It sends an email with a verification link containing the token and returns a success response
  async sendSystemAdministratorVerificationMail(
    createSystemAdministrator: CreateSystemAdministratorDto,
  ) {
    try {
      const payload = {
        fullName: createSystemAdministrator.fullName,
        roles: createSystemAdministrator.roles,
        email: createSystemAdministrator.email,
        password: createSystemAdministrator.password,
      };

      const access_token = await this.jwtService.sign(payload, {
        expiresIn: '300s',
      });

      await this.mailService.sendMail({
        to: createSystemAdministrator.email,
        subject: 'Registration Verification',
        text: 'Registration Verification mail',
        html: `
          <p>Hi there!</p>
          <p>Please verify your registration by clicking the link below:</p>
          <a href="${this.config.get(
          MAIL_VERIFICATION_HOST,
        )}/auth-mail/verify?token=${access_token}">Verify Email</a>
        `,
      });

      return payload;
    } catch (error) {
      throw new HttpException(
        error.message || FAILED_TO_SEND_VERIFICATION_MAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // This method compares the provided password with the hashed user password

  async compareHashPassword(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
  }

  async getAccessToken(response) {
    const payload = {
      sub: (await response)._id,
      fullName: (await response).fullName,
      email: (await response).email,
      role: (await response).role,
      subscribedPlan: (await response).subscribedPlan,
    };
    const access_token = await this.jwtService.signAsync(payload);
    await this.userService.updateAccessToken(payload.sub, access_token);
    return { data: payload, access_token };
  }
}
