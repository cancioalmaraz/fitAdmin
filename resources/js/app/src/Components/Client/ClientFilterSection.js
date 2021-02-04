import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
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
                <Typography>Filter Section</Typography>
            </AccordionDetails>
        </Accordion>
    );
});

export default ClientFilterSection;
