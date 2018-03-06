class ClassroomSelectionForm extends React.Component{

  constructor(){
    super();
    this.state = {
      location: 0,
      classroom: 0
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
        this.showClassroom(values.classroom);
    }
  }

  showClassroom(classroom){

    var ClassroomSchedule = React.createClass({
        render(){
            return (
                <div>
                    <iframe src={this.props.src} height={this.props.height} width={this.props.width} frameBorder="0" scrolling="no"></iframe>
                </div>
            )
        }
    });

    ReactDOM.render(
        <ClassroomSchedule src={"https://calendar.google.com/calendar/embed?src=" + classroom + "%40gmail.com&ctz=Europe%2FAmsterdam"} height="800px" width="1200px"/>, 
        document.getElementById('react-classroom-schedule')
    );
  }

  render() {
    return (
        <div>
            <label>Location</label>
            <select name="location" value={this.state.location} onChange={this.handleChange}>
                <option value="0">Select a location</option>
                <option value="1">Kralingse Zoom</option>
                <option value="2">Kralingse Zoom</option>
                <option value="3">Kralingse Zoom</option>
                <option value="4">Kralingse Zoom</option>
            </select>
                
            <label>Classroom</label>
            <select name="classroom" value={this.state.classroom} onChange={this.handleChange}>
                <option value="0">Select a classroom</option>
                <option value="1">H.4.312</option>
                <option value="2">H.4.312</option>
                <option value="3">H.4.312</option>
                <option value="4">H.4.312</option>
            </select>
        </div>
    );
  }

}

ReactDOM.render(
  <ClassroomSelectionForm />,
  document.getElementById('react-classroom-overview')
);

