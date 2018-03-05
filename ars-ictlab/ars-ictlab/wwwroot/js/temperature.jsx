var Temperature = React.createClass({
  render: function() {
    return (
        <div className="temperature">
        Hello. It's currently 20 degrees in classroom H.x.xxx
        </div>
    );
  }
});

ReactDOM.render(
  <Temperature />,
  document.getElementById('react-temperature')
);
