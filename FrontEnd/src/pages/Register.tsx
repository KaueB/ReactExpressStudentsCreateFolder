import SelectOccupation from "@/components/SelecetOccupation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RegisterUser } from "@/services/users/RegisterUser";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type Inputs = {
    name: string;
    email: string;
    occupation: string;
    password: string;
    subject?: string;
};

export const Register = () => {
    const [selectedOccupation, setSelectedOccupation] = useState<'student' | 'teacher'>('student');
    const navigate = useNavigate();

    const handleOccupationChange = (newOccupation: string) => {
        setSelectedOccupation(newOccupation as 'student' | 'teacher');
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async ({ name, email, password, subject }) => {
        try {
            const response = await RegisterUser({
                name,
                email,
                occupation: selectedOccupation,
                password,
                subject
            });
            if (response) {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                        <CardTitle>Cadastrar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input id="name" placeholder="Nome" {...register("name", { required: true })} />
                                    {errors.name && <span>Favor inserir um nome</span>}
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="Email" {...register("email", { required: true })} />
                                    {errors.email && <span>Favor inserir um email</span>}
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input type="password" id="password" placeholder="Senha" {...register("password", { required: true })} />
                                    {errors.password && <span>Favor inserir uma senha</span>}
                                </div>
                                <SelectOccupation onOccupationChange={handleOccupationChange} />
                                {selectedOccupation === "teacher" && (
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="subject">Disciplina</Label>
                                        <Input id="subject" placeholder="Disciplina" {...register("subject", { required: true })} />
                                        {errors.subject && <span>Favor inserir uma disciplina</span>}
                                    </div>
                                )}
                            </div>
                            <CardFooter className="flex justify-between p-0 mt-5">
                                <Link to='/'>
                                    <Button type="button" variant="outline">Logar</Button>
                                </Link>
                                <Button type="submit">Criar</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};