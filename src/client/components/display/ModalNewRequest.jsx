import React, { Component } from "react";
import { connect } from "react-redux";
import Request from "./Request.jsx";
import Response from "./Response.jsx";

import * as actions from '../../actions/actions';
import HeaderEntryForm from './HeaderEntryForm.jsx';

const mapStateToProps = store => ({});

const mapDispatchToProps = dispatch => ({
  reqResAdd: reqRes => {
    dispatch(actions.reqResAdd(reqRes));
  }
});

class ModalNewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      method : 'GET',
      headers : [],
      body : '',
      url : '',
    }
    this.methodOnChange = this.methodOnChange.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
    this.bodyOnChange = this.bodyOnChange.bind(this);
    this.urlOnChange = this.urlOnChange.bind(this);
    this.addNewRequest = this.addNewRequest.bind(this);
  }

  methodOnChange(e) {
    this.setState({
      method: e.target.value
    });
  }
  urlOnChange(e) {
    this.setState({
      url: e.target.value
    });
  }
      }),
    },() => {
      console.log(this.state.headers)
    });
  }
  bodyOnChange(e) {
    this.setState({
      body: e.target.value
  }

  addNewRequest() {
    console.log(this.state.headers)
    let reqRes = {
      id : Math.floor(Math.random() * 100000),
      url : this.state.url,
      timeSent : null,
      timeReceived : null,
      connection : 'uninitialized',
      connectionType : null,
      request: {
        method : this.state.method,
        headers : this.state.headers,
        body : JSON.parse(this.state.body),
      },
      response : {
        headers : null,
        events : null,
      }
    };

    this.props.reqResAdd(reqRes);
  }

  render() {
    return(
      <div style={{'border' : '1px solid black', 'display' : 'flex', 'flexDirection' : 'column'}}>
        ModalNewRequest
        <select onChange={(e) => {
          this.methodOnChange(e)
        }}>
          <option value='GET'>GET</option>
          <option value='POST'>POST</option>
          <option value='PUT'>PUT</option>
          <option value='PATCH'>PATCH</option>
          <option value='DELETE'>DELETE</option>
        </select>

        <input type='text' placeholder='URL' onChange={(e) => {
          this.urlOnChange(e)
        }}></input>
        
        <HeaderEntryForm updateHeaders={this.updateHeaders}></HeaderEntryForm>

        <textarea type='text' placeholder='Body' onChange={(e) => {
          this.bodyOnChange(e)
        }}></textarea>

        <button onClick={this.addNewRequest}>Add New Request</button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewRequest);
