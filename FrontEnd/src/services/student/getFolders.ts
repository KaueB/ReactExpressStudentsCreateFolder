import { AxiosResponse } from "axios"
import { api } from "../api"

type Idata = {
    id: number | null | ""
};

type ICreate = {
    name: string,
    id: number | null | ""
}

export const GetFolders = async ({ id }: Idata) => {
    try {
        const response: AxiosResponse<IResponse> = await api.get('/students/folder', {
            params: { id }
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const GetPaths = async ({ id }: Idata) => {
    try {
        const response: AxiosResponse<IPaths> = await api.get('/students/parentfolder', {
            params: { id }
        })
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const CreateFolder = async ({ name, id }: ICreate) => {
    try {
        const response: AxiosResponse<ICreateFolder> = await api.post('/students/folder', {
            id, name
        })
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}