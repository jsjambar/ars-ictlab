import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Classrooms } from './components//classroom/Classrooms';
import { Users } from './components/user/Users';
import { Schedule } from './components/user/Schedule';
import { Reservations } from './components/Reservation/Reservations';
import { Login } from './components/user/Login';
import { ClassroomCreation } from './components/classroom/ClassroomCreation';

export const routes = <Layout>
    <Route exact path='/' component={ Login } />
    <Route path='/home' component={ Schedule } />
    <Route path='/classroom' component={ Classrooms } />
    <Route path='/user' component={ Users } />
    <Route path='/reservation' component={ Reservations } />
    <Route path='/admin/classrooms/create' component={ ClassroomCreation }/>
</Layout>;

