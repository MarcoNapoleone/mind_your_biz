import React, {useContext, useEffect, useState} from "react";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import DetailsPage from "../../../Components/DetailsPage/DetailsPage";
import {getFormattedDate, getUpdatedTime} from "../../../utils/dateHandler";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import {DatePicker} from "@mui/x-date-pickers";
import DetailsSection from "../../../Components/DetailsSection/DetailsSection";
import {defaultVehicle, deleteVehicle, getVehicle, updateVehicle, Vehicle} from "../../../services/vehicles.services";
import LoadingPlaceholder from "../../../Components/LoadingPlaceholder/LoadingPlaceholder";
import {defaultLocalUnit, getLocalUnit} from "../../../services/localUnits.services";

type PageParamsType = {
  vehicleId: string;
  companyId: string;
}

const VehicleDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {companyId, vehicleId} = useParams<PageParamsType>();
  const [loading, setLoading] = useState(true);
  const [registrationDate, setRegistrationDate] = React.useState<Date | null>(null);
  const [vehicle, setVehicle] = useState(defaultVehicle);
  const [localUnit, setLocalUnit] = useState(defaultLocalUnit);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectLoading, setSelectLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const {setAlertEvent} = useContext(useAlertContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href={`/app/companies/${companyId}`}
    >
      App
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href={`/app/companies/${companyId}/vehicles`}
    >
      Vehicles
    </Link>,
    <Typography
      key="3" color="text.primary"
    >
      {loading
        ? <Skeleton animation="wave" width="30px"/>
        : vehicle?.name?.charAt(0).toUpperCase() + vehicle?.name?.slice(1)
      }
    </Typography>,
  ];

  const fetchData = async () => {
    const _vehicle = await getVehicle(vehicleId)
    const _localUnit = await getLocalUnit(_vehicle.localUnitId);
    setVehicle(_vehicle);
    setLocalUnit(_localUnit);
    setRegistrationDate(new Date(_vehicle.registrationDate));
  }

  const getCategories = async () => {
    setCategories(["Automobile", "Autocarro", "Muletto"]);
    setSelectLoading(false);
  }

  useEffect(() => {
    handleRefresh()
  }, []);

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

  const handleDelete = () => {
    deleteVehicle(vehicleId)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        setOpenDeleteDialog(false);
        navigate(`/app/companies/${companyId}/hr`)
      })
      .catch((err) => {
          setAlertEvent(getReasonAlert(err));
        }
      )
  }

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newVehicle: Vehicle = {
      name: data.get('name') as string,
      brand: data.get('brand') as string,
      model: data.get('model') as string,
      serialNumber: data.get('serialNumber') as string,
      licensePlate: data.get('licensePlate') as string,
      category: selectedCategory,
      registrationDate: registrationDate,
      owner: data.get('owner') as string,
    }
    await updateVehicle(vehicleId, newVehicle)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })
  };

  return (
    <DetailsPage
      title={vehicle?.name}
      loading={loading}
      updatedTime={updatedTime}
      breadcrumbs={breadcrumbs}
      allowModify={{edit: true, delete: true}}
      onDelete={handleDelete}
      onSubmit={handleSubmitEdit}
      onRefresh={handleRefresh}
      editChildren={
        <Grid container direction="column" spacing={1}>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="name"
                name="name"
                label="Name"
                autoFocus
                defaultValue={vehicle?.name}
                autoComplete="name"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="owner"
                name="owner"
                label="Owner"
                defaultValue={vehicle?.owner}
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
                defaultValue={vehicle?.brand}
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
                defaultValue={vehicle?.model}
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
                defaultValue={vehicle?.licensePlate}
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
                defaultValue={vehicle?.serialNumber}
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
        </Grid>
      }
      baseChildren={
        <Grid container direction="column" id="details" spacing={1}>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Name:" sectionTextContent={vehicle.name}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Owner:" sectionTextContent={vehicle.owner}/>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Brand:" sectionTextContent={vehicle.brand}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Model:" sectionTextContent={vehicle.model}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="License Plate:" sectionTextContent={vehicle.licensePlate}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Serial Number:" sectionTextContent={vehicle.serialNumber}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Registration Date:"
                              sectionTextContent={getFormattedDate(vehicle.registrationDate)}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Category:" sectionTextContent={vehicle.category}/>
            </Grid>
          </Grid>
          <Box py={2}>
            <Divider textAlign="left">
              <Typography variant="body2" color="text.secondary">
              Local unit
            </Typography>
            </Divider>
          </Box>
          <Grid item xs={12}>
            <DetailsSection
              sectionTitle="Name:"
              fullWidth
              chip
              sectionTextContent={localUnit?.name}
              contentRedirect={`/app/companies/${companyId}/local-units/${localUnit?.id}`}
            />
          </Grid>
        </Grid>
      }
    >
    </DetailsPage>
  );
}
export default VehicleDetailsPage;