import React, {FC, useContext, useState} from "react";
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Typography,
  useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {DarkModeOutlined} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {StandardCSSProperties} from "@mui/system/styleFunctionSx/StandardCssProperties";
import {ThemeModeContext} from "../../../Components/Providers/Theme/Theme";
import PageFrame from "../../../Components/PageFrame/PageFrame";
import DetailsPage from "../../../Components/DetailsPage/DetailsPage";

export interface SelectedPalette {
  p: {
    color: number,
    gradient: number,
  },
  s: {
    color: number,
    gradient: number,
  }
}

const SettingsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {mode, setMode, palette, setPalette} = useContext(ThemeModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openPaletteMenu, setOpenPaletteMenu] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleThemeSwitch = () => {
    if (mode === 'light') {
      setMode('dark');
      localStorage.setItem("theme", JSON.stringify({mode: 'dark', palette: palette}))
    } else {
      setMode('light');
      localStorage.setItem("theme", JSON.stringify({mode: 'light', palette: palette}))
    }
  };

  return (
    <PageFrame>
      <DetailsPage
        title={"Settings"}
        loading={loading}
        allowModify={{edit: false, delete: false}}
        baseChildren={
          <List
            sx={{width: '100%', bgcolor: 'background.paper'}}
          >
            <ListItem>
              <ListItemIcon>
                <DarkModeOutlined/>
              </ListItemIcon>
              <ListItemText id="theme-switch" primary="Tema scuro"/>
              <Switch
                edge="end"
                onChange={handleThemeSwitch}
                checked={theme.palette.mode === 'dark'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PaletteOutlinedIcon/>
              </ListItemIcon>
              <ListItemText id="theme-switch" primary="Palette"/>
              <Stack direction="row" spacing={1}>
                <PaletteColorBox selected title="P" color={theme.palette.primary.main}/>
                <PaletteColorBox selected title="S" color={theme.palette.secondary.main}/>
              </Stack>
            </ListItem>
          </List>
        }
        anchors={[
          {title: 'Users', id: 'users'},
          {title: 'Roles', id: 'roles'},
          {title: 'Profile', id: 'profile'},
        ]}
      >
        <SettingCard
          title="Users"
          primary="Users management"
          secondary="Users, Roles, Auth, Modules, Password reset"
          icon={<GroupOutlinedIcon/>}
          onClick={() => navigate('/impostazioni/utenti')}
        />
        <SettingCard
          title="Roles"
          primary="Roles management"
          secondary="Roles, Auth, Modules"
          icon={<AdminPanelSettingsOutlinedIcon/>}
          onClick={() => navigate('/impostazioni/ruoli')}
        />
        <SettingCard
          title="Profile"
          primary="View and edit your profile"
          secondary="Name, email and password"
          icon={<AccountCircleOutlinedIcon/>}
          onClick={() => navigate('/account')}
        />
        <Dialog
          open={openPaletteMenu}
          onClose={() => {
          }}
          disableEscapeKeyDown
          scroll="paper"
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              boxShadow: 0,
              borderRadius: theme.spacing(4),
            }
          }}
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <Box px={!isMobile && 1} pt={!isMobile && 2}>

            </Box>
          </DialogContent>
          <Box pr={2} pb={2}>
            <DialogActions>
              <Button color="inherit" onClick={() => {
              }}>annulla</Button>
              <Button color="inherit" onClick={() => {
              }}>reset</Button>
              <Button
                color="primary"
                onClick={() => {
                }}
              >
                salva
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </DetailsPage>
    </PageFrame>
  );
}

type SettingCardType = {
  title: string,
  primary: string,
  secondary: string,
  icon: any,
  onClick: () => void,
}

const SettingCard: FC<SettingCardType> = (
  {
    title,
    primary,
    secondary,
    icon,
    onClick
  }
) => {
  return (
    <Grid container direction="column" id={title?.toLowerCase()} spacing={1} pt={2}>
      <Grid item>
        <Box px={2}>
          <Typography variant="h6">
            {title}
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Card variant="outlined">
          <CardActionArea onClick={onClick}>
            <Box px={2}>
              <List>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end">
                      <ArrowForwardIcon/>
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={primary}
                    secondary={secondary}
                  />
                </ListItem>
              </List>
            </Box>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
}


const PaletteColorBox = (
  props: {
    title: string | number,
    color: StandardCSSProperties['backgroundColor'],
    square?: boolean,
    selected?: boolean,
    onClick?: () => void,
  }
) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Avatar
      variant="square"
      onClick={props.onClick}
      sx={{
        width: isMobile ? '9vw' : '38px',
        height: isMobile ? '9vw' : '38px',
        bgcolor: props.color,
        transition: theme.transitions.create(['all', 'transform'], {
          duration: theme.transitions.duration.standard,
        }),
        border: `solid 1px ${theme.palette.background.default}`,
        borderRadius: props.selected ? theme.spacing(4) : 0,
        "&:hover": {
          borderRadius: props.selected ? theme.spacing(4) : '8px',
        }
      }}
    >
      <Typography variant="body1" sx={{
        fontWeight: 600,
        color: theme.palette.getContrastText(props.color as string),
      }}
      >{Boolean(props.title) && props.title}</Typography>
    </Avatar>
  )
}

export default SettingsPage;