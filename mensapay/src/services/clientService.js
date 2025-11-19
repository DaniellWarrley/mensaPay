import { apiFetch } from "./api"

export const clientService = {
    newClient: async (data, plan) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('client/newClient',{
            method: 'POST',
            body: {data, plan},
            token: token
        })
        return res
    },
    getClients: async () => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('client/getClients', {
            method: 'GET',
            token: token
        })

        return res
    },
    editClient: async(data, clientId) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('client/editClient', {
            method: 'POST',
            body: {data, clientId},
            token: token
        })

        return res
    },
    deleteClient: async(clientId) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch(`client/deleteClient/${clientId}`, {
            method: 'DELETE',
            token: token
        })

        return res
    },
    efetuarPagamento: async(clientId) => {
        const token = localStorage.getItem('token')

        const res = await apiFetch('client/efetuarPagamento',{
            method: 'POST',
            body: {clientId},
            token: token
        })

        return res
    }
}