import React, { Suspense } from "react";
import { BrowserRouter as ReactRouter, Route, Switch, Redirect } from "react-router-dom";
import PageNotFound from "shared/dist/components/PageNotFound";
import { connect } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";

import { setupRouteAuthentications } from "./Routes";
import { loginActions } from "../Services/Redux/actionCreators/userActions";
import PrivateRoute from "../Components/PrivateRoute";

class GlobalRouter extends React.Component {
  componentDidMount() {
    this.props.initApp();
  }

  render() {
    if (!this.props.isInitialized) {
      return <LinearProgress />;
    }

    const routes = setupRouteAuthentications();

    return (
      <ReactRouter>
        <Suspense fallback={<LinearProgress />}>
          <Switch>
            <Route
              path="/"
              exact
              render={() => <Redirect to={this.props.isLoggedIn ? routes.LANDING.path : routes.HOW_IT_WORKS.path} />}
            />

            {Object.values(routes).map(route => {
              if (route.redirectTo) {
                return (
                  <PrivateRoute
                    key={route.name}
                    path={route.path}
                    component={route.component}
                    isAllowed={route.isAllowed}
                    redirectTo={route.redirectTo}
                  />
                );
              }
              return <Route key={route.name} path={route.path} component={route.component} />;
            })}
            <Route component={() => <PageNotFound homePath="/" />} />
          </Switch>
        </Suspense>
      </ReactRouter>
    );
  }
}

const mapStateToProps = state => ({
  isInitialized: state.user.isInitialized,
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  initApp: () => dispatch(loginActions.initializeApplication),
});

export default connect(mapStateToProps, mapDispatchToProps)(GlobalRouter);
