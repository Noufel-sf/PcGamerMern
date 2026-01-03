import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import NotFoundError from '../errors/not.found.error.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'fs';

export const createProduct = async (req, res) => {
  const { name, price, categoryId, bestSelling } = req.body;
  if (!name || !price || !categoryId) {
    throw new BadRequestError('Please provide all required fields!');
  }

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId, 10) },
  });
  if (!category) {
    throw new NotFoundError(`No category found with this id ${categoryId}`);
  }

  let image = '';
  if (req.files && req.files.image) {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    image = result.secure_url;
  }

  const isBestSelling =
    req.body.bestSelling === 'true' || req.body.bestSelling === true;

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price, 10),
      categoryId: parseInt(categoryId, 10),
      image,
      bestSelling: isBestSelling,
    },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Product has been created', product });
};

export const getBestSellingProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { bestSelling: true },
  });
  res.status(StatusCodes.OK).json({ products });
};

export const getProductById = async (req, res) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
    include: {
      category: { select: { title: true } },
      reviews: {
        include: { user: true },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ product });
};



export const getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { title: true, href: true },
      },
    },
  });
  res.status(StatusCodes.OK).json({ products });
};



export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { name, price, categoryId, bestSelling } = req.body;

  if (!name || !price || !categoryId) {
    throw new BadRequestError('Please provide all required fields!');
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
  });

  if (!existingProduct) {
    throw new NotFoundError(`No product found with this id ${productId}`);
  }

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId, 10) },
  });

  if (!category) {
    throw new NotFoundError(`No category found with this id ${categoryId}`);
  }

  let image = existingProduct.image;

  if (req.files && req.files.image) {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: 'lms-images',
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);
    image = result.secure_url;
  }

  const isBestSelling =
    req.body.bestSelling === 'true' || req.body.bestSelling === true;

  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(productId, 10) },
    data: {
      name,
      price: parseFloat(price, 10),
      categoryId: parseInt(categoryId, 10),
      image,
      bestSelling: isBestSelling,
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Product has been updated', product: updatedProduct });
};

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
  });
  if (!product) {
    throw new NotFoundError(`No products found with this id ${productId}`);
  }
  await prisma.product.delete({
    where: { id: parseInt(productId, 10) },
  });
  res.status(StatusCodes.OK).json({ message: 'Product has been deleted' });
};

export const filterProducts = async (req, res) => {
  const { categories, min = 0, max = 1000000, name = '' } = req.query;

  // Split comma-separated categories if present
  const categoryList = categories
    ?.split(',')
    .map((c) => c.trim().toLowerCase());

  const products = await prisma.product.findMany({
    where: {
      AND: [
        ...(categoryList && categoryList.length > 0
          ? [
              {
                category: {
                  title: {
                    in: categoryList,
                    mode: 'insensitive',
                  },
                },
              },
            ]
          : []),

        {
          price: {
            gte: parseFloat(min),
            lte: parseFloat(max),
          },
        },

        {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      category: true,
    },
  });

  res.status(StatusCodes.OK).json({ products });
};

export const searchProducts = async (req, res) => {
  const { name = '' } = req.query;

  if (!name) {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Search term is required' });
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
    take: 5,
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
    },
  });

  res.status(StatusCodes.OK).json({ products });
};
