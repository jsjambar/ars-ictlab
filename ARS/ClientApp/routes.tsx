import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Classrooms } from './components//classroom/Classrooms';
import { Users } from './components/user/Users';
import { Schedule } from './components/user/Schedule';
import  { Helpdesk } from './components/helpdesk/Helpdesk';
// import { Reservation } from './components/Reservation'

export const routes = <Layout>
    <Route exact path='/' component={ Schedule } />
    <Route path='/classroom' component={ Classrooms } />
    <Route path='/user' component={ Users } />
    <Route path='/Helpdesk' component={ Helpdesk } />
    {/* <Route path='/reservation' component={ Reservation } /> */}
</Layout>;

