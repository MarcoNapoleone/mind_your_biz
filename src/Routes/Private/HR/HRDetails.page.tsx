import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {Box, Divider, Grid, Link, Skeleton, TextField, Typography} from "@mui/material";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import DetailsPage from "../../../Components/DetailsPage/DetailsPage";
import {defaultHR, deleteHR, getHR, HR, updateHR} from "../../../services/hr.services";
import {getFormattedDate, getUpdatedTime} from "../../../utils/dateHandler";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import DetailsSection from "../../../Components/DetailsSection/DetailsSection";
import DialogFormLabel from "../../../Components/DialogFormLabel/DialoFormLabel";
import {DatePicker} from "@mui/x-date-pickers";

type PageParamsType = {
  hrId: string;
  companyId: string;
}

const HRDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {companyId, hrId} = useParams<PageParamsType>();
  const [loading, setLoading] = useState(true);
  const [hr, setHR] = useState(defaultHR);
  const [birthDate, setBirthDate] = React.useState<Date | null>(null);
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
      href={`/app/companies/${companyId}/hr`}
    >
      HR
    </Link>,
    <Typography
      key="3" color="text.primary"
    >
      {loading
        ? <Skeleton animation="wave" width="30px"/>
        : hr?.name?.charAt(0).toUpperCase() + hr?.name?.slice(1)
        + ' ' + hr?.surname?.charAt(0).toUpperCase() + hr?.surname?.slice(1)
      }
    </Typography>,
  ];

  const fetchData = async () => {
    const _hr = await getHR(hrId)
    setHR(_hr);
    setBirthDate(new Date(_hr.birthDate));
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
    deleteHR(hrId)
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

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newHR: HR = {
      name: data.get("name") as string,
      surname: data.get("surname") as string,
      birthDate: birthDate,
      birthPlace: data.get("birthPlace") as string,
      address: data.get("address") as string,
      municipality: data.get("municipality") as string,
      province: data.get("province") as string,
      postalCode: data.get("postalCode") as string,
      country: data.get("country") as string,
      fiscalCode: data.get("fiscalCode") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string
    }
    await updateHR(hrId, newHR)
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
      title={hr.name + ' ' + hr.surname}
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
                defaultValue={hr?.name}
                autoFocus
                autoComplete="name"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="surname"
                name="surname"
                label="Surname"
                defaultValue={hr?.surname}
                autoComplete="surname"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="fiscalCode"
              name="fiscalCode"
              label="Fiscal Code"
              autoComplete="fiscalCode"
              defaultValue={hr?.fiscalCode}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <DialogFormLabel title="Info"/>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Birth Date"
                views={['year', 'month', 'day']}
                value={birthDate}
                onChange={(newValue) => {
                  setBirthDate(newValue);
                }}
                renderInput={(params) => <TextField
                  fullWidth
                  id="birthdate" name="birthdate"
                  {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="birthPlace"
                name="birthPlace"
                label="Birth Place"
                defaultValue={hr?.birthPlace}
                autoComplete="birthPlace"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="address"
                name="address"
                label="Address"
                defaultValue={hr?.address}
                autoComplete="address"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="municipality"
                name="municipality"
                defaultValue={hr?.municipality}
                label="Municipality"
                autoComplete="municipality"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="postalCode"
                name="postalCode"
                defaultValue={hr?.postalCode}
                label="Postal code"
                autoComplete="postalCode"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="province"
                name="province"
                label="Province"
                defaultValue={hr?.province}
                autoComplete="province"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item>
            <DialogFormLabel title="Contacts"/>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="phone"
                name="phone"
                label="Phone"
                defaultValue={hr?.phone}
                autoComplete="phone"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Email"
                autoComplete="email"
                defaultValue={hr?.email}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Grid>
      }
      baseChildren={
        <Grid container direction="column" id="details" spacing={1}>
          <Grid item xs={12}>
            <DetailsSection fullWidth sectionTitle="Fiscal Code:" sectionTextContent={hr?.fiscalCode}/>
          </Grid>
          <Box py={2}>
            <Divider textAlign="left"><Typography variant="body2" color="text?.secondary">Info</Typography></Divider>
          </Box>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Birth Date:" sectionTextContent={getFormattedDate(hr?.birthDate)}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Birth Place:" sectionTextContent={hr?.birthPlace}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Address:" sectionTextContent={hr?.address}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Municipality:" sectionTextContent={hr?.municipality}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Postal Code:" sectionTextContent={hr?.postalCode}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Province:" sectionTextContent={hr?.province}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Country:" sectionTextContent={hr?.country}/>
            </Grid>
          </Grid>
          <Box py={2}>
            <Divider textAlign="left"><Typography variant="body2"
                                                  color="text?.secondary">Contacts</Typography></Divider>
          </Box>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Phone:" sectionTextContent={hr?.phone}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Email:" sectionTextContent={hr?.email}/>
            </Grid>
          </Grid>
        </Grid>
      }
    >
    </DetailsPage>
  );
}

export default HRDetailsPage;