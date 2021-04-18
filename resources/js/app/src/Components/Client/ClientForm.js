import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    AppBar,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Slide from "@material-ui/core/Slide";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import esLocale from "date-fns/locale/es";

//Services
import CoachService from "../../Services/CoachService";
import ClientService from "../../Services/ClientService";
import ScheduleService from "../../Services/ScheduleService";
import MembershipService from "../../Services/MembershipService";

//Components
import FilterSimpleSelect from "../shared/FilterSimpleSelect";

//Icons
import CloseIcon from "@material-ui/icons/Close";
import RoomIcon from "@material-ui/icons/Room";

import StateHelper from "../../Helpers/StateHelper";

const useStyles = makeStyles(theme => ({
    form: {
        padding: theme.spacing(2, 2, 0)
    },
    dialogActions: {
        padding: theme.spacing(2, 3, 2)
    },
    dialogPaper: {
        minHeight: "90vh",
        maxHeight: "90vh"
    },
    formControl: {
        margin: 0,
        width: "100%"
    },
    formLabel: {
        paddingLeft: theme.spacing(2)
    },
    appBarMap: {
        position: "relative"
    },
    titleMap: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const center = {
    lat: -17.510927506862437,
    lng: -63.167612515389926
};

const DraggableMarker = ({ position }) => {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    position.changeForm({
                        target: {
                            name: "address",
                            value: marker.getLatLng()
                        }
                    });
                }
            }
        }),
        []
    );

    return (
        <Marker
            draggable
            eventHandlers={eventHandlers}
            position={position.state}
            ref={markerRef}
        >
            <Popup minWidth={90}>
                <span>Direccion</span>
            </Popup>
        </Marker>
    );
};

const ClientForm = React.memo(({ state, handleClose }) => {
    const classes = useStyles();

    // Helpers
    const stateHelper = new StateHelper();

    // Services
    const coachService = new CoachService();
    const clientService = new ClientService();
    const scheduleService = new ScheduleService();
    const membershipService = new MembershipService();

    const [helperText, setHelperText] = useState({
        data: "",
        loading: false
    });

    // State to client form
    const [form, setForm] = useState({});

    const handleChangeForm = ({ target }) => {
        setForm(state => ({
            ...state,
            [target.name]: target.value
        }));
    };

    // State to coaches
    const [coachList, setCoachList] = useState({
        data: [],
        loading: true
    });

    const setData = (data, setList) => {
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

    // State to schedules
    const [scheduleList, setScheduleList] = useState({
        data: [],
        loading: true
    });

    // State to memberships
    const [membershipList, setMembershipList] = useState({
        data: [],
        loading: true
    });

    // State map
    const [openMap, setOpenMap] = React.useState(false);

    const handleOpenMap = () => {
        setOpenMap(true);
    };

    const handleCloseMap = () => {
        setOpenMap(false);
    };

    const chargeCoachList = () => {
        startLoading(setCoachList);
        coachService
            .getAll(10000, 0)
            .then(httpSuccess => {
                setData(httpSuccess.data.results, setCoachList);
            })
            .finally(() => {
                finishLoading(setCoachList);
            });
    };

    const chargeScheduleList = () => {
        stateHelper.startLoading(setScheduleList);
        scheduleService
            .getAll(10000, 0)
            .then(httpSuccess => {
                stateHelper.setData(httpSuccess.data.results, setScheduleList);
            })
            .finally(() => {
                stateHelper.finishLoading(setScheduleList);
            });
    };

    const chargeMembershipList = () => {
        stateHelper.startLoading(setMembershipList);
        membershipService
            .getAll(10000, 0)
            .then(httpSuccess => {
                stateHelper.setData(httpSuccess.data.results, setMembershipList);
            })
            .finally(() => {
                stateHelper.finishLoading(setMembershipList);
            });
    };

    const chargeHelperText = (coach, schedule) => {
        startLoading(setHelperText);
        clientService
            .getAll(10000, 0, { coach: coach.id, schedule: schedule.id })
            .then(httpSuccess => {
                setData(
                    `En este horario ${coach.name} tiene ${httpSuccess.data.filterCount} alumno(s)`,
                    setHelperText
                );
            })
            .finally(() => {
                finishLoading(setHelperText);
            });
    };

    const handleChangeCoach = e => {
        changingHelperText(e.target.value, form.schedule);
        handleChangeForm(e);
    };

    const handleChangeSchedule = e => {
        changingHelperText(form.coach, e.target.value);
        handleChangeForm(e);
    };

    const changingHelperText = (coach, schedule) => {
        if (!!schedule && !!coach) {
            chargeHelperText(coach, schedule);
        } else {
            setData("", setHelperText);
        }
    };

    useEffect(() => {
        if (state.open) {
            chargeCoachList();
            chargeScheduleList();
            chargeMembershipList();
            setData("", setHelperText);

            setForm({
                ...state.client,
                ci: !!state.client.ci ? state.client.ci : "",
                name: !!state.client.name ? state.client.name : "",
                first_last_name: !!state.client.first_last_name
                    ? state.client.first_last_name
                    : "",
                second_last_name: !!state.client.second_last_name
                    ? state.client.second_last_name
                    : "",
                phone: !!state.client.phone ? state.client.phone : "",
                address: !!state.client.address ? state.client.address : center,
                date_of_birth_full: !!state.client.date_of_birth
                    ? new Date(`${state.client.date_of_birth}T04:00`)
                    : null,
                coach: !!state.client.coach ? state.client.coach : null,
                schedule: !!state.client.schedule ? state.client.schedule : null,
                membership: !!state.client.membership ? state.client.membership : null,
                sex: !!state.client.sex ? state.client.sex : ""
            });
        }
    }, [state.open]);

    return (
        <Fragment>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={state.open}
                onClose={handleClose}
                classes={{ paper: classes.dialogPaper }}
            >
                <DialogTitle style={{ textAlign: "center" }}>
                    {!!state.client.id ? "Editar" : "Inscribir"}
                </DialogTitle>
                <DialogContent>
                    <form
                        id="form-client"
                        onSubmit={e => {
                            state.submit(e, form);
                        }}
                    >
                        <MuiPickersUtilsProvider
                            utils={DateFnsUtils}
                            locale={esLocale}
                        >
                            <Grid
                                container
                                spacing={3}
                                className={classes.form}
                            >
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        rowsMax={1}
                                        autoComplete="off"
                                        label="C.I."
                                        name="ci"
                                        variant="outlined"
                                        type="number"
                                        value={form.ci}
                                        onChange={handleChangeForm}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        rowsMax={1}
                                        autoComplete="off"
                                        label="Nombre(s)"
                                        name="name"
                                        variant="outlined"
                                        value={form.name}
                                        onChange={handleChangeForm}
                                        inputProps={{
                                            maxLength: 30
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        rowsMax={1}
                                        autoComplete="off"
                                        label="Apellido P."
                                        name="first_last_name"
                                        variant="outlined"
                                        value={form.first_last_name}
                                        onChange={handleChangeForm}
                                        inputProps={{
                                            maxLength: 30
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        rowsMax={1}
                                        autoComplete="off"
                                        label="Apellido M."
                                        name="second_last_name"
                                        variant="outlined"
                                        value={form.second_last_name}
                                        onChange={handleChangeForm}
                                        inputProps={{
                                            maxLength: 30
                                        }}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    style={{ alignSelf: "center" }}
                                >
                                    <TextField
                                        fullWidth
                                        rowsMax={1}
                                        autoComplete="off"
                                        label="Telefono"
                                        name="phone"
                                        variant="outlined"
                                        type="number"
                                        value={form.phone}
                                        onChange={handleChangeForm}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    style={{ alignSelf: "center", textAlign: 'center' }}
                                >
                                    <KeyboardDatePicker
                                        margin="normal"
                                        label="F. de Nacimiento"
                                        format="yyyy-MM-dd"
                                        value={form.date_of_birth_full}
                                        inputVariant="outlined"
                                        onChange={date => {
                                            handleChangeForm({
                                                target: {
                                                    name: "date_of_birth_full",
                                                    value: date
                                                }
                                            });
                                        }}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date"
                                        }}
                                        cancelLabel="Cancelar"
                                        okLabel="Aceptar"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} style={{ alignSelf: 'center' }}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                    >
                                        <InputLabel id="select-gender">Sexo</InputLabel>
                                        <Select
                                            name="sex"
                                            value={form.sex}
                                            labelId="select-gender"
                                            label="Sexo"
                                            onClick={handleChangeForm}
                                        >
                                            <MenuItem value="">
                                                <em>Ninguno</em>
                                            </MenuItem>
                                            <MenuItem value={"M"}>Masculino</MenuItem>
                                            <MenuItem value={"F"}>Femenino</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    style={{ alignSelf: "center" }}
                                >
                                    <FilterSimpleSelect
                                        open={state.open}
                                        name="coach"
                                        list={coachList.data}
                                        label="Seleccionar Coach"
                                        onChange={handleChangeCoach}
                                        disabled={coachList.loading}
                                        value={!!form.coach ? form.coach : null}
                                        optionField="fullName"
                                        helperText=""
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    style={{ alignSelf: "center" }}
                                >
                                    <FilterSimpleSelect
                                        open={state.open}
                                        name="schedule"
                                        list={scheduleList.data}
                                        label="Seleccionar Horario"
                                        onChange={handleChangeSchedule}
                                        disabled={scheduleList.loading}
                                        value={!!form.schedule ? form.schedule : null}
                                        optionField="fullTime"
                                        helperText={helperText.data}
                                        loading={helperText.loading}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    style={{ alignSelf: "start" }}
                                >
                                    <FilterSimpleSelect
                                        open={state.open}
                                        name="membership"
                                        list={membershipList.data}
                                        label="Seleccionar Afiliacion"
                                        onChange={handleChangeForm}
                                        disabled={membershipList.loading}
                                        value={!!form.membership ? form.membership : null}
                                        optionField="name"
                                        helperText=""
                                        loading={membershipList.loading}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={12}
                                    style={{ alignSelf: "center" }}
                                >
                                    <Button
                                        fullWidth
                                        onClick={handleOpenMap}
                                        startIcon={<RoomIcon />}
                                        color="primary"
                                        variant="contained"
                                    >
                                        Direccion
                                    </Button>
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </form>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button
                        variant="contained"
                        disabled={state.loading}
                        onClick={() => {
                            handleClose();
                        }}
                        color="primary"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="form-client"
                        variant="contained"
                        color="primary"
                        disabled={state.loading}
                        autoFocus
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullScreen
                open={openMap}
                onClose={handleCloseMap}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBarMap}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleCloseMap}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.titleMap}>
                            Seleccione la ubicacion
                        </Typography>
                        <Button
                            autoFocus
                            id="save-map"
                            color="inherit"
                            onClick={handleCloseMap}
                        >
                            Guardar
                        </Button>
                    </Toolbar>
                </AppBar>
                <MapContainer
                    center={
                        !!state.client.address ? state.client.address : center
                    }
                    zoom={16}
                    scrollWheelZoom={true}
                    style={{
                        height: "100%",
                        width: "100%"
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <DraggableMarker
                        position={{
                            state: form.address,
                            changeForm: handleChangeForm
                        }}
                    />
                </MapContainer>
            </Dialog>
        </Fragment>
    );
});

export default ClientForm;
