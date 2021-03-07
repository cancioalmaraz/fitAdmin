import React, { useCallback, useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";

// Services
import PaymentService from "../../Services/PaymentService";

// Components
import Pagination from "../shared/Pagination";
import PaymentList from "../Payment/PaymentList";

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
        <Grid container item spacing={3}>
            <PaymentList paymentList={paymentList} />

            <Grid item xs={12}>
                {!pagination.loading && paymentList.data.length !== 0 && (
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
                )}
            </Grid>
        </Grid>
    );
};

export default ClientDetailsPaymentsTab;
