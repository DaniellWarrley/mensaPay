import { apiFetch } from "./api"

export const planService = {
    newPlan: async (data) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('plan/newPlan', {
            method: 'POST',
            body: data,
            token: token
        })

        return res
    },
    getUserPlans: async () => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('plan/getUserPlans', {
            method: 'GET',
            token: token
        })

        return res
    },
    editPlan: async(data, planId) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('plan/editPlan', {
            method: 'POST',
            body: {data, planId},
            token: token
        })

        return res
    },
    deletePlan: async(planId) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch(`plan/deleteUserPlan/${planId}`, {
            method: 'DELETE',
            token: token
        })

        return res
    }
}