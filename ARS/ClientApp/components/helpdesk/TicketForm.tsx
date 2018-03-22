import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User } from '../Model';
import * as immutable from 'immutable';

interface TicketState { 
    location: String|0, 
    classroom: String|0,
    problem: Problem|0,
    description: String|"",
    date: Date|0,
    receiveCopy:Boolean|false,
    userId: Number|0,
    user: immutable.List<User>|0
    problemOptions: string[]|0
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
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            }
        ];
        let problems = ["Hardware problem","Software problem","Internet problem","Your problem"]
        this.state = { 
            location: 0,
            classroom: 0,
            problem: 0,
            description: "",
            date: new Date(),
            receiveCopy: false,
            userId: sampleUser["userId"],
            user: immutable.List<User>(sampleUser),
            problemOptions: problems
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyTicket = this.verifyTicket.bind(this);
    }

    populateOptions(arrayProblems) {
        return arrayProblems.map((arrayProblems, index) => (
          <option key={index} value={arrayProblems}>{arrayProblems}</option>
        ));
      }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name] : value
        })
    }

    verifyTicket(){
        const values = this.state;
        // refactor this to a re-usable function
        if(values.location != 0 && values.classroom != 0 && values.problem != 0 &&
            values.description != ""){
            this.submitTicket();
        } else {
            // show errors for the missing values
        }
    }

    submitTicket() {
        const values = this.state;
        // api.set_ticket(new Object({ problem: values.problemId, location: values.location, room: values.classroom, description: values.description, date: values.date, time: values.time }));
        const a = new Object({ problem: values.problem, location: values.location, room: values.classroom, description: values.description, date: values.date, userId: values.userId, user: values.user});
        console.log(a);
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
                    <select name='problem' value={`${this.state.problemOptions}`} onChange={this.handleChange}>
                        <option value="0">Select a problem</option>
                        {this.populateOptions(this.state.problemOptions)}
                    </select>
                </div>
                <br/>
                <div className="location"> 
                    <label>Location:</label>
                    <select name='location' value={`${this.state.location}`} onChange={this.handleChange}>
                        <option value="0">Select a location</option>
                        <option value="1">Kralingse Zoom</option>
                        <option value="2">Kralingse Zoom</option>
                        <option value="3">Kralingse Zoom</option>
                        <option value="4">Kralingse Zoom</option>
                    </select>
                </div>
                <br/>
                <div className="classroom"> 
                    <label>Classroom:</label>
                    <select name="classroom" value={`${this.state.classroom}`} onChange={this.handleChange}>
                        <option value="0">Select a classroom</option>
                        <option value="0907662">H.4.312</option>
                        <option value="0907662">H.4.312</option>
                        <option value="0907662">H.4.312</option>
                        <option value="0907662">H.4.312</option>
                    </select>
                </div>
                <br/>
                <div className="description"> 
                    <label>Description:</label>
                    <textarea name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>
                </div>
                <br/>
                <div className="formButton"> 
                    <button type="button" name="submit_ticket" onClick={this.verifyTicket}>Submit ticket</button>
                    <button type="button" name="cancel_ticket">Cancel</button>
                </div>
            </form>
        </div>;
    }

}
