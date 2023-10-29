import { ApiManager } from "./ApiManager";

export const findAllSubject = async (token) => {
    try {
        const result = await ApiManager('/subject', {
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