type IReponseDocument = {
    id: number,
    name: string,
    error?: string
}[]


type ICreateDocument = {
    id: number,
    name: string,
    folder: number | null | string,
    students: {
        id: number,
        name: string
    }[],
    error?: string
}