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
import CoachList from "./CoachList";
import Pagination from "../shared/Pagination";
import CoachActionSection from "./CoachActionSection";
import CoachFilterSection from "./CoachFilterSection";
import CoachForm from "./CoachForm";
import SnackActions from "../shared/SnackActions";

// Services
import CoachService from "../../Services/CoachService";
import { Grid } from "@material-ui/core";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import LoopIcon from "@material-ui/icons/Loop";

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
                            Coaches
                        </Typography>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: "right" }}>
                        <IconButton
                            aria-label="reload"
                            size="medium"
                            onClick={props.actionList.reload}
                        >
                            <LoopIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
});

const limit = 10;

const CoachPage = React.memo(props => {
    const classes = useStyles();

    const helpers = new Helpers();

    // Services
    const coachService = new CoachService();

    // State to filterList
    const [filterList, setFilterList] = useState({});

    // State to Coaches
    const [coachList, setCoachList] = useState({
        data: [],
        loading: true
    });

    const chargeCoachList = (data = []) => {
        setCoachList(state => ({
            ...state,
            data: data
        }));
    };

    const startLoadingCoachList = () => {
        setCoachList(state => ({
            ...state,
            loading: true
        }));
    };

    const finishLoadingCoachList = () => {
        setCoachList(state => ({
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
        coach: {},
        submit: () => {}
    });

    const handleCreateCoach = useCallback(() => {
        setStateForm(state => ({
            ...state,
            open: true,
            coach: {},
            submit: createCoach
        }));
    }, [setStateForm]);

    const handleEditCoach = useCallback(
        coach => {
            setStateForm(state => ({
                ...state,
                open: true,
                coach: coach,
                submit: editCoach
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

    // State to coach
    const createCoach = useCallback(
        (e, coach) => {
            e.preventDefault();
            if (!!coach.date_of_birth_full) {
                coach.date_of_birth = helpers.parseDate(
                    coach.date_of_birth_full
                );
            }
            coachService
                .create(coach)
                .then(httpSuccess => {
                    handleCloseForm();
                    handleOpenSnack("success", "Contratacion Exitosa");
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

    const editCoach = useCallback(
        (e, coach) => {
            e.preventDefault();
            if (!!coach.date_of_birth_full) {
                coach.date_of_birth = helpers.parseDate(
                    coach.date_of_birth_full
                );
            }
            coachService
                .edit(coach)
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

    //Functions to Coach
    const deleteCoach = coach => {
        coachService
            .delete(coach)
            .then(httpSuccess => {
                handleCloseForm();
                handleOpenSnack("success", "Coach Eliminado");
                chargePage();
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            });
    };

    const sendMessageToCoach = coach => {
        if (!!coach.phone) {
            window.open(
                `https://api.whatsapp.com/send?phone=591${coach.phone}`
            );
        }
    };

    // Function in Page
    const chargePage = (
        filterList = {},
        page = pagination.page,
        offset = pagination.offset
    ) => {
        startLoadingCoachList();
        startLoadingPagination();
        setFilterList(filterList);

        coachService
            .getAll(limit, offset, filterList)
            .then(httpSuccess => {
                chargeCoachList(httpSuccess.data.results);
                settingPagination(httpSuccess.data, page, offset);
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            })
            .finally(() => {
                finishLoadingCoachList();
                finishLoadingPagination();
            });
    };

    const changePage = newPage => {
        const newOffset = (newPage - 1) * limit;

        startLoadingCoachList();
        startLoadingPagination();

        coachService
            .getAll(limit, newOffset, filterList)
            .then(httpSuccess => {
                chargeCoachList(httpSuccess.data.results);
                settingPagination(httpSuccess.data, newPage, newOffset);
            })
            .catch(httpError => {
                const errorMessageList = helpers.getMessagesError(
                    httpError.response.data.errors
                );
                handleOpenSnack("error", errorMessageList.join(", "));
            })
            .finally(() => {
                finishLoadingCoachList();
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

                <CoachActionSection
                    accordion={{
                        state: accordion,
                        open: handleOpenAccordion,
                        close: handleCloseAccordion
                    }}
                    form={{
                        create: handleCreateCoach
                    }}
                />

                <CoachFilterSection
                    accordion={{
                        state: accordion
                    }}
                    filter={{
                        search: search,
                        charge: chargePage
                    }}
                />

                {!pagination.loading && (
                    <CoachList
                        coachList={coachList}
                        actionList={{
                            edit: handleEditCoach,
                            delete: deleteCoach,
                            message: sendMessageToCoach
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
                        subject="coach(es)"
                    />
                )}

                <CoachForm state={stateForm} handleClose={handleCloseForm} />

                <SnackActions
                    snack={openSnack}
                    handleCloseSnack={handleCloseSnack}
                />
            </main>
        </Fragment>
    );
});

export default CoachPage;
