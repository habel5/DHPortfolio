import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Evidence } from "./pages/Evidence";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "projecten", Component: Projects },
      { path: "bewijslast", Component: Evidence },
      { path: "*", Component: NotFound },
    ],
  },
]);
