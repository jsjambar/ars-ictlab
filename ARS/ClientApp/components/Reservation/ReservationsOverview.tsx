// Imports
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Reservation, Error } from '../Model';
import { ReservationComponent } from './Reservation';
import * as api from '../Api';

// Helpers
import * as immutable from 'immutable';

// Authentication
import * as Authentication from '../Authentication';
import { Auth } from '../Authentication';

// State that gets used
export type AdminReservationsState = {
    reservations: immutable.List<Reservation> | "Loading...",
    auth: Auth,
    errors: immutable.List<Error>
}

export class AdminReservations extends React.Component<RouteComponentProps<{}>, AdminReservationsState> {
    constructor() {
        super();
        // Default value
        this.state = { 
            errors:immutable.List<Error>(),
            reservations: "Loading...",
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }

    // Begin authentication and getting the startup data
    componentWillMount():void{
        this.check_auth()
    }

    check_auth():void{
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}, () => this.getReservations()))
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }
    // End authentication and getting the startup data

    // Sets the error to be shown
    set_error(error: Error):void{
        const maybe_error: immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({ ...this.state, errors: this.state.errors.push(error) })
            : null
    }

    // Start getting the Reservations that needs to be shown
    getReservations():void{
        api.get_reservations()
            .then(reservations => this.setState({ reservations: reservations }))
            .catch(e => this.set_error({ num: 10, msg: "Reservations Not Found" }))
    }

    public render() {
        return <div className="column reservations">
            {
                this.state.auth.is_loggedin != false ?
                <div> 
                    <div>
                        {
                            this.state.errors.map(e => {
                            return <div className="alert alert-danger" role="alert">
                                    <p>{e.msg}</p>
                            </div>
                            })
                        }
                    </div>
                    <div className="page-header">
                        <h1>Reservations</h1>
                    </div>
                    {
                        this.state.reservations != "Loading..." ?
                            <div className="row tbl">
                                <div className="row head">
                                    <strong className="col-xs-1 first">#</strong>
                                    <strong className="col-xs-2">Classroom</strong>
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
                :
                <h4>No Access</h4>
            }
        </div>
    }
}
