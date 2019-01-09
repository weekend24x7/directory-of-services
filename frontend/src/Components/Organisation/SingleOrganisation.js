import React, { Component, Fragment } from 'react';
import ReactToPrint from "react-to-print";
import Dialog, {
  withMobileDialog,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import EditOrganisation from './EditOrganisation';
import Notification from '../Users/Notification'
import './single-org.css';


class SingleOrganisation extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { org, role } = this.props;
    const branchIds = {
      orgId: org.org_id,
      branchId: org.branch_id
    }
    const uiMessage = 'Add';
    return (
      <div className="single-org" >
        <div className="org-detail-btn">
          <Button
            onClick={this.handleOpen}
            variant="raised"
            size="small"
            className={window.location.href.indexOf('home') !== -1  ? 'move-right-home-hidden' : 'move-right-org-hidden'}
          />
          <Button
            onClick={this.handleOpen}
            variant="raised"
            size="small"
            className={window.location.href.indexOf('home') !== -1  ? 'move-right-home' : 'move-right-org'}
          >
          View More
          </Button>
        </div>
        <Dialog
          className="org-info"
          open={this.state.open}
          onClose={this.handleClose}
          ref={el => {
            (this.componentRef = el)
            return this.componentRef
          }}
        >
          <div className="org-close-btn">
            <Button
              onClick={this.handleClose}
              className="btn close-button"
            >
              <i className="material-icons" variant="raised" size="small">close</i>
            </Button>
          </div>
          <ReactToPrint
            trigger={() => <i className="material-icons" > print </i>}
            content={() => this.componentRef}
          />

          {role === 'Admin' || role === 'Editor' ?
            <EditOrganisation org={org} /> : null
          }
          {org.org_name.length > 0 ? <h1> {org.org_name} </h1> : <h1 className="not-available"> Add organisation name ... </h1>}

          <h6 className="details-area">
            <span className="location-name">Area</span>: <span className="area">{org.area ? org.area : 'Add area ...'} </span> | {"  "}
            <span className="location-name">Borough</span>: <span className="borough">{org.borough ? org.borough : 'Add borough ...'}</span>
          </h6>

          <div className="org-project org-contact">
            <div>
              <h4>Project</h4>
              {org.project ? <Fragment> <p className="service"> {org.project}</p>  </Fragment>
                : <p className="not-available">{`${uiMessage}`} project ...</p>}
            </div>
            <div>
              <h4>Clients Accepted</h4>
              {org.clients ? <Fragment> <p className="service"> {org.clients}</p>  </Fragment>
                : <p className="not-available">{`${uiMessage}`} Clients Accepted...</p>}
            </div>
          </div>
          <div className="org-service">
            <h4>Services</h4>
            {org.service ? <Fragment> <p className="service"> {org.service}</p></Fragment> :
            <p className="not-available">{`${uiMessage}`} services ...</p>}
          </div>

          <div className="org-process">
            <div>
              <h4>Process</h4>
              {org.process ? <Fragment><p className="service">{org.process.replace(/\s+/g, " ")} </p> </Fragment>
                : <p className="not-available">{`${uiMessage}`} process ...</p>}
            </div>
            <div>
              <h4>Days</h4>
              {org.service_days ? <Fragment><p>{org.service_days.split(' ').join(', ')}</p></Fragment>
                : <p className="not-available">{`${uiMessage}`} days ...</p>}
            </div>
          </div>

          <div className="org-contact">
            <div>
              <h4>Telephone</h4>
              {org.telephone && org.telephone !== "undefined" ? <Fragment><p>{org.telephone}</p></Fragment>
                : <p className="not-available" disable>{`${uiMessage}`} telephone...</p>}
            </div>

            <div>
              <h4>Email</h4>
              {org.email_address ? <Fragment><p>{org.email_address}</p></Fragment>
                : <p className="not-available">{`${uiMessage}`} email ...</p>}
            </div>
          </div>
          <div className="org-website org-process">
            <div>
              <h4>Website </h4>
              {org.website ? <Fragment> <a className="website-link" target="blank" href={`${org.website}`}>{org.website}</a></Fragment>
                : <p className="not-available"> {`${uiMessage}`} website... </p>}
            </div>
            <div>
              <h4>Postcode </h4>
              {org.postcode ? <p> {org.postcode}</p>
                : <p className="not-available"> {`${uiMessage}`} postcode... </p>}
            </div>
          </div>
          <div className="org-service">

            <div>
              <h4>Tags</h4>
              {org.tag ? <Fragment><p className="tag service"> <img src="https://png.icons8.com/material/15/666666/tag-window.png" alt="tag" /> {org.tag}</p></Fragment>
                : <p className="not-available">  {`${uiMessage}`} tags... </p>}
            </div>
          </div>
          {role === 'Admin' ? <Notification branchIds={branchIds} deleteOrg organisation={org.org_name} /> : null}
        </Dialog>
      </div>
    );
  }
}

export default withMobileDialog()(SingleOrganisation);
