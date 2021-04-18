import React, { Fragment } from 'react';
import Schedule from "./Schedule";
import {Grid} from "@material-ui/core";

const ScheduleList = ({
    scheduleList = [],
    loading = true
                      }) => {
    return (
        <Grid
         container
         spacing={3}
         style={{ marginTop: 20 }}
        >
            {
                !loading &&
                scheduleList.map(schedule => (
                    <Schedule key={schedule.id} schedule={schedule} />
                ))
            }
        </Grid>
    );
}

export default ScheduleList;
