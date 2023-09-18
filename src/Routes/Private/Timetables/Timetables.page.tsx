import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MainPage from "../../../Components/MainPage/MainPage";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteDialog from "../../../Components/DeleteDialog/DeleteDialog";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {getReasonAlert} from "../../../utils/requestAlertHandler";
import {defaultLocalUnits, getAllLocalUnits} from "../../../services/localUnits.services";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import {CalendarPickerSkeleton, MobileDatePicker, StaticDatePicker} from "@mui/x-date-pickers";
import {getFormattedDate} from "../../../utils/dateHandler";
import DatagridError from "../../../Components/DatagridComponents/DatagridError";
import LoadingOverlay from "../../../Components/DatagridComponents/DatagridLoading";
import NoRowsOverlay from "../../../Components/DatagridComponents/DatagridNoRow";
import DatagridToolbar from "../../../Components/DatagridComponents/DatagridToolbar";
import AddCard from "../../../Components/AddCard/AddCard";

type PageParamsType = {
  companyId: string;
};

const TimetablesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const [localUnits, setLocalUnits] = useState(defaultLocalUnits);
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState("00:00");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {setAlertEvent} = useContext(useAlertContext);

  const fetchData = async () => {
    const res = await getAllLocalUnits(companyId)
    setLocalUnits(res);
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }, []);

  const handleDateChange = (newValue: any) => {
    setSelectedDay(newValue);
  }

  const RenderMoreButton = (e: any) => {
    const handleMoreClick = () => {
      navigate(`/app/companies/${e.row.companyId}/local-units/${e.row.id}`);
    };
    return (
      <IconButton
        onClick={handleMoreClick}
        size="small"
      >
        <OpenInNewOutlinedIcon/>
      </IconButton>
    );
  }

  const RenderDeleteButton = (e: any) => {
    const handleDeleteClick = async () => {
      setLoading(true);

    };
    return (
      <>
        <IconButton
          onClick={() => setOpenDeleteDialog(true)}
          size="small"
        >
          <DeleteIcon/>
        </IconButton>
        <DeleteDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          handleDelete={handleDeleteClick}
          title="Department"
        />
      </>
    );
  }

  const handleDoubleClick = (e: any) => {
    navigate(`/app/companies/${e.row.companyId}/local-units/${e.row.id}`);
  }

  const rows = localUnits.map((localUnit) => {
    return {
      id: localUnit.id,
      companyId: localUnit.companyId,
      name: localUnit.name,
      email: localUnit.email,
      phone: localUnit.phone,
      address: localUnit.address,
      postalCode: localUnit.postalCode,
      municipality: localUnit.municipality
    }
  })
  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'Id',
      width: 90,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'name',
      headerName: 'Nome',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Address',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'municipality',
      headerName: 'Municipality',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'postalCode',
      headerName: 'Postal code',
      minWidth: 150,
      editable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 150,
      editable: false,
    },
    {
      field: 'more',
      headerName: 'More',
      description: 'Details',
      align: 'center',
      renderCell: RenderMoreButton,
      width: 90,
      editable: false,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'edit',
      headerName: 'Edit',
      description: 'Edit, Delete',
      align: 'center',
      renderCell: RenderDeleteButton,
      width: 110,
      editable: false,
      sortable: false,
      headerAlign: 'center',
    }
  ];

  const handleRefresh = () => {
    setLoading(true)
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }

  return (
    <MainPage
      title="Timetables"
      //icon={<EventOutlinedIcon fontSize="large"/>}
      onRefresh={handleRefresh}
      updatedTime={updatedTime}>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}><Typography variant="h6" mx={2}>Close to due</Typography></Grid>
        <Grid item container spacing={2} xs={12}>
          {loading
            ? <>
              <Grid item xs={12} md={3}>
                <AddCard disabled/>
              </Grid>
              {[...Array(5)].map(() => (
                <Grid item xs={12} md={3}>

                  </Grid>
                )
              )}
            </>
            : <>
              <Grid item xs={12} md={3}>
                <AddCard/>
              </Grid>
              {[...Array(5)].map(() => (
                  <Grid item xs={12} md={3}>
                    <Card variant="outlined">
                      <CardActionArea sx={{
                        height: '100%',
                      }} onClick={() => {
                      }}>
                        <CardContent>
                          <Typography variant="h6" color="textSecondary" gutterBottom>
                            12/12/2020
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )
              )}
            </>
          }
        </Grid>
        <Grid item xs={12}><Typography variant="h6" mx={2}>All by day</Typography></Grid>
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={12} sm="auto">
            {isMobile
              ? <Card variant="outlined">
                <Box p={2}>
                  <MobileDatePicker
                    label="Select day"
                    value={selectedDay}
                    loading={loading}
                    onChange={() => {
                    }}
                    onAccept={handleDateChange}
                    renderInput={(params) => <TextField
                      fullWidth {...params}
                      variant="standard"
                      sx={{bgcolor: 'background.paper'}}
                    />}
                  />
                </Box>
              </Card>
              : <Card variant="outlined">
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  renderLoading={() => <CalendarPickerSkeleton/>}
                  openTo="day"
                  value={selectedDay}
                  loading={loading}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  /*renderDay={(day, _value, DayComponentProps) => {
                    return (
                      <Badge
                        key={day.toString()}
                        overlap="circular"
                        badgeContent="1"
                      >
                        <PickersDay {...DayComponentProps} />
                      </Badge>
                    );
                  }}*/
                />
              </Card>}
          </Grid>
          <Grid item container xs={12} sm direction="column" spacing={1}>
            {!isMobile
              && <Grid item mx={2}>
                <Typography variant="h6">
                  Of {getFormattedDate(selectedDay.toString())}
                </Typography>
              </Grid>
            }
            <Grid item xs>
              <Card variant="outlined" style={{height: isMobile ? "50vh" : "100%", width: "100%"}}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowId={(row) => row.id}
                  autoHeight={isMobile}
                  disableSelectionOnClick
                  density="compact"
                  loading={loading}
                  onRowDoubleClick={handleDoubleClick}
                  components={{
                    Toolbar: DatagridToolbar,
                    NoRowsOverlay: NoRowsOverlay,
                    ErrorOverlay: DatagridError,
                    LoadingOverlay: LoadingOverlay,
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainPage>
  );
}

export default TimetablesPage;