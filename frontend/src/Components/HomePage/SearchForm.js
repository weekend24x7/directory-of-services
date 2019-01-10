import React from 'react'
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { withStyles, Grid, Button } from 'material-ui';
import helpers from '../../helpers';
import styles from './style'

function SearchForm(props){
    const clearSearchByKeywordBtn = props.value.length < 1 || props.isHidden;
    const clearSearchByPostcodeBtn = props.postCode.length < 1 || !props.isPostcode;
    const { classes } = props;
    return  (
      <Grid item xs={12} className="search-input">
        <div className="search-text">
          <i className="material-icons search-icon">search</i>
          <Autosuggest
            theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion
                        }}
            renderInputComponent={helpers.renderInput}
            suggestions={props.suggestions}
            onSuggestionsFetchRequested={props.handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={props.handleSuggestionsClearRequested}
            renderSuggestionsContainer={helpers.renderSuggestionsContainer}
            getSuggestionValue={helpers.getMainSearchSuggestionValue}
            renderSuggestion={helpers.renderMainSearchSuggestion}
            inputProps={{
                        classes,
                        placeholder: 'Search by keyword',
                        value: props.value,
                        onChange: props.handleChange,
                        onKeyUp: props.handleKeyUp
                        }}
          />
          <button
            variant="raised"
            size="small"
            color="secondary"
            className={clearSearchByKeywordBtn ? 'hidden' : 'clear-search'}
            onClick={props.clearSearchField}
          >
            <i
              className="material-icons clear-icon"
              size="small"
              variant="raised"
            >
              close
            </i>
          </button>
        </div>
        <div className="postcode-field">
          <Autosuggest
            theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                        }}
            className="post-code-suggesition"
            renderInputComponent={helpers.renderInput}
            suggestions={props.postcodeSuggestions}
            onSuggestionsFetchRequested={props.handleSuggestionsFetchRequestedPostcode}
            onSuggestionsClearRequested={props.handleSuggestionsClearRequestedPostcode}
            renderSuggestionsContainer={helpers.renderSuggestionsContainer}
            getSuggestionValue={helpers.getSuggestionValue}
            renderSuggestion={helpers.renderSuggestion}
            inputProps={{
                        classes,
                        placeholder: 'Enter postcode',
                        name: 'postCode',
                        value: props.postCode,
                        onChange: props.handlePostCodeChange,
                        onKeyUp: props.handleKeyUp
                        }}
          />
          <button
            variant="raised"
            size="small"
            color="secondary"
            className={clearSearchByPostcodeBtn ? 'hidden' : 'clear-postcode'}
            onClick={props.clearPostcodeField}
          >
            <i
              className="material-icons"
              size="small"
              variant="raised"
            >
              close
            </i>
          </button>
        </div>
        <div className="home-btn-search">
          <Button
            onClick={props.updateSearchData}
            variant="raised"
            color="primary"
            size="small"
            className="btn-search"
          >
          Search
          </Button>
        </div>
      </Grid>
    )
}

SearchForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchForm);
