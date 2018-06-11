import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User, Classroom, Location, Error } from '../Model';
import * as immutable from 'immutable';
import { Link } from 'react-router-dom';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication';
import * as moment from 'moment';

//State of Ticket form component
interface TicketState { 
    created_at: Date,
    description: String,
    problem_id: Number,
    classroom_id: Number,
    user_id: Number,
    location_id: Number,
    problemOptions: immutable.List<Problem>,
    locationOptions: immutable.List<Location>,
    classroomOptions: immutable.List<Classroom>,
    solved: Boolean,
    auth:Auth,
    errors:immutable.List<Error>
}

export class TicketForm extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor() {
        super();
        this.state = { 
            errors:immutable.List<Error>(),
            location_id: 0,
            classroom_id: 0,
            problem_id: 0,
            description: "",
            created_at: moment().toDate(),
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

     // Check the authentication of the user when mounting and handle accordingly
    componentWillMount():void{
        this.check_auth();
    }

    //Handle change event of dropdown boxes in the form
    handleChange(event):void{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name] : value
        })
        if(name == "location_id"){
           this.getLocClassrooms(value);
        }
    }

    //Authentication check
    check_auth():void{
        Authentication.check_auth()
        .then(r => { this.setState({...this.state, auth:r})})
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    //Handle authentication, 0 = not authenticated, 1 = user, 2 = admin
    handle_auth():void{
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        : this.handle_authenticated()
    }

    //Handle authenticated users
    handle_authenticated():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getProblems();
        this.getLocations();
    }

    // Set errors if they dont exist already
    set_error(error:Error):void{
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    //Get problems for the form  
    getProblems():void{
        api.getProblems()
        .then(problemOptions => this.setState({problemOptions:problemOptions}))
        .catch(e => this.set_error({num:13, msg:"Problems Not Found"}))
    }

    //Get locations for the form
    getLocations():void{
        api.getLocations()
        .then(locationOptions => this.setState({locationOptions:locationOptions}))
        .catch(e => this.set_error({num:8, msg:"Locations Not Found"}))
    }

    //Get classrooms of selected location for the form
    getLocClassrooms(location_id):void{
        api.getLocationClassrooms(location_id)
        .then(classroomOptions => this.setState({classroomOptions:classroomOptions}))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    //Populate the dropdown boxes of the form
    populateOptions(options):HTMLOptionElement{
        return options.map((options, index) => (
          <option key={index} value={options.id}>{options.name}</option>
        ));
      }

    //Check if all fields in form is filled in
    fieldCheck():boolean{
        const { description, location_id, classroom_id, problem_id } = this.state;
        return(
            description.length > 0 && location_id != 0 && classroom_id != 0 && problem_id != 0
        );
    }

    //Submit ticket if fieldcheck condition is met
    verifyTicket():void{
        if(this.fieldCheck){
            this.submitTicket();
        }
    }

    //Submit ticket
    submitTicket():void{
        const values = this.state;
        api.createTicket(new Object({ 
            created_at: moment(values.created_at).add(2, 'hours'), 
            description: values.description,
            problem_id: values.problem_id, 
            classroom_id: values.classroom_id, 
            user_id: values.auth.user.id, 
            solved: values.solved}));
        window.location.replace('/helpdesk/overview');
    }

    public render() {
        return <div className="ticketForm">
        {
            this.state.auth.is_loggedin != false ?
            <div>
                <div className="page-header">
                    <h1>Ticket Form</h1>
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
                    <br />
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
                    <div className=""> 
                        <div className="row">
                            <label>Description:</label>
                        </div>
                        <div className="row">
                            <textarea className="description" name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>
                        </div>
                    </div>
                    <br/>
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
            <h4>No Access</h4>
        }
        </div>;
    }
}
