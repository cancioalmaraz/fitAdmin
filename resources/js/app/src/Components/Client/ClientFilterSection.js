import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";

import SearchIcon from '@material-ui/icons/Search';

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

                    <Grid item xs md={10}></Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            size="small"
                            color="primary"
                            variant="contained"
                            startIcon={<SearchIcon />}
                        >
                            Buscar
                        </Button>
                    </Grid>

                </Grid>
            </AccordionDetails>
        </Accordion>
    );
});

export default ClientFilterSection;
