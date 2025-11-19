import { apiFetch } from "./api"

export const authService = {
    login: async (data) => {
        const res = await apiFetch('auth/login', {
            method: 'POST',
            body: data
        })

        if(res?.token){
            localStorage.setItem('token', res.token)
        }

        return res
    },
    register: async (data) =>  {
        const res = await apiFetch('auth/register', {
            method: 'POST',
            body: data
        })

        return res
    }
}