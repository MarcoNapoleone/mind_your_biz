import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {Grid, Link, Skeleton, TextField, Typography} from "@mui/material";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import DetailsPage from "../../../Components/DetailsPage/DetailsPage";
import {
  defaultProperty,
  deleteProperty,
  getProperty,
  Property,
  updateProperty
} from "../../../services/properties.services";
import {defaultLocalUnit} from "../../../services/localUnits.services";
import {getUpdatedTime} from "../../../utils/dateHandler";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import DetailsSection from "../../../Components/DetailsSection/DetailsSection";

type PageParamsType = {
  propertyId: string;
  companyId: string;
}
const PropertyDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {companyId, propertyId} = useParams<PageParamsType>();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(defaultProperty);
  const [localUnit, setLocalUnit] = useState(defaultLocalUnit);
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
      href={`/app/companies/${companyId}/properties`}
    >
      Properties
    </Link>,
    <Typography
      key="3" color="text.primary"
    >
      {loading
        ? <Skeleton animation="wave" width="30px"/>
        : property?.name?.charAt(0).toUpperCase() + property?.name?.slice(1)
      }
    </Typography>,
  ];

  const fetchData = async () => {
    const _property = await getProperty(propertyId)
    setProperty(_property);
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
    deleteProperty(propertyId)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        setOpenDeleteDialog(false);
        navigate(`/app/companies/${companyId}/properties`)
      })
      .catch((err) => {
          setAlertEvent(getReasonAlert(err));
        }
      )
  }

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newProperty: Property = {
      name: data.get("name") as string,
      address: data.get("address") as string,
      municipality: data.get("municipality") as string,
      province: data.get("province") as string,
      postalCode: data.get("postalCode") as string,
      country: data.get("country") as string,
    }
    await updateProperty(propertyId, newProperty)
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
      title={property.name}
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
              autoFocus
              defaultValue={property?.name}
              autoComplete="name"
              fullWidth
              required
            />
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="address"
                name="address"
                label="Address"
                defaultValue={property?.address}
                autoComplete="address"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="municipality"
                name="municipality"
                defaultValue={property?.municipality}
                label="Municipality"
                autoComplete="municipality"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="postalCode"
                defaultValue={property?.postalCode}
                name="postalCode"
                label="Postal code"
                autoComplete="postalCode"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="province"
                name="province"
                label="Province"
                defaultValue={property?.province}
                autoComplete="province"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="country"
                name="country"
                defaultValue={property?.country}
                label="Country"
                autoComplete="country"
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Grid>
      }
      baseChildren={
        <Grid container direction="column" id="details" spacing={1}>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Address:" sectionTextContent={property?.address}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Municipality:" sectionTextContent={property?.municipality}/>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Postal code:" sectionTextContent={property?.postalCode}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Province:" sectionTextContent={property?.province}/>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DetailsSection sectionTitle="Country:" sectionTextContent={property?.country}/>
            </Grid>
          </Grid>
        </Grid>
      }
    >
    </DetailsPage>
  );
}

export default PropertyDetailsPage;