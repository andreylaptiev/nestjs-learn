import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      // fake methods of UsersService which we use in our app inside AuthService
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        // things we register inside testing DI container
        AuthService,
        {
          // if anyone asks for UsersSevice
          provide: UsersService,
          // give him this object
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // here fakeUsersService is used to resolve AuthService dependency
    authService = module.get(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await authService.signup('test@mail.com', 'qwerty');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('qwerty');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an existing email', async () => {
    // create user
    await authService.signup('test@mail.com', 'qwerty');

    // test user
    await expect(authService.signup('test@mail.com', 'qwerty')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user signs in with unused email', async () => {
    await expect(
      authService.signin('wrong@mail.com', 'qwerty'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error if wrong password provided', async () => {
    await authService.signup('test@mail.com', 'qwerty');

    await expect(
      authService.signin('test@mail.com', 'qwerty123'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if password is correct', async () => {
    await authService.signup('test@mail.com', 'qwerty');

    const user = await authService.signin('test@mail.com', 'qwerty');
    expect(user).toBeDefined();
  });
});
