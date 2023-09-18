import {alpha, Badge, Card, CardActionArea, Grid, Skeleton, Typography} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {Document} from "../../../services/documents.services";
import React, {FC} from "react";
import {styled} from '@mui/system';

const SelectedBadge = styled(Badge)`
  & .MuiBadge-badge {
    padding: 0;
    color: #fff;
  }
`;

type FileRowProps = {
  onClick?: () => void,
  selected?: boolean,
  disabled?: boolean,
  loadingMode?: boolean,
  title?: string,
  file?: Document,
}

const FileRow: FC<FileRowProps> = (
  {
    onClick,
    disabled,
    selected,
    loadingMode,
    title,
    file
  }
) => {

  return (
    <>
      {loadingMode
        ? <Skeleton variant="rectangular" animation="wave" sx={{borderRadius: '8px'}}>
          <Card sx={{borderRadius: '8px'}}/>
        </Skeleton>
        : <Card
          variant="outlined"
          onClick={onClick}
          sx={{
            height: '40px',
            maxWidth: '600px',
            borderRadius: '8px',
            bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.1) : "background.paper",
            borderColor: selected ? 'primary.main' : "",
          }}
        >
          <CardActionArea
            sx={{height: '100%', width: '100%'}}
            disabled={disabled}
          >
            <Grid container spacing={2} px={2} py={1} justifyContent="flex-start" alignItems="flex-start">
              <Grid item>
                <InsertDriveFileOutlinedIcon fontSize="small" color="primary"/>
              </Grid>
              <Grid item>
                <Typography>
                  {Boolean(title)
                    ? title
                    : file?.name
                  }
                </Typography>
              </Grid>
            </Grid>
          </CardActionArea>
        </Card>
      }
    </>
  );
}

export default FileRow;