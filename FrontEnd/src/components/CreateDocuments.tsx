import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { api } from "@/services/api";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";

type IProps = {
    path: IPaths | null;
    id: number | null;
    onCreate: () => Promise<void>
}

type responseFetch = {
    name: string;
    path: string;
    student: IStudent;
    folder: string | number | null;
    error?: string;
}

export const CreateDocuments: React.FC<IProps> = ({ path, id, onCreate }) => {
    const [file, setFile] = useState<File | undefined>()
    const [formData, setFormData] = useState<FormData | undefined>()

    const handleCreateDocuments = async () => {
        try {
            const response: AxiosResponse<responseFetch> = await api.post("/students/documents", formData);

            if (response.data) {
                toast(`Documento criado com sucesso: '${response.data.name}'`)
            } else {
                toast('ue')
            }
            onCreate()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast(error.response.data.error)
            } else {
                console.error("Unexpected error: ", error);
            }
        }
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file)

            const formData = new FormData();
            formData.append("file", file);
            formData.append("id", id ? id.toString() : '0');
            setFormData(formData);
        }
    };

    return (
        <>
            <Dialog onOpenChange={(e) => { e ? undefined : setFile(undefined) }}>
                <DialogTrigger
                    className="
                    inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors 
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none 
                    disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-[7rem]
                "
                >
                    +Documento
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="">Criar uma pasta dentro de {path && `'${path[path.length - 1].name}'?`}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-start p-2">
                        <div className="flex flex-col space-y-2 items-center">
                            <Label htmlFor="name" className="text-right text-center">
                                Inserir novo documento
                            </Label>
                            <div className="flex flex-row space-x-2">
                                <div className="flex items-center justify-center bg-gray-100 rounded-md">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="file-input-hidden w-auto"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        className="custom-file-button"
                                        onClick={handleFileUploadClick}
                                    >
                                        Upload de Arquivo
                                    </button>
                                </div>
                                <div className="flex flex-col justify-center item-center">
                                    {file ? <h1>{file.name}</h1> : <></>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateDocuments}>Criar Pasta</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}