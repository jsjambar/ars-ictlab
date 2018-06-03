import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User, Classroom, Location } from '../Model';
import * as immutable from 'immutable';
import { Link } from 'react-router-dom';

interface TicketEditState {
    id: Number | 0,
    created_at: Date | 0,
    description: String | "",
    image: String | "",
    problem_id: Number | 0,
    classroom_id: Number | 0,
    user_id: Number | 0,
    location_id: Number | 0,
    receiveCopy: Boolean | false,
    problemOptions: immutable.List<Problem> | immutable.List<Problem>,
    locationOptions: immutable.List<Location> | immutable.List<Location>,
    classroomOptions: immutable.List<Classroom> | immutable.List<Classroom>,
    solved: boolean | false
}

export class TicketEdit extends React.Component<RouteComponentProps<{}>, TicketEditState> {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
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
            solved: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyTicket = this.verifyTicket.bind(this);
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        var ticket_id = Object.keys(params).map(function (key) { return params[key] })[0];
        this.getProblems();
        this.getLocations();
        this.getTicket(ticket_id);
    }

    handleChange(event) {
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

    getProblems() {
        api.getProblems()
            .then(problemOptions => this.setState({ problemOptions: problemOptions }))
            .catch(e => console.log("getProblems, " + e))
    }

    getLocations() {
        api.getLocations()
            .then(locationOptions => this.setState({ locationOptions: locationOptions }))
            .catch(e => console.log("getLocations, " + e))
    }

    getLocClassrooms(location_id) {
        api.getLocationClassrooms(location_id)
            .then(classroomOptions => this.setState({ classroomOptions: classroomOptions }))
            .catch(e => console.log("getLocationClassrooms, " + e))
    }

    getClassroom(classroomId) {
        api.getClassroom(classroomId)
            .then(classroom => this.setState(function (prevState, props) {
                this.setState({
                    location_id: classroom.location_id
                })
                this.getLocClassrooms(classroom.location_id);
            }))
            .catch(e => console.log("getClassroom, " + e))
    }

    populateOptions(options) {
        return options.map((options, index) => (
            <option key={index} value={options.id}>{options.name}</option>
        ));
    }

    verifyTicket() {
        const values = this.state;
        if (values.location_id != 0 && values.classroom_id != 0 && values.problem_id != 0 &&
            values.description != "") {
            this.submitTicketChanges();
        } else {
            // show errors for the missing values
            console.log(values.problemOptions);
            console.log(values.problem_id);
        }
    }

    submitTicketChanges() {
        const values = this.state;
        api.updateTicket(values.id, new Object({
            id: values.id,
            created_at: values.created_at,
            description: values.description,
            image: values.image,
            problem_id: values.problem_id,
            classroom_id: values.classroom_id,
            user_id: values.user_id,
            solved: values.solved
        }));

        window.location.replace('/helpdesk/overview');
    }

    getTicket(ticket_id) {
        api.getTicket(ticket_id)
            .then(ticket => this.setState(function (prevState, props) {
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
            .catch(e => console.log("getTicket, " + e))
    }

    public render() {
        return <div className="ticketForm">
            <div className="page-header">
                <h4>Ticket Form</h4>
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
                <br />
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
                <br />
                <div className="">
                    <div className="row">
                        <label>Description:</label>
                    </div>
                    <div className="row">
                        <textarea className="description" name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>
                    </div>
                </div>
                <br />
                <div className="row">
                    <input className="checkbox" type="checkbox" name="solved" onChange={this.handleChange} checked={this.state.solved} /> Ticket solved
                </div>
                <br />
                <div className="formButton row">
                    <Link className="btn btn-primary" onClick={this.verifyTicket} to={'/Helpdesk/overview'}>Submit Ticket</Link>
                    <Link className="btn btn-danger" to={'/Helpdesk/overview'}>Cancel</Link>
                </div>
            </form>
        </div>;
    }
}