import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

const adminHeader = {
    color: '#9d9d9d',
    fontSize: '20px',
    listStyleType: 'none',
    paddingLeft: '15px',
    marginTop: '20px'
};

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return <div className='main-nav'>
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
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={ '/home' } exact activeClassName='active'>
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
                    </ul>
                    
                    <li style={adminHeader}><span className='glyphicon glyphicon-cog'></span> Admin panel</li>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/admin/classrooms/overview'} activeClassName='active'>
                                <span className='glyphicon glyphicon-list'></span> Classrooms
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/admin/users/overview'} activeClassName='active'>
                                <span className='glyphicon glyphicon-user'></span> Users
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/analytics'} activeClassName='active'>
                                <span className='glyphicon glyphicon-signal'></span> Analytics
                            </NavLink>
                        </li>
                    
                    </ul>
                </div>
            </div>
        </div>;
    }
}