import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { UpdateUser } from "./UpdateUser";

export const Header = () => {
    const { student, teacher, signOut } = useContext(AuthContext);
    return (
        <nav className="flex justify-between p-10">
            <h1>Olá {student ? `Aluno, ${student.name}` : teacher ? `professro, ${teacher.name}` : "Desconhecido"}</h1>

            <div className="flex ">
                <ModeToggle />
                <div className="mx-3" >
                    <UpdateUser />
                </div>
                <Button onClick={signOut}>Sair</Button>
            </div>
        </nav>
    )
}