interface IProfile {
    user: Iuser;
    student?: IStudent;
    teacher?: ITeacher;
    error?: any;
    message?: string;
}

interface Iuser {
    id: number;
    email: string;
}

interface IStudent {
    id: number;
    name: string;
}

interface ITeacher {
    id: number;
    name: string;
    subject: string;
}

interface ResponseSingIn {
    user: Iuser;
    token: string;
    error?: string;
}