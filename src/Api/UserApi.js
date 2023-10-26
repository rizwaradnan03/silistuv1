import { ApiManager } from "./ApiManager";

export const registerUser = async data => {
    try {
        const result = await ApiManager(`/auth/register`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        })

        return result
    } catch (error) {
        console.log('Error While Register ', error)
    }
}

export const loginUser = async data => {
    try {
        const result = await ApiManager(`/auth/login`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        })

        return result
    } catch (error) {
        console.log('Error While Login Api ', error)
    }
}