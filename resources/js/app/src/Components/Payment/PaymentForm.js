import React, { Fragment, useEffect, useMemo, useState } from "react";
import "date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import NumberFormat from "react-number-format";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import esLocale from "date-fns/locale/es";

// Components
import FilterMultipleSelect from "../shared/FilterMultipleSelect";

// Services
import ClientService from "../../Services/ClientService";

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

const NumberFormatCustom = props => {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator
            isNumericString
            prefix="Bs. "
        />
    );
};

const PaymentForm = React.memo(({ state, handleClose }) => {
    const initialState = useMemo(
        () => ({
            start_dateFull: new Date(),
            end_dateFull: new Date(),
            clientListGross: !!state.client ? [state.client] : [],
            notes: "",
            payment_amount: 0
        }),
        [state.client]
    );

    const classes = useStyles();

    const clientService = new ClientService();

    // State for Form
    const [form, setForm] = useState(initialState);

    const handleChangeForm = ({ target }) => {
        setForm(state => ({
            ...state,
            [target.name]: target.value
        }));
    };

    // State to clients
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

    useEffect(() => {
        if (state.open) {
            startLoadingClientList();
            setForm(initialState);
            clientService
                .getAll(1000, 0)
                .then(httpSuccess => {
                    chargeClientList(httpSuccess.data.results);
                })
                .finally(() => {
                    finishLoadingClientList();
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
                <DialogTitle style={{ textAlign: "center" }} disableTypography>
                    <Typography variant="h6">
                        Realizar Pago {!!state.client && "de:"}
                    </Typography>

                    {!!state.client && (
                        <Typography variant="subtitle1">
                            {`C.I : ${state.client.ci} - ${state.client.fullName}`}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    <form
                        id="form-payment"
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
                                spacing={2}
                                className={classes.form}
                            >
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        label="Desde"
                                        format="yyyy-MM-dd"
                                        inputVariant="outlined"
                                        value={form.start_dateFull}
                                        onChange={date => {
                                            handleChangeForm({
                                                target: {
                                                    name: "start_dateFull",
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
                                <Grid item xs={12} sm={6}>
                                    <KeyboardDatePicker
                                        margin="normal"
                                        label="Hasta"
                                        format="yyyy-MM-dd"
                                        inputVariant="outlined"
                                        value={form.end_dateFull}
                                        onChange={date => {
                                            handleChangeForm({
                                                target: {
                                                    name: "end_dateFull",
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
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name="payment_amount"
                                        label="Monto de Pago"
                                        fullWidth
                                        variant="outlined"
                                        autoComplete="off"
                                        value={form.payment_amount}
                                        onChange={handleChangeForm}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom
                                        }}
                                    />
                                </Grid>
                                {!state.client && (
                                    <Grid item xs={12}>
                                        <FilterMultipleSelect
                                            required
                                            disabled={clientList.loading}
                                            name="clientListGross"
                                            label="Clientes"
                                            value={form.clientListGross}
                                            onChange={handleChangeForm}
                                            list={clientList.data}
                                            optionField="fullName"
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        name="notes"
                                        label="Notas"
                                        multiline
                                        fullWidth
                                        rows={6}
                                        variant="outlined"
                                        value={form.notes}
                                        onChange={handleChangeForm}
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
