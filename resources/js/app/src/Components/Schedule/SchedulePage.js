import React, {useCallback, useEffect, useState} from "react";
import { Fragment } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Helpers from "../../Helpers/Helpers";
import { Button, Grid } from "@material-ui/core";

// Components
import SnackActions from "../shared/SnackActions";
import ScheduleForm from "./ScheduleForm";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from '@material-ui/icons/Add';

// Services
import ScheduleService from "../../Services/ScheduleService";
import moment from "moment";
import StateHelper from "../../Helpers/StateHelper";
import ScheduleList from "./ScheduleList";
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: "none"
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}));

const AppBarPage = React.memo(props => {
    const classes = useStyles();

    const { drawer } = props;

    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: drawer.state
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={drawer.open}
                    edge="start"
                    className={clsx(classes.menuButton, {
                        [classes.hide]: drawer.state
                    })}
                >
                    <MenuIcon />
                </IconButton>
                <Grid container justify="space-between">
                    <Grid item xs={4} style={{ alignSelf: "center" }}>
                        <Typography variant="h6" noWrap>
                            Horarios
                        </Typography>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
});

const limit = 10;

const SchedulePage = React.memo(props => {
    const classes = useStyles();

    const helpers = new Helpers();
    const stateHelper = new StateHelper()

    const scheduleService = new ScheduleService();

    // State for scheduleList
    const [scheduleList, setScheduleList] = useState({
        data: [],
        loading: true,
        filterList: {}
    });

    // State to schedule form
    const [scheduleForm, setScheduleForm] = useState({
        open: false,
        action: () => {},
        value: null
    });

    const handleOpenScheduleForm = () => {
        setScheduleForm(state => ({
            ...state,
            open: true,
            action: createSchedule,
            value: null
        }));
    };

    const handleEditScheduleForm = (schedule) => {
        setScheduleForm(state => ({
            ...state,
            open: true,
            action: editSchedule,
            value: schedule
        }));
    };

    const handleCloseScheduleForm = () => {
        setScheduleForm(state => ({
            ...state,
            open: false
        }));
    };

    // State for SnackActions
    const [openSnack, setOpenSnack] = useState({
        success: {
            state: false,
            message: "Message Success Default"
        },
        error: {
            state: false,
            message: "Message Error Default"
        },
        info: {
            state: false,
            message: "Message Info Default"
        }
    });

    const handleCloseSnack = useCallback(
        (reason, type) => {
            if (reason === "clickaway") {
                return;
            }
            setOpenSnack(state => ({
                ...state,
                [type]: { ...state[type], state: false }
            }));
        },
        [setOpenSnack]
    );

    const handleOpenSnack = (type, message = null) => {
        setOpenSnack(state => ({
            ...state,
            [type]: {
                ...state[type],
                state: true,
                message: message !== null ? message : state[type].message
            }
        }));
    };

    // Functions to schedule
    const chargeScheduleList = () => {
        stateHelper.startLoading(setScheduleList);
        scheduleService
            .getAll(1000, 0, scheduleList.filterList)
            .then(httpSuccess=>{
                stateHelper.setData(httpSuccess.data.results, setScheduleList);
            })
            .finally(()=>{
                stateHelper.finishLoading(setScheduleList);
            })
    }

    const createSchedule = (schedule) => {
        scheduleService
            .create(schedule)
            .then(httpSuccess => {
                handleOpenSnack('success', 'Horario creado exitosamente');
                handleCloseScheduleForm();
                chargeScheduleList();
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(httpError.response.data.errors);
                handleOpenSnack("error", errorMessageList.join(", "));
            });
    };

    const editSchedule = (schedule) => {
        scheduleService
            .edit(schedule)
            .then(httpSuccess => {
                handleOpenSnack('success', 'Horario editado exitosamente');
                handleCloseScheduleForm();
                chargeScheduleList();
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(httpError.response.data.errors);
                handleOpenSnack("error", errorMessageList.join(", "));
            });
    };

    const deleteSchedule = (schedule) => {
        scheduleService
            .delete(schedule)
            .then(()=>{
                handleOpenSnack('success', 'Horario eliminado exitosamente');
                handleCloseScheduleForm();
                chargeScheduleList();
            })
    }

    useEffect(()=>{
        chargeScheduleList();
    }, []);

    return (
        <Fragment>
            <AppBarPage
                {...props}
            />

            <main className={classes.content}>
                <div className={classes.toolbar} />

                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOpenScheduleForm}
                    startIcon={<AddIcon />}
                >
                    Añadir Horario
                </Button>

                <ScheduleList
                    scheduleList={scheduleList.data}
                    loading={scheduleList.loading}
                    actionList={{
                        edit: handleEditScheduleForm
                    }}
                />

                <ScheduleForm
                    onClose={handleCloseScheduleForm}
                    open={scheduleForm.open}
                    action={scheduleForm.action}
                    value={scheduleForm.value}
                    onDelete={deleteSchedule}
                />

                <SnackActions
                    snack={openSnack}
                    handleCloseSnack={handleCloseSnack}
                />
            </main>
        </Fragment>
    );
});

export default SchedulePage;
