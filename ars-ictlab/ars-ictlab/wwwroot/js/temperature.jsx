class Temperature extends React.Component{

  constructor(){
    super();
    this.state = {
      error: 0,
      temperature: {},
      isLoaded: false
    };
  }

  componentDidMount() {
      fetch("http://localhost:5000/Classroom/GetTemperature")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            error: result.error,
            temperature: result.temperature
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      )
  }

  render() {
    if(this.state.isLoaded){
        if (this.state.error == 0) {
          return <div>Temperatuur in lokaal H4312 is: {this.state.temperature.C} celcius / {this.state.temperature.F} fahrenheit</div>;
        } else {
          return <div>this.state.error</div>;
        }
    }

    return <div></div>;
  }

}

ReactDOM.render(
  <Temperature />,
  document.getElementById('react-temperature')
);
