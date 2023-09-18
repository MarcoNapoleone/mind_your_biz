import React, {useContext, useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {getFormattedDate, getUpdatedTime} from "../../../utils/dateHandler";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";

import {Box, Divider, Grid, Link, Skeleton, TextField, Typography} from "@mui/material";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import DetailsPage from "../../../Components/DetailsPage/DetailsPage";
import {DatePicker} from "@mui/x-date-pickers";
import DetailsSection from "../../../Components/DetailsSection/DetailsSection";
import {
  defaultEquipment,
  deleteEquipment,
  Equipment,
  getEquipment,
  updateEquipment
} from "../../../services/equipments.services";
import {defaultDepartment, getDepartment} from "../../../services/departments.services";

type PageParamsType = {
  equipmentId: string;
  companyId: string;
}

const EquipmentDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {companyId, equipmentId} = useParams<PageParamsType>();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState(defaultEquipment);
  const [department, setDepartment] = useState(defaultDepartment);
  const [purchaseDate, setPurchaseDate] = React.useState<Date | null>(null);
  const [firstTestDate, setFirstTestDate] = React.useState<Date | null>(null);
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
      href={`/app/companies/${companyId}/equipments`}
    >
      equipments
    </Link>,
    <Typography
      key="3" color="text.primary"
    >
      {loading
        ? <Skeleton animation="wave" width="30px"/>
        : equipment?.name?.charAt(0).toUpperCase() + equipment?.name?.slice(1)
      }
    </Typography>,
  ];

  const fetchData = async () => {
    const _equipment = await getEquipment(equipmentId)
    const _department = await getDepartment(_equipment.departmentId)
    setEquipment(_equipment);
    setDepartment(_department);
    setPurchaseDate(new Date(_equipment.purchaseDate));
    setFirstTestDate(new Date(_equipment.firstTestDate));
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
    deleteEquipment(equipmentId)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        setOpenDeleteDialog(false);
        navigate(`/app/companies/${companyId}/equipments`)
      })
      .catch((err) => {
          setAlertEvent(getReasonAlert(err));
        }
      )
  }

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newEquipment: Equipment = {
      name: data.get("name") as string,
      type: data.get("type") as string,
      brand: data.get("brand") as string,
      purchaseDate: purchaseDate,
      firstTestDate: firstTestDate,
      serialNumber: data.get("serialNumber") as string,
    }
    await updateEquipment(equipmentId, newEquipment)
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
      title={equipment?.name}
      loading={loading}
      updatedTime={updatedTime}
      breadcrumbs={breadcrumbs}
      allowModify={{edit: true, delete: true}}
      onDelete={handleDelete}
      onSubmit={handleSubmitEdit}
      onRefresh={handleRefresh}
      editChildren={
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              label="Name"
              defaultValue={equipment?.name}
              autoFocus
              autoComplete="name"
              fullWidth
              required
            />
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="type"
                name="type"
                label="Type"
                defaultValue={equipment?.type}
                autoComplete="type"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="brand"
                name="brand"
                label="Brand"
                defaultValue={equipment?.brand}
                autoComplete="brand"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="PurchaseDate"
                views={['year', 'month', 'day']}
                value={purchaseDate}
                onChange={(newValue) => {
                  setPurchaseDate(newValue);
                }}
                renderInput={(params) => <TextField
                  fullWidth
                  id="purchaseDate" name="purchaseDate"
                  {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="firstTestDate"
                views={['year', 'month', 'day']}
                value={firstTestDate}
                onChange={(newValue) => {
                  setFirstTestDate(newValue);
                }}
                renderInput={(params) => <TextField
                  fullWidth
                  id="firstTestDate" name="firstTestDate"
                  {...params} />}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="serialNumber"
              name="serialNumber"
              label="Serial Number"
              defaultValue={equipment?.serialNumber}
              autoFocus
              autoComplete="serialNumber"
              fullWidth
              required
            />
          </Grid>
        </Grid>
      }
      baseChildren={
        <Grid container direction="column" id="details" spacing={1}>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Type:" sectionTextContent={equipment?.type}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Brand:" sectionTextContent={equipment?.brand}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Purchase:" sectionTextContent={getFormattedDate(equipment?.purchaseDate)}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="First use:" sectionTextContent={getFormattedDate(equipment?.firstTestDate)}/>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <DetailsSection fullWidth sectionTitle="Serial number:" sectionTextContent={equipment?.serialNumber}/>
          </Grid>
          <Box py={2}>
            <Divider textAlign="left">
              <Typography variant="body2" color="text.secondary">
              Department
            </Typography>
            </Divider>
          </Box>
          <Grid item xs={12}>
            <DetailsSection
              sectionTitle="Name:"
              fullWidth
              chip
              sectionTextContent={department?.name}
              contentRedirect={`/app/companies/${companyId}/departments/${department?.id}`}
            />
          </Grid>
        </Grid>
      }
    >
    </DetailsPage>
  );
}
export default EquipmentDetailsPage;