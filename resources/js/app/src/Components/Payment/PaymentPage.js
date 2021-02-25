import React, { Fragment, useCallback, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import { Button } from "@material-ui/core";
import PaymentForm from "./PaymentForm";

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

    // State to form
    const [stateForm, setStateForm] = useState({
        open: false,
        loading: false,
        client: {},
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

    // Functions to Payments
    const createPayment = (e, payment) => {
        e.preventDefault();
        payment.clientList = payment.clientListGross.map(e=>e.id);
        console.log(payment);
    };

    return (
        <Fragment>
            <AppBarPage {...props} />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.root}>
                    <Button onClick={handleCreatePayment}>Realizar Pago</Button>

                    <PaymentForm
                        state={stateForm}
                        handleClose={handleCloseForm}
                    />
                </div>
            </main>
        </Fragment>
    );
});

export default PaymentPage;
