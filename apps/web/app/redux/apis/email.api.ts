import { APP_URL } from "@/app/constant/confi"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const emailApi = createApi({
    reducerPath: "emailApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/email/`,
        credentials: "include"
    }),
    tagTypes: ["tagName"],
    endpoints: (builder) => {
        return {
            sendMessage: builder.mutation({
                query: (data) => ({
                    url: "/contact-message",
                    method: "POST",
                    body: data
                })
            })

        }
    }
})

export const { useSendMessageMutation } = emailApi
