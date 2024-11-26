import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Users } from 'src/entities/entities/Users';
import { UserService } from 'src/user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UserService>

  beforeEach(async () => {
    fakeAuthService = {
      createUsersAcc: (email: string, password_typed: string, name: string, lastName: string) => {
        return Promise.resolve({
          idusers: 1,
          email,
          password: password_typed,
          name,
          lastName,
          roleIdrole: 1,
          positionIdposition: null,
          roomsOrders: [],
          servicesOrders: [],
        } as Users);
        
      },
      signinUser: (email: string, password: string) => {
        return Promise.resolve({
          idusers: 2,
          email,
          password,
          roleIdrole: 1,
          positionIdposition: null,
        } as Users);
      },
      createUserByAdmin: (email: string, name: string, lastName: string) => {
        return Promise.resolve({
          idusers: 3,
          email,
          name,
          lastName,
          roleIdrole: 3,
        } as Users);
      },
      createStaffByAdmin: (email: string, name: string, lastName: string) => {
        return Promise.resolve({
          idusers: 4,
          email,
          name,
          lastName,
        } as Users);
      },
      signout: (session: any) => {
        session.idusers = null;
        session.roleId = null;
        return Promise.resolve();
      },
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers:[
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UserService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('create user account, updates session object and returns user', async ()=>{
    const session = { 
      idusers: 1,
      roleId: 1
    }
    const user = await controller.createUser(
      {email:"asd@asd.com", password_typed: "23r324r", name:"Test", lastName:"Test"},
      session
      );
    expect(user.idusers).toEqual(1);
    expect(session.idusers).toEqual(1);
    expect(user.roleIdrole).toEqual(1);
    expect(session.roleId).toEqual(1)
  });
  it('should sign in a user, update session object and return the user', async () => {
    const session = {
      idusers: 1,
      roleId: 1
    };
    const user = await controller.singinUser(
      { email: "test@example.com", password_typed: "password123" },
      session
    );
  
    expect(user).toBeDefined();
    expect(user.email).toEqual("test@example.com");
    expect(user.password).toEqual("password123");
    expect(session.idusers).toEqual(2);
    expect(session.roleId).toEqual(1);
  });
  
  it('should sign up a user by admin and update the session object', async () => {
    const session: any = {};
    const user = await controller.singUserByAdmin(
      { email: "admin@example.com", name: "Admin", lastName: "User" },
      session
    );
  
    expect(user).toBeDefined();
    expect(user.email).toEqual("admin@example.com");
    expect(user.name).toEqual("Admin");
    expect(user.lastName).toEqual("User");
    expect(session.idusers).toEqual(3); 
    expect(session.roleId).toEqual(3);
  });
  
  it('should create staff by admin and return the created user', async () => {
    const body = { email: "staff@example.com", name: "Staff", lastName: "User" };
    const user = await controller.createStaffByAdmin(body);
    expect(user.email).toEqual("staff@example.com");
    expect(user.name).toEqual("Staff");
    expect(user.lastName).toEqual("User");
  });

  it('should sign out a user and clear the session', async () => {
    const session: any = { idusers: 1, roleId: 2 };
    
    await controller.signout(session);

    expect(session.idusers).toBeNull();
    expect(session.roleId).toBeNull();
  });

});
