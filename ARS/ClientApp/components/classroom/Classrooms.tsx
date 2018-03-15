import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface ScheduleState { location: String|0, classroom: String|0, selected:Boolean|false }

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        this.state = { 
            location: 0,
            classroom: 0,
            selected: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name] : value
        }, () => {
            const valid = this.validateValues();
        });
    }


    validateValues(){
        const values = this.state;

        if(values.location != 0 && values.classroom != 0){
            this.setState({
                selected: true
            })
        } else {
            this.setState({
                selected: true
            })
        }
    }

    public render() {
        return <div>
            <h1>Classrooms overview</h1>
            <p>Please select a location and classroom.</p>
            
        </div>;
    }

}
