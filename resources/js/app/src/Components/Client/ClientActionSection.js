import React from "react";
import { Button, Grid, Hidden } from "@material-ui/core";

// Icons
import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from '@material-ui/icons/FilterList';

const ClientActionSection = React.memo(({accordion}) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={6} md={2}>
                <Button
                    fullWidth
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={accordion.state ? accordion.close : accordion.open}
                >
                    Filtros
                </Button>
            </Grid>
            <Hidden xsDown>
                <Grid item md={8}></Grid>
            </Hidden>
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
});

export default ClientActionSection;
