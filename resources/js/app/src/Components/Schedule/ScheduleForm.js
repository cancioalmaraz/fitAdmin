import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import moment from "moment";

const now = moment().hours(7).minutes(0).seconds(0);

const ScheduleForm = ({
    create = () => { },
    onClose = () => { },
    open = false
}) => {

    const [schedule, setSchedule] = useState({
        entry_time: now.toDate(),
        departure_time: now.add(1, 'hours').toDate()
    });

    const handleChangeTime = ( target ) => {
        setSchedule(state=>({
            ...state,
            [target.name]: target.value
        }));
    };

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
                                onChange={(e)=>{
                                    handleChangeTime({
                                        name: "entry_time",
                                        value: e
                                    });
                                }}
                                value={schedule.entry_time}
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
                                id="departure-time"
                                label="Hora de Salida"
                                onChange={(e)=>{
                                    handleChangeTime({
                                        name: "departure_time",
                                        value: e
                                    });
                                }}
                                value={schedule.departure_time}
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
                <Button
                    onClick={()=>{
                        create(schedule);
                    }}
                    color="primary" autoFocus
                >
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ScheduleForm;
