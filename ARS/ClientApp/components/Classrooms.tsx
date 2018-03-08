import * as React from 'react';
import { RouteComponentProps } from 'react-router';


export class Classrooms extends React.Component<RouteComponentProps<{}>, {}> {
    constructor() {
        super();
        this.state = { currentCount: 0 };
    }

    public render() {
        return <div>
            <h1>Hi Jase!</h1>
        </div>;
    }

}
