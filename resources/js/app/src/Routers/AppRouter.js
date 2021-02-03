import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import HomePage from "../Components/shared/HomePage";

const AppRouter = props => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/">
                        <HomePage {...props} />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    );
};

export default AppRouter;
