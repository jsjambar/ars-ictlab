import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Ticket, Problem, User } from '../Model';
import * as immutable from 'immutable';

interface TicketState { 
    locationId: Number|0,
    classroomId: Number|0,
    problemId: Number|0,
    description: String|"",
    date: Date|0,
    receiveCopy:Boolean|false,
    userId: Number|0,
    problemOptions: string[][]|0,
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
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            }
        ];
        let problems = [["1","Hardware problem"],["2", "Software problem"],["3","Internet problem"],["4","Your problem"]]
        this.state = { 
            locationId: 0,
            classroomId: 0,
            problemId: 0,
            description: "",
            date: new Date(),
            receiveCopy: false,
            userId: sampleUser[0]["userId"],
            problemOptions: problems,
            solved: false
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyTicket = this.verifyTicket.bind(this);
    }

    populateOptions(arrayProblems) {
        return arrayProblems.map((arrayProblems, index) => (
          <option key={index} value={arrayProblems[0]}>{arrayProblems[1]}</option>
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
        if(values.locationId != 0 && values.classroomId != 0 && values.problemId != 0 &&
            values.description != ""){
            this.submitTicket();
        } else {
            // show errors for the missing values
            const a = new Object({ userId: values.userId, description: values.description, locationId: values.locationId, classroomId: values.classroomId, date: values.date, problemId: values.problemId, solved: values.solved });
            console.log(a);
        }
    }

    submitTicket() {
        const values = this.state;
        // api.set_ticket(new Object({ userId: values.userId, description: values.description, locationId: values.locationId, classroomId: values.classroomId, date: values.date, problemId: values.problemId, solved:values.solved }));
        // const a = new Object({ date: values.date, description: values.description, problemId: values.problemId, problem: values.problem, classroomId: values.classroomId, classroom: values.classroom, userId: values.userId, user: values.user});
        // console.log(a);
        const a = new Object({ userId: values.userId, description: values.description, locationId: values.locationId, classroomId: values.classroomId, date: values.date, problemId: values.problemId, solved:values.solved });
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
                    <select name='problemId' value={`${this.state.problemId}`} onChange={this.handleChange}>
                        <option value="0">Select a problem</option>
                        {this.populateOptions(this.state.problemOptions)}
                    </select>
                </div>
                <br/>
                <div className="location"> 
                    <label>Location:</label>
                    <select name='locationId' value={`${this.state.locationId}`} onChange={this.handleChange}>
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
                    <select name="classroomId" value={`${this.state.classroomId}`} onChange={this.handleChange}>
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
