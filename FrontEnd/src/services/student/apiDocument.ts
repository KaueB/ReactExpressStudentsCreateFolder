import { AxiosResponse } from "axios";
import { api } from "../api";

type ICreate = {
    name: string,
    id: number | null | ""
}

export const CreateDocument = async ({ name, id }: ICreate) => {
    try {
        const response: AxiosResponse<ICreateDocument> = await api.post('/students/documents', {
            id, name
        })
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const GetDocument = async ({ id }: { id: number | null }) => {
    try {
        const response: AxiosResponse<IReponseDocument> = await api.get('/students/documents', {
            params: { id }
        })
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}