import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { EmailSenderService } from "src/email-sender/email-sender.service";
import { Users } from "src/entities/entities/Users";
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';

describe('AuthService', ()=>{

    let service: AuthService;
    let fakeUsersService: Partial<UserService>;
    let fakeEmailSenderService: Partial<EmailSenderService>
    beforeEach (async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            
        };
    
        const fakeUsersRepository = {
            findOne: jest.fn(() => Promise.resolve(null)),
            create: jest.fn(({ email, name, lastName, password, roleIdrole }) => ({
                idusers: Math.floor(Math.random() * 1000),
                email,
                password,
                name,
                lastName,
                roleIdrole,
                positionIdposition: null,
                roomsOrders: [],
                servicesOrders: [],
            } as Users)),
            save: jest.fn((user) => Promise.resolve(user)),
        };
        
    
        fakeEmailSenderService = {
            sendEmail: jest.fn(() => Promise.resolve()),
        };
    
        const fakePositionRepository = {
            findOne: () => Promise.resolve(null),
        };
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: fakeUsersService,
                },
                {
                    provide: 'UsersRepository',
                    useValue: fakeUsersRepository,
                },
                {
                    provide:  EmailSenderService,
                    useValue: fakeEmailSenderService,
                },
                {
                    provide: 'PositionRepository',
                    useValue: fakePositionRepository,
                },
            ],
        }).compile();
    
       service = module.get(AuthService);
    })
    it('creates a new user with hashed password', async () => {
        const email = "test@test1.com";
        const password = "adfasd";
        const name = "Test";
        const lastName = "User";

        const user = await service.createUsersAcc(email, password, name, lastName);

        expect(user.password).not.toEqual(password);

        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
    it('throws an error if users sings up with email that is in use', async () =>{
        fakeUsersService.find = jest.fn(() => Promise.resolve([{ idusers: 1, email: 'test@test1.com', password: 'hashed_password', name: 'Test', lastName: 'User' } as Users]));
        await expect(service.createUsersAcc('test@test1.com', 'password', 'Test', 'User')).rejects.toThrow(BadRequestException);
    })
    it('signs in with email and password', async () => {
        const email = "test@test1.com";
        const password = "adfasd";
    
        fakeUsersService.find = jest.fn(() => 
            Promise.resolve([{
                idusers: 1,
                email,
                password: "salt.hash", 
                name: "Test",
                lastName: "User",
            } as Users])
        );
    
        service['verifyPassword'] = jest.fn(async (inputPassword, storedPassword) => true);
    
        const user = await service.signinUser(email, password);
    
        expect(user).toBeDefined();
        expect(user.email).toEqual(email);
        expect(fakeUsersService.find).toHaveBeenCalledWith(email);
        expect(service['verifyPassword']).toHaveBeenCalledWith(password, "salt.hash");
    });
    
    it('throws error if email does not exist', async () => {
        const email = "nonexistent@test.com";
        const password = "password";
    
        fakeUsersService.find = jest.fn(() => Promise.resolve([]));
    
        await expect(service.signinUser(email, password)).rejects.toThrow(NotFoundException);
        expect(fakeUsersService.find).toHaveBeenCalledWith(email);
    });
    
    it('throws error if password is incorrect', async () => {
        const email = "test@test1.com";
        const password = "invalid_password";
    
        fakeUsersService.find = jest.fn(() => 
            Promise.resolve([{
                idusers: 1,
                email,
                password: "salt.hash", 
                name: "Test",
                lastName: "User",
            } as Users])
        );
    
        service['verifyPassword'] = jest.fn(async (inputPassword, storedPassword) => false);
    
        await expect(service.signinUser(email, password)).rejects.toThrow(BadRequestException);
        expect(service['verifyPassword']).toHaveBeenCalledWith(password, "salt.hash");
    });
    
    it('creates a user by admin with generated password and sends email', async () => {
        const email = "test@test1.com";
        const name = "Test";
        const lastName = "User";

        const createdUser = await service.createUserByAdmin(email, name, lastName);

        expect(createdUser).toBeDefined();
        expect(createdUser.email).toEqual(email);
        
        expect(fakeEmailSenderService.sendEmail).toHaveBeenCalledWith(
            email,
            'Your password',
            expect.stringContaining('Password to your account:')
        );

    });

    it('clears session and logs out user successfully', async () => {
        const session = {
          idusers: 1,
          roleId: 1,
        };
    
        await service.signout(session);
    
        expect(session.idusers).toBeNull();
        expect(session.roleId).toBeNull();
      });
     

})
