import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Classrooms } from './components/Classrooms';
import { Blog } from './components/Blog'
import { Users } from './components/User'
import { Register } from './components/Register'

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata' component={ FetchData } />
    <Route path='/classrooms' component={ Classrooms } />
    <Route path='/users' component={ Users } />
    <Route path='/register' component={ Register } />
</Layout>;

