import React, { Fragment } from "react";
import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import ShowMoreText from "react-show-more-text";

const PaymentList = ({ paymentList = {}, showClientList = false }) => {
    return (
        <Fragment>
            {paymentList.data.length === 0 && !paymentList.loading && (
                <Grid item xs={12} style={{ color: "Black" }}>
                    <Typography>
                        No hay Pagos realizados por este cliente
                    </Typography>
                </Grid>
            )}
            {!paymentList.loading ? (
                paymentList.data.map(payment => (
                    <Grid
                        item
                        key={payment.id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                    >
                        <Paper elevation={3}>
                            <Grid container spacing={2} style={{ padding: 20 }}>
                                <Grid item xs={12}>
                                    ID: {payment.id}
                                </Grid>
                                <Grid item xs={12}>
                                    Fechas:
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    style={{ textAlign: "center" }}
                                >
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
                                {showClientList && (
                                    <Grid item xs={12}>
                                        Clientes:
                                        <ShowMoreText
                                            lines={2}
                                            more="Mas..."
                                            less="Menos..."
                                            expanded={false}
                                            width={400}
                                        >
                                            {payment.clients.map(client => (
                                                <Fragment key={client.id}>
                                                    {client.fullName} <br />
                                                </Fragment>
                                            ))}
                                        </ShowMoreText>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12} style={{ textAlign: "center", margin: 20 }}>
                    <CircularProgress />
                </Grid>
            )}
        </Fragment>
    );
};

export default PaymentList;
