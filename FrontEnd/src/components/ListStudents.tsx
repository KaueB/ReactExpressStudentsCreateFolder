import { GetStudents } from "./GetStudents";

export const ListStudents = () => {
    return (
        <div className="mt-0 m-10">
            <div className="justify-between mb-3 inline-block align-middle">
                <h1 className="text-3xl">Alunos</h1>
            </div>
            <GetStudents />
        </div>
    );
};
