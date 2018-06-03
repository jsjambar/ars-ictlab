import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User, Classroom, Location } from '../Model';
import * as immutable from 'immutable';
import { Link } from 'react-router-dom';

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
    solved: Boolean|false
}

export class TicketForm extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor() {
        super();
        let sampleUser = [
            {
                "userId": 1,
                "user": {
                    "username": "0910212",
                    "firstName": "Mark",
                    "lastName": "Thal"
                }
            }
        ];
        
        this.state = { 
            location_id: 0,
            classroom_id: 0,
            problem_id: 0,
            image: "",
            description: "",
            created_at: new Date(),
            receiveCopy: false,
            user_id: sampleUser[0]["userId"],
            problemOptions: immutable.List<Problem>(),
            locationOptions: immutable.List<Location>(),
            classroomOptions: immutable.List<Classroom>(),
            solved: false
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyTicket = this.verifyTicket.bind(this);
    }

    componentWillMount(){
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

    verifyTicket(){
        const values = this.state;
        if(values.location_id != 0 && values.classroom_id != 0 && values.problem_id != 0 &&
            values.description != ""){
            this.submitTicket();
        } else {
            // show errors for the missing values
            console.log(values.problemOptions);
            console.log(values.problem_id);
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
            user_id: values.user_id, 
            solved: values.solved}));
            window.location.replace('/helpdesk/overview');
    }

    public render() {
        return <div className="ticketForm">
            <div className="page-header">
                <h1>Ticket Form</h1>
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
                <div className="formButton row"> 
                    <Link className="btn btn-primary" onClick={this.verifyTicket} to={ '/Helpdesk/overview' }>Submit Ticket</Link>
                    <Link className="btn btn-danger" to={ '/Helpdesk/overview' }>Cancel</Link>
                </div>
            </form>
        </div>;
    }

}
