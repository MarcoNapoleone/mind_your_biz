import * as React from "react";
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import {BusinessOutlined, GroupOutlined} from "@mui/icons-material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ApartmentIcon from '@mui/icons-material/Apartment';
import SensorsIcon from '@mui/icons-material/Sensors';

export const DrawerElements = [
  {index: 1, path: "local-units", icon: <BusinessOutlined color="inherit"/>, label: 'Local Units'},
  {index: 2, path: "departments", icon: <PersonPinCircleOutlinedIcon color="inherit"/>, label: 'Departments'},
  {index: 3, path: "hr", icon: <GroupOutlined color="inherit"/>, label: 'HR'},
  {index: 4, path: "properties", icon: <HomeWorkOutlinedIcon color="inherit"/>, label: 'Properties'},
  {index: 5, path: "vehicles", icon: <LocalShippingOutlinedIcon color="inherit"/>, label: 'Vehicles'},
  {index: 6, path: "equipments", icon: <ConstructionOutlinedIcon color="inherit"/>, label: 'Equipments'},
  {index: 7, path: "timetables", icon: <EventOutlinedIcon color="inherit"/>, label: 'Timetables'},
  {index: 8, path: "documents", icon: <DescriptionOutlinedIcon color="inherit"/>, label: 'Documents'},
  {index: 9, path: "pods", icon: <SensorsIcon color="inherit"/>, label: 'Pods'},
];
