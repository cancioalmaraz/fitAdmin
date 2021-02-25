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
import esLocale from "date-fns/locale/es";

// Components
import FilterMultipleSelect from "../shared/FilterMultipleSelect";

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
            start_date: null,
            end_date: null,
            clientList: []
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
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                            <Grid
                                container
                                spacing={2}
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
                                        clearable
                                        clearLabel="Limpiar"
                                        cancelLabel="Cancelar"
                                        okLabel="Aceptar"
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
                                        clearable
                                        clearLabel="Limpiar"
                                        cancelLabel="Cancelar"
                                        okLabel="Aceptar"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FilterMultipleSelect
                                        name="clientList"
                                        label="Clientes"
                                        value={form.clientList}
                                        onChange={handleChangeForm}
                                        list={[
                                            { name: "David", id: 1 },
                                            { name: "Cancio", id: 50 }
                                        ]}
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
