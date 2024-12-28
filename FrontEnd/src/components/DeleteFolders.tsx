import { DeleteIcons } from "@/assets/FolderIcons"
import { api } from "@/services/api"
import { AxiosResponse } from "axios";
import { toast } from "sonner";

type IDeleteResponse = {
    message: string;
    error?: string;
}

type IProps = {
    id: number;
    onCreate: () => Promise<void>
}

export const DeleteFolders = ({ id, onCreate }: IProps) => {

    async function deleteFolders() {
        try {
            const response: AxiosResponse<IDeleteResponse> = await api.delete("/students/folder", {
                params: { id: id.toString() }
            });

            toast.warning('Pasta deletada', {
                description: response.data.message
            });
            onCreate()
            console.log(response.data.message)
        } catch (error) {
            console.error({ error: error })
        }
    }

    return (
        <div onClick={deleteFolders}>
            <DeleteIcons />
        </div>
    )
}