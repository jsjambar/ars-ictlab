import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Classrooms } from './components//classroom/Classrooms';    
import { Users } from './components/user/Users';
import { Schedule } from './components/user/Schedule';
import { Reservations } from './components/Reservation/ReservationOverview';
import { ReservationEdit } from './components/Reservation/ReservationEdit';
import { Login } from './components/user/Login';
import { ClassroomCreation } from './components/classroom/ClassroomCreation';
import { ClassroomEdit } from './components/classroom/ClassroomEdit';

export const routes = <Layout>
    <Route exact path='/' component={ Login } />
    <Route path='/home' component={ Schedule } />
    <Route path='/classroom' component={ Classrooms } />
    <Route path='/user' component={ Users } />
    <Route path='/reservation/overview' component={ Reservations } />
    <Route path='/reservation/:id/edit' component={ ReservationEdit } />
    <Route path='/admin/classrooms/create' component={ ClassroomCreation }/>
    <Route path='/admin/classrooms/:id/edit' component={ ClassroomEdit } />
</Layout>;

