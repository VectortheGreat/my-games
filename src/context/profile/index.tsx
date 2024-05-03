import type { AxiosResponse } from "axios"
import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { showErrorToast } from "@utils/functions/toast"
import i18next from "@utils/localization"
import { UsersData } from "types/users"

import {
  AppContextProps,
  appContextDefaultValues,
  useAppContext
} from "../app_context"

export type ProfileContextProps = {
  profile?: UsersData
}

export type ProfilePageContextProps = AppContextProps & ProfileContextProps

export const profilePageDefaultValues: ProfilePageContextProps = {
  ...appContextDefaultValues,
  translate: i18next.t
}

const ProfilePageContext = createContext(profilePageDefaultValues)

export function ProfilePageContextProvider(props: {
  children: React.ReactNode | React.ReactNode[]
}) {
  const { translate } = useAppContext()
  const { id } = useParams()
  const [profile, setProfile] = useState<UsersData>()

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/${id}`)
      .then((res: AxiosResponse<{ data: UsersData }>) => {
        setProfile(res.data.data)
      })
      .catch((err) => {
        showErrorToast("Database Fethcing Error")
        console.error(err)
      })
  }, [id])

  return (
    <ProfilePageContext.Provider
      value={{
        ...profilePageDefaultValues,
        translate,
        profile
      }}
    >
      {props.children}
    </ProfilePageContext.Provider>
  )
}

export function useProfilePageContext() {
  const context = useContext(ProfilePageContext)
  if (context === undefined) {
    throw new Error("ProfilePage Context Error")
  }
  return context
}