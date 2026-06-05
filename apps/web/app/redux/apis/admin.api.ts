import { APP_URL } from "@/app/constant/confi"
import { STATE_INFO_REQUEST, STATE_INFO_RESPONSE } from "@portfolio/types"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const portfolioApi = createApi({
    reducerPath: "Portfolio",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/admin`,
        credentials: "include"
    }),
    tagTypes: ["tagName"],
    endpoints: (builder) => {
        return {
            // Portfolio Get query
            getPortfolio: builder.query({
                query: () => {
                    return {
                        url: "/info-get",
                        method: "GET"
                    }
                },
                providesTags: ["tagName"]
            }),



            // Skill get query
            getSkill: builder.query({
                query: () => {
                    return {
                        url: "/info-skill",
                        method: "GET"
                    }
                },
                providesTags: ["tagName"]
            }),


            // Experinence get query
            getExp: builder.query({
                query: () => {
                    return {
                        url: "/info-exp",
                        method: "GET"
                    }
                },
                providesTags: ["tagName"]
            }),


            // Project get query
            getProject: builder.query({
                query: () => {
                    return {
                        url: "/info-project",
                        method: "GET"
                    }
                },
                providesTags: ["tagName"]
            }),


            // Portfolio Create mutation
            createPortfolio: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-create",
                        method: "POST",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),

            // Skill Create mutation
            createSkill: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-create-skill",
                        method: "POST",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),


            // Exp Create mutation
            createExp: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-create-exp",
                        method: "POST",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),


            // Project Create mutation
            createProject: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-create-project",
                        method: "POST",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),



            // Portfolio Update mutation
            updatePortfolio: builder.mutation({
                query: userData => {
                    const id = userData instanceof FormData ? userData.get("_id") : userData._id
                    return {
                        url: "/info-modify/" + id,
                        method: "PUT",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),




            //  Skill  Update mutation
            updateSkill: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-up-skill/" + userData._id,
                        method: "PUT",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),



            //  Exp  Update mutation
            updateExp: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-up-exp/" + userData._id,
                        method: "PUT",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),



            //  Project  Update mutation
            updateProject: builder.mutation({
                query: userData => {
                    const id = userData instanceof FormData ? userData.get("_id") : userData._id
                    return {
                        url: "/info-up-project/" + id,
                        method: "PUT",
                        body: userData
                    }
                },
                invalidatesTags: ["tagName"]
            }),


            //  Portfolio  delete mutation
            deletePortfolio: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-remove/" + userData._id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["tagName"]
            }),


            //  Skill  delete mutation
            deleteSkill: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-remove-skill/" + userData._id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["tagName"]
            }),


            //  Exp  delete mutation
            deleteExp: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-remove-exp/" + userData._id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["tagName"]
            }),


            //  project  delete mutation
            deleteProject: builder.mutation({
                query: userData => {
                    return {
                        url: "/info-remove-project/" + userData._id,
                        method: "DELETE",
                    }
                },
                invalidatesTags: ["tagName"]
            }),

        }
    }
})

export const { useGetPortfolioQuery, useGetSkillQuery, useGetExpQuery, useGetProjectQuery, useUpdatePortfolioMutation, useUpdateSkillMutation, useUpdateExpMutation, useUpdateProjectMutation, useDeletePortfolioMutation, useDeleteSkillMutation, useDeleteExpMutation, useDeleteProjectMutation, useCreatePortfolioMutation, useCreateSkillMutation, useCreateExpMutation, useCreateProjectMutation } = portfolioApi
