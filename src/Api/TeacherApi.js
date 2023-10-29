import { ApiManager } from "./ApiManager";

export const findAllTeacher = async (token) => {
    try {
        const result = await ApiManager('/teacher', {
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