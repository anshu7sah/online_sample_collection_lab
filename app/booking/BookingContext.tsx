import React, { createContext, useContext, useReducer } from "react";

export type BookingState = {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Others" | "";
  address: string;
  mobile: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;

  date: string;
  timeSlot: string;

  hasPrescription: boolean;
  prescriptionFile: any;

  prcDoctor: string;
};

const initialState: BookingState = {
  name: "",
  age: "",
  gender: "",
  address: "",
  mobile: "",
  location: null,
  date: "",
  timeSlot: "",
  hasPrescription: false,
  prescriptionFile: null,
  prcDoctor: "",
};

type Action = Partial<BookingState>;

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function bookingReducer(state: BookingState, action: Action): BookingState {
  return { ...state, ...action };
}

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
};
