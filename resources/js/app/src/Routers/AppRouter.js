import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Components
import ClientPage from "../Components/Client/ClientPage";
import CoachPage from "../Components/Coach/CoachPage";
import EventPage from "../Components/Event/EventPage";
import PaymentPage from "../Components/Payment/PaymentPage";

const AppRouter = props => {
    return (
        <div style={{ width: "100%" }}>
            <Switch>
                <Route exact path="/">
                    <ClientPage {...props} />
                </Route>
                <Route exact path="/coaches">
                    <CoachPage {...props} />
                </Route>
                <Route exact path="/payments">
                    <PaymentPage {...props} />
                </Route>
                <Route exact path="/events">
                    <EventPage {...props} />
                </Route>
                <Redirect to="/" />
            </Switch>
        </div>
    );
};

export default AppRouter;
