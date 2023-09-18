import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {Grid, IconButton, TextField, useMediaQuery} from "@mui/material";
import DatagridTable from "../../../Components/DatagridComponents/DatagridTable";
import AddDialog from "../../../Components/AddDialog/AddDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MainPage from "../../../Components/MainPage/MainPage";
import {GridColumns} from "@mui/x-data-grid";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import {createHR, defaultHRs, deleteHR, getAllHR, HR} from "../../../services/hr.services";
import DialogFormLabel from "../../../Components/DialogFormLabel/DialoFormLabel";
import {DatePicker} from "@mui/x-date-pickers";
import {getUpdatedTime} from "../../../utils/dateHandler";
import {useConfirmation} from "../../../Components/Providers/ConfirmDialog/ConfirmDialog.provider";


type PageParamsType = {
  companyId: string;
};

const HRPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [birthDate, setBirthDate] = React.useState<Date | null>(null);
  const [hr, setHR] = useState(defaultHRs);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const {confirm} = useConfirmation();
  const {setAlertEvent} = useContext(useAlertContext);

  const fetchData = async () => {
    const res = await getAllHR(companyId)
    setHR(res);
  }

  useEffect(() => {
    handleRefresh();
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

  const handleMoreInfoClick = (e: any) => {
    navigate(`/app/companies/${companyId}/hr/${e.row.id}`);
  };
  const RenderMoreButton = (e: any) => {

    return (
      <IconButton
        onClick={() => handleMoreInfoClick(e)}

      >
        <OpenInNewOutlinedIcon/>
      </IconButton>
    );
  }

  const RenderDeleteButton = (e: any) => {
    const handleDeleteClick = async () => {
      setLoading(true);
      confirm(
        {
          title: "Delete HR",
          onConfirm: async () => {
            await deleteHR(e.row.id)
              .then((res) => {
                setAlertEvent(getResponseAlert(res));
                handleRefresh();
              })
              .catch((err) => {
                setAlertEvent(getReasonAlert(err));
              })
          }
        }
      )
    };
    return (

      <IconButton
        onClick={handleDeleteClick}
      >
        <DeleteIcon/>
      </IconButton>
    );
  }

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newHR: HR = {
      name: data.get('name') as string,
      surname: data.get('surname') as string,
      fiscalCode: data.get('fiscalCode') as string,
      phone: data.get('phone') as string,
      email: data.get('email') as string,
      birthDate: birthDate,
      birthPlace: data.get('birthPlace') as string,
      address: data.get('address') as string,
      municipality: data.get('municipality') as string,
      province: data.get('province') as string,
      postalCode: data.get('postalCode') as string,
      country: data.get('country') as string
    };
    await createHR(companyId, newHR)
      .then((res) => {
        setOpenAddDialog(false);
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })
  };

  const rows = hr.map((hr) => {
    return {
      id: hr.id,
      name: hr.name,
      surname: hr.surname,
      fiscalCode: hr.fiscalCode,
      phone: hr.phone,
      email: hr.email,
      birthDate: hr.birthDate,
      birthPlace: hr.birthPlace,
      address: hr.address,
      municipality: hr.municipality,
      province: hr.province,
      postalCode: hr.postalCode,
      country: hr.country,
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
      headerName: 'Name',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'surname',
      headerName: 'Surname',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'fiscalCode',
      headerName: 'Fiscal Code',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
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
      field: 'birthDate',
      headerName: 'Birth Date',
      minWidth: 150,
      editable: false,
      flex: 1,
    },
    {
      field: 'birthPlace',
      headerName: 'Birth Place',
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
      field: 'province',
      headerName: 'Province',
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
      title="HR"
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
        title={"Add HR"}
        open={openAddDialog}
        setOpen={setOpenAddDialog}
        handleSubmit={handleSubmitCreate}
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
            <Grid item xs={12} sm={6}>
              <TextField
                id="surname"
                name="surname"
                label="Surname"
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
                autoComplete="address"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="municipality"
                name="municipality"
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

export default HRPage;