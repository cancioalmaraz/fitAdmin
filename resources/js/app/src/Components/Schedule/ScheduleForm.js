import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";

const ScheduleForm = ({
    onClose = () => { },
    open = false
}) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="dialog-title">{"Crear Horario"}</DialogTitle>
            <DialogContent>
                <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    locale={esLocale}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            xs={6}
                        >
                            <KeyboardTimePicker
                                margin="normal"
                                id="entry-time"
                                label="Hora de Entrada"
                                onChange={() => { }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                        >
                            <KeyboardTimePicker
                                margin="normal"
                                id="partiture-time"
                                label="Hora de Salida"
                                onChange={() => { }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={onClose} color="primary" autoFocus>
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ScheduleForm;