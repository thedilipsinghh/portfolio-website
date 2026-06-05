import { APP_URL } from "@/app/constant/confi"
import { LOGIN_REQUEST, LOGIN_RESPONE } from "@portfolio/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/auth/`,
        credentials: "include"
    }),
    tagTypes: ["tagName"],
    endpoints: (builder) => {
        return {
            signin: builder.mutation({
                query: userData => {
                    return {
                        url: "/admin-signin",
                        method: "POST",
                        body: userData
                    }
                },
            }),
            signout: builder.mutation({
                query: userData => {
                    return {
                        url: "/admin-signout",
                        method: "POST",
                    }
                },
                transformResponse: data => {
                    localStorage.removeItem("PortfolioAdmin")
                }
            }),
        }
    }
})

export const { useSigninMutation, useSignoutMutation } = authApi
