import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {Autocomplete, Grid, IconButton, TextField, useMediaQuery} from "@mui/material";
import AddDialog from "../../../Components/AddDialog/AddDialog";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MainPage from "../../../Components/MainPage/MainPage";
import {GridColumns} from "@mui/x-data-grid";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import {
  createEquipment,
  defaultEquipments,
  deleteEquipment,
  Equipment,
  getAllEquipments
} from "../../../services/equipments.services";
import DatagridTable from "../../../Components/DatagridComponents/DatagridTable";
import {getFormattedDate, getUpdatedTime} from "../../../utils/dateHandler";
import {DatePicker} from "@mui/x-date-pickers";
import {defaultDepartments, Department, getAllDepartments} from "../../../services/departments.services";
import {useConfirmation} from "../../../Components/Providers/ConfirmDialog/ConfirmDialog.provider";


type PageParamsType = {
  companyId: string;
};

const EquipmentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [equipments, setEquipments] = useState(defaultEquipments);
  const [departments, setDepartments]: [Department[], (posts: Department[]) => void] = useState(defaultDepartments);
  const [selectedDepartment, setSelectedDepartment]: [Department, (posts: Department) => void] = useState(null);
  const [purchaseDate, setPurchaseDate] = React.useState<Date | null>(null);
  const [firstTestDate, setFirstTestDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectLoading, setSelectLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const {setAlertEvent} = useContext(useAlertContext);
  const {confirm} = useConfirmation();

  const fetchData = async () => {
    const _equipments = await getAllEquipments(companyId)
    setEquipments(_equipments);
  }

  useEffect(() => {
    handleRefresh();
  }, []);

  const getDepartments = async () => {
    setSelectLoading(true)
    const _departments = await getAllDepartments(companyId)
    setDepartments(_departments);
    setSelectLoading(false)
  }

  const handleMoreInfoClick = (e: any) => {
    navigate(`/app/companies/${companyId}/equipments/${e.row.id}`);
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
      confirm({
          title: "Are you sure you want to delete this equipment?",
          onConfirm: async () => {
            await deleteEquipment(e.row.id)
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
        size="small"
      >
        <DeleteIcon/>
      </IconButton>
    );
  }

  const rows = equipments.map((equipment) => {
    return {
      id: equipment.id,
      departmentId: equipment.departmentId,
      name: equipment.name,
      type: equipment.type,
      brand: equipment.brand,
      serialNumber: equipment.serialNumber,
      purchaseDate: equipment.purchaseDate,
      firstTestDate: equipment.firstTestDate,
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
      width: 180,
      editable: false,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 180,
      editable: false,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 180,
      editable: false,
    },
    {
      field: 'purchaseDate',
      headerName: 'Purchase Date',
      width: 180,
      editable: false,
      renderCell: (e) => {
        return getFormattedDate(e.row.purchaseDate)
      },
    },
    {
      field: 'firstTestDate',
      headerName: 'First Test Date',
      width: 180,
      editable: false,
      renderCell: (e) => {
        return getFormattedDate(e.row.firstTestDate)
      },
    },
    {
      field: 'serialNumber',
      headerName: 'Serial Number',
      flex: 1,
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
    setUpdatedTime(getUpdatedTime());
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }

  const handleSubmitCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newEquipment: Equipment = {
      name: data.get("name") as string,
      departmentId: selectedDepartment?.id,
      type: data.get("type") as string,
      brand: data.get("brand") as string,
      purchaseDate: purchaseDate,
      firstTestDate: firstTestDate,
      serialNumber: data.get("serialNumber") as string,
    }
    await createEquipment(companyId, newEquipment)
      .then((res) => {
        setOpenAddDialog(false);
        handleRefresh();
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
      })
  };

  return (
    <MainPage
      title="Equipments"
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
        title={"Add Equipment"}
        handleSubmit={handleSubmitCreate}
        open={openAddDialog}
        setOpen={setOpenAddDialog}
      >
        <Grid container direction="column" spacing={1}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  id="type"
                  name="type"
                  label="Type"
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
                autoFocus
                autoComplete="serialNumber"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="department"
                loading={selectLoading}
                multiple={false}
                value={selectedDepartment}
                onOpen={getDepartments}
                onChange={(event: any, newValue: any) => {
                  setSelectedDepartment(newValue);
                }}
                options={departments}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </AddDialog>
    </MainPage>
  );
}

export default EquipmentsPage;