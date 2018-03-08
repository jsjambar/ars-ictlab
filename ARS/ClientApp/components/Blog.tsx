import * as React from 'react';
import { RouteComponentProps } from 'react-router';


export class Blog extends React.Component<RouteComponentProps<{}>, {}> {
    constructor() {
        super();
        this.state = { currentCount: 0 };
    }

    public render() {
        return <div>
            <h1>Blog page</h1>
        </div>;
    }

}
