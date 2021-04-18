import React, {useEffect, useMemo, useState} from "react";
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

// Components
import FilterSimpleSelect from "../shared/FilterSimpleSelect";

// Services
import ScheduleService from "../../Services/ScheduleService";

import StateHelper from "../../Helpers/StateHelper";

const ClientFilterSection = React.memo(
    ({ accordion = { state: false }, filter = {} }) => {
        const initFilters = useMemo(
            () => ({
                ci: "",
                first_last_name: "",
                second_last_name: "",
                schedule: null
            }),
            []
        );

        const stateHelper = new StateHelper();

        const scheduleService = new ScheduleService();

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

        // State to schedules
        const [scheduleList, setScheduleList] = useState({
            data: [],
            loading: true
        });

        const chargeScheduleList = () => {
            stateHelper.startLoading(setScheduleList);
            scheduleService
                .getAll(10000, 0)
                .then(httpSuccess => {
                    stateHelper.setData(httpSuccess.data.results, setScheduleList);
                })
                .finally(() => {
                    stateHelper.finishLoading(setScheduleList);
                });
        };

        useEffect(()=>{
            chargeScheduleList();
        }, []);

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
                <AccordionDetails
                    style={{ padding: 25 }}
                >
                    <form
                        id="form-client-filters"
                        onSubmit={e => {
                            filter.search(e, {
                                ...form,
                                schedule: !!form.schedule ? form.schedule.id : null
                            });
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
                                    autoComplete="off"
                                    value={form.ci}
                                    onChange={handleChangeForm}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth
                                    label="Apellido P."
                                    name="first_last_name"
                                    autoComplete="off"
                                    value={form.first_last_name}
                                    onChange={handleChangeForm}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    fullWidth
                                    label="Apellido M."
                                    name="second_last_name"
                                    autoComplete="off"
                                    value={form.second_last_name}
                                    onChange={handleChangeForm}
                                />
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                            >
                                <FilterSimpleSelect
                                    name="schedule"
                                    list={scheduleList.data}
                                    label="Seleccionar Horario"
                                    onChange={handleChangeForm}
                                    disabled={scheduleList.loading}
                                    value={form.schedule}
                                    optionField="fullTime"
                                    helperText=""
                                    loading={scheduleList.loading}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </AccordionDetails>
                <Divider />
                <AccordionActions>
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
