import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import UnauthenticatedError from '../errors/unauthenticated.error.js';
import { attachCookiesToResponse } from '../utils/jwt.js';
import { isTokenValid } from '../utils/jwt.js';
import createTokenUser from '../utils/create.token.user.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required fields');
  }

  const normalizedEmail = email.toLowerCase();
  const isEmailExists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (isEmailExists) {
    throw new BadRequestError('Email is already registered!');
  }

  const isFirstAccount = await prisma.user.count();
  const role = isFirstAccount === 0 ? 'ADMIN' : 'USER';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    },
  });

  const refreshToken = crypto.randomBytes(40).toString('hex');

  await prisma.token.create({
    data: {
      userId: user.id,
      refreshToken,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
      isValid: true,
    },
  });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide a valid email and password');
  }

  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const existingToken = await prisma.token.findFirst({
    where: {
      userId: user.id,
      isValid: true,
    },
  });

  let refreshToken = '';

  if (existingToken) {
    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(40).toString('hex');

    await prisma.token.create({
      data: {
        userId: user.id,
        refreshToken,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        isValid: true,
      },
    });
  }

  await prisma.token.create({
    data: {
      userId: user.id,
      refreshToken,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
      isValid: true,
    },
  });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  if (!refreshToken) {
    throw new UnauthenticatedError('Refresh token missing');
  }

  const payload = isTokenValid(refreshToken);

  const realRefreshToken = payload.user.refreshToken;

  const existingToken = await prisma.token.findFirst({
    where: {
      userId: payload.user.userId,
      refreshToken: realRefreshToken,
      isValid: true,
    },
  });

  if (!existingToken) {
    throw new UnauthenticatedError('Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.user.userId },
  });

  if (!user) {
    throw new UnauthenticatedError('User no longer exists');
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({
    res,
    user: tokenUser,
    refreshToken: existingToken.refreshToken,
  });
};

export const logout = async (req, res) => {
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 1000),
    signed: true,
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 1000),
    signed: true,
  });
  res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};
