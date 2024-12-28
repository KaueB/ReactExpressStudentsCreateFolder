import { api } from "../api"

type Idata = {
    name: string,
    email: string,
    password: string,
    occupation: string,
    subject?: string
}

export const RegisterUser = async (data: Idata) => {
    try {
        const response = await api.post('/user', data);
        console.log(response.data);
        return response;
    } catch (error) {
        console.error(error);
        throw error; 
    }
}
