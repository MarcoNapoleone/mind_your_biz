import {DataGrid, GridColumns, GridRowsProp, GridSelectionModel} from "@mui/x-data-grid";
import {useTheme} from "@mui/material/styles";
import {Grid, useMediaQuery} from "@mui/material";
import React from "react";
import {styled} from "@mui/styles";
import {GridDensity} from "@mui/x-data-grid/models/gridDensity";
import NoRowsOverlay from "../../DatagridComponents/DatagridNoRow";
import DatagridError from "../../DatagridComponents/DatagridError";
import LoadingOverlay from "../../DatagridComponents/DatagridLoading";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
  borderRadius: '8px',
  '& .MuiDataGrid-columnsContainer': {
    borderTop: 0,
  },
}));

export function FileTable(
  props: {
    rows?: GridRowsProp,
    columns?: GridColumns,
    loading: boolean,
    error?: boolean,
    disableToolBar?: boolean,
    onAdd?: (state: boolean) => void,
    allowEdit?: boolean,
    density?: GridDensity,
    onRowDoubleClick?: (e: any) => void,
    onSelectionModelChange?: (e: GridSelectionModel) => void,
    selectionModel?: GridSelectionModel
  }
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <div style={{height: isMobile ? "auto" : "100%", width: "100%"}}>
          <StyledDataGrid
            rows={props.rows}
            columns={props.columns}
            getRowId={(row) => row.id}
            autoHeight
            sx={{
              '& .MuiDataGrid-footerContainer': {
                display: 'none'
              }
            }}
            {...props}
            onSelectionModelChange={props.onSelectionModelChange}
            selectionModel={props.selectionModel}
            density={"compact"}
            error={props.error ? true : null}
            loading={props.loading}
            rowsPerPageOptions={[]}
            disableDensitySelector
            onError={(e) => console.log(e)}
            onRowDoubleClick={props.onRowDoubleClick}
            components={{
              Toolbar: null,
              NoRowsOverlay: NoRowsOverlay,
              ErrorOverlay: DatagridError,
              LoadingOverlay: LoadingOverlay,
              Pagination: null,
            }}
            componentsProps={{
              toolbar: {onAdd: props.onAdd, allowAdd: props.allowEdit}
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
}

