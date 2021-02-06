import React from "react";
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

// Icons
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PersonIcon from "@material-ui/icons/Person";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import HouseIcon from "@material-ui/icons/House";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

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

const Layout = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Clientes"} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <AccessibilityNewIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Coachs"} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <MonetizationOnIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Pagos"} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <HouseIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Afiliaciones"} />
                    </ListItem>
                </List>
            </Drawer>

            <AppRouter
                drawer={{
                    state: open,
                    open: handleDrawerOpen,
                    close: handleDrawerClose
                }}
            />
        </div>
    );
};

export default Layout;
