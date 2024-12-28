import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Skeleton } from "./ui/skeleton";
import { DocumentIcons, FolderIcons } from "@/assets/FolderIcons";
import { GetDocument } from "@/services/student/apiDocument";
import { GetFolders, GetPaths } from "@/services/student/getFolders";
import Loading from "./Loading";
import { CreateFolders } from "./CreateFolder";
import { CreateDocuments } from "./CreateDocuments";
import { DeleteDocuments } from "./DeleteDocuments";
import { DeleteFolders } from "./DeleteFolders";
import { DownloadDocuments } from "./DownloadDocuments";

export const Folder = () => {
    const [idFolder, setIdFolder] = useState<{ id: number | null }>({ id: 0 });
    const [parentFolder, setParentFolder] = useState<number | null>(null);
    const [path, setPath] = useState<IPaths | null>(null);
    const [childrenFolder, setChildrenFolder] = useState<IChildren[] | null>(null);
    const [documents, setDocuments] = useState<IReponseDocument | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await GetFolders(idFolder);
                const responsePath = await GetPaths(idFolder);
                const responseDocuments = await GetDocument(idFolder);
                setParentFolder(response.data.parentFolder);
                setPath(responsePath.data);
                setDocuments(responseDocuments.data);
                setChildrenFolder(response.data.children || null);
            } catch (err) {
                handleFetchError('Erro ao carregar as pastas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [idFolder]);

    const handleFetchError = (errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
    };

    const handlefetchData = async () => {
        fetchData();
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await GetFolders(idFolder);
            const responsePath = await GetPaths(idFolder);
            const responseDocuments = await GetDocument(idFolder)
            setParentFolder(response.data.parentFolder);
            setPath(responsePath.data);
            setDocuments(responseDocuments.data);
            setChildrenFolder(response.data.children || null);
        } catch (err) {
            handleFetchError('Erro ao carregar as pastas');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        toast.error(error as string, {
            className: 'bg-red'
        });
    }

    return (
        <div className="mt-0 m-10">
            <div className="flex justify-between mb-3 inline-block align-middle">
                <h1 className="text-3xl">Pastas: {path && path[path.length - 1].name}</h1>
                <div className="space-x-5">
                    <CreateFolders path={path} id={idFolder.id} onCreate={handlefetchData} />
                    <CreateDocuments path={path} id={idFolder.id} onCreate={handlefetchData} />
                    <Button
                        disabled={parentFolder === undefined}
                        variant="outline"
                        onClick={() => setIdFolder({
                            id: parentFolder
                        })}
                    >
                        Voltar
                    </Button>
                </div>
            </div>
            <Breadcrumb>
                <BreadcrumbList className="flex flex-row items-center">
                    {path && path.map((paths, index) => (
                        <Fragment key={paths.id}>
                            <BreadcrumbItem className="cursor-pointer">
                                <BreadcrumbLink onClick={() => setIdFolder(paths)}>{paths.name}</BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < path.length - 1 && <BreadcrumbSeparator />}
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-wrap">
                {
                    (childrenFolder?.length !== 0 || documents?.length !== 0) ?
                        <>
                            {childrenFolder?.map(child => {
                                return (
                                    <div
                                        key={child.id}
                                        className="grid grid-rows-3 m-2 mt-4 rounded-md border-solid
                                        border-indigo-500/50 border-2 w-40 h-40 text-center "
                                    >
                                        <div className="w-full flex justify-between p-3 pt-2 w-5 h-5 cursor-pointer">
                                            <DeleteFolders id={child.id} onCreate={handlefetchData} />
                                        </div>
                                        <div
                                            className="flex flex-col items-center justify-start cursor-pointer"
                                            style={{ height: '100px' }}
                                            onClick={() => setIdFolder({ id: child.id })}
                                        >
                                            <FolderIcons />
                                            <h1>{child.name}</h1>
                                        </div>
                                    </div>
                                )
                            })}
                            {documents?.map(child => {
                                return (
                                    <div
                                        key={child.id}
                                        className="grid grid-rows-3 m-2 mt-4 rounded-md border-solid
                                        border-indigo-500/50 border-2 w-40 h-40 text-center"
                                    >
                                        <div className="w-full flex justify-between p-3 pt-2">
                                            <DeleteDocuments id={child.id} onCreate={handlefetchData} />
                                            <DownloadDocuments id={child.id} />
                                        </div>
                                        <div
                                            className="flex flex-col items-center justify-center"
                                        >
                                            <DocumentIcons />
                                            <h1>{child.name}</h1>
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                        :
                        <Skeleton className="flex flex-col justify-center items-center m-2 rounded-md border-solid border-2 w-40 h-40 mt-10 ">
                            <FolderIcons />
                            <h1>Atual Pasta Vazia</h1>
                        </Skeleton>
                }
            </div>
        </div>
    )
}