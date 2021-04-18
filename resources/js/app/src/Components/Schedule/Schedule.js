import React from 'react';
import {Grid, Paper, Typography} from "@material-ui/core";

import Helpers from "../../Helpers/Helpers";

const Schedule = ({
    schedule,
    actionList = {}
                  }) => {

    const helpers = new Helpers();

    return (
        <Grid
            item
            xs={2}
            style={{ cursor: 'pointer' }}
            onClick={()=>{
                actionList.edit(schedule)
            }}
        >
            <Paper
                elevation={3}
                style={{ padding: 20, textAlign: "center" }}
            >
                <hr/>
                <Typography
                    variant="subtitle1"
                >
                    { helpers.transformTimeFromServer(schedule.entry_time) } - { helpers.transformTimeFromServer(schedule.departure_time) }
                </Typography>
            </Paper>
        </Grid>
    );
}

export default Schedule;
