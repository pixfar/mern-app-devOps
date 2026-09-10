"use client";

import { store } from "@/redux/store";
import { stripePromise } from "@/utils/stripe/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </Elements>
    </Provider>
  );
}
