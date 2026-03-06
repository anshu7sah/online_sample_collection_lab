# Lab Test Collection Application - Architecture Summary

## Overview
This is a **React Native (Expo)** rider application with OTP-based authentication (mobile + email/password ready), token-based authorization, and persistent state management using AsyncStorage and Context API.

---

## 🔐 Authentication Flow

### 1. **Login/OTP-Based Authentication**
- User enters mobile number → SMS OTP is sent to backend
- User enters 6-digit OTP → Verified with backend
- Backend returns:
  - `token`: JWT token stored in AsyncStorage
  - `isNewUser`: Boolean flag to determine if user needs to complete profile

### 2. **User Registration Flow**
- If `isNewUser === true` → User redirected to signup page
- User completes profile (Name, DOB)
- Profile data sent to backend (`/auth/signup`)
- User redirected to home tabs

### 3. **Authorization & Token Attachment**
- Token is **automatically attached** to every API request via Axios interceptor
- Token is retrieved from AsyncStorage before each request
- Authorization header format: `Bearer {token}`

---

## 💾 Token & State Management

### **AsyncStorage (Persistent Storage)**
Located in: [contexts/AppContext.tsx](contexts/AppContext.tsx)

**Stored Items:**
- `token`: JWT token (set after login, cleared on logout)
- `appState`: Complete app state (user, cart, isAuthenticated, etc.)

```javascript
// On successful login
await AsyncStorage.setItem('token', data.token);

// On logout
AsyncStorage.removeItem('token');
AsyncStorage.removeItem('appState');
```

### **App State Structure**
```typescript
interface AppState {
  user: User | null;              // Logged-in user info
  cart: CartItem[];               // Shopping cart items
  isAuthenticated: boolean;       // Auth status
  token: string | null;           // JWT token
  authReady: boolean;             // Bootstrap flag
}
```

---

## 🌍 Context Setup

### **AppContext** ([contexts/AppContext.tsx](contexts/AppContext.tsx))
Manages global state and provides:
- `state`: Current app state
- `dispatch`: Reducer function to update state
- `queryClient`: React Query client for API calls

**Key Actions:**
- `RESTORE_AUTH`: Restore token on app startup
- `SET_USER`: Update user info
- `LOGOUT`: Clear all auth data
- `ADD_TO_CART` / `REMOVE_FROM_CART` / `CLEAR_CART`: Cart management

**Bootstrap Flow:**
```typescript
useEffect(() => {
  const bootstrapAuth = async () => {
    // 1. Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    // 2. Attach token to axios headers
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    
    // 3. Dispatch RESTORE_AUTH action
    dispatch({ type: 'RESTORE_AUTH', payload: { token } });
  };
  
  bootstrapAuth();
}, []);
```

---

## 🔌 API Configuration with Axios

### **lib/axios.ts**
```typescript
const api = axios.create({
  baseURL: 'http://192.168.1.113:5000/api', // Backend URL
  withCredentials: true,
});

// ✅ AUTOMATIC TOKEN INJECTION
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Key Features:**
- **Interceptor**: Automatically attaches token to every request
- **AsyncStorage Integration**: Retrieves fresh token on each request
- **Credentials**: Includes cookies if needed (`withCredentials: true`)
- **Centralized**: All API calls use this configured instance

### **API Endpoints Used:**
1. `POST /auth/send-otp` - Send OTP to mobile
2. `POST /auth/verify-otp` - Verify OTP and get token
3. `POST /auth/signup` - Complete user profile
4. `GET /auth/current` - Fetch current logged-in user

---

## 🔄 Application Flow Diagram

```
App Startup
    ↓
RootLayout (_layout.tsx)
    ├─ AppProvider wraps entire app
    │    └─ bootstrapAuth() executes
    │         ├─ Retrieve token from AsyncStorage
    │         ├─ Attach token to axios headers
    │         └─ Dispatch RESTORE_AUTH
    ├─ Stack Navigation initialized
    └─ Splash screen shown
    
    ↓
    
Decide Route Based on Auth
    ├─ If NO token → Show /auth/login (OTP login)
    ├─ If token + new user → Show /auth/signup (profile completion)
    └─ If token + existing user → Show /(tabs) (main app)

User Login Flow
    ├─ User enters mobile number
    ├─ POST /auth/send-otp
    ├─ User enters OTP
    ├─ POST /auth/verify-otp → Backend returns token
    ├─ Token saved to AsyncStorage
    ├─ If isNewUser: redirect to signup
    └─ Else: redirect to home
    
    ↓
    
Auth Check on Tabs
    ├─ TabLayout calls useCurrent hook
    │    └─ GET /auth/current (axios auto-attaches token)
    ├─ If response = null → redirect to login
    ├─ If isNew = true → redirect to signup
    └─ Else: render tabs normally
```

---

## 📦 Packages & Their Roles

### **Authentication & State Management**
| Package | Version | Purpose |
|---------|---------|---------|
| `@react-native-async-storage/async-storage` | ^2.2.0 | Persistent storage for token & state |
| `@tanstack/react-query` | ^5.85.5 | Server state management, caching, API requests |
| `axios` | ^1.11.0 | HTTP client with interceptors for auto token injection |

### **Navigation & Routing**
| Package | Version | Purpose |
|---------|---------|---------|
| `expo-router` | ~5.0.2 | File-based routing (like Next.js for React Native) |
| `@react-navigation/native` | ^7.0.14 | Core navigation library |
| `@react-navigation/bottom-tabs` | ^7.2.0 | Bottom tab navigation |
| `@react-navigation/material-top-tabs` | ^7.3.3 | Top tab navigation |

### **Form Validation**
| Package | Version | Purpose |
|---------|---------|---------|
| `formik` | ^2.4.9 | Form state & validation |
| `yup` | ^1.7.1 | Schema validation library |

### **UI & Components**
| Package | Version | Purpose |
|---------|---------|---------|
| `react-native-paper` | ^5.14.5 | Material Design components |
| `lucide-react-native` | ^0.475.0 | Icon library |
| `expo-linear-gradient` | ~14.1.3 | Gradient backgrounds |
| `expo-blur` | ~14.1.3 | Blur effects |
| `react-native-toast-message` | ^2.3.3 | Toast notifications |

### **Device Features**
| Package | Version | Purpose |
|---------|---------|---------|
| `expo-camera` | ~16.1.5 | Camera access |
| `expo-location` | ~18.1.6 | GPS location access |
| `expo-notifications` | ^0.31.4 | Push notifications |
| `react-native-geolocation-service` | ^5.3.1 | Geolocation service |
| `react-native-maps` | 1.20.1 | Map display |

### **Other Utilities**
| Package | Version | Purpose |
|---------|---------|---------|
| `lodash` | ^4.17.21 | Utility functions |
| `expo` | ^53.0.0 | Expo framework (React Native runtime) |

---

## 🔑 Key Features Implemented

### ✅ **Automatic Token Attachment**
- Every API request automatically includes the Bearer token
- Token is injected via Axios interceptor
- No manual header setup needed in individual components

### ✅ **Persistent Authentication**
- Token saved in AsyncStorage
- On app restart, token is retrieved and attached
- User stays logged in until logout

### ✅ **Global State Management**
- AppContext provides user, cart, and auth state
- UseReducer for predictable state updates
- AsyncStorage for persistence

### ✅ **Protected Routes**
- TabLayout checks `useCurrent` hook
- Unauthorized users redirected to login
- Profile incomplete users redirected to signup

### ✅ **OTP-Based Auth**
- Mobile-first authentication flow
- Automatic OTP verification
- Profile completion after first login

---

## 🚀 How It All Works Together

### **On App Launch:**
1. RootLayout mounts → AppProvider initializes
2. `bootstrapAuth()` runs:
   - Gets token from AsyncStorage
   - Sets axios default Authorization header
   - Dispatches RESTORE_AUTH action
3. Route decision happens based on `token` presence
4. Splash screen shown while loading

### **On User Login:**
1. User enters mobile → `sendOtpMutation` calls `POST /auth/send-otp`
2. User enters OTP → `verifyOtpMutation` calls `POST /auth/verify-otp`
3. Backend returns token → saved to AsyncStorage
4. `api.defaults.headers` updated
5. Route changes to `/auth/signup` or `/(tabs)`

### **On Protected API Calls:**
1. Component calls API (e.g., `GET /auth/current`)
2. Axios interceptor runs before request
3. Token automatically added from AsyncStorage
4. Request sent with Authorization header: `Bearer {token}`
5. Backend validates token and returns data

### **On Logout:**
1. Logout action dispatched
2. Token removed from AsyncStorage
3. User state cleared
4. User redirected to `/auth/login`

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| [lib/axios.ts](lib/axios.ts) | Axios config with token interceptor |
| [contexts/AppContext.tsx](contexts/AppContext.tsx) | Global state + bootstrap auth |
| [app/_layout.tsx](app/_layout.tsx) | App root + provider setup |
| [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) | Auth protection + route guards |
| [app/auth/login.tsx](app/auth/login.tsx) | OTP login flow |
| [app/auth/signup.tsx](app/auth/signup.tsx) | Profile completion |
| [hooks/useCurrent.ts](hooks/useCurrent.ts) | Fetch current user + auth check |

---

## 🎯 Summary

Your application uses a **modern authentication architecture** with:
- ✅ **Token-based JWT auth** (OTP login)
- ✅ **Automatic token injection** via Axios interceptor
- ✅ **Persistent storage** using AsyncStorage
- ✅ **Global state** via Context API + useReducer
- ✅ **Protected routes** with auth guards
- ✅ **React Query** for efficient API data management

The flow is seamless: user logs in → token saved → token auto-attached to all requests → protected routes verified via current user endpoint.
