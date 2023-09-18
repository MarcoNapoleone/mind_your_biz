import React from "react";
import {useTheme} from "@mui/material/styles";
import {CartesianGrid, Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis,} from "recharts";
import {alpha, Box, Card, Typography} from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import {DataGrid} from "@mui/x-data-grid";
import CustomGridToolbar from "../DatagridComponents/DatagridToolbar";
import NoRowsOverlay from "../DatagridComponents/DatagridNoRow";
import DatagridError from "../DatagridComponents/DatagridError";
import LoadingOverlay from "../DatagridComponents/DatagridLoading";

const getLineColor = (index: number, theme: any) => {
  /* switch (index) {
     case 0:
       return indigo['500'];
     case 1:
       return cyan['500'];
     case 2:
       return teal['500'];
     case 3:
       return deepPurple['500'];
     case 4:
       return deepOrange['500']
     case 5:
       return amber['500']
     case 6:
       return yellow['500'];
     default:
       return theme.palette.primary.main;
   }*/
  return theme.palette.primary.main;
}
const getLineDash = (index: number) => {
  switch (index % 3) {
    case 0:
      return "";
    case 1:
      return "";
    case 2:
      return "";
    default:
      return "";
  }
}

const DataChart = (
  props: {
    data: any,
    max?: number,
    keys: string[],
    loading: boolean,
    rows: any,
    columns: any,
  }
) => {
  const theme = useTheme();

  return (
    <Card variant="outlined">
      <Box height={350}>
        <AutoSizer>
          {({width, height}) =>
            <LineChart width={width} height={height} data={props.data} margin={{top: 8, bottom: 8}}>
              <XAxis dataKey="time" padding={{left: 30, right: 30,}}/>
              <YAxis/>
              <Tooltip/>
              <Legend verticalAlign="top" height={42}/>
              <ReferenceLine
                y={props.max}
                label={<Typography color="text.secondary">Max</Typography>}
                stroke={theme.palette.text.secondary}
                strokeLinecap="round"
                strokeDasharray="2 5"
              />
              <CartesianGrid
                stroke={alpha(theme.palette.text.disabled, 0.1)}
                strokeDasharray="2 5"
              />
              {props.keys.map((el, index) => (
                <Line
                  dataKey={props.keys[index]}
                  type="natural"
                  strokeLinecap="round"
                  dot={<></>}
                  stroke={getLineColor(index, theme)}
                  strokeDasharray={getLineDash(index)}
                  strokeWidth={3}
                />
              ))}
            </LineChart>}
        </AutoSizer>
      </Box>
      <div style={{height: "auto", width: "100%"}}>
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          getRowId={(row) => row.id}
          autoHeight
          pagination
          rowsPerPageOptions={[5]}
          error={null}
          disableSelectionOnClick
          loading={props.loading}
          disableColumnMenu
          components={{
            Toolbar: CustomGridToolbar,
            NoRowsOverlay: NoRowsOverlay,
            ErrorOverlay: DatagridError,
            LoadingOverlay: LoadingOverlay,
          }}
        />
      </div>
    </Card>
  );
}

export default DataChart;


