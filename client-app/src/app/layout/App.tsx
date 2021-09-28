import React, { Fragment } from 'react';

import { Container } from 'semantic-ui-react';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestErrors';

function App() {

    const location = useLocation();

    return (
        <>
            <Route exact path='/' component={HomePage} />
            <Route
                path={'/(.+)'}
                render={() => (
                    <>
                        <Navbar />
                        <Container style={{ marginTop: '7em' }}>
                            <Route exact path='/activities' component={ActivityDashboard} />
                            <Route path='/activities/:id' component={ActivityDetails} />
                            <Route key={location.key} path={['/createActivity', '/edit/:id']} component={ActivityForm} />
                            <Route path='/errors' component={TestErrors} />
                        </Container>
                    </>
                )}
            />
        </>
    );
}

export default observer(App);
