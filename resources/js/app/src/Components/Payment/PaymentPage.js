import React, { Fragment, useCallback, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Helpers from "../../Helpers/Helpers";
import { Button } from "@material-ui/core";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

// Components
import PaymentForm from "./PaymentForm";
import SnackActions from "../shared/SnackActions";

// Services
import PaymentService from "../../Services/PaymentService";

const drawerWidth = 240;

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
    },
    actionCard: {
        width: "auto"
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
                <Typography variant="h6" noWrap>
                    Pagos
                </Typography>
            </Toolbar>
        </AppBar>
    );
});

const PaymentPage = React.memo(props => {
    const classes = useStyles();

    const helpers = new Helpers();

    // Services
    const paymentService = new PaymentService();

    // State to form
    const [stateForm, setStateForm] = useState({
        open: false,
        loading: false,
        submit: () => {}
    });

    const handleCreatePayment = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: true,
            submit: createPayment
        }));
    }, [setStateForm]);

    const handleCloseForm = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: false
        }));
    }, [setStateForm]);

    // State to snack messages
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

    // Functions to Payments
    const createPayment = (e, payment) => {
        e.preventDefault();
        payment.clientList = payment.clientListGross.map(e => e.id);
        payment.start_date = helpers.parseDate(payment.start_dateFull);
        payment.end_date = helpers.parseDate(payment.end_dateFull);
        paymentService.create(payment).then(httpSuccess => {
            handleCloseForm();
            handleOpenSnack("success", "Pago realizado exitosamente");
        });
    };

    return (
        <Fragment>
            <AppBarPage {...props} />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.root}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<MonetizationOnIcon />}
                        onClick={handleCreatePayment}
                    >
                        Realizar pago
                    </Button>

                    <PaymentForm
                        state={stateForm}
                        handleClose={handleCloseForm}
                    />
                    <SnackActions
                        snack={openSnack}
                        handleCloseSnack={handleCloseSnack}
                    />
                </div>
            </main>
        </Fragment>
    );
});

export default PaymentPage;
