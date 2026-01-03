import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();

// Important Packages
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import corsConfig from './configs/cors.js';
import fileUpload from 'express-fileupload';

// Middleware
import notFoundMiddleware from './middleware/not.found.js';
import errorHandlerMiddleware from './middleware/error.handler.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.routes.js';

app.set('trust proxy', 1);
app.use(corsConfig());
app.use(express.json());
app.use(morgan('dev'));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/review', reviewRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
