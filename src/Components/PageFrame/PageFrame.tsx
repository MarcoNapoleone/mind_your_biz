import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {CSSObject, styled, Theme, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TopBar from "../TopBar/TopBar";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {Drawer, ListItemButton, ListSubheader, Stack, SwipeableDrawer, useMediaQuery,} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined} from "@mui/icons-material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ThemeModeContext} from "../Providers/Theme/Theme";
import {DrawerElements} from "../DrawerItems/DrawerItems";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {useCurrentCompany} from "../Providers/Company/Company.provider";


const drawerWidth = 256;

type PageParamsType = {
  companyId: string;
};

interface PageFrameProps {
  children?: React.ReactNode,
  title?: string,
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '&::-webkit-scrollbar': {width: 0},
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {display: 'none'},
  width: `calc(${theme.spacing(8)} - 2px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 2px)`,
  },
});

const ResponsiveDrawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
  ({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {},
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const PageFrame: React.FC<PageFrameProps> = ({children, title}) => {
  const theme = useTheme();
  const {mode, setMode, palette} = useContext(ThemeModeContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"))
  const [open, setOpen] = React.useState(Boolean(isLargeScreen));
  const location = useLocation();
  const {company, setCompany} = useCurrentCompany();
  const {companyId} = useParams<PageParamsType>();
  const [nestedListToggle, setNestedListToggle] = useState(true)
  const pagePath = location.pathname.split('/')[4];
  const isCompanyBasePath = location.pathname.split('/')[4] === 'companies' && pagePath === undefined;

  const handlePageSelection = (pagePath: string) => {
    navigate(`/app/companies/${company.id}/${pagePath}`)
    handleDrawerClose();
  }

  const handleDrawerToggle = () => {
    setOpen(!open)
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleThemeSwitch = () => {
    if (mode === 'light') {
      setMode('dark');
      localStorage.setItem("theme", JSON.stringify({mode: 'dark', palette: palette}))
    } else {
      setMode('light');
      localStorage.setItem("theme", JSON.stringify({mode: 'light', palette: palette}))
    }
  };
  const handleNestedListToggle = (event: any) => {
    const element = document.getElementById("drawer-content-id");
    if (open) {
      setNestedListToggle(!nestedListToggle)
    } else {
      setOpen(true)
      element.scrollTo(0, element.scrollHeight);
      setNestedListToggle(true)
    }
  };

  const DrawerContent = () => {

    return (
      <Box px={1} pb={2} sx={{height: '100%'}} id="drawer-content-id">
        <Stack direction="column" sx={{height: '100%'}} spacing={1} justifyContent="space-between">
          <div>
            <List>
              <Box py={1}>
                <ListItemButton
                  key={0}
                  sx={{height: '48px', width: '48px'}}
                  onClick={handleDrawerToggle}
                  disabled={isLargeScreen}
                >
                  <ListItemIcon>
                    <MenuOutlinedIcon
                      sx={{
                        transition: 'transform 0.3s ease-out',
                        transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                      }}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </Box>
              <ListItemButton
                key={1}
                onClick={() => navigate(`/app/companies/${company?.id}`)}
                selected={isCompanyBasePath}
              >
                <ListItemIcon sx={{color: isCompanyBasePath ? 'primary.main' : ''}}>
                  <HomeOutlinedIcon color="inherit"/>
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    color: isCompanyBasePath ? 'primary' : '',
                    fontWeight: isCompanyBasePath ? 'bold' : '',
                  }}
                  primary="Company"
                />
              </ListItemButton>
            </List>
            <List
              component="nav"
              subheader={<ListSubheader component="div">{open || isLargeScreen ? 'Categories' : ''}</ListSubheader>}
            >
              {DrawerElements.map((el) => (
                <ListItemButton
                  onClick={() => handlePageSelection(el.path)} key={el.index + 2}
                  selected={el.path === pagePath}
                >
                  <ListItemIcon sx={{color: el.path === pagePath ? 'primary.main' : ''}}>
                    {el.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={el.label}
                    primaryTypographyProps={{
                      color: el.path === pagePath ? 'primary' : '',
                      fontWeight: el.path === pagePath ? 'bold' : '',
                    }}
                  />
                </ListItemButton>
              ))}
              {/*<ListItemButton
            onClick={(event) => handleNestedListToggle(event)}
            key={1}
            sx={{height: isMobile ? '48px' : '57px', py: '8px'}}
            selected={location.pathname === 'app/pod'}
          >
            <ListItemIcon>
              <SensorsIcon sx={{color: location.pathname === '/home' ? 'primary.main' : ''}}/>
            </ListItemIcon>
            <ListItemText primary="Pod"/>
            <ExpandLess sx={{
              transform: !nestedListToggle ? 'rotate(180deg)' : 'none',
              transition: theme.transitions.create('all', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.standard,
              }),
            }}/>
          </ListItemButton>
          <Collapse in={nestedListToggle && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Box pb={1}>
              <ListItemButton sx={{pl: 4}} onClick={() => navigate('/app/pod')}>
                <ListItemText primary="Sala macchine"/>
              </ListItemButton>
              </Box>
              <Box pb={1}>
              <ListItemButton sx={{pl: 4}} onClick={() => navigate('/app/pod')}>
                <ListItemText primary="Ventola Nord"/>
              </ListItemButton>
              </Box>
              <Box pb={1}>
              <ListItemButton sx={{pl: 4}} onClick={() => navigate('/app/pod')}>
                <ListItemText primary="Ventola Sud"/>
              </ListItemButton>
              </Box>
            </List>
          </Collapse>*/}
            </List>
          </div>
          <List
            subheader={<ListSubheader component="div">App</ListSubheader>}
            component="nav"
          >
            <ListItemButton
              onClick={() => navigate('/app/settings')}
              key={2}
              selected={location.pathname === '/app/settings'}
            >
              <ListItemIcon>
                <SettingsOutlinedIcon sx={{color: location.pathname === '/app/settings' ? 'primary.main' : ''}}/>
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  color: location.pathname === '/app/settings' ? 'primary' : '',
                  fontWeight: location.pathname === '/app/settings' ? 'bold' : '',
                }}
              />
            </ListItemButton>
            <ListItemButton
              onClick={handleThemeSwitch}
              key={3}
            >
              <ListItemIcon>
                {theme.palette.mode === 'dark'
                  ? <LightModeOutlined/>
                  : <DarkModeOutlined/>
                }
              </ListItemIcon>
              <ListItemText
                primary={theme.palette.mode === 'dark'
                  ? "Light theme"
                  : "dark theme"
                }
              />
            </ListItemButton
            >
          </List>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{display: 'flex',}}>
      <CssBaseline/>
      {isMobile
        ? <SwipeableDrawer
          open={open}
          elevation={0}
          onClose={handleDrawerClose}
          onOpen={handleDrawerOpen}
          disableDiscovery
          disableSwipeToOpen
          ModalProps={{
            BackdropProps: {
              sx: {}
            }
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <DrawerContent/>
        </SwipeableDrawer>
        : isLargeScreen
          ? <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <DrawerContent/>
          </Drawer>
          : <ResponsiveDrawer variant="permanent" open={open}>
            <DrawerContent/>
          </ResponsiveDrawer>
      }
      <Box component="main" sx={{flexGrow: 1}}>
        <TopBar isOpen={open} title={title} onMenuClick={handleDrawerToggle}/>
        <Box pt={6} pb={isMobile && 8} mb={4}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default PageFrame;