import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { Reservation } from '../Model'
import { ReservationComponent } from './Reservation'

import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

export type ReservationsState = { reservations: immutable.List<Reservation> | "Loading...", auth:Auth }

export class Reservations extends React.Component<RouteComponentProps<{}>, ReservationsState> {
    constructor() {
        super();
        this.state = { 
            reservations: "Loading...",
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }

    componentWillMount() {
        this.check_auth()
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}, () => this.getReservations()))
        .catch(e => console.log(e))
    }

    getReservations() {
        api.getUserReservations(this.state.auth.user.id)
        .then(reservations => this.setState({ reservations: reservations }))
        .catch(e => console.log("getReservations, " + e))
    }
    
    public render() {
        return <div className="column reservations">
            <div className="page-header">
                <h1>Reservations</h1>
            </div>
            {
                this.state.reservations != "Loading..." ?
                    <div className="row tbl">
                        <div className="row head">
                            <strong className="col-xs-1 first">#</strong>
                            <strong className="col-xs-2">Classroom Id</strong>
                            <strong className="col-xs-3 col-sm-2">Date of reservation</strong>
                            <strong className="col-xs-2">Start Time</strong>
                            <strong className="col-xs-2">End Time</strong>
                            <strong className="col-xs-2 col-sm-3 last"></strong>
                        </div>
                        <div className="row body">
                            {this.state.reservations.map((u, k) => <ReservationComponent key={k} reservation={u} />)}
                        </div>
                    </div>
                    : "Loading..."
            }
        </div>
    }

}
