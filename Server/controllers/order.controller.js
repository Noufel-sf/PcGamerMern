import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad.request.error.js';
import NotFoundError from '../errors/not.found.error.js';
import stripe from '../configs/stripe.js';

export const createOrder = async (req, res) => {
  const clientId = req.user.userId;

  const cartItems = await prisma.cart.findMany({
    where: { userId: clientId },
    include: { product: true },
  });

  if (!cartItems || cartItems.length === 0) {
    throw new BadRequestError('Cart is empty!');
  }

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        images: [item.product.image],
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    payment_method_options: {
      card: {
        request_three_d_secure: 'any',
      },
    },
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.SERVER_URL}/api/v1/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
    metadata: {
      clientId,
    },
  });

  res.status(StatusCodes.OK).json({ url: session.url });
};

export const handleSuccess = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    throw new BadRequestError('Session ID is missing');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const userId = session.metadata.clientId;

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true },
  });

  if (!cartItems || cartItems.length === 0) {
    throw new BadRequestError('Cart is empty');
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      paymentId: session.payment_intent,
      totalPrice,
      status: 'COMPLETED',
      orderItems: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.product.price,
        })),
      },
    },
  });

  await prisma.cart.deleteMany({
    where: { userId },
  });

  res.redirect(`${process.env.CLIENT_URL}/orders`);
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.userId;
  const orders = await prisma.order.findMany({
    where: { userId, status: 'COMPLETED' },
    include: {
      orderItems: {
        select: {
          product: {
            select: { name: true, price: true, image: true },
          },
        },
      },
    },
  });
  res.status(StatusCodes.OK).json({ orders });
};

export const adminGetAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: { select: { product: true } },
      user: { select: { name: true } },
    },
  });
  res.status(StatusCodes.OK).json({ orders });
};
