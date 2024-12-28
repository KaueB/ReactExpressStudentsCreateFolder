import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm, SubmitHandler } from "react-hook-form"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import { Link, Navigate } from "react-router-dom"
import { toast } from "sonner"

type Inputs = {
    email: string
    password: string
}

export function Login(): JSX.Element | undefined {
    const { signIn, signed, student, teacher } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const response = await signIn(data);
        if (response?.error) {
            toast.error(response.error as string, {
                className: 'bg-red'
            })
        }
    }

    if (!signed) {
        return (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: "translate(-50%, -50%)"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" placeholder="Email" {...register("email", { required: true })} />
                                        {errors.email && <span>Favor inserir um email</span>}
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input type="password" id="password" placeholder="Password" {...register("password", { required: true })} />
                                        {errors.password && <span className="color-red">Favor inserir uma senha</span>}
                                    </div>
                                </div>
                                <CardFooter className="flex justify-between p-0 mt-5">
                                    <Link to='/register'>
                                        <Button type="button" variant="outline">Cadastrar</Button>
                                    </Link>
                                    <Button type="submit">Entrar</Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    } else {
        return (
            student ?
                <Navigate to="/student/home" />
                : teacher ?
                    <Navigate to="/teacher/home" />
                    : <h1>Oh meu deus, o que eu fiz</h1>
        );
    }
}
