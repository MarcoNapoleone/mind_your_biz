import React, {useEffect, useState} from 'react';
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Divider,
  Grid,
  Grow,
  ListItemIcon,
  ListItemText,
  Menu,
  useMediaQuery,
  Zoom
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useAlert} from "../../../Components/Providers/Alert/Alert.provider";
import {getReasonAlert} from "../../../utils/requestAlertHandler";
import AddCard from "../../../Components/AddCard/AddCard";
import CompanyCard from "../../../Components/CompanyCard/CompanyCard";
import {defaultCompanies, getAllCompanies} from "../../../services/companies.services";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import {AccountCircleOutlined, Logout} from "@mui/icons-material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../Components/Providers/Authorization/Authorization.provider";
import {useCurrentCompany} from "../../../Components/Providers/Company/Company.provider";
import {Id} from "../../../entities/entities";
import {deleteCookie, setCookie} from "../../../services/connectors/cookies";
import MainPage from "../../../Components/MainPage/MainPage";

function CompaniesPage() {

  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState(defaultCompanies);
  const {company, setCompany} = useCurrentCompany();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {setAlertEvent} = useAlert();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorElUser);
  const navigate = useNavigate();
  const {loggedUser, setLoggedUser} = useAuth();

  const fetchData = async () => {
    const res = await getAllCompanies()
    setCompanies(res);
  }

  const handleRefresh = async () => {
    setLoading(true)
    fetchData()
      .then(() => setLoading(false))
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      })
  }

  useEffect(() => {
    handleRefresh()
  }, []);

  const handleClick = async (id: Id) => {
    const company = companies.find(c => c.id === id);
    setCompany(company);
    await setCookie('company', JSON.stringify(company), 1)
    navigate(`/app/companies/${id}`)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = async () => {
    deleteCookie("token")
    setLoggedUser(null)
    navigate("/login")
  }

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        py={1} px={2}
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          borderBottom: theme.palette.mode === 'light' ? '#f0f0f0' : '#303030',
          bgcolor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(40px)',
          zIndex: theme => theme.zIndex.appBar,
        }}
      >
        <Grid item xs={12} container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <IconButton sx={{borderRadius: '16px'}} disableRipple>
              <Logo/>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton sx={{borderRadius: '16px'}} disableRipple>
              <Badge variant="dot" overlap="rectangular" color="secondary">
                <Avatar variant="rounded" sx={{borderRadius: '8px'}} onClick={handleOpenUserMenu}
                        alt="User profile picture"
                        src="https://mui.com/static/images/avatar/1.jpg"/>
              </Badge>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{
        py: 10,
        px: 1,
      }}>
        <MainPage
          title="Your companies"
          disableBreadcrumbs
          loading={loading}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} container spacing={2}>
              {loading
                ? <>
                  <Grid item xs={12} md={4}>
                    <AddCard disabled/>
                  </Grid>
                  {[...Array(5)].map((el, index) => (
                      <Grow in style={{transitionDelay: `50ms`}}>
                        <Grid key={index.toString()} item xs={12} md={4}>
                          <CompanyCard isLoading/>
                        </Grid>
                      </Grow>
                    )
                  )}
                </>
                : <>
                  <Grow in style={{transitionDelay: `50ms`}}>
                    <Grid item xs={12} md={4}>
                      <AddCard onClick={() => {
                      }}/>
                    </Grid>
                  </Grow>
                  {companies.map((el, index) => (
                    <Grow key={index.toString()} in style={{transitionDelay: `${index * 50}ms`}}>
                      <Grid item xs={12} md={4}>
                        <CompanyCard company={el} onClick={() => handleClick(el.id)}/>
                      </Grid>
                    </Grow>
                  ))}
                </>
              }
            </Grid>
          </Grid>
          <Menu
            anchorEl={anchorElUser}
            open={openUserMenu}
            onClose={handleCloseUserMenu}
            TransitionComponent={Zoom}
            transformOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          >
            <MenuItem key={1} onClick={() => navigate('/Account')}>
              <ListItemIcon>
                <AccountCircleOutlined
                  fontSize="small"/>
              </ListItemIcon>
              <ListItemText>{loggedUser?.name + ' ' + loggedUser?.surname}</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <NotificationsOutlinedIcon/>
              </ListItemIcon>
              <ListItemText>Notifiche</ListItemText>
            </MenuItem>
            <Divider/>
            <MenuItem key={3} onClick={logout}>
              <ListItemIcon>
                <Logout fontSize="small"/>
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </MainPage>
      </Box>
    </>
  );
}


const Logo = () => {
  return (
    <svg style={{marginTop: '7px'}} width="50" height="50" viewBox='0 0 177 100' fill='none'
         xmlns='http://www.w3.org/2000/svg'>
      <circle cx='72' cy='50' r='30' fill='#68DBFF'/>
      <ellipse cx='104.647' cy='50' rx='29.7059' ry='30' fill='#FF7917'/>
      <path fill-rule='evenodd' clip-rule='evenodd'
            d='M88.4039 75.1221C96.5911 69.7652 102 60.5143 102 50C102 39.4858 96.5911 30.2348 88.4039 24.878C80.2971 30.2348 74.9412 39.4858 74.9412 50C74.9412 60.5143 80.2971 69.7652 88.4039 75.1221Z'
            fill='#5D2C02'/>
    </svg>
  );
}

export default CompaniesPage;

