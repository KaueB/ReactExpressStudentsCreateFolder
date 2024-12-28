import { RouterProvider, createBrowserRouter } from "react-router-dom"; // react router dom
import { PrivateStudent, PrivateTeacher } from "./privateRoutes"; // PivateRouter

// pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DashBoardStudent } from "./pages/Student/DashBoardStudent";
import { DashBoardTeacher } from "./pages/Teacher/DashBoardTeacher";

const Routes: React.FC = () => {
  const routesForPublic = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    // Rotas para Alunos / Students
    {
      path: "/student",
      element: <PrivateStudent />,
      children: [
        {
          path: "home",
          element: <DashBoardStudent />,
        },
      ],
    },

    // Rotas para Professores / Teachers
    {
      path: "/teacher",
      element: <PrivateTeacher />,
      children: [
        {
          path: "home",
          element: <DashBoardTeacher />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routesForPublic);

  return <RouterProvider router={router} />;
};

export default Routes;
