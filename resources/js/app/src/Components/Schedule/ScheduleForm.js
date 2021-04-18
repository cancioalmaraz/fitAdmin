import React, {useEffect, useState} from 'react';
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
import Helpers from "../../Helpers/Helpers";
import ScheduleService from "../../Services/ScheduleService";

const now = moment().hours(7).minutes(0).seconds(0);

const ScheduleForm = ({
    action = () => { },
    onDelete = () => { },
    onClose = () => { },
    open = false,
    value = null
}) => {

    const helpers = new Helpers();

    const scheduleService = new ScheduleService();

    const [schedule, setSchedule] = useState({
        ...value,
        entry_time: now.toDate(),
        departure_time: now.add(1, 'hours').toDate()
    });

    const handleChangeTime = ( target ) => {
        setSchedule(state=>({
            ...state,
            [target.name]: target.value
        }));
    };

    useEffect(() => {
        if (open){
            if(!!value){
                setSchedule(state => ({
                    ...state,
                    ...value,
                    entry_time: moment( helpers.transformTimeFromServer(value.entry_time), 'HH:mm' ).toDate(),
                    departure_time: moment( helpers.transformTimeFromServer(value.departure_time), 'HH:mm' ).toDate()
                }))
            } else {
                setSchedule(state => ({
                    ...state,
                    ...value,
                    entry_time: moment().hours(7).minutes(0).seconds(0).toDate(),
                    departure_time: moment().hours(7).minutes(0).seconds(0).add(1, 'hours').toDate()
                }))
            }
        }
    }, [open]);


    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="dialog-title">{ !!value ? "Editar Horario" : "Crear Horario" }</DialogTitle>
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
                                ampm={false}
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
                                ampm={false}
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
                {
                    !!value &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={()=>{onDelete(schedule)}}
                        >
                            Eliminar
                        </Button>
                }

                <Button
                    onClick={onClose}
                    color="primary"
                    variant="contained"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={()=>{
                        action(schedule);
                    }}
                    variant="contained"
                    color="primary" autoFocus
                >
                    Crear
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ScheduleForm;
