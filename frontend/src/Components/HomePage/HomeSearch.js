import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import {
  Grid,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Menu
} from 'material-ui';
import { withRouter, Link } from 'react-router-dom';
import EditOrganisation from '../Organisation/EditOrganisation';
import SingleOrganisation from '../Organisation/SingleOrganisation';
import OrganisationCard from '../Organisation/OrganisationCard';
import { getBranchesFilteredByPostCode } from '../../actions/postData';
import helpers from '../../helpers';
import SearchForm from './SearchForm';
import Spinner from '../Spinner';
import './HomePage.css';
import homePageHelper from './homePageHelper';

class HomeSearch extends React.Component {
  state = {
    organisationsBeforFilterByPostcode: [],
    postcodeSuggestions: [],
    postcodeValue: '',
    organisations: [],
    suggestions: [],
    postCode: '',
    editIdx: -1,
    search: '',
    value: '',
    postcodeError: '',
    isPostcode: false,
    isLoading: false,
    isHidden: true,
    sort: false,
    showLink: true,
    AllCat: true,
    Hous: false,
    Immi: false,
    Bene: false,
    Heal: false,
    Empl: false,
    Baby: false,
    Dest: false,
    Fami: false,
    Gend: false,
    LGBT: false,
    Soci: false,
    Educ: false,
    Debt: false,
    Youn: false,
    Traf: false,
    Wome: false,
    Ment: false,
    categoriesToFilter: [],
    fillterdOrganisations: [],
    anchorEl: null,
    noResult: ''
  };

  componentWillReceiveProps(newProps) {
    const organisations = newProps.organisations ? newProps.organisations : [];
    this.setState({
      organisations,
      organisationsBeforFilterByPostcode: organisations,
    });
  }

  handleClickBar = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  // allow user to press enter key for search
  handleKeyUp = e => {
    if (e.charCode === 13 || e.key === 'Enter') {
      if (
        this.state.value.trim().length !== 0 &&
        this.state.postcodeError.trim().length !== 0
      ) {
        this.setState({ postcodeError: '' });
        this.updateSearchData();
      } else if (
        (this.state.postCode.trim().length !== 0 &&
          this.state.value.trim().length !== 0) ||
        (this.state.postCode.trim().length === 0 &&
          this.state.value.trim().length !== 0) ||
        (this.state.postCode.trim().length !== 0 &&
          this.state.value.trim().length === 0)
      ) {
        this.setState({ noResult: 'No Result Found' })
        this.updateSearchData();
      }
    }
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: helpers.getMainSearchSuggestions(
        value,
        this.state.organisations,
      ),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  handleChange = (event, { newValue }) => {
    this.setState({ value: newValue, isHidden: false });
  };
  handleCheck = name => event => {
    this.setState({ [name]: event.target.checked });
    const { categoriesToFilter, organisations } = this.state;
    const indexToRemove = categoriesToFilter.indexOf(name);
    if (indexToRemove > -1) {
      // item found if > -1
      // it means user unchecked again!
      categoriesToFilter.splice(indexToRemove, 1); // if unchecked remove the category
    } else {
      categoriesToFilter.push(name); // add if checked first time
    }
    const fillterdOrganisations =
      categoriesToFilter.length === 0 ? organisations : [];
    if (categoriesToFilter.length > 0) {
      for (const organisation of organisations) {
        for (const organisationToFilter of categoriesToFilter) {
          if (organisation.cat_name.substring(0, 4) === organisationToFilter) {
            fillterdOrganisations.push(organisation);
          }
        }
      }
    }
    this.setState({ fillterdOrganisations, categoriesToFilter });
    if (categoriesToFilter.length === 0) {
      this.setState({ AllCat: true });
    }
    else {
      this.setState({ AllCat: false });
    }
  };

  editSelectedOrganisation = idex => this.setState({ editIdx: idex });

  stopEditing = () => {
    this.setState({ editIdx: -1 });
  };

  // clear input value
  clearSearchField = () => {
    this.setState({
      value: '',
      isHidden: true,
    });
  };

  clearPostcodeField = () => {
    const data = this.state.organisationsBeforFilterByPostcode;
    this.setState({
      postCode: '',
      postcodeValue: '',
      isPostcode: false,
      organisations: data,
    });
  };

  handlePostSearch = async () => {
    if (this.state.postCode.length === 0) {
      return null;
    } else if (this.state.postCode.length < 5) {
      this.setState({
        postcodeError: 'The postcode you have entered is incorrect.',
        isLoading: false,
        postCode: '',
        postcodeValue: '',
      });
    } else {
      const post = this.state.postCode.replace(/[' ']/g, '');
      this.setState({ isLoading: true, postcodeError: '' });
      const data = await fetch(`https://api.postcodes.io/postcodes/?q=${post}`);
      const res = await data.json();
      if (res && res.result && res.status === 200) {
        this.setState({ isLoading: true, sort: true });
        res.result.map(async info => {
          const lat = info.latitude;
          const long = info.longitude;
          const getBranches = await this.props.getBranchesFilteredByPostCode({
            lat,
            long,
          });
          const orgsData = [];
          getBranches.data.map(branchs => {
            const { distance } = branchs;
            const orgs = branchs.data;
            return orgsData.push({ distance, ...orgs });
          });
          this.setState({ organisations: orgsData });
        });
        this.setState({ isLoading: false });
      } else {
        this.setState({
          postcodeError: 'The postcode you have entered is incorrect.',
          isLoading: false,
          postCode: '',
          postcodeValue: '',
        });
      }
    }
  };
  handleSuggestionsFetchRequestedPostcode = () => {
    this.setState({
      postcodeSuggestions: ''
    });
  };

  updateSearchData = () => {
    // Remove x sign uses to clear input when user start search(value)
    this.setState({
      search: this.state.value,
      isHidden: true,
      postcodeValue: this.state.postCode,
      isPostcode: false,
      showLink: false,
    });

    this.handlePostSearch();
  };

  dataOrder = () => {
    if (!this.state.sort) {
      return helpers.sortArrObj;
    }
    return (a, b) => parseFloat(a.distance) - parseFloat(b.distance);
  };

  handleSuggestionsClearRequestedPostcode = () => {
    this.setState({
      postcodeSuggestions: [],
    });
  };

  handlePostCodeChange = (event, { newValue }) => {
    event.preventDefault();
    this.setState({
      postCode: newValue,
      isPostcode: true,
    });
  };

  render() {
    const { AllCat, Hous, Immi, Bene, Heal, Empl, Baby, Dest,
      Fami,
      Gend,
      LGBT,
      Soci,
      Educ,
      Debt,
      Youn,
      Traf, Wome, Ment, anchorEl } = this.state;
    const { role } = this.props;
    let { organisations } = this.state
    const { editIdx, search, postcodeValue, fillterdOrganisations } = this.state;
    if (fillterdOrganisations.length > 0) {
      organisations = fillterdOrganisations
    }
    const params = this.props.location.pathname;
    const isHomeRoute = params && params.includes('home');
    if (
      this.state.isLoading ||
      homePageHelper.filterData.length === 0 ||
      organisations.length <= 0
    ) {
      return <Spinner />;
    }
    const searchResult = homePageHelper
      .filterData(organisations.sort(this.dataOrder()), search, postcodeValue)

    const finalSearchResult = searchResult.map((org, index) => {
      const currentlyEditing = editIdx === index;


      return currentlyEditing ? (
        <Fragment>
          <EditOrganisation stopEditing={this.stopEditing} org={org} show />
          <SingleOrganisation
            stopEditing={this.stopEditing}
            handleShawDetails
            org={org}
          />
        </Fragment>
      ) : (

        <Grid item xs={12} sm={6} key={org.id}>
          <OrganisationCard
            getData={() => this.editSelectedOrganisation(index)}
            org={org}
            index={index}
            isHomeRoute={isHomeRoute}
            role={role}
          />
        </Grid>
        );
    });
    if (
      this.props.match.url.includes('/users') ||
      this.props.match.url.includes('/admindos') ||
      this.props.match.url.includes('/accept')
    ) {
      return null;
    }

    let addNewOrganisation = null;
    // Conditionaly display add new organisation element on home page
    if (role && (role === 'Admin' || role === 'Editor')) {
      addNewOrganisation = (
        <div>
          <Link to="/services/service/add" className="add-orgnaization">
            <span> Add a project </span>
            <Button
              className="add-orgonaization-button"
              variant="fab"
              aria-label="add`"
            >
              <AddIcon />
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="org-home">
        <div className="org-home_title">
          <h2> Search for projects in
            <Button
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClickBar}
              className="menu"
            >
              all categories
            </Button>
          </h2>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <FormControl component="fieldset" className="fieldControl" >
              <FormLabel component="legend">Select Category</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={AllCat}
                      onChange={this.handleCheck('AllCat')}
                      value="AllCat"
                    />
                  }
                  label="All Categories"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Empl}
                      onChange={this.handleCheck('Empl')}
                      value="Empl"
                    />
                  }
                  label="Employment"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Hous}
                      onChange={this.handleCheck('Hous')}
                      value="Hous"
                    />
                  }
                  label="Housing"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Immi}
                      onChange={this.handleCheck('Immi')}
                      value="Immi"
                    />
                  }
                  label="Immigration"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Bene}
                      onChange={this.handleCheck('Bene')}
                      value="Bene"
                    />
                  }
                  label="Benefits"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Heal}
                      onChange={this.handleCheck('Heal')}
                      value="Heal"
                    />
                  }
                  label="Healthcare"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Baby}
                      onChange={this.handleCheck('Baby')}
                      value="Baby"
                    />
                  }
                  label="Baby"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Dest}
                      onChange={this.handleCheck('Dest')}
                      value="Dest"
                    />
                  }
                  label="Destitution"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Fami}
                      onChange={this.handleCheck('Fami')}
                      value="Fami"
                    />
                  }
                  label="Family"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Gend}
                      onChange={this.handleCheck('Gend')}
                      value="Gend"
                    />
                  }
                  label="Gendoyment"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={LGBT}
                      onChange={this.handleCheck('LGBT')}
                      value="LGBT"
                    />
                  }
                  label="LGBTQ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Soci}
                      onChange={this.handleCheck('Soci')}
                      value="Soci"
                    />
                  }
                  label="Social And Other"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Educ}
                      onChange={this.handleCheck('Educ')}
                      value="Educ"
                    />
                  }
                  label="Education"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Debt}
                      onChange={this.handleCheck('Debt')}
                      value="Debt"
                    />
                  }
                  label="Debt"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Youn}
                      onChange={this.handleCheck('Youn')}
                      value="Youn"
                    />
                  }
                  label="Young People And Children"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Traf}
                      onChange={this.handleCheck('Traf')}
                      value="Traf"
                    />
                  }
                  label="Trafficking"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Wome}
                      onChange={this.handleCheck('Wome')}
                      value="Wome"
                    />
                  }
                  label="Women"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Ment}
                      onChange={this.handleCheck('Ment')}
                      value="Ment"
                    />
                  }
                  label="Mental Health Service"
                />

              </FormGroup>
              {Immi && <FormHelperText>Be careful</FormHelperText>}
            </FormControl>
          </Menu>

          {addNewOrganisation}
        </div>
        <Grid container className="organisation-page" spacing={24}>
          <SearchForm
            value={this.state.value}
            postCode={this.state.postCode}
            isHidden={this.state.isHidden}
            handleKeyUp={this.handleKeyUp}
            handleChange={this.handleChange}
            isPostcode={this.state.isPostcode}
            suggestions={this.state.suggestions}
            updateSearchData={this.updateSearchData}
            clearSearchField={this.clearSearchField}
            clearPostcodeField={this.clearPostcodeField}
            handlePostCodeChange={this.handlePostCodeChange}
            postcodeSuggestions={this.state.postcodeSuggestions}
            handleSuggestionsFetchRequested={
              this.handleSuggestionsFetchRequested
            }
            handleSuggestionsClearRequested={
              this.handleSuggestionsClearRequested
            }
            handleSuggestionsFetchRequestedPostcode={
              this.handleSuggestionsFetchRequestedPostcode
            }
            handleSuggestionsClearRequestedPostcode={
              this.handleSuggestionsClearRequestedPostcode
            }
          />
          {/* Bugs form link  */}
          {this.state.showLink && (
            <div className="bug-form">
              <h4>We would love your feedback {'  '}😍 </h4>
              <p>
                Please provide your feedback by clicking{' '}
                <a href="https://goo.gl/Jhy5Us" target="blank">
                  here
                </a>
              </p>
            </div>
          )}
          {this.state.postcodeError ? (
            <span className="postcode-error">{this.state.postcodeError}</span>
          ) : (
              finalSearchResult
            )}
          {this.state.noResult && finalSearchResult.length === 0 ? (
            <div className="bug-form">
              <h4>{this.state.noResult} </h4>
              <p>
                Please try again.
              </p>
            </div>
          ) : (
              finalSearchResult
            )}
        </Grid>
      </div>
    );
  }
}

HomeSearch.propTypes = {
  getBranchesFilteredByPostCode: PropTypes.func.isRequired,
};

export default connect(null, { getBranchesFilteredByPostCode })(
  withRouter(props => <HomeSearch {...props} />),
);