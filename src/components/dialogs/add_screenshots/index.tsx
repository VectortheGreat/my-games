import axios, { type AxiosResponse } from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"

import DialogProvider from "@components/dialog_provider"
import TextInput from "@components/text_input"
import { showErrorToast, showSuccessToast } from "@utils/functions/toast"
import log from "@utils/log"
import { useAppContext } from "context/app_context"
import { useGameDetailPageContext } from "context/games_detail"
import { Screenshot } from "types/games"

export default function AddScreenShot() {
  const {
    translate,
    setScreenShots,
    screenshotControl,
    screenshotHandleSubmit,
    screenshotIsValid,
    screenshotReset,
    isAddScreenshotDialogOpen,
    setIsAddScreenshotDialogOpen
  } = useGameDetailPageContext()
  const { token } = useAppContext()
  const { id } = useParams()

  const [loading, setLoading] = useState(false)

  function handleClose() {
    if (loading) {
      return
    }
    setIsAddScreenshotDialogOpen?.()
    screenshotReset?.()
  }
  async function onSubmit(data: Screenshot) {
    setLoading(true)
    const requestData = {
      name: data.name,
      url: data.url
    }
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/games/${id}/addSS`,
        requestData,
        {
          headers: {
            Authorization: `Bearer: ${token?.access_token}`
          }
        }
      )
      .then((res: AxiosResponse<{ data: Screenshot }>) => {
        log(`${data.url} is added: `, data)
        screenshotReset?.()
        showSuccessToast("Screenshot is added")
        setScreenShots?.((prev) => [...(prev ?? []), res.data.data])
        handleClose()
      })
      .catch((error) => {
        console.error(error)
        showErrorToast(
          "Screenshot couldn't be added" + (error as Error).message
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <DialogProvider
      title={translate("add_screenshot")}
      leftButton={{
        text: translate("cancel"),
        color: "secondary",
        onClick: handleClose,
        disabled: loading
      }}
      rightButton={{
        text: translate("save"),
        color: "primary",
        onClick: screenshotHandleSubmit?.(onSubmit),
        loading: loading,
        disabled: !screenshotIsValid
      }}
      isOpen={!!isAddScreenshotDialogOpen}
      setClose={handleClose}
      size="large"
    >
      <>
        <TextInput<Screenshot>
          type="text"
          name="name"
          control={screenshotControl}
          label={translate("screenshot_name")}
          placeholder={translate("screenshot_name")}
          disabled={loading}
        />
        <TextInput<Screenshot>
          type="text"
          name="url"
          control={screenshotControl}
          label={translate("screenshot_url")}
          placeholder={
            "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg"
          }
          required
          disabled={loading}
        />
      </>
    </DialogProvider>
  )
}