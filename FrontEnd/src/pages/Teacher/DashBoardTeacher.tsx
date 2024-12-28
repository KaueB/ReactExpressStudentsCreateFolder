import { Header } from "@/components/Header"
import { Separator } from "@/components/ui/separator"
import { ListStudents } from "@/components/ListStudents"

export const DashBoardTeacher = () => {
    return (
        <>
            <Header />
            <Separator className="mb-4" />
            <ListStudents />
        </>
    )
}