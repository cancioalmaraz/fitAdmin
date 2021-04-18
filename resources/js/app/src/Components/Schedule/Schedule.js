import React from 'react';
import {Grid, Paper, Typography} from "@material-ui/core";
import moment from "moment";

const Schedule = ({
    schedule
                  }) => {

    const transformTime = (time) => {
        return moment(time, 'HH:mm:ss').add(moment().utcOffset() / 60, 'hours').format('HH:mm')
    };

    const handleClickSchedule = () => {
        console.log("Click");
    };

    return (
        <Grid
            item
            xs={2}
            style={{ cursor: 'pointer' }}
            onClick={handleClickSchedule}
        >
            <Paper
                elevation={3}
                style={{ padding: 20, textAlign: "center" }}
            >
                <hr/>
                <Typography
                    variant="subtitle1"
                >
                    { transformTime(schedule.entry_time) } - { transformTime(schedule.departure_time) }
                </Typography>
            </Paper>
        </Grid>
    );
}

export default Schedule;
