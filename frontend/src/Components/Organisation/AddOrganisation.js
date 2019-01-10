import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import OrganisationForm from './OrganisationForm';
import { addOrganisation } from '../../actions/postData';
import categoriesData from '../../Data/Categories.json';
import './add-org.css';
import TopNav from '../TopNav';
import helpers from '../../helpers'

class AddOrganisation extends Component {
  state = {
    notificationSystem: null,
    Organisation: '',
    Area: '',
    Borough: '',
    Process: '',
    Day: [''],
    Tel: '',
    Email: '',
    Website: '',
    Services: '',
    Categories: [],
    isChecked: true,
    project: '',
    tag: ''
  };

  componentDidMount() {
    const category = helpers.addSpaceToCategName(categoriesData, this.props.match.url);
    const catIndex = category.indexOf('Young People and Children');
    const updateCategory = catIndex > -1 ? ['Young People/Children']: category;
    this.setState({
      notificationSystem: this.refs.savedChanges,
      Categories: updateCategory
    });
  }

  validate = () => {
    let isError = false;
    if (
      this.state.Organisation.length <= 0 ||
      this.state.Categories.length <= 0
    ) {
      isError = true;
    }
    return isError;
  }

  handleSubmit = (e) => {
    const checkedCategory = helpers.categoryNameMaker(this.props.location.pathname);
    e.preventDefault();
    const error = this.validate();
    const days = this.state.Day.join(",");
    const categories = this.state.Categories;

    const data = {
      organisation: this.state.Organisation,
      service: this.state.Services,
      website: this.state.Website,
      borough: this.state.Borough,
      process: this.state.Process,
      email: this.state.Email,
      area: this.state.Area,
      tel: this.state.Tel,
      categories,
      days,
      project: this.state.project,
      tag: this.state.tag
    }
    if (!error) {
      this.props.addOrganisation(data).then(user => {
        if (user && user.success === true) {
          this.savedChangesSuccessfully();
          this.props.history.push(`/services/${checkedCategory}`);
        } else {
          this.unSucessSavedChanges(user.message);
        }
      });
    } else {
      this.unSucessSavedChanges('You have to fill Organisation name and categories fields');
    }

  }

  savedChangesSuccessfully = () => {
    this.state.notificationSystem.addNotification({
      title: 'Success',
      message: 'Your Changes have been saved successfully',
      level: 'success',
    });
  };

  unSucessSavedChanges = message => {
    this.state.notificationSystem.addNotification({
      title: 'Unsuccess',
      message,
      level: 'error',
    });
  };

  handleFieldUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleDefaultCheckbox = event => {
    const listOfCategories = this.state.Categories;
    let index;
    if (event.target.checked  && event.target.value !== 'Young People and Children') {
        listOfCategories.push(event.target.value);
    } else if (!event.target.checked  && event.target.value !== 'Young People and Children'){
        index = listOfCategories.indexOf(event.target.value);
        listOfCategories.splice(index, 1)
      }

    if (event.target.checked && event.target.value === 'Young People and Children') {
        listOfCategories.push('Young People/Children')
    } else if (!event.target.checked && event.target.value === 'Young People and Children'){
        index =  listOfCategories.indexOf('Young People/Children');
        listOfCategories.splice(index, 1)
      }

    this.setState({
      [event.target.name]: event.target.checked,
      Categories: listOfCategories,
      isChecked:!this.state.isChecked,
    });
  };

  handleCheckBox = event => {
    const listOfCategories = this.state.Categories;
    let index
    for(let i = 0; i < categoriesData.length; i += 1){
      if (event.target.checked && event.target.value === categoriesData[i].split(' ').join('') && event.target.value !== 'Young People and Children'.split(' ').join('')) {
        listOfCategories.push(categoriesData[i])
      } else if (!event.target.checked && event.target.value === categoriesData[i].split(' ').join('') && event.target.value !== 'Young People and Children'.split(' ').join('')){
        index = listOfCategories.indexOf(categoriesData[i]);
        listOfCategories.splice(index, 1)
      }
    }

    if (event.target.checked && event.target.value.includes('Young People and Children'.split(' ').join(''))) {
      listOfCategories.push('Young People/Children')
    }else if (!event.target.checked && event.target.value.includes('Young People and Children'.split(' ').join(''))){
      index = listOfCategories.indexOf('Young People/Children');
      listOfCategories.splice(index, 1)
    }

    this.setState({
      [event.target.name]: event.target.checked,
      Categories: listOfCategories,
    });
  };


  handleMulitySelectChange = event => {
    this.setState({ Day: event.target.value });
  };

  render() {
    const checkedCategory = helpers.categoryNameMaker(this.props.location.pathname);
    return (
      <div>
        <TopNav addLink="organisations/add" addOrg="Add new organisation" />
        <NotificationSystem ref="savedChanges" />
        <div className="add-new-org">
          <OrganisationForm
            name={this.state.Organisation}
            area={this.state.Area}
            borough={this.state.Borough}
            process={this.state.Process}
            day={this.state.Day}
            telephone={this.state.Tel}
            email={this.state.Email}
            website={this.state.Website}
            project={this.state.project}
            tag={this.state.tag}
            service={this.state.Services}
            checkedCategory={checkedCategory}
            handleCheckBox={this.handleCheckBox}
            formType="org-content"
            handleMulitySelectChange={this.handleMulitySelectChange}
            onChange={this.handleFieldUpdate}
            check={this.state.isChecked}
            handleDefaultCheckbox={this.handleDefaultCheckbox}
          />
          <Button
            className="save-btn add-orgonaization-link"
            onClick={event => this.handleSubmit(event)}
            color="primary"
            size="small"
          >
            SAVE CHANGES
          </Button>
        </div>
      </div>
    );
  }
}

AddOrganisation.propTypes = {
  addOrganisation: PropTypes.func.isRequired
}

export default connect(null, { addOrganisation })(AddOrganisation);
