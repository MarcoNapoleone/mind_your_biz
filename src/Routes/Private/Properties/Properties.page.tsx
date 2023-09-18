import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {Grid, IconButton, useMediaQuery} from "@mui/material";
import DatagridTable from "../../../Components/DatagridComponents/DatagridTable";
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
import {
  createProperty,
  defaultProperties,
  deleteProperty,
  getAllProperties,
  Property
} from "../../../services/properties.services";
import {getUpdatedTime} from "../../../utils/dateHandler";
import TextField from "@mui/material/TextField";


type PageParamsType = {
  companyId: string;
};

const PropertiesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [properties, setProperties] = useState(defaultProperties);
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {setAlertEvent} = useContext(useAlertContext);

  const fetchData = async () => {
    const res = await getAllProperties(companyId)
    setProperties(res);
  }

  const handleMoreInfoClick = (e: any) => {
    navigate(`/app/companies/${e.row.companyId}/properties/${e.row.id}`);
  };

  useEffect(() => {
    setLoading(true)
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }, []);

  const handleRefresh = () => {
    setLoading(true)
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }

  const RenderMoreButton = (e: any) => {
    return (
      <IconButton
        onClick={()=>handleMoreInfoClick(e)}
        size="small"
      >
        <OpenInNewOutlinedIcon/>
      </IconButton>
    );
  }

  const RenderDeleteButton = (e: any) => {
    const handleDeleteClick = async () => {
      setLoading(true);
      await deleteProperty(e.row.id)
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
          title="Property"
        />
      </>
    );
  }

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newProperty: Property = {
      name: data.get("name") as string,
      address: data.get("address") as string,
      municipality: data.get("municipality") as string,
      postalCode: data.get("postalCode") as string,
      province: data.get("province") as string,
      country: data.get("country") as string,
    }
    await createProperty(companyId, newProperty)
      .then((res) => {
        setOpenAddDialog(false);
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })

  };

  const rows = properties.map((property) => {
    return {
      id: property.id,
      companyId: property.companyId,
      name: property.name,
      address: property.address,
      municipality: property.municipality,
      postalCode: property.postalCode,
      province: property.province,
      country: property.country,
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
      headerName: 'Postal Code',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'province',
      headerName: 'Province',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'country',
      headerName: 'Country',
      minWidth: 150,
      editable: false,
      flex: 1,
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
      title="Properties"
      onRefresh={handleRefresh}
      updatedTime={updatedTime}>
      <DatagridTable
        allowAdd
        onAdd={() => setOpenAddDialog(true)}
        rows={rows}
        columns={columns}
        loading={loading}
        onRowDoubleClick={handleMoreInfoClick}
      />
      <AddDialog
        open={openAddDialog}
        setOpen={setOpenAddDialog}
        title={"Add property"}
        handleSubmit={handleSubmitCreate}
      >
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
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
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="address"
                name="address"
                label="Address"
                autoComplete="address"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="municipality"
                name="municipality"
                label="Municipality"
                autoComplete="municipality"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="postalCode"
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
                autoComplete="province"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="country"
                name="country"
                label="Country"
                autoComplete="country"
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Grid>
      </AddDialog>
    </MainPage>
  );
}

export default PropertiesPage;