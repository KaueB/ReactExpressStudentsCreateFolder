type IChildren = {
    id: number,
    name: string
};

type IResponse = {
    id: string | number,
    name: string,
    parentFolder: number | null,
    children?: IChildren[],
    error?: string
};

type IPaths = {
    id: number,
    name: string
}[]

type ICreateFolder = {
    id: number,
    name: string,
    students: {
        id: number,
        name: string
    }[],
    error?: string
}