import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import ClientPage from "../Components/Client/ClientPage";

const AppRouter = props => {
    return (
        <Router>
            <div style={{width: '100%'}}>
                <Switch>
                    <Route path="/">
                        <ClientPage {...props} />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    );
};

export default AppRouter;
