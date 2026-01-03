import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import NotFoundError from '../errors/not.found.error.js';

export const createCategory = async (req, res) => {
  const { title, description, href } = req.body;
  if (!title || !description || !href) {
    throw new BadRequestError('Please provide all required fields!');
  }

  const category = await prisma.category.create({
    data: { title, description, href },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Category has been created', category });
};

export const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany({});
  res.status(StatusCodes.OK).json({ categories });
};

export const getSingleCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId, 10) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with this id ${categoryId}`);
  }
  res.status(StatusCodes.OK).json({ category });
};

export const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { title, description, href } = req.body;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId, 10) },
  });
  if (!category) {
    throw new BadRequestError(`No category found with this id ${categoryId}`);
  }
  await prisma.category.update({
    where: { id: parseInt(categoryId, 10) },
    data: { title, description, href },
  });
  res.status(StatusCodes.OK).json({ message: 'Category has been updated' });
};

export const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId, 10) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with this id ${categoryId}`);
  }
  await prisma.category.delete({
    where: { id: parseInt(categoryId, 10) },
  });
  res.status(StatusCodes.OK).json({
    message: `Category has been deleted`,
  });
};
