import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import NotFoundError from '../errors/not.found.error.js';

export const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    throw new BadRequestError('Please provide a valid productId!');
  }
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId, 10) },
  });
  if (!product) {
    throw new NotFoundError(`No products found with this id ${productId}`);
  }

  const existingProduct = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: parseInt(productId, 10),
      },
    },
  });

  let cartItem;

  if (existingProduct) {
    cartItem = await prisma.cart.update({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId, 10),
        },
      },
      data: {
        quantity: existingProduct.quantity + parseInt(quantity, 10),
      },
    });
  } else {
    cartItem = await prisma.cart.create({
      data: {
        userId,
        productId: parseInt(productId, 10),
        quantity: parseInt(quantity, 10),
      },
    });
  }

  res.status(StatusCodes.OK).json({ message: 'Added to cart', cartItem });
};

export const getCart = async (req, res) => {
  const userId = req.user.userId;
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  res.status(StatusCodes.OK).json({ cartItems, total });
};

export const updateCartItems = async (req, res) => {
  const userId = req.user.userId;
  const { productId, action } = req.body;
  if (!productId || !['increase', 'decrease'].includes(action)) {
    throw new BadRequestError('Invalid productId or action');
  }

  const cartItems = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: parseInt(productId, 10),
      },
    },
  });

  if (!cartItems) {
    throw new NotFoundError('Cart item not found');
  }

  if (action === 'increase') {
    const updated = await prisma.cart.update({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId, 10),
        },
      },
      data: {
        quantity: cartItems.quantity + 1,
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Increased quantity', cartItems: updated });
  }
  if (action === 'decrease') {
    if (cartItems.quantity <= 1) {
      await prisma.cart.delete({
        where: {
          userId_productId: {
            userId,
            productId: parseInt(productId, 10),
          },
        },
      });
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Item removed from cart' });
    } else {
      const updated = await prisma.cart.update({
        where: {
          userId_productId: {
            userId,
            productId: parseInt(productId, 10),
          },
        },
        data: {
          quantity: cartItems.quantity - 1,
        },
      });
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Decreased quantity', cartItems: updated });
    }
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.userId;
  const cart = await prisma.cart.deleteMany({
    where: { userId },
  });
  res.status(StatusCodes.OK).json({ msg: 'Cart cleared' });
};

export const deleteProductFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  if (!productId) {
    throw new BadRequestError('Please provide a valid productId');
  }

  const existingItem = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: parseInt(productId, 10),
      },
    },
  });

  if (!existingItem) {
    throw new NotFoundError(
      `No product found in your cart with ID ${productId}`
    );
  }

  await prisma.cart.delete({
    where: {
      userId_productId: {
        userId,
        productId: parseInt(productId, 10),
      },
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Product removed from cart successfully' });
};
