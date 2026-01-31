import type { Dispatch, ReactNode, SetStateAction } from 'react';

export interface User {
	userId: string;
	name: string;
	email: string;
	role: string;
}

export interface AuthContextType {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	logout: () => Promise<void>;
	loading: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface AuthProviderProps {
	children: ReactNode;
}

export interface CartItem {
	productId: string;
	quantity: number;
	price: number;
	name: string;
	image?: string;
}

export interface CartState {
	cart: CartItem[];
	total: number;
	loading: boolean;
}

export type CartAction =
	| { type: 'FETCH_START' }
	| { type: 'FETCH_SUCCESS'; payload: { cartItems: CartItem[]; total: number } }
	| { type: 'CLEAR_CART' };

export interface CartContextType {
	cart: CartItem[];
	total: number;
	loading: boolean;
	fetchCart: (withLoading?: boolean) => Promise<void>;
	addToCart: (productId: string) => Promise<void>;
	updateCartItems: (productId: string, action: 'increase' | 'decrease') => Promise<void>;
	deleteCartItem: (productId: string) => Promise<void>;
	clearCart: () => Promise<void>;
}

export interface CartProviderProps {
	children: ReactNode;
}

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeProviderContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
}


