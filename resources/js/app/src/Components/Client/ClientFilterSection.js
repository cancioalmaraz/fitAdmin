import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";

const ClientFilterSection = React.memo(({ accordion = { state: false } }) => {
    return (
        <Accordion expanded={accordion.state}>
            <AccordionSummary
                style={{
                    height: 0,
                    maxHeight: 0,
                    minHeight: 0,
                    marginTop: 20
                }}
            ></AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={2}>
                        <TextField
                            fullWidth
                            label="Apellido P."
                        />
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <TextField
                            fullWidth
                            label="Coach"
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
});

export default ClientFilterSection;
