import { ApiManager } from "./ApiManager";

export const findAllIsCompletedTaskEntry = async (token) => {
    try {
        const result = await ApiManager(`/task-entries/completed/${token}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log('Error While findAllKelas ', error)
    }
}

export const findAllIsNotCompletedTaskEntry = async (token) => {
    try {
        const result = await ApiManager(`/task-entries/not-completed/${token}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log('Error While findAllKelas ', error)
    }
}

export const findByIdTaskEntry = async (token, id) => {
    try {
        const result = await ApiManager(`/task-entries/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log('Error While findAllKelas ', error)
    }
}

export const doneCompletingTask = async(token,id) => {
    try {
        const result = await ApiManager(`/task-entries/done/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log('Error While findAllKelas ', error)
    }
}