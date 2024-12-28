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
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { CreateFolder } from "@/services/student/getFolders";

type IProps = {
    path: IPaths | null;
    id: number | null;
    onCreate: () => Promise<void>
}

export const CreateFolders: React.FC<IProps> = ({ path, id, onCreate }) => {
    const [name, setName] = useState<string>("")

    const handleCreateFolder = async () => {
        try {
            const response = await CreateFolder({ name, id });

            if (response?.data.error) {
                toast.error(response.data.error as string, {
                    className: 'bg-red'
                });
            } else {
                toast.success('Pasta criada com sucesso', {
                    description: `Nome ${response.data.name}`
                });
                onCreate(); // Atualiza a pagina
                setName(''); // Limpa o campo de entrada
            }
        } catch (error) {
            toast.warning('Erro ao criar uma pasta');
        }
    }

    return (
        <Dialog>
            <DialogTrigger
                className="
                    inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors 
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
                    bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 w-[7rem]
                "
            >
                +Pasta
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="">Criar uma pasta dentro de {path && `'${path[path.length - 1].name}'?`}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input type='text' id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateFolder}>Criar Pasta</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}