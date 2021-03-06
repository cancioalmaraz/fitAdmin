import React, { Fragment, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

// Components

const drawerWidth = 240;

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
                <Typography variant="h6" noWrap>
                    Client Details
                </Typography>
            </Toolbar>
        </AppBar>
    );
});

const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

const a11yProps = index => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
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

const ClientDetailsPage = React.memo(props => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            <AppBarPage {...props} />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.root}>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="simple tabs example"
                        >
                            <Tab
                                label="Datos"
                                icon={<AssignmentIndIcon />}
                                {...a11yProps(0)}
                            />
                            <Tab
                                label="Pagos"
                                icon={<MonetizationOnIcon />}
                                {...a11yProps(0)}
                            />
                        </Tabs>
                    </AppBar>
                    <TabPanel
                        value={value}
                        index={0}
                        style={{ backgroundColor: "lavender" }}
                    >
                        <div>Datos</div>
                    </TabPanel>
                    <TabPanel
                        value={value}
                        index={1}
                        style={{ backgroundColor: "lavender" }}
                    >
                        <div>Pagos</div>
                    </TabPanel>
                </div>
            </main>
        </Fragment>
    );
});

export default ClientDetailsPage;
