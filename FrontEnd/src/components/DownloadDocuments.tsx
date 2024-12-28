import { DownloadIcons } from "@/assets/FolderIcons"
import { api } from "@/services/api"
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import fileDownload from 'js-file-download';

interface INameDocuments {
    name: string
    error: string
}

type IProps = {
    id: number;
}

export const DownloadDocuments = ({ id }: IProps) => {

    async function DownloadDocument() {
        try {
            const response: AxiosResponse<Blob> = await api.get("/students/downloads", {
                responseType: "blob",
                params: { id: id.toString() }
            })

            if (!response) {
                toast.error('Arquivo não encontrado', {
                    description: 'Este arquivo não foi encontrado!'
                });
                return
            }

            const nameDocument: AxiosResponse<INameDocuments> = await api.get('/students/namedocument', {
                params: { id: id.toString() }
            })

            if (nameDocument.data.error) {
                toast.warning('Error', {
                    description: 'Houve um erro para conseguir pega o nome do documento'
                })
                return
            }

            fileDownload(response.data, nameDocument.data.name);

            toast.success('Documento baixado com sucesso', {
                description: 'O documento foi baixado e está pronto para visualização.'
            });
        } catch (error) {
            toast.error('Erro ao baixar o documento', {
                description: 'Houve um problema ao tentar baixar o documento.'
            });
            console.error({ error });
        }
    }

    return (
        <div onClick={DownloadDocument}>
            <DownloadIcons />
        </div>
    )
}