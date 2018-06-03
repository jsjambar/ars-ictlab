import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User, Classroom, Location } from '../Model';
import * as immutable from 'immutable';
import { Link } from 'react-router-dom';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication';

interface TicketState { 
    created_at: Date|0,
    description: String|"",
    image: String|"",
    problem_id: Number|0,
    classroom_id: Number|0,
    user_id: Number|0,
    location_id: Number|0,
    receiveCopy:Boolean|false,
    problemOptions: immutable.List<Problem>|immutable.List<Problem>,
    locationOptions: immutable.List<Location>|immutable.List<Location>,
    classroomOptions: immutable.List<Classroom>|immutable.List<Classroom>,
    solved: Boolean|false,
    auth:Auth
}

export class TicketForm extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor() {
        super();
        this.state = { 
            location_id: 0,
            classroom_id: 0,
            problem_id: 0,
            image: "",
            description: "",
            created_at: new Date(),
            receiveCopy: false,
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
        this.check_auth();
        this.getProblems();
        this.getLocations();
    }

    handleChange(event){
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

    check_auth(){
        Authentication.check_auth()
        .then(r => {
            this.setState({...this.state, auth:r})
        })
        .catch(e => console.log("Authenticate, " + e))
    }

    getProblems(){
        api.getProblems()
        .then(problemOptions => this.setState({problemOptions:problemOptions}))
        .catch(e => console.log("getProblems, " + e))
    }

    getLocations(){
        api.getLocations()
        .then(locationOptions => this.setState({locationOptions:locationOptions}))
        .catch(e => console.log("getLocations, " + e))
    }

    getLocClassrooms(location_id){
        api.getLocationClassrooms(location_id)
        .then(classroomOptions => this.setState({classroomOptions:classroomOptions}))
        .catch(e => console.log("getLocationClassrooms, " + e))
    }

    populateOptions(options) {
        return options.map((options, index) => (
          <option key={index} value={options.id}>{options.name}</option>
        ));
      }

    fieldCheck(){
        const { description, location_id, classroom_id, problem_id } = this.state;
        return(
            description.length > 0 && location_id != 0 && classroom_id != 0 && problem_id != 0
        );
    }
    verifyTicket(){
        const values = this.state;
        if(this.fieldCheck){
            this.submitTicket();
        }
    }

    submitTicket() {
        const values = this.state;
        api.createTicket(new Object({ 
            created_at: values.created_at, 
            description: values.description, 
            image: values.image, 
            problem_id: values.problem_id, 
            classroom_id: values.classroom_id, 
            user_id: values.auth.user.id, 
            solved: values.solved}));
        window.location.replace('/helpdesk/overview');
    }

    public render() {
        return <div>
            <div className="page-header">
                <h4>Ticket Form</h4>
            </div>
            <p>Fill in form before submitting ticket.</p>
            <form>
                <div className="problem"> 
                    <label>Problem type:</label>
                    <select name='problem_id' value={`${this.state.problem_id}`} onChange={this.handleChange}>
                        <option value="0">Select a problem</option>
                        {this.populateOptions(this.state.problemOptions)}
                    </select>
                </div>
                <br/>
                <div className="location"> 
                    <label>Location:</label>
                    <select name='location_id' value={`${this.state.location_id}`} onChange={this.handleChange}>
                        <option value="0">Select a location</option>
                        {this.populateOptions(this.state.locationOptions)}
                    </select>
                </div>
                <br/>
                <div className="classroom"> 
                    <label>Classroom:</label>
                    <select name="classroom_id" value={`${this.state.classroom_id}`} onChange={this.handleChange}>
                        <option value="0">Select a classroom</option>
                        {this.populateOptions(this.state.classroomOptions)}
                    </select>
                </div>
                <br/>
                <div className="description"> 
                    <label>Description:</label>
                    <textarea name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>
                </div>
                <br/>
                <div className="formButton"> 
                    {
                        !this.fieldCheck() ?
                        <button className="btn btn-primary" disabled={!this.fieldCheck()}>Submit Ticket</button>
                        :
                        <Link className="btn btn-primary" onClick={this.verifyTicket} to={ '/Helpdesk/overview' }>Submit Ticket</Link>
                    }
                    <Link className="btn btn-primary" to={ '/Helpdesk/overview' }>Cancel</Link>
                </div>
            </form>
        </div>;
    }

}
