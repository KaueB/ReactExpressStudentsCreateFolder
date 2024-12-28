import { getListStudents } from "@/services/teacher/teacher";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";

type IListStudents = {
    id: string;
    name: string;
}[];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GetStudents = () => {
    const [students, setStudents] = useState<IListStudents | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchStudents = async () => {
        setIsLoading(true);
        await delay(500);

        try {
            const response = await getListStudents();

            if (response.error) {
                return console.error(response.error);
            }

            console.log(response.students);
            setStudents(response.students);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteStudent = async (id: string) => {
        try {
            const response = await api.delete(`/teachers/students`, {
                params: {
                    id,
                },
            });

            if (response.status === 200) {
                toast("Estudante excluído com sucesso", {
                    className: "bg-green",
                });
            }
        } catch (error) {
            console.error(error);
            toast("Erro ao excluir o estudante", { className: "bg-red" });
        } finally {
            await delay(800);
            fetchStudents();
        }
    };

    const resetPassword = async (id: string) => {
        try {
            const response = await api.patch(`/teachers/students`, { id });

            if (response.status === 200) {
                toast("Senha redefinida com sucesso", {
                    className: "bg-green",
                });
            }
        } catch (error) {
            console.error(error);
            toast("Erro ao redefinir a senha", { className: "bg-red" });
        } finally {
            await delay(800);
            fetchStudents();
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    if (isLoading) {
        return (
            <div>
                <h1>Carregando...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {students &&
                students.map((student) => (
                    <div
                        key={student.id}
                        className="flex justify-between p-5 border-2 border-indigo-500/75 w-full rounded-lg "
                    >
                        <div>
                            <h1>{student.name}</h1>
                        </div>
                        <div className="flex gap-3">
                            <div>
                                <Button
                                    variant="destructive"
                                    onClick={() => deleteStudent(student.id)}
                                >
                                    Excluir
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={() => resetPassword(student.id)}
                                >
                                    Refinir Senha
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};
