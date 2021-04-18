import React, { Fragment } from 'react';
import Schedule from "./Schedule";
import {Grid} from "@material-ui/core";

const ScheduleList = ({
    scheduleList = [],
    loading = true,
    actionList = {}
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
                    <Schedule key={schedule.id} schedule={schedule} actionList={actionList}/>
                ))
            }
        </Grid>
    );
}

export default ScheduleList;
