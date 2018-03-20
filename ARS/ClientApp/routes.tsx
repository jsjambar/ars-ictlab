import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Classrooms } from './components//classroom/Classrooms';
import { Users } from './components/user/Users';
import { Schedule } from './components/user/Schedule';
import  { Helpdesk } from './components/helpdesk/Helpdesk';
import {TicketForm} from './components/helpdesk/TicketForm';
// import { Reservation } from './components/Reservation'

import { Reservations } from './components/Reservation/Reservations';
import { Login } from './components/user/Login';


export const routes = <Layout>
    <Route exact path='/' component={ Login } />
    <Route path='/home' component={ Schedule } />
    <Route path='/classroom' component={ Classrooms } />
    <Route path='/user' component={ Users } />
    <Route path='/Helpdesk' component={ Helpdesk } />
    <Route path='/helpdesk/TicketForm' component={TicketForm} />
    {/* <Route path='/reservation' component={ Reservation } /> */}
    <Route path='/reservation' component={ Reservations } />
</Layout>;

