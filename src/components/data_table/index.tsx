import { Avatar, Box } from "@mui/material"
import type { GridColDef } from "@mui/x-data-grid"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"

type RenderCellAvatarData = {
  value?: { avatar?: string; username?: string }
}

export default function DataTable() {
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        color: "#fff"
      }}
    >
      <DataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          color: "white",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main"
          },
          "& .MuiDataGrid-pagination": {
            color: "white"
          },
          "& .MuiDataGrid-pagination .MuiButton-root": {
            color: "white"
          }
        }}
        autoHeight
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20
            }
          }
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        slots={{
          toolbar: GridToolbar
        }}
        disableRowSelectionOnClick
      />
    </Box>
  )
}
const columns: GridColDef[] = [
  {
    field: "photo",
    headerName: "",
    renderCell: (params: RenderCellAvatarData) => {
      return <Avatar src={params.value?.avatar} />
    }
  },
  {
    field: "game",
    headerName: "Oyun"
  },
  {
    field: "score",
    headerName: "Puan"
  },
  {
    field: "platform",
    headerName: "Platform",
    type: "number"
  },
  {
    field: "ss",
    headerName: "Ekran Görüntüleri"
  },
  {
    field: "lastPlayed",
    headerName: "Son Oynama"
  },
  {
    field: "status",
    headerName: "Durum",
    type: "number"
  }
]

const rows = [
  {
    id: 1,
    photo: {
      avatar:
        "https://assets.materialup.com/uploads/bebad102-7f40-4941-99cd-54366113003e/avatar-08.png"
    },
    game: "Snow",
    score: "Jon",
    platform: 14
  },
  {
    id: 2,
    game: "Lannister",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 3,
    game: "Lannister",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 4,
    game: "Stark",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 5,
    game: "Targaryen",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 6,
    game: "Melisandre",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 7,
    game: "Clifford",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 8,
    game: "Frances",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  },
  {
    id: 9,
    game: "Roxie",
    score: 9.5,
    platform: "Steam",
    ss: 15,
    lastPlayed: "2021-10-10",
    status: "Bitilrildi"
  }
]
