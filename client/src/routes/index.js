import DefaultLayout from "layouts/defaultLayout";

import { HomePage, ProfilePage, LoginPage } from "pages";

export const publicRoutes = [
    { path: "/", component: HomePage, layout: DefaultLayout },
    { path: "/login", component: LoginPage },
    { path: "/profile/:userId", component: ProfilePage, layout: DefaultLayout },
]