import React, {useEffect, useState} from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useAlert} from "../../../Components/Providers/Alert/Alert.provider";
import {podServicePath} from "../../../services/connectors/axios";
import DetailsSection from "../../../Components/DetailsSection/DetailsSection";
import {getReasonAlert} from "../../../utils/requestAlertHandler";
import DataChart from "../../../Components/Chart/DataChart";
import {getFormattedDate, getFormattedMonth, getFormattedTime, getUpdatedTime} from "../../../utils/dateHandler";
import {ArrowForward} from "@mui/icons-material";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TextField from "@mui/material/TextField";
import {MonthPicker, StaticDatePicker, StaticTimePicker} from '@mui/x-date-pickers';
import MainPage from '../../../Components/MainPage/MainPage';

const sampleData = {
  "device": {
    "id": "25555",
    "mac": "0xc49deda439d5",
    "ip": "192.168.1.12",
    "name": "Ventola Sud"
  },
  "data": [
    {
      "info": {
        "sensore": "Tempertaura",
        "keys": ["temp0", "temp1"],
        "um": "°C",
        "max": 30
      },
      "now": {
        "value": 24.0,
        "time": "2022-06-24 10:00:00"
      },
      "rilevazioni": [
        {
          "temp0": 20.9,
          "temp1": 24.9,
          "time": "2022-06-24 08:00:00"
        },
        {
          "temp0": 16.9,
          "temp1": 28.9,
          "time": "2022-06-24 09:00:00"
        },
        {
          "temp0": 21.4,
          "temp1": 29.1,
          "time": "2022-06-24 10:00:00"
        },
        {
          "temp0": 21.4,
          "temp1": 29.1,
          "time": "2022-06-24 10:00:00"
        },
        {
          "temp0": 21.4,
          "temp1": 29.1,
          "time": "2022-06-24 10:00:00"
        },
        {
          "temp0": 21.4,
          "temp1": 29.1,
          "time": "2022-06-24 10:00:00"
        }
      ]
    },
    {
      "info": {
        "sensore": "Umidità",
        "keys": ["hum"],
        "um": "%",
        "max": 75
      },
      "now": {
        "value": 78.9,
        "time": "2022-06-24 10:00:00"
      },
      "rilevazioni": [
        {
          "hum": 72.1,
          "time": "2022-06-24 08:00:00"
        },
        {
          "hum": 75.3,
          "time": "2022-06-24 09:00:00"
        },
        {
          "hum": 78.9,
          "time": "2022-06-24 10:00:00"
        }
      ]
    }
  ]
}

function PodsPage() {

  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [updatedTime, setUpdatedTime] = useState("00:00");
  const [device, setDevice] = useState<any>({})
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {setAlertEvent} = useAlert();
  const [startTime, setStartTime] = useState<Date | null | number>(new Date().setHours(0, 0, 0, 0));
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [startDay, setStartDay] = useState<Date | null | number>(new Date().setDate(new Date().getDate() - 1));
  const [endDay, setEndDay] = useState<Date | null>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [timeView, setTimeView] = React.useState('day');
  const [openStartTimeDialog, setOpenStartTimeDialog] = useState(false)
  const [openEndTimeDialog, setOpenEndTimeDialog] = useState(false)
  const [openStartDateDialog, setOpenStartDateDialog] = useState(false)
  const [openEndDateDialog, setOpenEndDateDialog] = useState(false)
  const [openMonthDialog, setOpenMonthDialog] = useState(false)
  const [openDayDialog, setOpenDayDialog] = useState(false)


  const handleChange = (event: SelectChangeEvent) => {
    setTimeView(event.target.value as string);
  };

  useEffect(() => {
    podServicePath
      .get('/getgraph.php')
      .then(res => {
        setDevice(res.data)
        let dt = new Date();
        setUpdatedTime(getUpdatedTime());
        setLoading(false)
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      });
  }, []);

  const getRows = (keys: Array<string>, data: Array<any>, um: string) => {
    let rows: Array<any> = [];
    data.forEach((el, index) => {
      const row = {
        id: index,
        n: index + 1,
      }
      for (const key of keys) {
        row[`${key}`] = el[`${key}`] + ' ' + um
      }
      row["time"] = getFormattedTime(new Date(el["time"]))
      rows.push(row)
    })
    return rows
  }

  const getColumns = (keys: Array<string>) => {
    let columns: Array<any> = [
      {
        field: 'n',
        headerName: 'n°',
        width: 90,
        align: 'center',
        editable: false,
        headerAlign: 'center',
      },
      {
        field: 'time',
        headerName: 'Tempo',
        description: 'Tempo alla rilevazione',
        minWidth: 150,
        flex: 0.5,
        editable: false,
      },
    ]
    for (const key of keys) {
      columns.push(
        {
          field: key,
          headerName: key,
          minWidth: 150,
          align: 'center',
          flex: 1 / keys?.length,
          editable: false,
          headerAlign: 'center',
        }
      )
    }
    return columns
  }

  const handleRefresh = () => {
    setLoading(true)
    podServicePath
      .get('/getgraph.php')
      .then(res => {
        setDevice(res.data)
        let dt = new Date();
        setUpdatedTime(getUpdatedTime());
        setLoading(false)
      })
      .catch((err) => {
        setAlertEvent(getReasonAlert(err));
        setLoading(false)
      });
  }

  return (
    <MainPage
      title="Pods"
      //icon={<SensorsIcon fontSize="large"/>}
      onRefresh={handleRefresh}
      updatedTime={updatedTime}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <Stack spacing={1} p={2}>
              <FormControl>
                <InputLabel id="timeView-label">Filtro</InputLabel>
                <Select
                  labelId="timeView-select-label"
                  id="timeView-select"
                  defaultValue="day"
                  autoWidth
                  value={timeView}
                  size="small"
                  label="Filtro"
                  onChange={handleChange}
                >
                  <MenuItem value="day">Giorno</MenuItem>
                  <MenuItem value="month">Mese</MenuItem>
                  <MenuItem value="timeFrame">Seleziona periodo</MenuItem>
                </Select>
              </FormControl>
              <Box>
                {timeView === "day"
                  ? <Grow in>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={<TodayOutlinedIcon/>}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.text.secondary, 0.10),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                          },
                        }}
                        onClick={() => setOpenDayDialog(true)}
                        label={getFormattedDate(selectedDay)}
                      />
                      <Dialog
                        open={openDayDialog}
                        onClose={() => setOpenDayDialog(false)}
                        disableEscapeKeyDown
                        BackdropProps={{
                          sx: {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                          }
                        }}
                        PaperProps={{
                          sx: {
                            boxShadow: 0,
                            borderRadius: theme.spacing(4),
                          }
                        }}
                        scroll="paper"
                        TransitionComponent={Fade}
                      >
                        {loading && <LinearProgress color="primary"/>}
                        <DialogContent>
                          <DialogContentText>
                            <StaticDatePicker
                              displayStaticWrapperAs="desktop"
                              value={selectedDay}
                              onChange={(newValue) => {
                                setSelectedDay(newValue);
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </DialogContentText>
                        </DialogContent>
                        <Box pr={2} pb={2}>
                          <DialogActions>
                            <Button
                              color="primary"
                              onClick={() => setOpenDayDialog(false)}
                            >
                              <Box mx={2}>
                                Chiudi
                              </Box>
                            </Button>
                          </DialogActions>
                        </Box>
                      </Dialog>
                      <Stack direction="row" alignItems="center">
                        <Chip
                          icon={<AccessTimeOutlinedIcon/>}
                          size="small"
                          onClick={() => setOpenStartTimeDialog(true)}
                          sx={{
                            backgroundColor: alpha(theme.palette.text.secondary, 0.10),
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                            },
                          }}
                          label={getFormattedTime(startTime)}
                        />
                        <Dialog
                          open={openStartTimeDialog}
                          onClose={() => setOpenStartTimeDialog(false)}
                          disableEscapeKeyDown
                          BackdropProps={{
                            sx: {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }
                          }}
                          PaperProps={{
                            sx: {
                              boxShadow: 0,
                              borderRadius: theme.spacing(4),
                            }
                          }}
                          scroll="paper"
                          TransitionComponent={Fade}
                        >
                          {loading && <LinearProgress color="primary"/>}
                          <DialogContent>
                            <DialogContentText>
                              <StaticTimePicker
                                displayStaticWrapperAs="mobile"
                                value={startTime}
                                onChange={(newValue) => {
                                  setStartTime(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <Box pr={2} pb={2}>
                            <DialogActions>
                              <Button
                                color="primary"
                                onClick={() => setOpenStartTimeDialog(false)}
                              >
                                <Box mx={2}>
                                  Chiudi
                                </Box>
                              </Button>
                            </DialogActions>
                          </Box>
                        </Dialog>
                        <IconButton disabled>
                          <ArrowForward fontSize="small"/>
                        </IconButton>
                        <Chip
                          icon={<AccessTimeOutlinedIcon/>}
                          size="small"
                          onClick={() => setOpenEndTimeDialog(true)}
                          sx={{
                            backgroundColor: alpha(theme.palette.text.secondary, 0.10),
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                            },
                          }}
                          label={getFormattedTime(endTime)}
                        />
                        <Dialog
                          open={openEndTimeDialog}
                          onClose={() => setOpenEndTimeDialog(false)}
                          disableEscapeKeyDown
                          BackdropProps={{
                            sx: {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }
                          }}
                          PaperProps={{
                            sx: {
                              boxShadow: 0,
                              borderRadius: theme.spacing(4),
                            }
                          }}
                          scroll="paper"
                          TransitionComponent={Fade}
                        >
                          {loading && <LinearProgress color="primary"/>}
                          <DialogContent>
                            <DialogContentText>
                              <StaticTimePicker
                                displayStaticWrapperAs="mobile"
                                value={endTime}
                                onChange={(newValue) => {
                                  setEndDay(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <Box pr={2} pb={2}>
                            <DialogActions>
                              <Button
                                color="primary"
                                onClick={() => setOpenEndTimeDialog(false)}
                              >
                                <Box mx={2}>
                                  Chiudi
                                </Box>
                              </Button>
                            </DialogActions>
                          </Box>
                        </Dialog>
                      </Stack>
                    </Stack>
                  </Grow>
                  : timeView === "month"
                    ? <Grow in>
                      <>
                        <Chip
                          icon={<CalendarMonthOutlinedIcon/>}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.text.secondary, 0.10),
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                            },
                          }}
                          onClick={() => setOpenMonthDialog(true)}
                          label={getFormattedMonth(selectedMonth)}
                        />
                        <Dialog
                          open={openMonthDialog}
                          onClose={() => setOpenMonthDialog(false)}
                          disableEscapeKeyDown
                          BackdropProps={{
                            sx: {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }
                          }}
                          PaperProps={{
                            sx: {
                              boxShadow: 0,
                              borderRadius: theme.spacing(4),
                            }
                          }}
                          scroll="paper"
                          TransitionComponent={Fade}
                        >
                          {loading && <LinearProgress color="primary"/>}
                          <DialogContent>
                            <DialogContentText>
                              <MonthPicker
                                date={selectedMonth}
                                minDate={new Date('1970-01-01T00:00:00.000')}
                                maxDate={new Date('2100-12-01T00:00:00.000')}
                                onChange={(newDate) => setSelectedMonth(newDate)}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <Box pr={2} pb={2}>
                            <DialogActions>
                              <Button
                                color="primary"
                                onClick={() => setOpenMonthDialog(false)}
                              >
                                <Box mx={2}>
                                  Chiudi
                                </Box>
                              </Button>
                            </DialogActions>
                          </Box>
                        </Dialog>
                      </>
                    </Grow>
                    : <Grow in>
                      <>
                        <Chip
                          icon={<DateRangeOutlinedIcon/>}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.text.secondary, 0.10),
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                            },
                          }}
                          onClick={() => setOpenStartDateDialog(true)}
                          label={getFormattedDate(startDay)}
                        />
                        <Dialog
                          open={openStartDateDialog}
                          onClose={() => setOpenStartDateDialog(false)}
                          disableEscapeKeyDown
                          BackdropProps={{
                            sx: {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }
                          }}
                          PaperProps={{
                            sx: {
                              boxShadow: 0,
                              borderRadius: theme.spacing(4),
                            }
                          }}
                          scroll="paper"
                          TransitionComponent={Fade}
                        >
                          {loading && <LinearProgress color="primary"/>}
                          <DialogContent>
                            <DialogContentText>
                              <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                value={startDay}
                                onChange={(newValue) => {
                                  setStartDay(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <Box pr={2} pb={2}>
                            <DialogActions>
                              <Button
                                color="primary"
                                onClick={() => setOpenStartDateDialog(false)}
                              >
                                <Box mx={2}>
                                  Chiudi
                                </Box>
                              </Button>
                            </DialogActions>
                          </Box>
                        </Dialog>
                        <IconButton disabled>
                          <ArrowForward fontSize="small"/>
                        </IconButton>
                        <Chip
                          icon={<DateRangeOutlinedIcon/>}
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.text.secondary, 0.10),
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.text.secondary, 0.15),
                            },
                          }}
                          onClick={() => setOpenEndDateDialog(true)}
                          label={getFormattedDate(endDay)}
                        />
                        <Dialog
                          open={openEndDateDialog}
                          onClose={() => setOpenEndDateDialog(false)}
                          disableEscapeKeyDown
                          BackdropProps={{
                            sx: {
                              backgroundColor: 'rgba(0,0,0,0.2)',
                            }
                          }}
                          PaperProps={{
                            sx: {
                              boxShadow: 0,
                              borderRadius: theme.spacing(4),
                            }
                          }}
                          scroll="paper"
                          TransitionComponent={Fade}
                        >
                          {loading && <LinearProgress color="primary"/>}
                          <DialogContent>
                            <DialogContentText>
                              <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                value={endDay}
                                /*renderDay={(day, _value, DayComponentProps) => {
                                  const isSelected = day.getDate() === startDay;

                                  // @ts-ignore
                                  return (
                                    <Badge
                                      key={day.toString()}
                                      overlap="circular"
                                      badgeContent={isSelected ? '🌚' : undefined}
                                    >
                                      <PickersDay {...DayComponentProps} />
                                    </Badge>
                                  );
                                }}*/
                                onChange={(newValue) => {
                                  setEndDay(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </DialogContentText>
                          </DialogContent>
                          <Box pr={2} pb={2}>
                            <DialogActions>
                              <Button
                                color="primary"
                                onClick={() => setOpenEndDateDialog(false)}
                              >
                                <Box mx={2}>
                                  Chiudi
                                </Box>
                              </Button>
                            </DialogActions>
                          </Box>
                        </Dialog>
                      </>
                    </Grow>
                }
              </Box>
            </Stack>
          </Card>
        </Grid>
        {loading
          ? <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <Box p={2}>
                  <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
                    <Grid item xs={8} sm={9} container>
                      <Grid item xs={12}>
                        <Skeleton>
                          <Typography color="text.secondary">
                            lorem ipsum
                          </Typography>
                        </Skeleton>
                      </Grid>
                      <Grid item>
                        <Skeleton>
                          <Typography variant={isMobile ? "h6" : "h4"} color="secondary">
                            00.00um
                          </Typography>
                        </Skeleton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <Stack width="100%" height={350} justifyContent="center" alignItems="center">
                  <CircularProgress/>
                </Stack>
              </Card>
            </Grid>
          </Grid>
          : device?.data?.map((el, index) => (
            <Grid item xs={12} /*lg={device?.data?.length === 1 ? 12 : 6}*/ container spacing={1} direction="column"
                  justifyContent="flex-start">
              <Grid item>
                <DataChart
                  data={el?.rilevazioni.map((r) => {
                    return {...r, "time": getFormattedTime(new Date(r.time))}
                  })}
                  max={el?.info?.max}
                  keys={el?.info?.keys}
                  rows={getRows(el?.info?.keys, el?.rilevazioni, el?.info?.um)}
                  columns={getColumns(el?.info?.keys)}
                  loading={loading}
                />
              </Grid>
            </Grid>
          ))}
      </Grid>
      <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
        fullWidth
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : theme.spacing(4),
            boxShadow: 0,
          }
        }}
        scroll="paper"
        TransitionComponent={Fade}
        fullScreen={isMobile}
      >
        {loading && <LinearProgress color="primary"/>}
        <DialogTitle>
          <Typography variant="h6">Info</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box py={1}>
              <DetailsSection
                sectionTitle="id"
                sectionTextContent={sampleData.device.id}
              />
              <DetailsSection
                sectionTitle="Ip"
                sectionTextContent={sampleData.device.ip}
              />
              <DetailsSection
                sectionTitle="Mac"
                sectionTextContent={sampleData.device.mac}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <Box pr={2} pb={2}>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => setOpenInfoDialog(false)}
            >
              Chiudi
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainPage>
  );
}

export default PodsPage;

