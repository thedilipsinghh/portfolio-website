import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { portfolioApi } from "./apis/admin.api";
import { emailApi } from "./apis/email.api";


const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [portfolioApi.reducerPath]: portfolioApi.reducer,
        [emailApi.reducerPath]: emailApi.reducer,
    },
    middleware: def => def().concat(authApi.middleware, portfolioApi.middleware, emailApi.middleware)
})

export default reduxStore