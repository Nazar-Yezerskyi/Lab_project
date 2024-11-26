import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { Position } from 'src/entities/entities/Position';
import { Users } from 'src/entities/entities/Users';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(Users) private usersRepo: Repository<Users>,
        private userService: UserService,
        private emailSenderService: EmailSenderService,
        @InjectRepository(Position) private positionRepo: Repository<Position>,
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        return `${salt}.${hash.toString('hex')}`;
    }

    private async verifyPassword(password: string, storedPassword: string): Promise<boolean> {
        const [salt, storedHash] = storedPassword.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        return storedHash === hash.toString('hex');
    }

    private async checkEmailExists(email: string): Promise<void> {
        const users = await this.userService.find(email);
        if (users.length) {
            this.logger.warn(`Email already in use: ${email}`);
            throw new BadRequestException('email in use');
        }
    }

    private async createUser(email: string, name: string, lastName: string, password: string, roleId: number) {
        const user = this.usersRepo.create({ email, name, lastName, password, roleIdrole: roleId });
        return this.usersRepo.save(user);
    }

    async createUsersAcc(email: string, password_typed: string, name: string, lastName: string) {
        this.logger.log(`Creating user account for email: ${email}`);
        await this.checkEmailExists(email);

        const password = await this.hashPassword(password_typed);
        const savedUser = await this.createUser(email, name, lastName, password, 1);

        this.logger.log(`User account created successfully: ${email}`);
        return savedUser;
    }

    async signinUser(email: string, password: string) {
        this.logger.log(`Signing in user with email: ${email}`);

        const [user] = await this.userService.find(email);
        if (!user) {
            this.logger.warn(`User not found: ${email}`);
            throw new NotFoundException('user not found');
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Invalid password for user: ${email}`);
            throw new BadRequestException('bad password');
        }

        this.logger.log(`User signed in successfully: ${email}`);
        return user;
    }

    async createUserByAdmin(email: string, name: string, lastName: string) {
        this.logger.log(`Admin creating user with email: ${email}`);
        await this.checkEmailExists(email);

        const generatedPassword = randomBytes(10).toString('hex').slice(0, 10);
        const password = await this.hashPassword(generatedPassword);

        await this.emailSenderService.sendEmail(
            email,
            'Your password',
            `Password to your account: ${generatedPassword} - do not share it with anyone, you can change the password in your personal account`
        );

        const savedUser = await this.createUser(email, name, lastName, password, 1);

        this.logger.log(`User created by admin successfully: ${email}`);
        return savedUser;
    }

    async createStaffByAdmin(email: string, name: string, lastName: string) {
        this.logger.log(`Admin creating staff with email: ${email}`);
        await this.checkEmailExists(email);

        const generatedPassword = randomBytes(10).toString('hex').slice(0, 10);
        const password = await this.hashPassword(generatedPassword);

        await this.emailSenderService.sendEmail(
            email,
            'Your password',
            `Password to your account: ${generatedPassword} - do not share it with anyone.\nBest regards,\n"Rest" team`
        );

        const savedUser = await this.createUser(email, name, lastName, password, 2);

        this.logger.log(`Staff created by admin successfully: ${email}`);
        return savedUser;
    }
    async signout(session: any): Promise<void> {
        this.logger.log(`Signing out user with session: ${JSON.stringify(session)}`);
    
        if (!session || !session.idusers) {
            this.logger.warn('No user session found');
            throw new BadRequestException('No active session to sign out');
        }
    
        session.idusers = null;
        session.roleId = null;
    
        this.logger.log('User signed out successfully');
    }
}


// import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { randomBytes, scrypt as _scrypt } from 'crypto';
// import { EmailSenderService } from 'src/email-sender/email-sender.service';
// import { Position } from 'src/entities/entities/Position';
// import { Users } from 'src/entities/entities/Users';
// import { UserService } from 'src/user/user.service';
// import { Repository } from 'typeorm';
// import { promisify } from 'util';
// const scrypt = promisify(_scrypt);

// @Injectable()
// export class AuthService {
//     private readonly logger = new Logger(AuthService.name);

//     constructor(
//         @InjectRepository(Users) private usersRepo: Repository<Users>,
//         private userService: UserService,
//         private emailSenderService: EmailSenderService,
//         @InjectRepository(Position) private positionRepo: Repository<Position>,
//     ) {}

//     async createUsersAcc(email: string, password_typed: string, name: string, lastName: string) {
//         this.logger.log(`Створення акаунта для користувача з email: ${email}`);
        
//         const users = await this.userService.find(email);
//         if (users.length) {
//             this.logger.warn(`Спроба створити акаунт з існуючим email: ${email}`);
//             throw new BadRequestException('email in use');
//         }

//         const salt = randomBytes(8).toString('hex');
//         const hash = (await scrypt(password_typed, salt, 32)) as Buffer;
//         const password = salt + '.' + hash.toString('hex');
        
//         this.logger.debug(`Пароль для користувача ${email} захешовано`);

//         const roleId = 1;
//         const user = this.usersRepo.create({ email, name, lastName, password, roleIdrole: roleId });

//         const savedUser = await this.usersRepo.save(user);
//         this.logger.log(`Користувач ${email} успішно створений`);
//         return savedUser;
//     }

//     async signinUser(email: string, password: string) {
//         this.logger.log(`Спроба входу для користувача з email: ${email}`);

//         const [user] = await this.userService.find(email);
//         if (!user) {
//             this.logger.warn(`Користувач із email ${email} не знайдений`);
//             throw new NotFoundException('user not found');
//         }

//         const [salt, storedHash] = user.password.split('.');
//         const hash = (await scrypt(password, salt, 32)) as Buffer;

//         if (storedHash !== hash.toString('hex')) {
//             this.logger.warn(`Невірний пароль для користувача ${email}`);
//             throw new BadRequestException('bad password');
//         }

//         this.logger.log(`Користувач ${email} успішно ввійшов`);
//         return user;
//     }

//     async createUserByAdmin(email: string, name: string, lastName: string) {
//         this.logger.log(`Адміністратор створює користувача з email: ${email}`);

//         const users = await this.userService.find(email);
//         if (users.length) {
//             this.logger.warn(`Спроба створення користувача з існуючим email: ${email}`);
//             throw new BadRequestException('email in use');
//         }

//         const generatePassword = randomBytes(10).toString('hex').slice(0, 10);
//         const salt = randomBytes(8).toString('hex');
//         const hash = (await scrypt(generatePassword, salt, 32)) as Buffer;
//         const password = salt + '.' + hash.toString('hex');

//         this.emailSenderService.sendEmail(
//             email,
//             'Your password',
//             `Password to your account: ${generatePassword} - do not share it with anyone, you can change the password in your personal account`
//         );

//         const roleId = 1;
//         const user = this.usersRepo.create({ email, name, lastName, password, roleIdrole: roleId });

//         const savedUser = await this.usersRepo.save(user);
//         this.logger.log(`Користувач ${email} успішно створений адміністратором`);
//         return savedUser;
//     }

//     async createStaffByAdmin(email: string, name: string, lastName: string) {
//         this.logger.log(`Адміністратор створює співробітника з email: ${email}`);

//         const users = await this.userService.find(email);
//         if (users.length) {
//             this.logger.warn(`Спроба створення співробітника з існуючим email: ${email}`);
//             throw new BadRequestException('email in use');
//         }

//         const generatePassword = randomBytes(10).toString('hex').slice(0, 10);
//         const salt = randomBytes(8).toString('hex');
//         const hash = (await scrypt(generatePassword, salt, 32)) as Buffer;
//         const password = salt + '.' + hash.toString('hex');

//         this.emailSenderService.sendEmail(
//             email,
//             'Your password',
//             `Password to your account: ${generatePassword} - do not share it with anyone.\nBest regards,\n"Rest" team`
//         );

//         const roleId = 2;
//         const user = this.usersRepo.create({ email, name, lastName, password, roleIdrole: roleId });

//         const savedUser = await this.usersRepo.save(user);
//         this.logger.log(`Співробітник ${email} успішно створений адміністратором`);
//         return savedUser;
//     }
// }
