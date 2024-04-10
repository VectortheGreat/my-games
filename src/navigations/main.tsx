import { Box } from "@mui/material"
import type { RouteObject } from "react-router-dom"

import PageHeader from "@components/page_header"
import AuthPageLayout from "@layouts/auth_page_layout"
import GamesNavigationLayout from "@layouts/games_navigation_layout"
import GamesPageLayout from "@layouts/games_page_layout"
import UsersPageLayout from "@layouts/users_page_layout"
import ErrorPage from "@pages/error"
import AuthLoginPage from "@pages/main/auth/login"
import AuthSignUp from "@pages/main/auth/signup"
import GamesPage from "@pages/main/games"
import UsersPage from "@pages/main/users"
import { AuthLoginPageContextProvider } from "context/auth/login"
import { AuthSignUpPageContextProvider } from "context/auth/signup"
import { GamesPageContextProvider } from "context/games"
import { UsersPageContextProvider } from "context/users"

const mainNavigation: RouteObject[] = [
  {
    path: "/",
    element: <GamesNavigationLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <GamesPageLayout
            HeaderComponent={() => <PageHeader />}
            ContextProvider={GamesPageContextProvider}
          >
            <Box />
          </GamesPageLayout>
        )
      },
      {
        path: "games",
        element: (
          <GamesPageLayout
            HeaderComponent={() => <PageHeader />}
            ContextProvider={GamesPageContextProvider}
          >
            <GamesPage />
          </GamesPageLayout>
        )
      },
      {
        path: "users",
        element: (
          <UsersPageLayout
            HeaderComponent={() => <PageHeader />}
            ContextProvider={UsersPageContextProvider}
          >
            <UsersPage />
          </UsersPageLayout>
        )
      },
      {
        path: "auth/login",
        element: (
          <AuthPageLayout
            HeaderComponent={() => <PageHeader />}
            ContextProvider={AuthLoginPageContextProvider}
          >
            <AuthLoginPage />
          </AuthPageLayout>
        )
      },
      {
        path: "auth/signup",
        element: (
          <AuthPageLayout
            HeaderComponent={() => <PageHeader />}
            ContextProvider={AuthSignUpPageContextProvider}
          >
            <AuthSignUp />
          </AuthPageLayout>
        )
      }
    ]
  }
]

export default mainNavigation
