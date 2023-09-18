import {alpha, Badge, Card, CardActionArea, CircularProgress, Grid, Skeleton, Stack, Typography} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import React, {FC} from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {styled} from '@mui/system';
import {Document} from "../../../services/documents.services";
import {FileType, getFileIcon} from "../../../utils/getFileIcon";

const SelectedBadge = styled(Badge)`
  & .MuiBadge-badge {
    padding: 0;
    color: #fff;
  }
`;

type FileCardProps = {
  onClick?: () => void,
  selected?: boolean,
  disabled?: boolean,
  title?: string,
  file?: Document,
  uploadingMode?: boolean,
  loadingMode?: boolean,
}

const FileCard: FC<FileCardProps> = (
  {
    onClick,
    disabled,
    selected,
    loadingMode,
    uploadingMode,
    title,
    file
  }
) => {

  const getTitle = () => {

  }

  return (
    <>
      {loadingMode
        ? <Skeleton variant="rectangular" animation="wave" sx={{borderRadius: '8px'}}>
          <Card
            sx={{
              height: '90px',
              width: '80px',
              borderRadius: '8px',
            }}
          />
        </Skeleton>
        : <Stack justifyContent="center" alignItems="center">
          <Card
            variant="outlined"
            sx={{
              height: '90px',
              width: '80px',
              borderRadius: '8px',
              bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.1) : "background.paper",
              borderColor: selected ? 'primary.main' : "",
            }}
          >
            <CardActionArea onClick={onClick} sx={{height: '100%', width: '100%'}}
                            disabled={disabled || uploadingMode}
            >
              <Stack
                justifyContent="center"
                alignItems="center"
              >
                {uploadingMode
                  ? <CircularProgress size={24}/>
                  : getFileIcon(file?.fileType.split('/')[0] as FileType, "large")
                }
              </Stack>
            </CardActionArea>
          </Card>
          <Typography
            textAlign={"center"}
            sx={{
              width: selected ? '80px' : '60px',
              zIndex: selected ? 1000 : 'default',
              wordWrap: 'break-word'
            }}
            variant="caption"
            color={selected ? "primary" : "default"}
          >
            {Boolean(title)
              ? title.length < 10
                ? title
                : selected
                  ? title
                  : title.substring(0, 7) + '...'
              : file?.name.length < 10
                ? file?.name
                : selected
                  ? file?.name
                  : file?.name.substring(0, 7) + '...'
            }
          </Typography>
        </Stack>
      }
    </>
  );
}

export default FileCard;