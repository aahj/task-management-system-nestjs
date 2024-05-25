import { Test } from '@nestjs/testing';
import { UserRepository } from './auth.repository';
import { DataSource } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

const mockCredentialsDto = { username: 'test1', password: 'abc123' };

const mockDataSource = {
  createEntityManager: jest.fn(),
  transaction: jest.fn(),
  manager: {
    save: jest.fn(),
  },
};

describe('UserRepository', () => {
  let userRepository: UserRepository;


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save })
    });
    it('should sign up a user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throw conflict excpetion as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws internal server excpetion', () => {
      save.mockRejectedValue({ code: '23000' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});