import React, {FC, useContext, useEffect, useState} from "react";
import {
  alpha,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grid,
  Grow,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  Zoom
} from "@mui/material";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import SortByAlphaOutlinedIcon from '@mui/icons-material/SortByAlphaOutlined';
import PhotoSizeSelectLargeOutlinedIcon from '@mui/icons-material/PhotoSizeSelectLargeOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from "@mui/icons-material/Add";
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import EmptyGridContent from "../../NoContentIcon/EmptyGridContent";
import {styled, useTheme} from "@mui/material/styles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DetailsSection from "../../DetailsSection/DetailsSection";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {FileTable} from "../FileTable/FileTable";
import {GridColumns} from "@mui/x-data-grid";
import {getFormattedDate} from "../../../utils/dateHandler";
import {
  createDocument,
  deleteDocument,
  Document,
  downloadFile,
  getDocumentById
} from "../../../services/documents.services";
import {useAlertContext} from "../../Providers/Alert/Alert.provider";
import FileCard from "../FileCard/FileCard";
import {LoadingButton} from "@mui/lab";
import {Id} from "../../../entities/entities";
import {humanFileSize} from "../../../utils/humanFileSize";
import {getFileIcon} from "../../../utils/getFileIcon";
import {getReasonAlert, getResponseAlert} from "../../../utils/requestAlertHandler";
import {useNavigate} from "react-router-dom";
import DeleteDialog from "../../DeleteDialog/DeleteDialog";

type SortType = 'name' | 'date' | 'size';
type ViewType = 'row' | 'grid';

const Input = styled('input')({
  display: 'none',
});

type FileContainerProps = {
  files: Document[]
  refId: Id,
  companyId: Id,
  moduleName: string,
  loading?: boolean,
  onSubmit?: () => void,
  onDeleted?: () => void,
}


const FileContainer: FC<FileContainerProps> = (
  {
    files,
    refId,
    companyId,
    loading,
    moduleName,
    onSubmit,
    onDeleted,
  }
) => {

  const theme = useTheme();
  const {setAlertEvent} = useContext(useAlertContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = React.useState<ViewType>('grid');
  const [sort, setSort] = React.useState<SortType>('name');
  const [selectedFile, setSelectedFile] = useState<Document>()
  const [fileToUpload, setFileToUpload] = useState([]);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const navigate = useNavigate();
  const [renderedFiles, setRenderedFiles] = useState(files);
  const [fileName, setFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [fileDescription, setFileDescription] = useState('');

  useEffect(() => {
    handleSort(null, "name")
  }, [])

  useEffect(() => {
    setRenderedFiles(files)
  }, [files])

  const handleClose = () => {
    setOpenAddDialog(false)
    setFileName('')
    setFileDescription('')
    setOpenUpdateDialog(false)
    handleDeleteBuffer()
  }

  const handleFileBuffer = (event) => {
    setFileToUpload([...event.target.files])
    setFileName(event.target.files[0].name)
  }

  const handleDownload = async () => {
    const _doc = await getDocumentById(selectedFile.id)
    await downloadFile(_doc.path, _doc.name)
  }

  const handleDeleteClick = () => {
    setFileLoading(true)
    deleteDocument(selectedFile.id)
      .then((res) => {
        setAlertEvent(getResponseAlert(res));
        setFileLoading(false)
        handleClose();
        setOpenDeleteDialog(false);
        onDeleted()
      })
      .catch((err) => {
          setAlertEvent(getReasonAlert(err));
        }
      )
  }

  const handleFileRename = () => {

  }

  const handleDeleteBuffer = () => {
    setFileToUpload([])
    setFileName('')
    setFileDescription('')
  }

  const handleUploadFile = (e: any) => {
    e.preventDefault();
    setFileLoading(true)

    const newDocument: Document = {
      name: fileName,
      description: fileDescription,
      companyId: companyId,
      refId: refId,
    }

    createDocument(newDocument, moduleName, fileToUpload[0])
      .then((res) => {
        setFileLoading(false)
        setOpenAddDialog(false)
        handleClose()
        onSubmit()
      })
      .catch((err) => {
        setFileLoading(false)
        setAlertEvent(getReasonAlert(err))
      })
  };

  const handleView = (event: any, newView: any) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleSort = (event: any, newSort: SortType) => {
    setSelectedFile(null)
    if (newSort !== null) {
      switch (newSort) {
        case 'name':
          setRenderedFiles(files.sort((a, b) => a.name.localeCompare(b.name)))
          break;
        case 'date':
          setRenderedFiles(files.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
          break;
        case 'size':
          setRenderedFiles(files.sort((a, b) => a.fileSize - b.fileSize))
          break;
        default:
          setRenderedFiles(files.sort((a, b) => a.name.localeCompare(b.name)))
      }
      setSort(newSort);
    }
  };

  const handleSelection = (file: Document) => {
    if (file === null) setSelectedFile(null)
    if (selectedFile === file) {
      setSelectedFile(null)
    } else (setSelectedFile(file))
  }

  const getRows = (files: Document[]) => {
    return files.map((file, index) => ({
      id: index,
      name: file?.name,
      date: file?.createdAt,
      type: file?.fileType,
      size: humanFileSize(file?.fileSize, true),
      description: file?.description,
    }))
  }

  const columns: GridColumns = [
    {
      field: 'file', headerName: 'File', width: 70, align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (e) => getFileIcon(e.row.type.split('/')[0], "small"),
      editable: false,
    },
    {
      field: 'name', headerName: 'Name', flex: 1, sortable: false,
      editable: false,
    },
    {
      field: 'date', headerName: 'Date', minWidth: 150, sortable: false,
      renderCell: (e) => getFormattedDate(e.row.date),
      editable: false,

    },
    {
      field: 'type', headerName: 'Type', flex: 0.3, sortable: false,
      editable: false, minWidth: 150
    },
    {
      field: 'size', headerName: 'Size', flex: 0.3, sortable: false, align: 'center', headerAlign: "center",
      editable: false,minWidth: 150
    },
    {
      field: 'description', headerName: 'Description', minWidth: 190, flex: 1, sortable: false,
      editable: false,
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{height: '100%',}}
    >
      <Box p={2}>
        <Grid container direction="column" spacing={2}>
          {loading
            ? <Grid item>
              <Skeleton variant="rectangular" animation="wave" sx={{borderRadius: '8px'}}>
                <Box sx={{height: '32px', width: '100%'}}/>
              </Skeleton>
            </Grid>
            : <Grid item container direction="row">
              <Grid item spacing={1} container xs>
                <Grid item>
                  <IconButton color="primary" onClick={() => setOpenAddDialog(true)}>
                    <AddIcon/>
                  </IconButton>
                </Grid>
                <Grid item>
                  <ToggleButtonGroup
                    value={view}
                    color="primary"
                    size="small"
                    exclusive
                    onChange={handleView}
                  >
                    <ToggleButton value="grid">
                      <Tooltip title="Vista griglia" TransitionComponent={Zoom} arrow>
                        <GridViewOutlinedIcon/>
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="row">
                      <Tooltip title="Vista lista" TransitionComponent={Zoom} arrow>
                        <ViewListOutlinedIcon/>
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item>
                  <ToggleButtonGroup
                    value={sort}
                    color="primary"
                    size="small"
                    exclusive
                    onChange={handleSort}
                  >
                    <ToggleButton value="name">
                      <Tooltip title="Ordina per nome" TransitionComponent={Zoom} arrow>
                        <SortByAlphaOutlinedIcon/>
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="date">
                      <Tooltip title="Ordina per data" TransitionComponent={Zoom} arrow>
                        <DateRangeOutlinedIcon/>
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="size">
                      <Tooltip title="Ordina per dimensione" TransitionComponent={Zoom} arrow>
                        <PhotoSizeSelectLargeOutlinedIcon/>
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
              <Grid item xs="auto">
                <Stack direction="row" spacing={1}>
                  <Zoom in={Boolean(selectedFile)}>
                    <IconButton onClick={() => {
                      setFileName(selectedFile.name)
                      setFileDescription(selectedFile?.description)
                      setOpenUpdateDialog(true)
                    }}>
                      <Tooltip title="Rinomina" TransitionComponent={Zoom} arrow>
                        <DriveFileRenameOutlineOutlinedIcon/>
                      </Tooltip>
                    </IconButton>
                  </Zoom>
                  <Zoom in={Boolean(selectedFile)}>
                    <IconButton onClick={() => setOpenInfoDialog(true)}>
                      <Tooltip title="Dettagli" TransitionComponent={Zoom} arrow>
                        <InfoOutlinedIcon/>
                      </Tooltip>
                    </IconButton>
                  </Zoom>
                  <Zoom in={Boolean(selectedFile)}>
                    <IconButton onClick={handleDownload}>
                      <Tooltip title="Download" TransitionComponent={Zoom} arrow>
                        <FileDownloadOutlinedIcon/>
                      </Tooltip>
                    </IconButton>
                  </Zoom>
                  <Zoom in={Boolean(selectedFile)}>
                    <IconButton onClick={()=>setOpenDeleteDialog(true)}>
                      <Tooltip title="Elimina" TransitionComponent={Zoom} arrow>
                        <DeleteForeverOutlinedIcon/>
                      </Tooltip>
                    </IconButton>
                  </Zoom>
                </Stack>
              </Grid>
            </Grid>
          }
          <Grid item container spacing={view === 'grid' ? 2 : 1}>
            {loading
              ? [...Array(4)].map(() => (<Grid item><FileCard loadingMode/></Grid>))
              : renderedFiles?.length
                ? view === 'grid'
                  ? <>
                    {renderedFiles.map((file, index) => (
                      <Grow in style={{transitionDelay: `${index * 25}ms`}}>
                        <Grid item>
                          <FileCard
                            file={file}
                            selected={selectedFile?.id === file?.id}
                            onClick={() => handleSelection(file)}
                          />
                        </Grid>
                      </Grow>
                    ))}
                  </>
                  : <>
                    <FileTable
                      loading={loading}
                      rows={getRows(renderedFiles)}
                      columns={columns}
                      onSelectionModelChange={(newRowSelectionModel) => {
                        if (newRowSelectionModel[0] == renderedFiles.indexOf(selectedFile)) return setSelectedFile(null)
                        setSelectedFile(renderedFiles[newRowSelectionModel[0]])
                      }}
                      selectionModel={[renderedFiles.indexOf(selectedFile)]}
                    />
                  </>
                : <Stack
                  p={2}
                  sx={{
                    width: '100%',
                  }}
                  justifyContent="center"
                  alignItems="center">
                  <EmptyGridContent/>
                </Stack>
            }
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Selected document: {selectedFile?.name}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={openAddDialog}
        onClose={handleClose}
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            boxShadow: 0,
            borderRadius: !isMobile && theme.spacing(4),
          }
        }}
        scroll="paper"
        TransitionComponent={Fade}
        fullScreen={isMobile}
      >
        {loading && <LinearProgress color="primary"/>}
        <DialogTitle>
          <Typography variant="h6">Upload new document</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box id="fileForm">
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  {fileToUpload.length
                    ? <Chip label={fileToUpload[0]?.name} onDelete={handleDeleteBuffer}/>
                    : <label htmlFor="contained-button-file">
                      <Input id="contained-button-file" onChange={handleFileBuffer} type="file"/>
                      <Button
                        component="span"
                        color="primary"
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.25),
                          },
                        }}
                      >
                        <Stack mx={1} spacing={1} justifyContent="center" alignItems="center" direction="row">
                          <AttachFileIcon fontSize="small"/>
                          <Typography variant="body2" color="primary">Choose file</Typography>
                        </Stack>
                      </Button>
                    </label>
                  }
                </Grid>
                <Grid item>
                  <TextField
                    id="name"
                    name="name"
                    fullWidth
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    label="Name"
                    placeholder="file name"
                    autoComplete="name"
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    fullWidth
                    multiline
                    placeholder="file description"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>
        <Box pr={2} pb={2}>
          <DialogActions>
            <Button color="inherit" onClick={handleClose}>
              <Box mx={2}>annulla</Box>
            </Button>
            <LoadingButton loading={fileLoading} onClick={handleUploadFile}>
              <Box mx={2}>
                Upload
              </Box>
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={openUpdateDialog}
        onClose={handleClose}
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            boxShadow: 0,
            borderRadius: !isMobile && theme.spacing(4),
          }
        }}
        scroll="paper"
        TransitionComponent={Fade}
        fullScreen={isMobile}
      >
        {loading && <LinearProgress color="primary"/>}
        <DialogTitle>
          <Typography variant="h6">Rename document</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box id="fileForm">
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <TextField
                    id="name"
                    name="name"
                    fullWidth
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    label="Name"
                    placeholder="file name"
                    autoComplete="name"
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    fullWidth
                    multiline
                    placeholder="file description"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>
        <Box pr={2} pb={2}>
          <DialogActions>
            <Button color="inherit" onClick={handleClose}>
              <Box mx={2}>cancel</Box>
            </Button>
            <LoadingButton color="primary" loading={fileLoading} onClick={handleFileRename}>
              <Box mx={2}>
                Save
              </Box>
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : theme.spacing(4),
            boxShadow: 0,
          }
        }}
        scroll="paper"
        TransitionComponent={Fade}
        fullScreen={isMobile}
      >
        {loading && <LinearProgress color="primary"/>}
        <DialogTitle>
          <Typography variant="h6">Info</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container spacing={2} alignItems="center" >
              <Grid item xs={12} pt={2} sm="auto">
                <FileCard loadingMode={loading} file={selectedFile} title="file"/>
              </Grid>
              <Grid item pt={0} xs={12} sm>
                <Box>
                  <DetailsSection
                    sectionTitle="Name"
                    fullWidth
                    sectionTextContent={selectedFile?.name}
                  />
                  <DetailsSection
                    sectionTitle="Type"
                    fullWidth
                    sectionTextContent={selectedFile?.fileType}
                  />
                  <DetailsSection
                    sectionTitle="Size"
                    fullWidth
                    sectionTextContent={humanFileSize(selectedFile?.fileSize, true) }
                  />
                  <DetailsSection
                    sectionTitle="Description"
                    fullWidth
                    sectionTextContent={selectedFile?.description}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <Box pr={2} pb={2}>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => setOpenInfoDialog(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        handleDelete={handleDeleteClick}
        loading={fileLoading}
        title="Document"
      />
    </Card>
  )
}


export default FileContainer;