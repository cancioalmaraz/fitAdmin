import React, { useCallback } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: "left",
        marginBottom: 20,
        color: "white"
    },
    paperRoot: {
        padding: 20,
        backgroundColor: "rgb(63, 81, 133)"
    },
    cardBirthday: {
        backgroundColor: "black",
        color: "white"
    }
}));

const BirthdayClientPaper = ({
    title = "Default Title",
    birthdayClientList = []
}) => {
    const classes = useStyles();

    const getTextToShowInInfoDate = useCallback(
        (remainingDaysToBirthday = 0) => {
            let textToShow = "";
            if (remainingDaysToBirthday < -1) {
                textToShow = `Hace ${-1 * remainingDaysToBirthday} dias`;
            }
            if (remainingDaysToBirthday === -1) {
                textToShow = "Ayer";
            }
            if (remainingDaysToBirthday === 0) {
                textToShow = `Hoy`;
            }
            if (remainingDaysToBirthday === 1) {
                textToShow = `Mañana`;
            }
            if (remainingDaysToBirthday > 1) {
                textToShow = `Dentro de ${remainingDaysToBirthday} dias`;
            }
            return textToShow;
        },
        []
    );

    return (
        <Paper elevation={2} className={classes.paperRoot}>
            <Grid container style={{ padding: 10 }}>
                <Grid className={classes.title} item xs={12}>
                    <Typography>{title}</Typography>
                </Grid>
                <Grid container spacing={5}>
                    {birthdayClientList.length === 0 && (
                        <Grid item xs={12} style={{ color: "white" }}>
                            <Typography>No hay cumpleaños</Typography>
                        </Grid>
                    )}
                    {birthdayClientList.map(client => (
                        <Grid
                            item
                            key={client.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            xl={2}
                        >
                            <Paper elevation={3} className={classes.cardBirthday}>
                                <Grid
                                    container
                                    spacing={2}
                                    style={{ padding: 20 }}
                                >
                                    <Grid item xs={12}>
                                        C.I: {client.ci}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {client.fullName}
                                    </Grid>
                                    <Grid
                                        item
                                        xs={8}
                                        style={{ textAlign: "left" }}
                                    >
                                        {getTextToShowInInfoDate(
                                            client.remaining_days_to_birthday
                                        )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        {client.remaining_days_to_birthday > 0
                                            ? client.age + 1
                                            : client.age}{" "}
                                        años
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BirthdayClientPaper;
