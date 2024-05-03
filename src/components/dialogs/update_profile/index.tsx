import { Avatar } from "@mui/material"
import Stack from "@mui/material/Stack"
import axios, { type AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"

import AutoCompleteInput from "@components/auto_complete"
import DialogProvider from "@components/dialog_provider"
import TextInput from "@components/text_input"
import { gameNameLabel } from "@utils/arrays/gameNameLabel"
import { showErrorToast, showSuccessToast } from "@utils/functions/toast"
import log from "@utils/log"
import { useAppContext } from "context/app_context"
import { useGamesPageContext } from "context/games"
import { DialogGameData, GamesData } from "types/games"

export default function UpdateProfile() {
  const {
    translate,
    reset,
    handleSubmit,
    control,
    isValid,
    isEditGameDialogOpen,
    selectedGame,
    setIsEditGameDialogOpen,
    isDirty,
    setGames
  } = useGamesPageContext()
  const { token } = useAppContext()
  const imageSrc = useWatch({ control, name: "photo" })
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * gameNameLabel.length)
  )
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    reset?.(
      selectedGame
        ? {
            name: selectedGame.name,
            photo: selectedGame.photo,
            lastPlay: selectedGame?.lastPlay.split("T")[0],
            platform: selectedGame.platform,
            review: selectedGame.review,
            rating: selectedGame.rating,
            status: selectedGame.status,
            playTime: selectedGame.playTime
          }
        : {}
    )
  }, [reset, selectedGame])
  function handleClose() {
    if (loading) {
      return
    }
    setIsEditGameDialogOpen?.()
    reset?.()
    setRandomNumber(Math.floor(Math.random() * gameNameLabel.length))
  }

  async function onSubmit(data: DialogGameData) {
    setLoading(true)
    await axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/auth/edit/${selectedGame?._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer: ${token?.access_token}`
          }
        }
      )
      .then((res: AxiosResponse<{ data: GamesData }>) => {
        log(`${data.name} is edited: `, data)
        reset?.()
        showSuccessToast("The Game Edited Successfully")
        setGames?.((prev) => [
          {
            name: data.name,
            photo: data.photo,
            lastPlay: data.lastPlay,
            platform: data.platform,
            review: data.review,
            rating: data.rating,
            status: data.status,
            playTime: data.playTime,
            _id: res.data.data._id,
            createdAt: res.data.data.createdAt,
            userId: res.data.data.userId,
            screenshots: []
          },
          ...prev
        ])
        handleClose()
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
      isOpen={!!isEditGameDialogOpen}
      setClose={handleClose}
      size="large"
    >
      <Stack spacing={2}>
        <TextInput<DialogGameData>
          type="text"
          name="name"
          control={control}
          label={translate("game_name")}
          placeholder={gameNameLabel[randomNumber]}
          disabled={loading}
          required
        />
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <TextInput<DialogGameData>
            type="text"
            name="photo"
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
        <Stack direction={"row"} gap={1}>
          <TextInput<DialogGameData>
            type="number"
            name="playTime"
            control={control}
            label={translate("game_play_time")}
            placeholder={"23.5"}
            disabled={loading}
            required
          />
          <AutoCompleteInput<DialogGameData>
            type="text"
            name="platform"
            control={control}
            label={translate("platform")}
            placeholder={translate("required_input_placeholder", {
              name: translate("platform")
            })}
            selectOptions={[
              { label: "Steam", value: "steam", icon: "steam" },
              { label: "Epic Games", value: "epicGames", icon: "epicGames" },
              { label: "Ubisoft", value: "ubisoft", icon: "ubisoft" },
              { label: "Xbox(Pc)", value: "xboxPc", icon: "xboxPc" },
              { label: "EA Games", value: "eaGames", icon: "eaGames" },
              { label: "Ubisoft", value: "ubisoft", icon: "ubisoft" },
              { label: "Torrent", value: "torrent", icon: "torrent" },
              {
                label: "Playstation",
                value: "playstation",
                icon: "playstation"
              },
              { label: "Xbox Series", value: "xboxSeries", icon: "xboxSeries" },
              { label: "Nintendo", value: "nintendo", icon: "nintendo" },
              { label: "Mobile", value: "mobile", icon: "mobile" },
              {
                label: translate("otherPlatforms"),
                value: "otherPlatforms",
                icon: "otherPlatforms"
              }
            ]}
            disabled={loading}
            required
          />
        </Stack>
        <Stack direction={"row"} gap={1}>
          <TextInput<DialogGameData>
            type="number"
            name="rating"
            control={control}
            label={translate("rating")}
            placeholder={"8.6"}
            disabled={loading}
          />
          <AutoCompleteInput<DialogGameData>
            name="status"
            control={control}
            label={translate("game_status")}
            placeholder={translate("required_input_placeholder", {
              name: translate("game_status")
            })}
            selectOptions={[
              { label: translate("completed"), value: "completed" },
              { label: translate("abondoned"), value: "abondoned" },
              { label: translate("toBeCompleted"), value: "toBeCompleted" },
              { label: translate("activePlaying"), value: "activePlaying" }
            ]}
            disabled={loading}
            required
          />
        </Stack>
        <TextInput<DialogGameData>
          type="date"
          name="lastPlay"
          control={control}
          label={translate("last_play_date")}
          disabled={loading}
          required
        />
        <TextInput<DialogGameData>
          multiline
          rows={4}
          name="review"
          control={control}
          label={translate("game_review")}
          placeholder={translate("optional_input_placeholder", {
            name: translate("game_review")
          })}
          disabled={loading}
        />
      </Stack>
    </DialogProvider>
  )
}