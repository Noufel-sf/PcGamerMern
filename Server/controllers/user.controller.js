import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import NotFoundError from '../errors/not.found.error.js';
import createTokenUser from '../utils/create.token.user.js';
import checkPermission from '../utils/check.permission.js';
import bcrypt from 'bcryptjs';

export const showCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  const tokenUser = createTokenUser(user);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserInfo = async (req, res) => {
  const userId = req.user.userId;
  const { name, email } = req.body;
  if (!name && !email) {
    throw new BadRequestError('Please provide at least new name or email!');
  }

  const isEmailExist = await prisma.user.findFirst({
    where: { email, id: { not: userId } },
  });
  if (isEmailExist) {
    throw new BadRequestError('Email is already exists');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  checkPermission(req.user, user.id);

  await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });

  res.status(StatusCodes.OK).json({
    message: 'Account Information Updated Successfully',
  });
};

export const updateUserPassword = async (req, res) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new BadRequestError(
      'Please provide both current password and new password'
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  checkPermission(req.user, user.id);

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new BadRequestError('Current Password is not correct!');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password updated successfully.' });
};

export const adminGetAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true },
      },
    },
  });
  res.status(StatusCodes.OK).json({ users });
};

export const adminUpdateUserInfo = async (req, res) => {
  const { id: userId } = req.params;
  const { name, email } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError(`No users found with this id ${userId}`);
  }

  const isEmailExist = await prisma.user.findFirst({
    where: {
      email,
      id: { not: userId },
    },
  });

  if (isEmailExist) {
    throw new BadRequestError('Email already in use');
  }

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });

  res.status(StatusCodes.OK).json({ message: 'User Information Updated' });
};

export const adminUpdateUserPassword = async (req, res) => {
  const { id: userId } = req.params;
  const { newPassword } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError(`No users found with this id ${userId}`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Password has been updated successfully' });
};
