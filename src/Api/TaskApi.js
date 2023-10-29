import { ApiManager } from "./ApiManager";

export const createTask = async (token, data) => {
    try {
        const result = await ApiManager('/task', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data
        })
        return result
    } catch (error) {
        console.log(error)
    }
}

export const findAllTask = async (token) => {
    try {
        const result = await ApiManager('/task',{
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log(error)
    }
}