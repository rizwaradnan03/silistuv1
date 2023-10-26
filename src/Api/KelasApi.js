import { ApiManager } from "./ApiManager";

export const findAllKelas = async (token) => {
    try {
        const result = await ApiManager(`/kelas`,{
            method: 'GET',
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log('Error While findAllKelas ', error)
    }
}

export const findKelasById = async (token,id) => {
    try {
        const result = await ApiManager(`/kelas/${id}`,{
            method: 'GET',
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return result
    } catch (error) {
        console.log('Error While findAllKelas ', error)
    }
}