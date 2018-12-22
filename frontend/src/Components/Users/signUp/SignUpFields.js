import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

const SignUpFields = props => {
  const { classes } = props;
  return (
    <form className="form-group">
      <TextField
        id="name"
        placeholder="Full Name"
        label="Full Name"
        autoComplete="fullName"
        name='fullName'
        className={classes.textField}
        value={props.fullName}
        onChange={props.handleChange('fullname')}
        margin="normal"
        required
      />

      <TextField
        id="Organisation"
        placeholder="Your organisation name"
        label="Organisation"
        name="organisation"
        autoComplete="organisation"
        className={classes.textField}
        value={props.organisation}
        onChange={props.handleChange('organisation')}
        margin="normal"
        helperText={props.organisationError}
        required
      />

      <TextField
        type="email"
        id="email"
        name="email"
        autoComplete="email"
        placeholder="Email"
        label="Email"
        className={classes.textField}
        value={props.email}
        onChange={props.handleChange('email')}
        margin="normal"
        helperText={props.emailError}
        required
      />

      <TextField
        placeholder="Password"
        label="Password"
        name="password"
        autoComplete="password"
        className={classes.textField}
        type="password"
        value={props.password}
        onChange={props.handleChange('password')}
        margin="normal"
        required
        helperText={props.passwordError}
      />

      <TextField
        placeholder="Confirm Password"
        label="Confirm Password"
        name="passwordConfirm"
        autoComplete="password"
        className={classes.textField}
        type="password"
        value={props.confirmPassword}
        onChange={props.handleChange('confirmPassword')}
        margin="normal"
        required
        helperText={props.confirmPasswordError}
      />
      <Button
        variant="raised"
        size="small"
        type="submit"
        onClick={props.handleSubmit}
      >
        Create My account
      </Button>
    </form>
  );
};

SignUpFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpFields);
