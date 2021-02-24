import React, { Fragment, useEffect, useMemo, useState } from "react";
import "date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";

//Icons
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
    }
}));

const PaymentForm = React.memo(({ state, handleClose }) => {
    const initialState = useMemo(
        () => ({
            start_date: new Date(),
            end_date: new Date()
        }),
        []
    );

    const classes = useStyles();

    // State for Form
    const [form, setForm] = useState(initialState);

    const handleChangeForm = ({ target }) => {
        setForm(state => ({
            ...state,
            [target.name]: target.value
        }));
    };

    useEffect(() => {
        if (state.open) {
            setForm(initialState);
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
                    Realizar Pago
                </DialogTitle>
                <DialogContent>
                    <form
                        id="form-payment"
                        onSubmit={e => {
                            state.submit(e, form);
                        }}
                    >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid
                                container
                                spacing={3}
                                className={classes.form}
                            >
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        label="Desde"
                                        format="yyyy-MM-dd"
                                        value={form.start_date}
                                        onChange={date => {
                                            handleChangeForm({
                                                target: {
                                                    name: "start_date",
                                                    value: date
                                                }
                                            });
                                        }}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        label="Hasta"
                                        format="yyyy-MM-dd"
                                        value={form.end_date}
                                        onChange={date => {
                                            handleChangeForm({
                                                target: {
                                                    name: "end_date",
                                                    value: date
                                                }
                                            });
                                        }}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date"
                                        }}
                                    />
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
                        form="form-payment"
                        variant="contained"
                        color="primary"
                        disabled={state.loading}
                        autoFocus
                    >
                        Pagar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
});

export default PaymentForm;
