import { AxiosResponse } from "axios";
import { api } from "../api";

type Idata = {
    name: string,
    email: string,
    password: string,
}

export const UpdateUserApi = async (data: Idata) => {
    try {
        const response: AxiosResponse<IProfile> = await api.put('/user', data)
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
}