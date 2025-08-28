// import React, {
//   createContext,
//   useContext,
//   useReducer,
//   useEffect,
//   ReactNode,
// } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface CartItem {
//   id: number;
//   name: string;
//   price: string;
//   type: 'test' | 'package';
//   quantity?: number;
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface AppState {
//   user: User | null;
//   cart: CartItem[];
//   isAuthenticated: boolean;
// }

// type AppAction =
//   | { type: 'SET_USER'; payload: User }
//   | { type: 'LOGOUT' }
//   | { type: 'ADD_TO_CART'; payload: CartItem }
//   | { type: 'REMOVE_FROM_CART'; payload: number }
//   | { type: 'CLEAR_CART' }
//   | { type: 'RESTORE_STATE'; payload: AppState }; // new action for persistence

// const initialState: AppState = {
//   user: null,
//   cart: [],
//   isAuthenticated: false,
// };

// const AppContext = createContext<{
//   state: AppState;
//   dispatch: React.Dispatch<AppAction>;
// } | null>(null);

// function appReducer(state: AppState, action: AppAction): AppState {
//   switch (action.type) {
//     case 'SET_USER':
//       saveStateToStorage({
//         ...state,
//         user: action.payload,
//         isAuthenticated: true,
//       });
//       return { ...state, user: action.payload, isAuthenticated: true };

//     case 'LOGOUT':
//       saveStateToStorage({
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         cart: [],
//       });
//       return { ...state, user: null, isAuthenticated: false, cart: [] };

//     case 'ADD_TO_CART':
//       if (state.cart.find((item) => item.id === action.payload.id))
//         return state;
//       const updatedCartAdd = {
//         ...state,
//         cart: [...state.cart, action.payload],
//       };
//       saveStateToStorage(updatedCartAdd);
//       return updatedCartAdd;

//     case 'REMOVE_FROM_CART':
//       const updatedCartRemove = {
//         ...state,
//         cart: state.cart.filter((item) => item.id !== action.payload),
//       };
//       saveStateToStorage(updatedCartRemove);
//       return updatedCartRemove;

//     case 'CLEAR_CART':
//       const clearedCart = { ...state, cart: [] };
//       saveStateToStorage(clearedCart);
//       return clearedCart;

//     case 'RESTORE_STATE':
//       return action.payload;

//     default:
//       return state;
//   }
// }

// // 🔹 Save state to AsyncStorage
// const saveStateToStorage = async (state: AppState) => {
//   try {
//     await AsyncStorage.setItem('appState', JSON.stringify(state));
//   } catch (error) {
//     console.error('Error saving state:', error);
//   }
// };

// // 🔹 Load state from AsyncStorage
// const loadStateFromStorage = async (): Promise<AppState | null> => {
//   try {
//     const storedState = await AsyncStorage.getItem('appState');
//     return storedState ? JSON.parse(storedState) : null;
//   } catch (error) {
//     console.error('Error loading state:', error);
//     return null;
//   }
// };

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(appReducer, initialState);

//   // Restore persisted state on app load
//   useEffect(() => {
//     (async () => {
//       const restored = await loadStateFromStorage();
//       if (restored) {
//         dispatch({ type: 'RESTORE_STATE', payload: restored });
//       }
//     })();
//   }, []);

//   return (
//     <AppContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within AppProvider');
//   }
//   return context;
// }
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

// ========================
// Types
// ========================
interface CartItem {
  id: number;
  name: string;
  price: string;
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
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_STATE'; payload: AppState };

// ========================
// Initial State
// ========================
const initialState: AppState = {
  user: null,
  cart: [],
  isAuthenticated: false,
};

// ========================
// Reducer
// ========================
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      saveStateToStorage({
        ...state,
        user: action.payload,
        isAuthenticated: true,
      });
      return { ...state, user: action.payload, isAuthenticated: true };

    case 'LOGOUT':
      saveStateToStorage({
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
      });
      return { ...state, user: null, isAuthenticated: false, cart: [] };

    case 'ADD_TO_CART':
      if (state.cart.find((item) => item.id === action.payload.id))
        return state;
      const updatedCartAdd = {
        ...state,
        cart: [...state.cart, action.payload],
      };
      saveStateToStorage(updatedCartAdd);
      return updatedCartAdd;

    case 'REMOVE_FROM_CART':
      const updatedCartRemove = {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
      saveStateToStorage(updatedCartRemove);
      return updatedCartRemove;

    case 'CLEAR_CART':
      const clearedCart = { ...state, cart: [] };
      saveStateToStorage(clearedCart);
      return clearedCart;

    case 'RESTORE_STATE':
      return action.payload;

    default:
      return state;
  }
}

// ========================
// AsyncStorage Helpers
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

  // Restore persisted state on app load
  useEffect(() => {
    (async () => {
      const restored = await loadStateFromStorage();
      if (restored) {
        dispatch({ type: 'RESTORE_STATE', payload: restored });
      }
    })();
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

// ========================
// Example React Query Usage
// ========================
// Now you can use these hooks in any component:
// const { state, dispatch } = useApp();
// const queryClient = useQueryClient();

export function useFetchData() {
  return useQuery({
    queryKey: ['exampleData'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      return res.json();
    },
  });
}

export function useSaveData() {
  return useMutation({
    mutationFn: async (newData: any) => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newData),
        headers: { 'Content-Type': 'application/json' },
      });
      return res.json();
    },
  });
}
