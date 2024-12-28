import { User } from "../entities/User";
import { Student } from "../entities/Student";
import { Teacher } from "../entities/Teacher";

declare global {
    namespace Express {
        export interface Request {
            user: Partial<User>;
            studentUser?: Student;
            teacherUser?: Teacher;
        }
    }
}