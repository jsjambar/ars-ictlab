import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as Authentication from './Authentication'
import { Auth } from './Authentication';
import * as api from './Api'
import { Error } from './Model'
import * as immutable from 'immutable'

export type NavMenuState = {auth:Auth, errors:immutable.List<Error>}

export class NavMenu extends React.Component<{}, NavMenuState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        }
    }

    componentWillMount(){
        this.check_auth()
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    logout_user(){
        api.logout_user()
        .then(() => window.location.replace('/login'))
        .catch(e => this.set_error({num:3, msg:"Logout Failed."}))
    }

    public render() {
        return <div className='main-nav'>
            <div>
                {
                    this.state.errors.map(e => {
                    return <div className="alert alert-danger" role="alert">
                            <p>{e.msg}</p>
                    </div>
                    })
                }
            </div>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>ARS</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    {
                        this.state.auth.permission == 0 ?
                            <ul className='nav navbar-nav'>
                                <li>
                                    <NavLink to={ '/login' } exact activeClassName='active'>
                                        <span className='glyphicon glyphicon-user'></span> Login
                                    </NavLink>
                                </li>
                            </ul>
                        : this.state.auth.permission == 1 ?
                            <ul className='nav navbar-nav'>
                                <li className='nameHeader'>{this.state.auth.user.first_name + " " + this.state.auth.user.last_name}</li>
                                <li>
                                    <NavLink to={ '/home' } activeClassName='active'>
                                        <span className='glyphicon glyphicon-home'></span> Home
                                    </NavLink>
                                </li>
                                <li>    
                                    <NavLink to={'/classrooms'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th-list'></span> Schedules
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to={'/reservation/overview'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th'></span> Reservations
                                    </NavLink>
                                </li>
                            
                                <li>
                                    <NavLink to={'/helpdesk/overview'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-info-sign'></span> Helpdesk
                                    </NavLink>
                                </li>
                                <li>
                                    <button className="btn btn-danger marginLeftBtn" onClick={() => this.logout_user()}>Logout</button>
                                </li>
                            </ul>
                        :
                            <ul className='nav navbar-nav'>
                                <li className='adminHeader'><span className='glyphicon glyphicon-cog'></span> Admin panel : {this.state.auth.user.first_name + " " + this.state.auth.user.last_name}</li>
                                <li>
                                    <NavLink to={'/admin/classrooms/overview'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th-list'></span> Classrooms
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to={'/admin/reservations/overview'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th'></span> Reservations
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to={'/admin/users/overview'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-user'></span> Users
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink to={'/helpdesk/overview'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-info-sign'></span> Helpdesk
                                    </NavLink>
                                </li>
                                <button className="btn btn-danger marginLeftBtn" onClick={() => this.logout_user()}>Logout</button>
                            </ul>
                    }
                </div>
            </div>
        </div>;
    }
}