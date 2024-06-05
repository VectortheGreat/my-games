import { Avatar } from "@mui/material"
import Stack from "@mui/material/Stack"
import axios, { type AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"

import DialogProvider from "@components/dialog_provider"
import TextInput from "@components/text_input"
import { gameNameLabel } from "@utils/arrays/gameNameLabel"
import { showErrorToast, showSuccessToast } from "@utils/functions/toast"
import log from "@utils/log"
import { useAppContext } from "context/app_context"
import { useUsersPageContext } from "context/users"
import { EditUserDialogData, UsersData } from "types/users"

export default function EditUser() {
  const {
    translate,
    reset,
    handleSubmit,
    control,
    isValid,
    selectedUser,
    isDirty,
    setUsers,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen
  } = useUsersPageContext()
  const { token } = useAppContext()
  const imageSrc = useWatch({ control, name: "profileImage" })
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * gameNameLabel.length)
  )
  const [loading, setLoading] = useState(false)
  console.log(selectedUser, "selectedUser")
  useEffect(() => {
    reset?.(
      selectedUser
        ? {
            email: selectedUser.email,
            profileImage: selectedUser.profileImage
          }
        : {}
    )
  }, [reset, selectedUser])
  function handleClose() {
    if (loading) {
      return
    }
    setIsEditUserDialogOpen?.()
    reset?.()
    setRandomNumber(Math.floor(Math.random() * gameNameLabel.length))
  }

  async function onSubmit(data: EditUserDialogData) {
    setLoading(true)
    await axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/auth/edit`,
        {
          email: data.email ? data.email : undefined,
          profileImage: data.profileImage ? data.profileImage : undefined,
          password: data.password ? data.password : undefined
        },
        {
          headers: {
            Authorization: `Bearer: ${token?.access_token}`
          }
        }
      )
      .then((res: AxiosResponse<{ data: UsersData }>) => {
        reset?.()
        showSuccessToast("Profile Edited")
        const responseData = res.data.data
        setUsers?.((prev) => {
          const updatedGameIndex = prev.findIndex(
            (user) => user._id === responseData._id
          )
          const updatedGames = [...prev]
          if (updatedGameIndex !== -1) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            updatedGames[updatedGameIndex] = {
              name: responseData.name,
              profileImage: responseData.profileImage,
              isVerified: responseData.isVerified,
              role: responseData.role,
              completedGameSize: responseData.completedGameSize,
              screenshotSize: responseData.screenshotSize,
              updatedAt: responseData.updatedAt,
              gameSize: responseData.gameSize,
              _id: responseData._id,
              createdAt: responseData.createdAt
            }
          }
          return updatedGames
        })
        handleClose()
        log("Profile edited: ", data)
      })
      .catch((error) => {
        console.error(error)
        showErrorToast("Game couldn't be edited" + (error as Error).message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <DialogProvider
      title={translate("edit_game")}
      leftButton={{
        text: translate("cancel"),
        color: "secondary",
        onClick: handleClose,
        disabled: loading
      }}
      rightButton={{
        text: translate("save"),
        color: "primary",
        onClick: handleSubmit?.(onSubmit),
        loading: loading,
        disabled: !isValid || !isDirty
      }}
      isOpen={!!isEditUserDialogOpen}
      setClose={handleClose}
      size="large"
    >
      <Stack spacing={2}>
        <TextInput<EditUserDialogData>
          type="text"
          name="email"
          control={control}
          label={translate("game_name")}
          placeholder={gameNameLabel[randomNumber]}
          disabled={loading}
          required
        />
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <TextInput<EditUserDialogData>
            type="text"
            name="profileImage"
            control={control}
            label={translate("game_photo_url")}
            placeholder={
              "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg"
            }
            TextLeft={
              imageSrc && (
                <Avatar sx={{ width: "40px", height: "40px" }} src={imageSrc} />
              )
            }
            disabled={loading}
          />
        </Stack>
        <TextInput<EditUserDialogData>
          type="text"
          name="password"
          control={control}
          label={translate("game_name")}
          placeholder={gameNameLabel[randomNumber]}
          disabled={loading}
          required
        />
      </Stack>
    </DialogProvider>
  )
}