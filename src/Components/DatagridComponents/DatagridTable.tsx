import {DataGrid, GridColumns, GridRowsProp} from "@mui/x-data-grid";
import CustomGridToolbar from "./DatagridToolbar";
import NoRowsOverlay from "./DatagridNoRow";
import LoadingOverlay from "./DatagridLoading";
import React from "react";
import DatagridError from "./DatagridError";
import {Card} from "@mui/material";

function DatagridTable(
  props: {
    rows?: GridRowsProp,
    columns?: GridColumns,
    loading: boolean,
    allowAdd?: boolean,
    onAdd?: () => void,
    error?: boolean,
    onRowDoubleClick?: (e: any) => void,
  }
) {
  return (
    <Card variant="outlined" style={{height: "auto", width: "100%"}}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        getRowId={(row) => row.id}
        disableColumnMenu
        autoHeight
        error={props.error ? true : null}
        disableSelectionOnClick
        loading={props.loading}
        onRowDoubleClick={props.onRowDoubleClick}
        components={{
          Toolbar: CustomGridToolbar,
          NoRowsOverlay: NoRowsOverlay,
          ErrorOverlay: DatagridError,
          LoadingOverlay: LoadingOverlay,
        }}
        componentsProps={{
          toolbar: {
            allowAdd: props.allowAdd,
            onAdd: props.onAdd
          }
        }}
      />
    </Card>);
}


export default DatagridTable;