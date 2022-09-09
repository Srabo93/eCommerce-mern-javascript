import React from "react";
import ReactDOM from "react-dom/client";
/*Redux Provider */
import store from "./store";
import { Provider } from "react-redux";
import { api } from "./features/services/api";
import { isLoggedIn } from "./features/auth/authSlice";
import { loadCart } from "./features/cartSlice";
/*React Router */
import { BrowserRouter } from "react-router-dom";
/*ChakraProvider */
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
/*App Components*/
import "../src/theme/styles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

store.dispatch(api.endpoints.getProducts.initiate());
store.dispatch(isLoggedIn());
store.dispatch(loadCart());

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
