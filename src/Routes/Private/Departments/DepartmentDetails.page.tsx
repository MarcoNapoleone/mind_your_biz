import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {
  Autocomplete,
  Box,
  Divider,
  Grid,
  IconButton,
  Link,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import DetailsPage from "../../../Components/DetailsPage/DetailsPage";
import {
  addHR,
  defaultDepartment,
  deleteDepartment,
  Department,
  getAllEquipments,
  getAllHR as departmentGetAllHR,
  getDepartment,
  removeHR,
  updateDepartment
} from "../../../services/departments.services";
import {getFormattedDate, getUpdatedTime} from "../../../utils/dateHandler";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import {GridColumns} from "@mui/x-data-grid";
import DatagridTable from "../../../Components/DatagridComponents/DatagridTable";
import {defaultHRs, getAllHR} from "../../../services/hr.services";
import {defaultEquipments} from "../../../services/equipments.services";
import {defaultLocalUnit, getLocalUnit} from "../../../services/localUnits.services";
import DetailsSection from "../../../Components/DetailsSection/DetailsSection";
import {DatePicker} from "@mui/x-date-pickers";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddDialog from "../../../Components/AddDialog/AddDialog";
import {ConfirmationContext} from "../../../Components/Providers/ConfirmDialog/ConfirmDialog.provider";

type PageParamsType = {
  departmentId: string;
  companyId: string;
}
const DepartmentDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {companyId, departmentId} = useParams<PageParamsType>();
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(true);
  const [department, setDepartment] = useState(defaultDepartment);
  const [localUnit, setLocalUnit] = useState(defaultLocalUnit);
  const [hrd, setHrd] = useState([]);
  const [hr, setHr] = useState(defaultHRs);
  const [openEquipmentAddDialog, setOpenEquipmentAddDialog] = useState(false);
  const [openHRAddDialog, setOpenHRAddDialog] = useState(false);
  const [openHRDeleteDialog, setOpenHRDeleteDialog] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedHR, setSelectedHR] = useState(null);
  const [equipments, setEquipments] = useState(defaultEquipments);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const {setAlertEvent} = useContext(useAlertContext);
  const {confirm} = useContext(ConfirmationContext);

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
      href={`/app/companies/${companyId}/departments`}
    >
      Departments
    </Link>,
    <Typography
      key="3" color="text.primary"
    >
      {loading
        ? <Skeleton animation="wave" width="30px"/>
        : department?.name?.charAt(0).toUpperCase() + department?.name?.slice(1)
      }
    </Typography>,
  ];

  const anchors = [
    {
      title: "HR",
      id: "hr"
    },
    {
      title: "Equipments",
      id: "equipments"
    }
  ]

  const fetchData = async () => {
    const _departments = await getDepartment(departmentId)
    const _hrd = await departmentGetAllHR(departmentId);
    const _equipments = await getAllEquipments(departmentId);
    const _localUnit = await getLocalUnit(_departments.localUnitId);
    setDepartment(_departments);
    setHrd(_hrd);
    setEquipments(_equipments);
    setLocalUnit(_localUnit);
  }

  const getHRs = async () => {
    const _hr = await getAllHR(companyId);
    setHr(_hr);
  }

  useEffect(() => {
    handleRefresh()
  }, []);

  const handleRefresh = () => {
    setLoading(true)
    setUpdatedTime(getUpdatedTime());
    setSelectedHR(null);
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }

  const handleDelete = () => {
    deleteDepartment(departmentId)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        setOpenHRDeleteDialog(false);
        navigate(`/app/companies/${companyId}/departments`)
      })
      .catch((err) => {
          setAlertEvent(getReasonAlert(err));
        }
      )
  }

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newDepartment: Department = {
      name: data.get("name") as string,
    }
    await updateDepartment(departmentId, newDepartment)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })
  };

  const handleAddHR = async () => {
    await addHR(departmentId, selectedHR.id,
      {
        startDate: startDate,
        endDate: endDate
      }
    )
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        setOpenHRAddDialog(false);
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })
  }

  const handleHRMoreInfoClick = (e: any) => {
    navigate(`/app/companies/${companyId}/hr/${e.row.id}`);
  };

  const RenderMoreButton = (e: any) => {
    return (
      <IconButton
        onClick={() => handleHRMoreInfoClick(e)}
        size="small"
      >
        <OpenInNewOutlinedIcon/>
      </IconButton>
    );
  }

  const RenderDeleteButton = (e: any) => {
    const handleHRDeleteClick = async () => {
      confirm({
          title: "Are you sure?",
          onConfirm: async () => {
            await removeHR(departmentId, e.row.id)
              .then((res) => {
                setAlertEvent(getResponseAlert(res));
                setOpenHRDeleteDialog(false);
                handleRefresh();
              })
              .catch((err) => {
                setAlertEvent(getReasonAlert(err));
              })
          },
        }
      );
    };

    return (
      <>
        <IconButton
          onClick={handleHRDeleteClick}
          size="small"
          disabled={e.row.endDate !== null}
        >
          <DeleteIcon/>
        </IconButton>
      </>
    );
  }

  const HRsRows = hrd.map((hrd) => {
    return {
      id: hrd.id,
      name: hrd.name,
      surname: hrd.surname,
      startDate: hrd?.startDate,
      endDate: hrd?.endDate,
      fiscalCode: hrd.fiscalCode,
      phone: hrd.phone,
      email: hrd.email,
      birthDate: hrd.birthDate,
      birthPlace: hrd.birthPlace,
      address: hrd.address,
      municipality: hrd.municipality,
      province: hrd.province,
      postalCode: hrd.postalCode,
      country: hrd.country,
    }
  })
  const HRsColumns: GridColumns = [
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
      field: 'startDate',
      headerName: 'Start Date',
      minWidth: 150,
      editable: false,
      renderCell: (e) => {
        return getFormattedDate(e.row.startDate)
      }
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      minWidth: 150,
      editable: false,
      renderCell: (e) => {
        return getFormattedDate(e.row.endDate)
      }
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
    /* {
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
  }*/
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
    <><DetailsPage
      title={department.name}
      loading={loading}
      updatedTime={updatedTime}
      breadcrumbs={breadcrumbs}
      allowModify={{edit: true, delete: true}}
      onDelete={handleDelete}
      onSubmit={handleSubmitEdit}
      onRefresh={handleRefresh}
      anchors={anchors}
      editChildren={
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              label="Name"
              autoFocus
              defaultValue={department?.name}
              autoComplete="name"
              fullWidth
              required
            />
          </Grid>
        </Grid>
      }
      baseChildren={
        <Grid container direction="column" id="details" spacing={1}>
          <Grid item xs={12} sm={6}>
            <Box py={2}>
              <Divider textAlign="left">
                <Typography variant="body2" color="text.secondary">
                  Local unit
                </Typography>
              </Divider>
            </Box>
            <DetailsSection
              sectionTitle="Name:"
              chip
              sectionTextContent={localUnit?.name}
              contentRedirect={`/app/companies/${companyId}/local-units/${localUnit?.id}`}
            />
          </Grid>
        </Grid>
      }
    >
      <Grid container direction="column" id="hr" spacing={1} pt={1}>
        <Grid item mx={2}>
          <Typography variant="h6">
            HR currently in the department
          </Typography>
        </Grid>
        <Grid item>
          {loading
            ? <Grid item container>
              {[...Array(3)].map(() => (
                <Grid item xs={12}>
                  <Skeleton animation="wave" width="100%" height="48px"/>
                </Grid>
              ))}
            </Grid>
            : <DatagridTable
              loading={loading}
              onAdd={() => setOpenHRAddDialog(true)}
              allowAdd
              onRowDoubleClick={handleHRMoreInfoClick}
              rows={HRsRows}
              columns={HRsColumns}
            />
          }
        </Grid>
      </Grid>
      <Grid container direction="column" id="equipments" spacing={1} pt={3}>
        <Grid item mx={2}>
          <Typography variant="h6">
            Equipments
          </Typography>
        </Grid>
        <Grid item>
          {loading
            ? <Grid item container>
              {[...Array(3)].map(() => (
                <Grid item xs={12}>
                  <Skeleton animation="wave" width="100%" height="48px"/>
                </Grid>
              ))}
            </Grid>
            : <DatagridTable
              loading={loading}
              onAdd={() => {
              }}
              rows={[]}
              columns={[]}
            />
          }
        </Grid>
      </Grid>
    </DetailsPage>
      <AddDialog
        title={"Add HR to department"}
        handleSubmit={handleAddHR}
        open={openHRAddDialog}
        setOpen={setOpenHRAddDialog}
      >
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Autocomplete
                id="hr"
                loading={selectLoading}
                multiple={false}
                value={selectedHR}
                onOpen={getHRs}
                onChange={(event: any, newValue: any) => {
                  setSelectedHR(newValue);
                }}
                options={hr.filter((hr) => !hrd.some((hrInDepartment) => hrInDepartment.id === hr.id))}
                getOptionLabel={(option) => option?.name + " " + option?.surname + " (" + option?.fiscalCode + ")"}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="HR"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                views={['year', 'month', 'day']}
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField
                  fullWidth
                  id="startDate" name="startDate"
                  {...params} />}
              />
            </Grid>
            {/*<Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                views={['year', 'month', 'day']}
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField
                  fullWidth
                  id="endDate" name="endDate"
                  {...params} />}
              />
            </Grid>*/}
          </Grid>
        </Grid>
      </AddDialog>
    </>
  );
}

export default DepartmentDetailsPage;


