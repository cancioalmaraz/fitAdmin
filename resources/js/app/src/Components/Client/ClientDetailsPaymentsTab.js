import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import ShowMoreText from "react-show-more-text";

// Services
import PaymentService from "../../Services/PaymentService";

const ClientDetailsPaymentsTab = () => {
    const params = useParams();

    const paymentService = new PaymentService();

    // State to PaymentList
    const [paymentList, setPaymentList] = useState({
        data: [],
        loading: true
    });

    const chargePaymentList = () => {
        startLoading(setPaymentList);
        paymentService
            .getAll(1000, 0, { client: params.id })
            .then(httpSuccess => {
                setData(httpSuccess.data.results, setPaymentList);
            })
            .finally(() => {
                finishLoading(setPaymentList);
            });
    };

    // Functions to change states
    const setData = (data = {}, setList) => {
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

    useEffect(() => {
        chargePaymentList();
    }, []);

    return (
        <Grid container spacing={3}>
            {paymentList.data.length === 0 && (
                <Grid item xs={12} style={{ color: "white" }}>
                    <Typography>
                        No hay Pagos realizados por este cliente
                    </Typography>
                </Grid>
            )}
            {paymentList.data.map(payment => (
                <Grid item key={payment.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Paper elevation={3}>
                        <Grid container spacing={2} style={{ padding: 20 }}>
                            <Grid item xs={12}>
                                ID: {payment.id}
                            </Grid>
                            <Grid item xs={12}>
                                Fechas:
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                {payment.start_date} a {payment.end_date}
                            </Grid>
                            <Grid item xs={12}>
                                Monto: Bs. {payment.payment_amount}
                            </Grid>
                            {payment.notes && (
                                <Grid item xs={12}>
                                    Notas:
                                    <ShowMoreText
                                        lines={1}
                                        more="Mas..."
                                        less="Menos..."
                                        expanded={false}
                                    >
                                        {payment.notes}
                                    </ShowMoreText>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default ClientDetailsPaymentsTab;
