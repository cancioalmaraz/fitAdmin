import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Components
import ClientPage from "../Components/Client/ClientPage";
import EventPage from "../Components/Event/EventPage";

const AppRouter = props => {
    return (
        <div style={{ width: "100%" }}>
            <Switch>
                <Route exact path="/">
                    <ClientPage {...props} />
                </Route>
                <Route exact path="/events">
                    <EventPage {...props} />
                </Route>
            </Switch>
        </div>
    );
};

export default AppRouter;
