import React from "react";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const ClientActionSection = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={6} md={10}></Grid>
            <Grid item xs={6} md={2}>
                <Button
                    fullWidth
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Inscribir
                </Button>
            </Grid>
        </Grid>
    );
};

export default ClientActionSection;
