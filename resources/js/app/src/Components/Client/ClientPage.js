import React, { useCallback, useEffect, useState } from "react";
import { Fragment } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

// Components
import ClientList from "./ClientList";
import Pagination from "../shared/Pagination";
import ClientActionSection from "./ClientActionSection";
import ClientFilterSection from "./ClientFilterSection";
import ClientForm from "./ClientForm";

// Services
import ClientService from "../../Services/ClientService";

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
                <Typography variant="h6" noWrap>
                    Clientes
                </Typography>
            </Toolbar>
        </AppBar>
    );
});

const limit = 10;

const ClientPage = React.memo(props => {
    const classes = useStyles();

    // Services
    const clientService = new ClientService();

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
        client: {}
    });

    const handleOpenForm = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: true,
            client: {}
        }));
    }, [setStateForm]);

    const handleCloseForm = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: false
        }));
    }, [setStateForm]);

    const handleSubmitForm = useCallback(
        (e, form) => {
            e.preventDefault();

            console.log(form);
        },
        [handleCloseForm]
    );

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

    const settingPagination = data => {
        setPagination(state => ({
            ...state,
            totalPages: Math.ceil(data.filterCount / limit),
            totalItems: data.filterCount,
            totalItemsInPage: data.results.length
        }));
    };

    // Function in Page
    const chargePage = (filterList = {}) => {
        startLoadingClientList();
        startLoadingPagination();

        clientService
            .getAll(limit, pagination.offset, filterList)
            .then(httpSuccess => {
                chargeClientList(httpSuccess.data.results);
                settingPagination(httpSuccess.data);
            })
            .finally(() => {
                finishLoadingClientList();
                finishLoadingPagination();
            });
    };

    const search = (e, filterList) => {
        e.preventDefault();
        chargePage(filterList);
    };

    useEffect(() => {
        chargePage();
    }, []);

    return (
        <Fragment>
            <AppBarPage {...props} />

            <main className={classes.content}>
                <div className={classes.toolbar} />

                <ClientActionSection
                    accordion={{
                        state: accordion,
                        open: handleOpenAccordion,
                        close: handleCloseAccordion
                    }}
                    form={{
                        open: handleOpenForm
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

                <ClientList clientList={clientList} />

                {!pagination.loading && (
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        offset={pagination.offset}
                        totalItemsInPage={pagination.totalItemsInPage}
                        loading={pagination.loading}
                    />
                )}

                <ClientForm
                    state={stateForm}
                    handleClose={handleCloseForm}
                    handleSubmit={handleSubmitForm}
                />
            </main>
        </Fragment>
    );
});

export default ClientPage;
