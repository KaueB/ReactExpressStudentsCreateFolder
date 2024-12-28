import { AxiosResponse } from "axios";
import { api } from "../api";

type IListStudents = {
    id: string,
    name: string
}[]

type IResStudent = {
    students: IListStudents | null
    error?: string,
}

export const getListStudents = async () => {
    try {
        const response: AxiosResponse<IResStudent> = await api.get('/teachers/students');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}