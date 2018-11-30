import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  getListOfUsers } from '../../actions/getApiData';
import { verified } from '../../actions/postData';
import './verify.css'

class Verify extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      success: false,
      requested: false,
      message:''
    };
  }

 componentDidMount() {
  this.props.verified(this.props.match.params.verified)
  .then(data => this.setState({success: data.success , requested: data.request, message: data.message}))
  }

  render() {
    return(
      <div className='emailContainer'>
        <div className="frame">
          {!this.state.success &&
          <form onSubmit={((e) => this.submitData(e))} className="form-signin" action="" method="post" name="form">
            <p className="form-signin-red">{this.state.message} </p>
          </form>
        }
          {
          (this.state.success) &&
          <form onSubmit={((e) => this.submitData(e))} className="form-signin" action="" method="post" name="form">
            <p className="form-signin-label" htmlFor="EMAIL">{this.state.message}
            </p>
            <p className="form-signin-label"> If you want to login please click on the button. </p>
            <Link to="/" className="btn-login">Login</Link>
          </form>

          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    usersList: state.listOfUsers
  };
}
export default connect(mapStateToProps, {getListOfUsers, verified})(Verify);
