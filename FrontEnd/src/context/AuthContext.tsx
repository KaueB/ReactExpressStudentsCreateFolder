import { AxiosResponse } from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../services/api";

// Define a interface para o contexto
interface AuthContextData {
    user: Iuser | null;
    student: IStudent | null;
    teacher: ITeacher | null;
    reload: boolean;
    signIn: ({ email, password }: SignInProps) => Promise<{ error?: string } | void>;
    updateUser: () => Promise<void>;
    signOut: () => void;
    signed: boolean;
}

// Define a interface para os props do SignIn
interface SignInProps {
    email: string;
    password: string;
}

// Define a interface para o AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// Cria o contexto com o valor inicial
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<Iuser | null>(null);
    const [student, setStudent] = useState<IStudent | null>(null);
    const [teacher, setTeacher] = useState<ITeacher | null>(null);

    const [reload, setReload] = useState<boolean>(false)

    useEffect(() => {
        const loadStoredData = async () => {
            const storageToken = localStorage.getItem("@Auth:token");

            if (storageToken) {
                api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;

                try {
                    const responseMiddlewares: AxiosResponse<IProfile> = await api.get("/profile");
                    if (responseMiddlewares.data.error) {
                        localStorage.clear();
                        setUser(null);
                        setStudent(null);
                        setTeacher(null);
                        alert(responseMiddlewares.data.error);
                    } else {
                        setUser(responseMiddlewares.data.user);
                        setStudent(responseMiddlewares.data.student || null);
                        setTeacher(responseMiddlewares.data.teacher || null);
                    }
                } catch (error) {
                    localStorage.clear();
                    setUser(null);
                    setStudent(null);
                    setTeacher(null);
                    console.error(error);
                }
            }

            await new Promise((res) => setTimeout(res, 300));
        };

        loadStoredData()
            .then(() => { setReload(true) })
            .catch(error => alert(error));
    }, []);

    const signIn = async ({ email, password }: SignInProps): Promise<{ error?: string } | void> => {
        try {
            const response: AxiosResponse<ResponseSingIn> = await api.post("/login", { email, password });
            console.log(response.data);
            if (response.data.error) {
                alert(response.data.error);
                return { error: response.data.error };
            } else {
                api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
                localStorage.setItem("@Auth:token", response.data.token);

                const respondeMiddlewares: AxiosResponse<IProfile> = await api.get("/profile");
                if (respondeMiddlewares.data.error) {
                    alert(respondeMiddlewares.data.error);
                    return { error: response.data.error };
                } else {
                    setUser(respondeMiddlewares.data.user);
                    setStudent(respondeMiddlewares.data.student || null);
                    setTeacher(respondeMiddlewares.data.teacher || null);
                }
            }
        } catch (error) {
            console.error(error);
            return { error: "Ocorreu um erro durante o login." };
        }
    };


    const signOut = () => {
        localStorage.clear();
        setUser(null);
        setStudent(null);
        setTeacher(null);
        return <Navigate to="/" />;
    };

    const updateUser = async () => {
        const respondeMiddlewares: AxiosResponse<IProfile> = await api.get("/profile");
        if (respondeMiddlewares.data.error) {
            alert(respondeMiddlewares.data.error);
        } else {
            setUser(respondeMiddlewares.data.user);
            setStudent(respondeMiddlewares.data.student || null);
            setTeacher(respondeMiddlewares.data.teacher || null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                student,
                teacher,
                reload: reload,
                signIn,
                signOut,
                updateUser,
                signed: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
