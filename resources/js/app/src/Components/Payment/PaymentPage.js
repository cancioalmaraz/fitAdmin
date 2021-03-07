import React, { Fragment, useCallback, useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Helpers from "../../Helpers/Helpers";
import { Button, Grid } from "@material-ui/core";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

// Components
import PaymentForm from "./PaymentForm";
import SnackActions from "../shared/SnackActions";
import Pagination from "../shared/Pagination";
import PaymentList from "./PaymentList";

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

const limit = 10;

const PaymentPage = React.memo(props => {
    const classes = useStyles();

    const helpers = new Helpers();

    // Services
    const paymentService = new PaymentService();

    // State to PaymentList
    const [paymentList, setPaymentList] = useState({
        data: [],
        loading: true
    });

    // State to Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 0,
        offset: 0,
        totalItems: 0,
        totalItemsInPage: 0,
        loading: true
    });

    const settingPagination = useCallback(
        (data, page = pagination.page, offset = pagination.offset) => {
            setPagination(state => ({
                ...state,
                page: page,
                offset: offset,
                totalPages: Math.ceil(data.filterCount / limit),
                totalItems: data.filterCount,
                totalItemsInPage: data.results.length
            }));
        },
        [pagination.page, pagination.offset]
    );

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

    // Functions to change states
    const setData = (data = {}, setList) => {
        setList(state => ({
            ...state,
            data: data
        }));
    };

    const startLoading = setList => {
        setList(state => ({
            ...state,
            loading: true
        }));
    };

    const finishLoading = setList => {
        setList(state => ({
            ...state,
            loading: false
        }));
    };

    // Functions to Payments
    const createPayment = (e, payment) => {
        e.preventDefault();
        payment.clientList = payment.clientListGross.map(e => e.id);
        payment.start_date = helpers.parseDate(payment.start_dateFull);
        payment.end_date = helpers.parseDate(payment.end_dateFull);
        paymentService
            .create(payment)
            .then(httpSuccess => {
                handleCloseForm();
                handleOpenSnack("success", "Pago realizado exitosamente");
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            });
    };

    const chargePaymentList = ({
        page = pagination.page,
        offset = pagination.offset
    }) => {
        startLoading(setPaymentList);
        startLoading(setPagination);

        paymentService
            .getAll(limit, 0)
            .then(httpSuccess => {
                setData(httpSuccess.data.results, setPaymentList);
                settingPagination(httpSuccess.data, page, offset);
            })
            .finally(() => {
                finishLoading(setPaymentList);
                finishLoading(setPagination);
            });
    };

    const changePage = newPage => {
        const newOffset = (newPage - 1) * limit;

        startLoading(setPaymentList);
        startLoading(setPagination);

        paymentService
            .getAll(limit, newOffset)
            .then(httpSuccess => {
                setData(httpSuccess.data.results, setPaymentList);
                settingPagination(httpSuccess.data, newPage, newOffset);
            })
            .finally(() => {
                finishLoading(setPaymentList);
                finishLoading(setPagination);
            });
    };

    const handleChangePage = (_, newPage) => {
        changePage(newPage);
    };

    useEffect(() => {
        chargePaymentList(1, 0);
    }, []);

    return (
        <Fragment>
            <AppBarPage {...props} />

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.root}>
                    <Grid container item spacing={3}>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<MonetizationOnIcon />}
                                onClick={handleCreatePayment}
                            >
                                Realizar Pago Masivo
                            </Button>
                        </Grid>

                        <PaymentList paymentList={paymentList} showClientList />

                        <Grid item xs={12}>
                            {!pagination.loading &&
                                paymentList.data.length !== 0 && (
                                    <Pagination
                                        page={pagination.page}
                                        totalPages={pagination.totalPages}
                                        totalItems={pagination.totalItems}
                                        onChange={handleChangePage}
                                        offset={pagination.offset}
                                        totalItemsInPage={
                                            pagination.totalItemsInPage
                                        }
                                        loading={pagination.loading}
                                        subject="pago(s)"
                                    />
                                )}
                        </Grid>
                    </Grid>

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
