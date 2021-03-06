import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import ShowMoreText from "react-show-more-text";

// Services
import PaymentService from "../../Services/PaymentService";

// Components
import Pagination from "../shared/Pagination";

const limit = 10;

const ClientDetailsPaymentsTab = () => {
    const params = useParams();

    const paymentService = new PaymentService();

    // State to PaymentList
    const [paymentList, setPaymentList] = useState({
        data: [],
        loading: true
    });

    const handleChangePage = (_, newPage) => {
        changePage(newPage);
    };

    // State to Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 0,
        offset: 0,
        totalItems: 0,
        totalItemsInPage: 0,
        loading: true
    });

    const settingPagination = useCallback(
        (data, page = pagination.page, offset = pagination.offset) => {
            setPagination(state => ({
                ...state,
                page: page,
                offset: offset,
                totalPages: Math.ceil(data.filterCount / limit),
                totalItems: data.filterCount,
                totalItemsInPage: data.results.length
            }));
        },
        [pagination.page, pagination.offset]
    );

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

    // Function page
    const chargePaymentList = ({
        page = pagination.page,
        offset = pagination.offset
    }) => {
        startLoading(setPaymentList);
        startLoading(setPagination);

        paymentService
            .getAll(limit, 0, { client: params.id })
            .then(httpSuccess => {
                setData(httpSuccess.data.results, setPaymentList);
                settingPagination(httpSuccess.data, page, offset);
            })
            .finally(() => {
                finishLoading(setPaymentList);
                finishLoading(setPagination);
            });
    };

    const changePage = newPage => {
        const newOffset = (newPage - 1) * limit;

        startLoading(setPaymentList);
        startLoading(setPagination);

        paymentService
            .getAll(limit, newOffset, { client: params.id })
            .then(httpSuccess => {
                setData(httpSuccess.data.results, setPaymentList);
                settingPagination(httpSuccess.data, newPage, newOffset);
            })
            .finally(() => {
                finishLoading(setPaymentList);
                finishLoading(setPagination);
            });
    };

    useEffect(() => {
        chargePaymentList(1, 0);
    }, []);

    return (
        <Grid container spacing={3}>
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
                            </Grid>
                        </Paper>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12} style={{ textAlign: "center", margin: 20 }}>
                    <CircularProgress />
                </Grid>
            )}
            {!pagination.loading && paymentList.data.length !== 0 && (
                <Grid item xs={12}>
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onChange={handleChangePage}
                        offset={pagination.offset}
                        totalItemsInPage={pagination.totalItemsInPage}
                        loading={pagination.loading}
                        subject="pago(s)"
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default ClientDetailsPaymentsTab;
