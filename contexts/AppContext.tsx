import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '@/lib/axios';

// ========================
// Types (UNCHANGED + SAFE ADDITIONS)
// ========================
interface CartItem {
  id: number;
  name: string;
  price: number | string;
  type: 'test' | 'package';
  quantity?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AppState {
  user: User | null;
  cart: CartItem[];
  isAuthenticated: boolean;

  // ✅ SAFE ADDITIONS
  token: string | null;
  authReady: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_STATE'; payload: AppState }
  | { type: 'RESTORE_AUTH'; payload: { token: string | null } };

// ========================
// Initial State
// ========================
const initialState: AppState = {
  user: null,
  cart: [],
  isAuthenticated: false,

  token: null,
  authReady: false,
};

// ========================
// Reducer (MINIMAL CHANGES)
// ========================
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'RESTORE_AUTH':
      console.log('Restoring auth with token:', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        authReady: true,
      };

    case 'SET_USER': {
      const updated = {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
      saveStateToStorage(updated);
      return updated;
    }

    case 'LOGOUT':
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('appState');
      return {
        ...initialState,
        authReady: true,
      };

    case 'ADD_TO_CART': {
      if (state.cart.find((item) => item.id === action.payload.id))
        return state;

      const updated = {
        ...state,
        cart: [...state.cart, action.payload],
      };
      saveStateToStorage(updated);
      return updated;
    }

    case 'REMOVE_FROM_CART': {
      const updated = {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
      saveStateToStorage(updated);
      return updated;
    }

    case 'CLEAR_CART': {
      const updated = { ...state, cart: [] };
      saveStateToStorage(updated);
      return updated;
    }

    case 'RESTORE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ========================
// AsyncStorage Helpers (UNCHANGED)
// ========================
const saveStateToStorage = async (state: AppState) => {
  try {
    await AsyncStorage.setItem('appState', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

const loadStateFromStorage = async (): Promise<AppState | null> => {
  try {
    const storedState = await AsyncStorage.getItem('appState');
    return storedState ? JSON.parse(storedState) : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

// ========================
// Context
// ========================
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  queryClient: QueryClient;
} | null>(null);

// ========================
// Provider
// ========================
const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ✅ BOOTSTRAP AUTH (CRITICAL FIX)
  useEffect(() => {
  const bootstrapAuth = async () => {
    const token = await AsyncStorage.getItem('token');

    // Restore saved state first
    const restored = await loadStateFromStorage();
    if (restored) {
      dispatch({ type: 'RESTORE_STATE', payload: restored });
    }

    // Then restore auth token separately
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    dispatch({
      type: 'RESTORE_AUTH',
      payload: { token },
    });
  };

  bootstrapAuth();
}, []);


  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ state, dispatch, queryClient }}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

// ========================
// Hook
// ========================
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
