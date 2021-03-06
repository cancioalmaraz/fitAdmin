import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Helpers from "../../Helpers/Helpers";

// Components
import ClientList from "./ClientList";
import Pagination from "../shared/Pagination";
import ClientActionSection from "./ClientActionSection";
import ClientFilterSection from "./ClientFilterSection";
import ClientForm from "./ClientForm";
import SnackActions from "../shared/SnackActions";
import PaymentForm from "../Payment/PaymentForm";

// Services
import ClientService from "../../Services/ClientService";
import PaymentService from "../../Services/PaymentService";
import { Grid } from "@material-ui/core";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import LoopIcon from "@material-ui/icons/Loop";

import { grey } from "@material-ui/core/colors";

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
                            Clientes
                        </Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: "right" }}>
                        <IconButton
                            aria-label="reload"
                            size="medium"
                            onClick={props.actionList.reload}
                        >
                            <LoopIcon style={{ color: grey[50] }} />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
});

const limit = 10;

const ClientPage = React.memo(props => {
    const classes = useStyles();

    const helpers = new Helpers();

    // Services
    const clientService = new ClientService();
    const paymentService = new PaymentService();

    // State to filterList
    const [filterList, setFilterList] = useState({});

    // State to Clients
    const [clientList, setClientList] = useState({
        data: [],
        loading: true
    });

    const chargeClientList = (data = []) => {
        setClientList(state => ({
            ...state,
            data: data
        }));
    };

    const startLoadingClientList = () => {
        setClientList(state => ({
            ...state,
            loading: true
        }));
    };

    const finishLoadingClientList = () => {
        setClientList(state => ({
            ...state,
            loading: false
        }));
    };

    // State to Accordion
    const [accordion, setAccordion] = useState(false);

    const handleOpenAccordion = useCallback(() => {
        setAccordion(true);
    }, []);

    const handleCloseAccordion = useCallback(() => {
        setAccordion(false);
    }, []);

    // State to form
    const [stateForm, setStateForm] = useState({
        open: false,
        loading: false,
        client: {},
        submit: () => {}
    });

    const handleCreateClient = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: true,
            client: {},
            submit: createClient
        }));
    }, [setStateForm]);

    const handleEditClient = useCallback(
        client => {
            setStateForm(state => ({
                ...state,
                open: true,
                client: client,
                submit: editClient
            }));
        },
        [setStateForm]
    );

    const handleCloseForm = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: false
        }));
    }, [setStateForm]);

    // State to form payment
    const [stateFormPayment, setStateFormPayment] = useState({
        open: false,
        loading: false,
        client: {},
        submit: () => {}
    });

    const handleCreatePayment = useCallback(
        client => {
            setStateFormPayment(state => ({
                ...state,
                open: true,
                client: client,
                submit: createPayment
            }));
        },
        [setStateFormPayment]
    );

    const handleCloseFormPayment = useCallback(() => {
        setStateFormPayment(state => ({
            ...state,
            open: false
        }));
    }, [setStateFormPayment]);

    // State to clients
    const createClient = useCallback(
        (e, client) => {
            e.preventDefault();
            if (!!client.date_of_birth_full) {
                client.date_of_birth = helpers.parseDate(
                    client.date_of_birth_full
                );
            }
            clientService
                .create(client)
                .then(httpSuccess => {
                    handleCloseForm();
                    handleOpenSnack("success", "Inscripcion Exitosa");
                    chargePage({ ci: httpSuccess.data.results.ci });
                })
                .catch(httpError => {
                    const errorMessageList = helpers.getMessagesError(
                        httpError.response.data.errors
                    );
                    handleOpenSnack("error", errorMessageList.join(", "));
                });
        },
        [handleCloseForm]
    );

    const editClient = useCallback(
        (e, client) => {
            e.preventDefault();
            if (!!client.date_of_birth_full) {
                client.date_of_birth = helpers.parseDate(
                    client.date_of_birth_full
                );
            }
            clientService
                .edit(client)
                .then(httpSuccess => {
                    handleCloseForm();
                    handleOpenSnack(
                        "success",
                        "Datos actualizados exitosamente"
                    );
                    chargePage({ ci: httpSuccess.data.results.ci });
                })
                .catch(httpError => {
                    const errorMessageList = helpers.getMessagesError(
                        httpError.response.data.errors
                    );
                    handleOpenSnack("error", errorMessageList.join(", "));
                });
        },
        [handleCloseForm]
    );

    // Functions to Payments
    const createPayment = (e, payment) => {
        e.preventDefault();
        payment.clientList = payment.clientListGross.map(e => e.id);
        if (!!payment.start_dateFull) {
            payment.start_date = helpers.parseDate(payment.start_dateFull);
        }
        if (!!payment.end_dateFull) {
            payment.end_date = helpers.parseDate(payment.end_dateFull);
        }
        paymentService
            .create(payment)
            .then(httpSuccess => {
                handleCloseFormPayment();
                handleOpenSnack("success", "Pago realizado exitosamente");
                chargePage({ ci: httpSuccess.data.results.clients[0].ci });
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            });
    };

    // State to Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 0,
        offset: 0,
        totalItems: 0,
        totalItemsInPage: 0,
        loading: true
    });

    const startLoadingPagination = () => {
        setPagination(state => ({
            ...state,
            loading: true
        }));
    };

    const finishLoadingPagination = () => {
        setPagination(state => ({
            ...state,
            loading: false
        }));
    };

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

    //Functions to Client
    const deleteClient = client => {
        clientService
            .delete(client)
            .then(httpSuccess => {
                handleCloseForm();
                handleOpenSnack("success", "Cliente Eliminado");
                chargePage();
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            });
    };

    const sendMessageToClient = client => {
        if (!!client.phone) {
            window.open(
                `https://api.whatsapp.com/send?phone=591${client.phone}`
            );
        }
    };

    // Function in Page
    const chargePage = (
        filterList = {},
        page = pagination.page,
        offset = pagination.offset
    ) => {
        startLoadingClientList();
        startLoadingPagination();
        setFilterList(filterList);

        clientService
            .getAll(limit, offset, filterList)
            .then(httpSuccess => {
                chargeClientList(httpSuccess.data.results);
                settingPagination(httpSuccess.data, page, offset);
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            })
            .finally(() => {
                finishLoadingClientList();
                finishLoadingPagination();
            });
    };

    const changePage = newPage => {
        const newOffset = (newPage - 1) * limit;

        startLoadingClientList();
        startLoadingPagination();

        clientService
            .getAll(limit, newOffset, filterList)
            .then(httpSuccess => {
                chargeClientList(httpSuccess.data.results);
                settingPagination(httpSuccess.data, newPage, newOffset);
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            })
            .finally(() => {
                finishLoadingClientList();
                finishLoadingPagination();
            });
    };

    const handleChangePage = (_, newPage) => {
        changePage(newPage);
    };

    const search = (e, filterList) => {
        e.preventDefault();
        chargePage(filterList, 1, 0);
    };

    useEffect(() => {
        chargePage();
    }, []);

    return (
        <Fragment>
            <AppBarPage
                {...props}
                actionList={{
                    reload: chargePage
                }}
            />

            <main className={classes.content}>
                <div className={classes.toolbar} />

                <ClientActionSection
                    accordion={{
                        state: accordion,
                        open: handleOpenAccordion,
                        close: handleCloseAccordion
                    }}
                    form={{
                        create: handleCreateClient
                    }}
                />

                <ClientFilterSection
                    accordion={{
                        state: accordion
                    }}
                    filter={{
                        search: search,
                        charge: chargePage
                    }}
                />

                {!pagination.loading && (
                    <ClientList
                        clientList={clientList}
                        actionList={{
                            generatePayment: handleCreatePayment,
                            edit: handleEditClient,
                            delete: deleteClient,
                            message: sendMessageToClient
                        }}
                    />
                )}

                {!pagination.loading && (
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onChange={handleChangePage}
                        offset={pagination.offset}
                        totalItemsInPage={pagination.totalItemsInPage}
                        loading={pagination.loading}
                        subject="cliente(s)"
                    />
                )}

                <ClientForm state={stateForm} handleClose={handleCloseForm} />

                <PaymentForm
                    state={stateFormPayment}
                    handleClose={handleCloseFormPayment}
                />

                <SnackActions
                    snack={openSnack}
                    handleCloseSnack={handleCloseSnack}
                />
            </main>
        </Fragment>
    );
});

export default ClientPage;
