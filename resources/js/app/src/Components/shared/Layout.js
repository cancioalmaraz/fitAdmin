import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AppRouter from "../../Routers/AppRouter";
import { BrowserRouter as Router, useHistory } from "react-router-dom";

// Icons
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PersonIcon from "@material-ui/icons/Person";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import HouseIcon from "@material-ui/icons/House";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventIcon from "@material-ui/icons/Event";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap"
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1
        }
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar
    }
}));

const DrawerUi = ({ drawer }) => {
    const classes = useStyles();
    const theme = useTheme();

    const history = useHistory();

    const linkToClients = () => {
        history.push("/");
    };

    const linkToEvents = () => {
        history.push("/events");
    };

    const linkToPayments = () => {
        history.push("/payments");
    };

    const linkToCoaches = () => {
        history.push("/coaches");
    };

    const linkToSchedules = () => {
        history.push("/schedules");
    };

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: drawer.state,
                [classes.drawerClose]: !drawer.state
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: drawer.state,
                    [classes.drawerClose]: !drawer.state
                })
            }}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={drawer.close}>
                    {theme.direction === "rtl" ? (
                        <ChevronRightIcon />
                    ) : (
                        <ChevronLeftIcon />
                    )}
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem button onClick={linkToClients}>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Clientes"} />
                </ListItem>
                <ListItem button onClick={linkToCoaches}>
                    <ListItemIcon>
                        <AccessibilityNewIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Coachs"} />
                </ListItem>
                <ListItem button onClick={linkToPayments}>
                    <ListItemIcon>
                        <MonetizationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Pagos"} />
                </ListItem>
                {/* <ListItem button>
                    <ListItemIcon>
                        <HouseIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Afiliaciones"} />
                </ListItem> */}
                <ListItem button onClick={linkToSchedules}>
                    <ListItemIcon>
                        <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Horarios"} />
                </ListItem>
                <ListItem button onClick={linkToEvents}>
                    <ListItemIcon>
                        <EventIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Eventos"} />
                </ListItem>
            </List>
        </Drawer>
    );
};

const Layout = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />

            <Router>
                <DrawerUi
                    drawer={{
                        state: open,
                        close: handleDrawerClose
                    }}
                />
                <AppRouter
                    drawer={{
                        state: open,
                        open: handleDrawerOpen,
                        close: handleDrawerClose
                    }}
                />
            </Router>
        </div>
    );
};

export default Layout;
