import React, {useEffect, useMemo, useState} from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@material-ui/core";

// Icons
import ClearAllIcon from "@material-ui/icons/ClearAll";
import SearchIcon from "@material-ui/icons/Search";

// Components
import FilterSimpleSelect from "../shared/FilterSimpleSelect";

// Services
import CoachService from "../../Services/CoachService";
import ScheduleService from "../../Services/ScheduleService";
import MembershipService from "../../Services/MembershipService";

import StateHelper from "../../Helpers/StateHelper";

const ClientFilterSection = React.memo(
    ({ accordion = { state: false }, filter = {} }) => {
        const initFilters = useMemo(
            () => ({
                ci: "",
                first_last_name: "",
                second_last_name: "",
                schedule: null,
                coach: null,
                membership: null,
                sex: ""
            }),
            []
        );

        const stateHelper = new StateHelper();

        const scheduleService = new ScheduleService();
        const coachService = new CoachService();
        const membershipService = new MembershipService();

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

        // State to coaches
        const [coachList, setCoachList] = useState({
            data: [],
            loading: true
        });

        const chargeCoachList = () => {
            stateHelper.startLoading(setCoachList);
            coachService
                .getAll(10000, 0)
                .then(httpSuccess => {
                    stateHelper.setData(httpSuccess.data.results, setCoachList);
                })
                .finally(() => {
                    stateHelper.finishLoading(setCoachList);
                });
        };

        // State to memberships
        const [membershipList, setMembershipList] = useState({
            data: [],
            loading: true
        });

        const chargeMembershipList = () => {
            stateHelper.startLoading(setMembershipList);
            membershipService
                .getAll(10000, 0)
                .then(httpSuccess => {
                    stateHelper.setData(httpSuccess.data.results, setMembershipList);
                })
                .finally(() => {
                    stateHelper.finishLoading(setMembershipList);
                });
        };

        useEffect(()=>{
            chargeScheduleList();
            chargeCoachList();
            chargeMembershipList();
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
                />
                <AccordionDetails
                    style={{ padding: 25 }}
                >
                    <form
                        id="form-client-filters"
                        onSubmit={e => {
                            filter.search(e, {
                                ...form,
                                schedule: !!form.schedule ? form.schedule.id : null,
                                coach: !!form.coach ? form.coach.id : null,
                                membership: !!form.membership ? form.membership.id : null
                            });
                        }}
                        style={{ width: "100%" }}
                    >
                        <Grid container spacing={3}>

                            <Grid item container spacing={3}>
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
                                <Grid item xs={6} md={2}>
                                    <FormControl
                                        fullWidth
                                    >
                                        <InputLabel id="select-gender">Sexo</InputLabel>
                                        <Select
                                            name="sex"
                                            value={form.sex}
                                            labelId="select-gender"
                                            label="Sexo"
                                            onClick={handleChangeForm}
                                        >
                                            <MenuItem value="">
                                                <em>Ninguno</em>
                                            </MenuItem>
                                            <MenuItem value={"M"}>Masculino</MenuItem>
                                            <MenuItem value={"F"}>Femenino</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid item container spacing={3}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
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
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <FilterSimpleSelect
                                        name="coach"
                                        list={coachList.data}
                                        label="Seleccionar Coach"
                                        onChange={handleChangeForm}
                                        disabled={coachList.loading}
                                        value={form.coach}
                                        optionField="fullName"
                                        helperText=""
                                        loading={coachList.loading}
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <FilterSimpleSelect
                                        name="membership"
                                        list={membershipList.data}
                                        label="Seleccionar Afiliacion"
                                        onChange={handleChangeForm}
                                        disabled={membershipList.loading}
                                        value={form.membership}
                                        optionField="name"
                                        helperText=""
                                        loading={membershipList.loading}
                                        variant="standard"
                                    />
                                </Grid>
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
