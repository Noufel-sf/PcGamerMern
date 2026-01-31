import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LayoutWrapper from './lib/Layout.js';

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <CartProvider>
          <App />
      </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);
