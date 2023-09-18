import {GridOverlay} from "@mui/x-data-grid";
import React from "react";
import {createStyles, makeStyles} from "@mui/styles";
import {createTheme} from "@mui/material/styles";
import EmptyGridContent from "../NoContentIcon/EmptyGridContent";
import {Stack} from "@mui/material";

const defaultTheme = createTheme();
const useStyles = makeStyles((theme) => createStyles({
  label: {
    marginTop: theme.spacing(1),
  },
}), {defaultTheme},);

function NoRowsOverlay() {
  const classes = useStyles();
  return (
    <GridOverlay>
      <Stack>
        <EmptyGridContent caption="No elements"/>
      </Stack>
    </GridOverlay>
  );
}

export default NoRowsOverlay;
