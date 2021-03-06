import React from 'react';
import './App.css';
import { Component } from 'react'

class WebSocketListener extends Component {

  // instance of websocket connection as a class property
  //ws = new WebSocket('ws://localhost:8080/Laputa')
    constructor(props) {
      super(props);

      this.state = {
          ws: null,
          messages: [],
          toSend:''
      };
  }

    // single websocket instance for the own application and constantly trying to reconnect.

    componentDidMount() {
        this.connect();
    }

    timeout = 250; // Initial timeout duration as a class variable

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = () => {
        var ws = new WebSocket("ws://localhost:8080/Laputa");
        let that = this; // cache the this
        var connectInterval;

        // websocket onopen event listener
        ws.onopen = () => {
            console.log("connected websocket main component");

            this.setState({ ws: ws });

            ws.send('xxx');
            ws.send('xxx');
            ws.send('xxx');
            ws.send('xxx');

            that.timeout = 250; // reset timer to 250 on open of websocket connection 
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        // websocket onclose event listener
        ws.onclose = e => {
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        ws.onmessage = messageEvent => {
          //console.log(messageEvent.data)
          this.setState({ws:this.state.ws, message: this.state.messages.push(messageEvent.data), toSend: this.state.toSend})
        }

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };

    handleStateDisplay = () => {
      let table = []
      this.state.messages.map(function(object, i){
        table.push(<div key={i}> {object} </div>);
        return null;
      })
      return table;
    }

    handleClick = () =>
    {
      console.log(this.state.toSend);
      this.state.ws.send(this.state.toSend); 
    }

    updateInputValue = (evt) => {
      this.setState({
        toSend: evt.target.value,
        ws: this.state.ws,
        message: this.state.messages
      });
    }

  render(){
      return (<div>
        <div className="chattextlist">
          {this.handleStateDisplay()}
        </div>
        <button onClick={(i) => this.handleClick(i)}>Click to send</button>
        <input select="select" type="text" className="textbox" value={this.state.toSend} onChange={this.updateInputValue} placeholder="What you will like to send" />
      </div>);
  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WebSocketListener/>
      </header>
    </div>
  );
}

export default App;
