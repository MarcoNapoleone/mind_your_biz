import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {Grid, IconButton, TextField, useMediaQuery} from "@mui/material";
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
import {
  createLocalUnit,
  defaultLocalUnits,
  deleteLocalUnit,
  getAllLocalUnits,
  LocalUnit
} from "../../../services/localUnits.services";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import DialogFormLabel from "../../../Components/DialogFormLabel/DialoFormLabel";
import {getUpdatedTime} from "../../../utils/dateHandler";


type PageParamsType = {
  companyId: string;
};

const LocalUnitsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [localUnits, setLocalUnits] = useState(defaultLocalUnits);
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {setAlertEvent} = useContext(useAlertContext);

  const fetchData = async () => {
    const res = await getAllLocalUnits(companyId)
    setLocalUnits(res);
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

  const handleMoreInfoClick = (e: any) => {
    navigate(`/app/companies/${e.row.companyId}/local-units/${e.row.id}`);
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
      await deleteLocalUnit(e.row.id)
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
          title="Local unit"
        />
      </>
    );
  }

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newLocalUnit: LocalUnit = {
      name: data.get("name") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      address: data.get("address") as string,
      municipality: data.get("municipality") as string,
      postalCode: data.get("postalCode") as string,
    }
    await createLocalUnit(companyId, newLocalUnit)
      .then((res) => {
        setOpenAddDialog(false);
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })

  };

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

  return (
    <MainPage
      title="Local Units"
      onRefresh={handleRefresh}
      updatedTime={updatedTime}
    >
      <DatagridTable
        rows={rows}
        allowAdd
        onAdd={() => setOpenAddDialog(true)}
        columns={columns}
        loading={loading}
        onRowDoubleClick={handleMoreInfoClick}
      />
      <AddDialog
        title={"Add local unit"}
        handleSubmit={handleSubmitCreate}
        loading={loading}
        open={openAddDialog}
        setOpen={setOpenAddDialog}
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
          <Grid item>
            <DialogFormLabel title="Contacts"/>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Email"
                autoComplete="email"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="phone"
                name="phone"
                label="Phone"
                autoComplete="phone"
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

export default LocalUnitsPage;