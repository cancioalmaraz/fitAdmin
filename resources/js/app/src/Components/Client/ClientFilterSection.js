import React, { useMemo, useState } from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";

// Icons
import ClearAllIcon from "@material-ui/icons/ClearAll";
import SearchIcon from "@material-ui/icons/Search";

const ClientFilterSection = React.memo(
    ({ accordion = { state: false }, filter = {} }) => {
        const initFilters = useMemo(
            () => ({
                ci: "",
                first_last_name: ""
            }),
            []
        );

        const [form, setForm] = useState(initFilters);

        const handleChangeForm = ({ target }) => {
            setForm(state => ({
                ...state,
                [target.name]: target.value
            }));
        };

        const clearFilters = () => {
            setForm(initFilters);
            filter.charge();
        };

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
                    <form
                        id="form-client-filters"
                        onSubmit={e => {
                            filter.search(e, form);
                        }}
                        style={{ width: "100%" }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth
                                    label="C.I."
                                    type="number"
                                    name="ci"
                                    value={form.ci}
                                    onChange={handleChangeForm}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth
                                    label="Apellido P."
                                    name="first_last_name"
                                    value={form.first_last_name}
                                    onChange={handleChangeForm}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </AccordionDetails>
                <Divider />
                <AccordionActions style={{ justifyContent: "space-between" }}>
                    <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={clearFilters}
                        startIcon={<ClearAllIcon />}
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="submit"
                        form="form-client-filters"
                        size="small"
                        color="primary"
                        variant="contained"
                        startIcon={<SearchIcon />}
                    >
                        Buscar
                    </Button>
                </AccordionActions>
            </Accordion>
        );
    }
);

export default ClientFilterSection;
