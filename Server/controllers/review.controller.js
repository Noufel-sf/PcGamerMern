import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import NotFoundError from '../errors/not.found.error.js';

export const createReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user.userId;

  if (!rating || !comment || !productId) {
    throw new BadRequestError('Please provide all required fields!');
  }
  if (rating < 1 || rating > 5) {
    throw new BadRequestError('Rating must be between 1 and 5');
  }

  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
  });
  if (!product) {
    throw new NotFoundError(`No products found with this id ${productId}`);
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId: parseInt(productId, 10),
    },
  });
  if (existingReview) {
    throw new BadRequestError(
      'You have already reviewed this product. You can only review a product once.'
    );
  }

  const purchased = await prisma.orderItems.findFirst({
    where: {
      productId: parseInt(productId, 10),
      order: {
        userId,
        status: 'COMPLETED',
      },
    },
  });
  if (!purchased) {
    throw new BadRequestError('You can only review products you’ve purchased.');
  }

  const review = await prisma.review.create({
    data: {
      rating: parseInt(rating, 10),
      comment,
      productId: parseInt(productId, 10),
      userId,
    },
  });

  const reviews = await prisma.review.findMany({
    where: {
      productId: parseInt(productId, 10),
    },
    select: {
      rating: true,
    },
  });

  const numOfReviews = reviews.length;
  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) / numOfReviews;

  await prisma.product.update({
    where: { id: parseInt(productId, 10) },
    data: { numOfReviews, averageRating: Math.round(averageRating * 10) / 10 },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Review has been submitted', review });
};

export const getProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
    select: {
      id: true,
      numOfReviews: true,
      averageRating: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });

  res.status(StatusCodes.OK).json({ productReviews: product });
};
