import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    Box,
    Grid,
    makeStyles,
    TextField,
    Typography
} from "@material-ui/core";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

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
    }
}));

const center = {
    lat: -17.5151,
    lng: -63.1658
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

    useEffect(() => {
        if (state.open) {
            setForm(
                !!state.client.id
                    ? state.client
                    : {
                          name: "",
                          address: center
                      }
            );
        }
    }, [state.open]);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={state.open}
            onClose={handleClose}
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogTitle id="alert-dialog-title">
                {!!state.client.id ? "Editar Cliente" : "Inscribir Cliente"}
            </DialogTitle>
            <DialogContent>
                <form
                    id="form-client"
                    onSubmit={e => {
                        handleSubmit(e, form);
                    }}
                >
                    <Grid container spacing={5} className={classes.form}>
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
                        <Grid item xs={12}>
                            <Typography>
                                Direccion:
                            </Typography>
                            <MapContainer
                                center={center}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{
                                    height: 200,
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
    );
});

export default ClientForm;
