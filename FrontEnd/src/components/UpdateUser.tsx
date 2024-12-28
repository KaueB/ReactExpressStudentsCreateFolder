import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AuthContext } from "@/context/AuthContext"
import { UpdateUserApi } from "@/services/users/UpdateUserApi"
import { useContext } from "react"

import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    name: string;
    email: string;
    password: string;
}

export function UpdateUser() {
    const { user, student, updateUser } = useContext(AuthContext);

    const {
        register,
        handleSubmit
    } = useForm<Inputs>({
        defaultValues: {
            name: student ? student.name : "",
            email: user ? user.email : ""
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async ({ name, email, password }) => {
        try {
            const response = await UpdateUserApi({
                name,
                email,
                password
            });
            if (response.user) {
                updateUser()
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Editar Usuario</Button>
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <SheetHeader>
                        <SheetTitle>Editar Perfil</SheetTitle>
                        <SheetDescription>
                            Troque seu nome, email e senha!!
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome
                            </Label>
                            <Input type="text" id="name" className="col-span-3" {...register("name")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input type="email" id="email" className="col-span-3" {...register("email")} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="passwold" className="text-right">
                                Senha
                            </Label>
                            <Input type="password" id="password" className="col-span-3" {...register("password")} />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
