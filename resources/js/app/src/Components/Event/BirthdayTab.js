import React from "react";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

// Hooks
import useGetClientBirthdays from "../../Hooks/useGetClientBirthdays";

// Components
import BirthdayClientPaper from "./BirthdayClientPaper";

const BirthdayTab = () => {
    const {
        previousBirthdayList,
        todayBirthdayList,
        tomorrowBirthdayList,
        nextBirthdayList
    } = useGetClientBirthdays();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {todayBirthdayList.loading ? (
                    <Skeleton variant="rect" height={200} animation="wave" />
                ) : (
                    <BirthdayClientPaper
                        title="Hoy"
                        birthdayClientList={todayBirthdayList.data}
                    />
                )}
            </Grid>
            <Grid item xs={12}>
                {tomorrowBirthdayList.loading ? (
                    <Skeleton variant="rect" height={200} animation="wave" />
                ) : (
                    <BirthdayClientPaper
                        title="Mañana"
                        birthdayClientList={tomorrowBirthdayList.data}
                    />
                )}
            </Grid>
            <Grid item xs={12}>
                {previousBirthdayList.loading ? (
                    <Skeleton variant="rect" height={200} animation="wave" />
                ) : (
                    <BirthdayClientPaper
                        title="Cumpleaños recientes"
                        birthdayClientList={previousBirthdayList.data}
                    />
                )}
            </Grid>
            <Grid item xs={12}>
                {nextBirthdayList.loading ? (
                    <Skeleton variant="rect" height={200} animation="wave" />
                ) : (
                    <BirthdayClientPaper
                        title="Proximamente"
                        birthdayClientList={nextBirthdayList.data}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default BirthdayTab;
