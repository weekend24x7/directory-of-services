import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoginForm from '../LoginForm';
import { deleteFlashMessage } from '../../actions/flashMessages';
import './landing-page.css';
import FlashMessagesNotification from '../FlashMessages'

class LandingPage extends Component {
  state = {
    open: false
  }
  componentDidMount() {
    this.props.isAuthenticated && this.props.history.replace('/home')
  }
  deleteMessage = () => (
    this.props.messages.map(message =>
      message.type === 'loginError' ?
        this.props.deleteFlashMessage(message.id) : null
    ));

  showSignUpForm = () => (
    <LoginForm />
  )

  renderMessages = () => (
    this.props.messages.map(message =>
      message.type === 'loginError' ?
        <Fragment key={message.id}>
          <FlashMessagesNotification
            messageType='error'
            message={message.text}
            test={this.props.messages}
            deleteMessage={this.deleteMessage}
          />
        </Fragment>
        : null
    ))

  renderSignUpPage = (e) => {
    e.preventDefault()
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (
      <div className="landing-page">
        <div className="login-content">
          {this.renderMessages()}
          {this.showSignUpForm()}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  const { isAuthenticated } = state.loginAuth
  return {
    messages: state.flashMessages,
    isAuthenticated
  };
}

LandingPage.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { deleteFlashMessage })(LandingPage);
