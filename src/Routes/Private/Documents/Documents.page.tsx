import React, {useContext, useEffect, useState} from "react";
import {useAlertContext} from "../../../Components/Providers/Alert/Alert.provider";
import {IconButton, useMediaQuery} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MainPage from "../../../Components/MainPage/MainPage";
import {GridColumns} from "@mui/x-data-grid";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteDialog from "../../../Components/DeleteDialog/DeleteDialog";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {getReasonAlert} from "../../../utils/requestAlertHandler";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import {Document, getAllDocuments} from "../../../services/documents.services";
import FileContainer from "../../../Components/Files/FileContainer/FileContainer";
import {getUpdatedTime} from "../../../utils/dateHandler";
import {getModuleByName} from "../../../services/modules.services";

type PageParamsType = {
  companyId: string;
};

const DocumentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {companyId} = useParams<PageParamsType>();
  const {company} = useCurrentCompany();
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState(getUpdatedTime());
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {setAlertEvent} = useContext(useAlertContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const  [moduleName, setModuleName] = useState<string>("");

  const fetchData = async () => {
    const _documents = await getAllDocuments(companyId)
    const _module = await getModuleByName("companies")
    setModuleName(_module.name)
    setDocuments(_documents);
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

  return (
    <MainPage
      title="Documents"
      //icon={<DescriptionOutlinedIcon fontSize="large"/>}
      onRefresh={handleRefresh}
      updatedTime={updatedTime}>
      <FileContainer
        files={documents}
        onSubmit={handleRefresh}
        onDeleted={handleRefresh}
        loading={loading}
        moduleName={moduleName}
        refId={companyId}
        companyId={companyId}
      />
    </MainPage>
  );
}

export default DocumentsPage;