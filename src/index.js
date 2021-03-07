import fetchCountries from './js/fetchCountries';
import singleCountryMarkup from './templates/single-country-markup.hbs';
import listOfCountriesMarkup from './templates/list-of-countries-markup.hbs';
const debounce = require('lodash.debounce');
import './styles.css';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { notice, error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
defaults.closerHover = false;



const countryContainer = document.querySelector('.country-container')
const searchFormRef = document.querySelector('.search-form__input');


searchFormRef.addEventListener('input', debounce(countryInputHandler, 500));


function countryInputHandler(event) {
    const countryName = event.target.value;

    if (countryName === '') {
        deleteMarkup();
        return;
    }

    fetchCountries(countryName)
    .then(countries => {

        if (countries.length > 10) {
            deleteMarkup();
            createNotice('Too many matches found. Please enter a more specific query!');
            return;
        }

        if (countries.length > 1) {
            createMarkup(listOfCountriesMarkup, countries)
            return;
        }
        
        createMarkup(singleCountryMarkup, countries[0])

    })
    .catch(error => {
        deleteMarkup();
        createError('No matches found. Please try again!');
        return;
    });


};


function createError(errorMessage) {
    const myError = error({
        text: errorMessage,
        animation: 'fade',
        shadow: true,
        hide: true,
        delay: 2000
      });
    return myError;
}

function createNotice(noticeMessage) {
    const myNotice = notice({
        text: noticeMessage,
        hide: true,
        delay: 2000
      });
    return myNotice;
}

function createMarkup(markupCreationFunction, requestResult) {
    const markup = markupCreationFunction(requestResult);
    countryContainer.innerHTML = markup;
}


function deleteMarkup() {
    countryContainer.innerHTML = '';
}





