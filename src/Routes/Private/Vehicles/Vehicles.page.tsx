import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {
  Autocomplete,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  useMediaQuery
} from "@mui/material";
import AddDialog from "../../../Components/AddDialog/AddDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MainPage from "../../../Components/MainPage/MainPage";
import {GridColumns} from "@mui/x-data-grid";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteDialog from "../../../Components/DeleteDialog/DeleteDialog";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import DatagridTable from "../../../Components/DatagridComponents/DatagridTable";
import {
  createVehicle,
  defaultVehicles,
  deleteVehicle,
  getAllVehicles,
  Vehicle
} from "../../../services/vehicles.services";
import {DatePicker} from "@mui/x-date-pickers";
import {getUpdatedTime} from "../../../utils/dateHandler";
import {defaultLocalUnits, getAllLocalUnits, LocalUnit} from "../../../services/localUnits.services";
import LoadingPlaceholder from "../../../Components/LoadingPlaceholder/LoadingPlaceholder";

type PageParamsType = {
  companyId: string;
  vehicleId: string;
};

const VehiclesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId, vehicleId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [registrationDate, setRegistrationDate] = React.useState<Date | null>(null);
  const [vehicles, setVehicles] = useState(defaultVehicles);
  const [localUnits, setLocalUnits]: [LocalUnit[], (posts: LocalUnit[]) => void] = useState(defaultLocalUnits);
  const [selectedLocalUnit, setSelectedLocalUnit]: [LocalUnit, (posts: LocalUnit) => void] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {setAlertEvent} = useContext(useAlertContext);

  const fetchData = async () => {
    const res = await getAllVehicles(companyId)
    setVehicles(res);
  }

  const getCategories = async () => {
    setCategories(["Automobile", "Autocarro", "Muletto"]);
    setSelectLoading(false);
  }

  const handleRefresh = () => {
    setLoading(true)
    setUpdatedTime(getUpdatedTime());
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }

  useEffect(() => {
    handleRefresh();
  }, []);

  const getLocalUnits = async () => {
    setSelectLoading(true)
    const res = await getAllLocalUnits(companyId)
    setLocalUnits(res)
    setSelectLoading(false)
  }

  const handleMoreInfoClick = (e) => {
    navigate(`/app/companies/${companyId}/vehicles/${e.row.id}`);
  };

  const RenderMoreButton = (e: any) => {
    return (
      <IconButton
        onClick={() => handleMoreInfoClick(e)}
        size="small"
      >
        <OpenInNewOutlinedIcon/>
      </IconButton>
    );
  }

  const RenderDeleteButton = (e: any) => {
    const handleDeleteClick = async () => {
      setLoading(true);
      await deleteVehicle(e.row.id)
        .then((res) => {
          setAlertEvent(getResponseAlert(res));
          setOpenDeleteDialog(false);
          handleRefresh();
        })
        .catch((err) => {
          setAlertEvent(getReasonAlert(err));
        })
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

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newVehicle: Vehicle = {
      name: data.get("name") as string,
      localUnitId: selectedLocalUnit.id,
      brand: data.get("brand") as string,
      model: data.get("model") as string,
      licensePlate: data.get("licensePlate") as string,
      serialNumber: data.get("serialNumber") as string,
      registrationDate: registrationDate,
      category: data.get("category") as string,
      owner: data.get("owner") as string,
    }
    await createVehicle(companyId, newVehicle)
      .then((res) => {
        setOpenAddDialog(false);
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })

  };

  const rows = vehicles.map((vehicle) => {
    return {
      id: vehicle.id,
      hrId: vehicle.hrId,
      localUnitId: vehicle.localUnitId,
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      serialNumber: vehicle.serialNumber,
      registrationDate: vehicle.registrationDate,
      category: vehicle.category,
      owner: vehicle.owner,
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
      field: 'hrId',
      headerName: 'HrId',
      width: 90,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'localUnitId',
      headerName: 'Local Unit Id',
      width: 90,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'model',
      headerName: 'Model',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'licensePlate',
      headerName: 'License Plate',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'serialNumber',
      headerName: 'Serial Number',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'registrationDate',
      headerName: 'Registration Date',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 120,
      align: 'center',
      editable: false,
      headerAlign: 'center',
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

  return (
    <MainPage
      title="Vehicles"
      onRefresh={handleRefresh}
      updatedTime={updatedTime}>
      <DatagridTable
        rows={rows}
        allowAdd
        onAdd={() => setOpenAddDialog(true)}
        columns={columns}
        loading={loading}
        onRowDoubleClick={handleMoreInfoClick}
      />
      <AddDialog
        title={"Add vehicle"}
        handleSubmit={handleSubmitCreate}
        open={openAddDialog}
        setOpen={setOpenAddDialog}
      >
        <Grid container direction="column" spacing={1}>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
            <TextField
              id="name"
              name="name"
              label="Name"
              autoFocus
              autoComplete="name"
              fullWidth
              required
            />
          </Grid>
            <Grid item xs={12} sm={6} >
              <TextField
                id="owner"
                name="owner"
                label="Owner"
                autoComplete="owner"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="brand"
                name="brand"
                label="Brand"
                autoComplete="brand"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="model"
                name="model"
                label="Model"
                autoComplete="model"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="licensePlate"
                name="licensePlate"
                label="License Plate"
                autoComplete="licensePlate"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="serialNumber"
                name="serialNumber"
                label="Serial Number"
                autoComplete="serialNumber"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Registration Date"
                views={['year', 'month', 'day']}
                value={registrationDate}
                onChange={(newValue) => {
                  setRegistrationDate(newValue);
                }}
                renderInput={(params) => <TextField
                  fullWidth
                  id="registrationDate"
                  name="registrationDate"
                  {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="topSize">Category</InputLabel>
                <Select
                  id="category"
                  name="category"
                  label="Category"
                  value={selectedCategory}
                  onOpen={getCategories}
                  onChange={handleChangeCategory}
                  defaultValue=""
                >
                  {selectLoading
                    ? <LoadingPlaceholder/>
                    : categories.map((el) => (
                      <MenuItem value={el}>
                        {el}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="localUnits"
              loading={selectLoading}
              multiple={false}
              value={selectedLocalUnit}
              onOpen={getLocalUnits}
              onChange={(event: any, newValue: any) => {
                setSelectedLocalUnit(newValue);
              }}
              options={localUnits}
              getOptionLabel={(option) => option?.name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Local unit"
                />
              )}
            />
          </Grid>
        </Grid>
      </AddDialog>
    </MainPage>
  );
}

export default VehiclesPage;