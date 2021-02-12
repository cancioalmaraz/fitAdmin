import React from "react";
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import ClientPage from "../Components/Client/ClientPage";

const AppRouter = props => {
    return (
        <div style={{width: '100%'}}>
            <Switch>
                <Route path="/">
                    <ClientPage {...props} />
                </Route>
                <Redirect to="/" />
            </Switch>
        </div>
    );
};

export default AppRouter;
