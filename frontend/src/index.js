import React from "react";
import ReactDOM from "react-dom/client";
/*Redux Provider */
import store from "./store";
import { Provider } from "react-redux";
import { isLoggedIn } from "./features/auth/authSlice";
import { loadCart } from "./features/cart/cartSlice";
/*React Router */
import { BrowserRouter } from "react-router-dom";
/*ChakraProvider */
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
/*CredentialsProvider */
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
/*App Components*/
import "../src/theme/styles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

store.dispatch(isLoggedIn());
store.dispatch(loadCart());

const root = ReactDOM.createRoot(document.getElementById("root"));

const paypalScriptOptions = {
  currency: "USD",
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
};
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={paypalScriptOptions}>
        <BrowserRouter>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
