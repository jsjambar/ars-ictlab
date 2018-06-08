import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User, Classroom, Location, Error } from '../Model';
import * as immutable from 'immutable';
import { Link } from 'react-router-dom';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication';

interface TicketEditState {
    id: Number, 
    created_at: Date,
    description: String,
    problem_id: Number,
    classroom_id: Number,
    user_id: Number,
    location_id: Number,
    problemOptions: immutable.List<Problem>,
    locationOptions: immutable.List<Location>,
    classroomOptions: immutable.List<Classroom>,
    solved: boolean,
    auth:Auth,
    errors:immutable.List<Error>
}

export class TicketEdit extends React.Component<RouteComponentProps<{}>, TicketEditState> {
    constructor(props) {
        super(props);
        this.state = { 
            errors:immutable.List<Error>(),
            id:0,
            location_id: 0,
            classroom_id: 0,
            problem_id: 0,
            description: "",
            created_at: new Date(),
            user_id: 0,
            problemOptions: immutable.List<Problem>(),
            locationOptions: immutable.List<Location>(),
            classroomOptions: immutable.List<Classroom>(),
            solved: false,
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            } 
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyTicket = this.verifyTicket.bind(this);
    }

    componentWillMount(){
        this.check_auth()
        const { match: { params } } = this.props
        var ticket_id = Object.keys(params).map(function(key){return params[key]})[0]
        api.getTicket(ticket_id)
        .then(r => {r.hasOwnProperty('error') ? window.location.replace('helpdesk/overview') : null; return r})
        .then(ticket => this.check_ticket(ticket))
        .catch(e => this.set_error({num:20, msg:"Something went wrong with the ticket."}))
    }

    check_ticket(ticket){
        if(ticket.user_id != this.state.auth.user.id){
            this.state.auth.permission != 2 ? window.location.replace('helpdesk/overview'):null
        }
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => {this.setState({...this.state, auth:r})})
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        : this.handle_authenticated()
    }

    handle_authenticated(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        const { match: { params } } = this.props;
        var ticket_id = Object.keys(params).map(function(key){return params[key]})[0];
        this.getProblems();
        this.getLocations();
        this.getTicket(ticket_id);
    }

    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
        if (name == "location_id") {
            this.getLocClassrooms(value);
        }
    }

    //Get problem for the form
    getProblems() {
        api.getProblems()
        .then(problemOptions => this.setState({problemOptions:problemOptions}))
        .catch(e => this.set_error({num:13, msg:"Problems Not Found"}))
    }

    //Get locations for the form
    getLocations() {
        api.getLocations()
        .then(locationOptions => this.setState({locationOptions:locationOptions}))
        .catch(e => this.set_error({num:8, msg:"Locations Not Found"}))
    }

    //Get classrooms of selected location
    getLocClassrooms(location_id) {
        api.getLocationClassrooms(location_id)
        .then(classroomOptions => this.setState({classroomOptions:classroomOptions}))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    //Get classroom
    getClassroom(classroomId) {
        api.getClassroom(classroomId)
        .then(classroom => this.setState(function(prevState, props){
            this.setState({
                location_id: classroom.location_id
            })
            this.getLocClassrooms(classroom.location_id);
        }))
        .catch(e => this.set_error({num:9, msg:"Classroom Not Found"}))
    }

    //Fill dropdown (problems, locations, classrooms) with options 
    populateOptions(options) {
        return options.map((options, index) => (
            <option key={index} value={options.id}>{options.name}</option>
        ));
    }

    //Check if all field are filled in
    fieldCheck(){
        const { description, location_id, classroom_id, problem_id } = this.state;
        return(
            description.length > 0 && location_id != 0 && classroom_id != 0 && problem_id != 0
        );
    }

    verifyTicket(){
        const values = this.state;
        if(this.fieldCheck){
            this.submitTicketChanges();
        }
    }

    //Update ticket
    submitTicketChanges() {
        const values = this.state;
        api.updateTicket(values.id, new Object({
            id: values.id,
            created_at: values.created_at,
            description: values.description, 
            problem_id: values.problem_id, 
            classroom_id: values.classroom_id,
            user_id: values.user_id,
            solved: values.solved}));
            window.location.replace('/helpdesk/overview');
    }

    //Retrieve ticket to show info in form
    getTicket(ticket_id) {
        api.getTicket(ticket_id)
        .then(ticket => this.setState(function(prevState, props){
            this.setState({
            id: ticket.id,
            classroom_id: ticket.classroom_id,
            problem_id: ticket.problem_id,
            created_at: ticket.created_at,
            description: ticket.description,
            user_id: ticket.user_id,
            solved: ticket.solved,
        })
        this.getClassroom(ticket.classroom_id);
        }))
        .catch(e => this.set_error({num:14, msg:"Ticket Not Found"}))
    }

    public render() {
        return <div className="ticketForm">
            {
                this.state.auth.is_loggedin != false && this.state.auth.user.id == this.state.user_id || this.state.auth.permission == 2?
                    <div>
                        <div className="page-header">
                            <h4>Ticket Form</h4>
                        </div>
                        <div>
                            {
                                this.state.errors.map(e => {
                                return <div className="alert alert-danger" role="alert">
                                        <p>{e.msg}</p>
                                </div>
                                })
                            }
                        </div>
                        <p>Fill in form before submitting ticket.</p>
                        <form>
                            <div className="problem">
                                <div className="row">
                                    <label>Problem type:</label>
                                </div>
                                <div className="row">
                                    <select name='problem_id' value={`${this.state.problem_id}`} onChange={this.handleChange}>
                                        <option value="0">Select a problem</option>
                                        {this.populateOptions(this.state.problemOptions)}
                                    </select>
                                </div>
                            </div>
                            <br/>
                            <div className="location">
                                <div className="row">
                                    <label>Location:</label>
                                </div>
                                <div className="row">
                                    <select name='location_id' value={`${this.state.location_id}`} onChange={this.handleChange}>
                                        <option value="0">Select a location</option>
                                        {this.populateOptions(this.state.locationOptions)}
                                    </select>
                                </div>
                            </div>
                            <br/>
                            <div className="classroom">
                                <div className="row">
                                    <label>Classroom:</label>
                                </div>
                                <div className="row">
                                    <select name="classroom_id" value={`${this.state.classroom_id}`} onChange={this.handleChange}>
                                        <option value="0">Select a classroom</option>
                                        {this.populateOptions(this.state.classroomOptions)}
                                    </select>
                                </div>
                            </div>
                            <br/>
                            <div> 
                                <div className="row">
                                  <label>Description:</label>
                                </div>
                                <div className="row">
                                  <textarea className="description" name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>
                                </div>
                            </div>
                            <br/>
                            {
                                this.state.auth.user.role_id == 2 ?
                                <div>
                                    <input type="checkbox" name="solved" onChange={this.handleChange} checked={this.state.solved} /> Ticket solved
                                    <br/>
                                    <br/>
                                </div>
                                :
                                <br/>
                            }
                            <div className="formButton">
                                {
                                    !this.fieldCheck() ?
                                    <button className="btn btn-primary" disabled={!this.fieldCheck()}>Submit Ticket</button>
                                    :
                                    <Link className="btn btn-primary" onClick={this.verifyTicket} to={ '/Helpdesk/overview' }>Submit Ticket</Link>
                                } 
                                <Link className="btn btn-danger" to={ '/Helpdesk/overview' }>Cancel</Link>
                            </div>
                        </form>
                    </div>
                :
                <h4>no access</h4>
            }
        </div>;
    }
}