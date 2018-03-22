import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Location } from '../Model'

export type LocationComponentProps = {location:Location, key:number}

export class LocationComponent extends React.Component<LocationComponentProps, {}> {
    constructor() {
        super();
        this.state = {};
    }

    public render() {
        return <option 
            value="">
            {this.props.location}
            </option>
    }

}
