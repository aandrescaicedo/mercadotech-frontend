import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    // Load from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Sync with backend on login / Clear on logout
    useEffect(() => {
        const syncCart = async () => {
            if (user) {
                try {
                    // Transform local items for backend: { product: id, quantity, store: id }
                    const localItemsForBackend = cartItems.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                        store: item.store?._id || item.store // Handle populated or ID
                    }));

                    const serverCart = await cartService.syncCart(localItemsForBackend);

                    // Transform backend items for frontend: { ...product, quantity, store }
                    const mergedItems = serverCart.items.map(item => ({
                        ...item.product,
                        quantity: item.quantity,
                        store: item.store
                    }));

                    setCartItems(mergedItems);
                } catch (error) {
                    console.error('Error syncing cart:', error);
                }
            }
        };

        if (user) {
            syncCart();
        } else {
            // User logged out: Clear cart
            setCartItems([]);
            localStorage.removeItem('cart');
        }
    }, [user]);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        // Only save to local storage if there are items or if we want to persist empty state
        // But we just cleared it on logout, so this might re-save empty array. That's fine.
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const updateBackendCart = async (newItems) => {
        if (user) {
            try {
                const itemsForBackend = newItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    store: item.store?._id || item.store
                }));
                await cartService.updateCart(itemsForBackend);
            } catch (error) {
                console.error('Error updating backend cart:', error);
            }
        }
    };

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);
            let newItems;
            if (existingItem) {
                newItems = prevItems.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [...prevItems, { ...product, quantity }];
            }
            updateBackendCart(newItems);
            return newItems;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const newItems = prevItems.filter((item) => item._id !== productId);
            updateBackendCart(newItems);
            return newItems;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevItems) => {
            const newItems = prevItems.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            );
            updateBackendCart(newItems);
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        updateBackendCart([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
