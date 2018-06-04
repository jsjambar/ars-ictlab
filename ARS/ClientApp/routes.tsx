import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Classrooms } from './components//classroom/Classrooms';    
import { Users } from './components/user/Users';
import { Schedule } from './components/user/Schedule';
import  { Helpdesk } from './components/helpdesk/Helpdesk';
import {TicketForm} from './components/helpdesk/TicketForm';
import {TicketEdit} from './components/helpdesk/TicketEdit';
import { Reservations } from './components/Reservation/ReservationOverview';
import { ReservationEdit } from './components/Reservation/ReservationEdit';
import { Login } from './components/user/Login';
import { ClassroomCreation } from './components/classroom/ClassroomCreation';
import { ClassroomEdit } from './components/classroom/ClassroomEdit';
import { ClassroomOverview } from './components/classroom/ClassroomOverview';
import { Register } from './components/user/Register';
import { Calendar } from './components/Calendar'

export const routes = <Layout>
    <Route exact path='/' component={ Login } />
    <Route path='/login' component={ Login } />
    <Route path='/Register' component={ Register } />
    <Route path='/home' component={ Schedule } />
    <Route path='/classrooms' component={ Classrooms } />
    <Route path='/admin/users' component={ Users } />
    <Route path='/helpdesk/overview' component={ Helpdesk } />
    <Route path='/helpdesk/create' component={TicketForm} />
    <Route path='/helpdesk/tickets/:id/edit' component={ TicketEdit } />
    <Route path='/reservations' component={ Reservations } />
    <Route path='/admin/classrooms/overview' component={ ClassroomOverview }/>
    <Route path='/classroom' component={ Classrooms } />
    <Route path='/user' component={ Users } />
    <Route path='/reservation/overview' component={ Reservations } />
    <Route path='/reservation/:id/edit' component={ ReservationEdit } />
    <Route path='/admin/classrooms/create' component={ ClassroomCreation }/>
    <Route path='/admin/classrooms/:id/edit' component={ClassroomEdit} />
</Layout>;