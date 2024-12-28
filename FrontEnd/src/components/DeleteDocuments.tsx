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

export const DeleteDocuments = ({ id, onCreate }: IProps) => {

    async function deleteDocument() {
        try {
            const response: AxiosResponse<IDeleteResponse> = await api.delete("/students/documents", {
                params: { id: id.toString() }
            });

            toast.warning('Documento deletado', {
                description: response.data.message
            });
            onCreate()
            console.log(response.data.message)
        } catch (error) {
            console.error({ error: error })
        }
    }

    return (
        <div onClick={deleteDocument}>
            <DeleteIcons />
        </div>
    )
}