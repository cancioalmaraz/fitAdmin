import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    AppBar,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Slide from "@material-ui/core/Slide";

//Icons
import CloseIcon from "@material-ui/icons/Close";
import RoomIcon from "@material-ui/icons/Room";

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

const ClientForm = React.memo(({ state, handleClose, handleSubmit }) => {
    const classes = useStyles();

    const [form, setForm] = useState({});

    const handleChangeForm = ({ target }) => {
        setForm(state => ({
            ...state,
            [target.name]: target.value
        }));
    };

    // State map
    const [openMap, setOpenMap] = React.useState(false);

    const handleOpenMap = () => {
        setOpenMap(true);
    };

    const handleCloseMap = () => {
        setOpenMap(false);
    };

    useEffect(() => {
        if (state.open) {
            setForm(
                !!state.client.id
                    ? state.client
                    : {
                          ci: "",
                          name: "",
                          first_last_name: "",
                          second_last_name: "",
                          phone: "",
                          address: center
                      }
            );
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
                            handleSubmit(e, form);
                        }}
                    >
                        <Grid container spacing={3} className={classes.form}>
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

                            <Grid item xs={12}>
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

                            <Grid item xs={12} md={6}>
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
                            Mapa
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
                    center={center}
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
