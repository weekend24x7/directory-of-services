import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "material-ui/Grid";
import { getBranchsByCategory } from "../../actions/getApiData";
import { getBranchesFilteredByPostCode } from "../../actions/postData";
import Search from "./Search";
import TopNav from "../TopNav";
import helpers from "../../helpers";
import OrganisationCard from "./OrganisationCard";
import categoriesData from "../../Data/Categories.json";
import orgHelpers from "./orgHelpers";
import Spinner from "../Spinner";
import "./index.css";
import homeSearchHelpers from "../HomePage/homePageHelper";

function getSelectedCategory(match) {
  const { params } = match;
  const service =
    params && params.service ? helpers.linkMaker(params.service) : null;
  return service;
}

class Organisations extends Component {
  state = {
    orgsBeforeFilteredByPostcode: [],
    organisations: [],
    category: getSelectedCategory(this.props.match),
    day: "",
    borough: "",
    searchInput: "",
    postcodeError: "",
    isLoading: false,
    isPostcode: false,
    sort: false,
  };

  componentDidMount() {
    const category = helpers.addSpaceToCategName(
      categoriesData,
      this.props.match.url
    );
    const index = category.indexOf("Young People and Children");
    if (index !== -1) {
      category[index] = "Young People/Children";
    }
    this.props.getBranchsByCategory(category);
  }

  componentWillReceiveProps(newProps) {
    const { organisation } = newProps;
    this.setState({
      category: getSelectedCategory(newProps.match),
      organisations: organisation,
      orgsBeforeFilteredByPostcode: organisation
    });
  }

  handleSelectedDay = event => {
    this.setState({ day: event.target.value });
  };

  handleSelectedBorough = event => {
    this.setState({ borough: event.target.value });
  };

  filterByPostcode = searchInput => {
    if (!searchInput) {
      this.setState({
        organisations: this.state.organisations
      });
    }
    const filteredOrg = this.state.organisations;
    if (filteredOrg && filteredOrg.filter) {
      this.setState({
        organisations: filteredOrg
      });
    }
  };

  handlePostCodeChange = (event, { newValue }) => {
    this.handlePostSearch(event, newValue)
    this.clearPostcodeField()
    this.setState(
      {
        organisations: this.props.organisation,
        searchInput: newValue,
        isPostcode: true
      },
      this.filterByPostcode(newValue)
    );
  };

  handlePostSearch = async (event) => {
    event.preventDefault();
    const { searchInput } = this.state;
    const isAlphaNumeric = helpers.isAlphaNumeric(searchInput);
    if (isAlphaNumeric) {
      if (searchInput.length === 0) {
        this.setState({ postcodeError: "Postcode is required *" });
      } else if (searchInput.length < 5) {
        this.setState({ postcodeError: "You have to inter valid postcode" });
      } else {
        const category = helpers.addSpaceToCategName(
          categoriesData,
          this.props.match.url
        )[0];
        const post = searchInput.replace(/[' ']/g, "");
        this.setState({ isLoading: true, postcodeError: "" });
        const data = await fetch(
          `https://api.postcodes.io/postcodes/?q=${post}`
        );
        const res = await data.json();
        if (res.result && res.status === 200) {
          this.setState({ isLoading: true, sort: true });
          res.result.map(async info => {
            const lat = info.latitude;
            const long = info.longitude;
            const getBranches = await this.props.getBranchesFilteredByPostCode({
              category,
              lat,
              long
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
            postcodeError: "Your postcode is incorrect",
            isLoading: false
          });
        }
      }
    } else {
      const search = searchInput;
      this.setState({
        organisations: homeSearchHelpers.findOrganisationByLocation(
          this.state.organisations,
          search
        ),
        isPostcode: false
      });
    }
  };


  handleKeyUp = async (e) => {
    e.preventDefault();
    if (e.charCode === 13 || e.key === 'Enter') {
      const { searchInput } = this.state;
    const isAlphaNumeric = helpers.isAlphaNumeric(searchInput);
    if (isAlphaNumeric) {
      if (searchInput.length === 0) {
        this.setState({ postcodeError: "Postcode is required *" });
      } else if (searchInput.length < 5) {
        this.setState({ postcodeError: "You have to inter valid postcode" });
      } else {
        const category = helpers.addSpaceToCategName(
          categoriesData,
          this.props.match.url
        )[0];
        const post = searchInput.replace(/[' ']/g, "");
        this.setState({ isLoading: true, postcodeError: "" });
        const data = await fetch(
          `https://api.postcodes.io/postcodes/?q=${post}`
        );
        const res = await data.json();
        if (res.result && res.status === 200) {
          this.setState({ isLoading: true, sort: true });
          res.result.map(async info => {
            const lat = info.latitude;
            const long = info.longitude;
            const getBranches = await this.props.getBranchesFilteredByPostCode({
              category,
              lat,
              long
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
            postcodeError: "Your postcode is incorrect",
            isLoading: false
          });
        }
      }
    } else {
      const search = searchInput;
      this.setState({
        organisations: homeSearchHelpers.findOrganisationByLocation(
          this.state.organisations,
          search
        ),
        isPostcode: false
      });
    }
    }
  }



  dataOrder = () => {
    if (!this.state.sort) {
      return helpers.sortArrObj;
    }
    return (a, b) => parseFloat(a.distance) - parseFloat(b.distance);
  };

  clearPostcodeField = () => {
    const data = this.state.orgsBeforeFilteredByPostcode;
    this.setState({
      organisations: data,
      isPostcode: false,
      searchInput: ""
    });
  };

  render() {
    const { category, searchInput, borough, day, organisations } = this.state;
    const role = this.props.user.role ? this.props.user.role : "";
    if (
      this.state.isLoading ||
      orgHelpers.filterOrganisationData.length === 0
    ) {
      return <Spinner />;
    }
    return (
      <div>
        <TopNav
          addLink={`services/${category}/add`}
          titleLink={`services/${category}`}
        />
        <div className="org-home_title">
          <h2>
            {" "}
            {helpers.displayCategoryNameWithSpace(
              categoriesData,
              category
            )}{" "}
          </h2>
        </div>
        <Search
          service={category}
          borough={borough}
          day={day}
          searchInput={searchInput}
          handleSelectedDay={this.handleSelectedDay}
          handleSelectedBorough={this.handleSelectedBorough}
          handlePostCodeChange={this.handlePostCodeChange}
          handlePostSearch={this.handlePostSearch}
          postcodeError={this.state.postcodeError}
          clearPostcodeField={this.clearPostcodeField}
          isPostcode={this.state.isPostcode}
          handleKeyUp={this.handleKeyUp}
        />
        <Grid container className="organisation-page" spacing={24} wrap="wrap">
          {orgHelpers
            .filterOrganisationData(
              organisations.sort(this.dataOrder()),
              day,
              borough
            )
            .map(org => (
              <Grid item xs={12} sm={6} key={org.id} className="card">
                <OrganisationCard org={org} role={role} category={category} />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organisation: state.filteredBranchsByCategory.branchs,
    user: state.loginAuth.user
  };
}

export default connect(
  mapStateToProps,
  { getBranchsByCategory, getBranchesFilteredByPostCode }
)(Organisations);
