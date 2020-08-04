## Table of Contents

* [Basic Information](#basic-information)
* [Installation Instructions](#installation-instructions)
* [Updating to a New Version of the Application](#updating-to-a-new-version-of-the-application)
* [Basic Usage](#basic-usage)
* [Custom Configuration](#custom-configuration)
* [Application Notes](#application-notes)
* [Additional Run Options](#additional-run-options)

## Basic Information

This repo is an example application using Vue with the Pega DX API.

## Installation Instructions small update good gedan

1.  Install Node Package Manager (npm) which is distributed with Node.js. Installation link [here](https://nodejs.org).
2.  Using a terminal, cd into the root directory (the directory this file is in).
3.  Run the following commands:
    * `npm install`
    * `npm start`
4.  The application should be served on http://localhost:8080 (or an alternate port speciied within the console if this port is already in use.

## Updating to a New Version of the Application

Run `npm install` to ensure the latest dependencies are installed, then use `npm start`.

## Basic Usage

By default, the application will be pointing to a specific Pega server.  A sample application (Cable Connect) is provided with the Pega Vue Starter Pack which can be deployed to a Pega server (if another suitable Pega application and associated operator records are not available)

To log into the Cable Company (cableco) test application, you may use

* rep.cableco / pega
* manager.cableco / pega
* tech.cableco / pega

The Author/Admin operator credentials for the application:
* admin.cableco / pega

Once logged in, you can create cases from the CaseType list, open WorkObjects from the Dashboard or Recents list, and perform end-to-end flows, based off the data returned from the API.

## Custom Configuration

If you want to point the application to a different server follow these steps:

* Open `/src/services/endpoints.js` and modify the PEGA_URL variable to reference your desired system.
* Ensure that your desired application includes the ruleset Pega-API:08-01 (or higher).
* Ensure that your access group includes the PegaRULES:PegaAPI role.

## Application Notes

## `assets`

Fonts and CSS files used by the application.

Files within the uikit style directory were originally downloaded from Pega 8.2 Dev Studio:
 * pega-icons.css (is px-pega-default-icons.css rule text file with all non .pi- rules stripped)
 * pega-icons.woff[2] (is px-font-pega-icons.woff[2])

## `components`

Some Vue components leveraged by the layout component

## `plugins`

## `router`

Vue Router related files.  App currently supports only 3 routes:
* "/": Main page ("layout component)
* "/login": Login page ("login" component)
* other: Error page


## `services`

Implements rest endpoint invocations leveraging axios

## `store`

Vuex state implementation files (actions, mutations)

These files contain action creators, used to dispatch actions via Redux.

There are separate files for actions related to:

* Alerts
* Assignments
* Cases
* Errors
* Users
* Workqueues

## `services`

Functions used to issue AJAX requests and manage responses.
All of the included methods use the Axios library for Promise-based requests.


## `views/main/workobject.vue`

This is a Vue component used to generate forms for assignments, views, and pages based on data returned from the Pega API.
Form generation for assignments, views, and pages are all based on a nested UI data structure returned from the API.

* Views / pages contain groups.
* Each element of a Group array can contain a view, layout, field, or paragraph.
* Layouts determine the UI structure of the form. Supported layout groupFormats are:
  * Stacked
  * Grid
  * Repeating Dynamic Layout
  * Inline middle
  * Inline grid double
  * Inline grid double (70 30)
  * Inline grid double (30 70)
* Fields contain information about the property, including reference, current value, outstanding validation messages, and attached actions.
* Supported fields:
  * pxTextInput
  * pxDropdown
  * pxCheckbox
  * pxTextArea
  * repeating
  * tableLayout
  * pxEmail
  * pxDateTime
  * pxInteger
  * pxPhone
  * pxDisplayText
  * pxHidden
  * pxButton
  * label
  * pxLink
  * pxIcon
  * pxRadioButtons
  * pxCurrency
  * pxAutoComplete
* Supported actions:
  * setValue
  * postValue
  * refresh
  * takeAction
  * runScript

Dropdowns of source type PageGroup are supported.  Dropdowns of source type PageList are not yet supported by this app (coming soon).

When changing values on the form (checking a checkbox, typing into an input, etc...) the changes in value are reflected in state.values for PegaForm.
When doing a POST to submit an assignment or refresh fields, the state.values object is translated into a nested representation of the data based on page structure, and sent to the server.

## `utils/ReferenceHelper.js`

* Class to handle translating Pega's fully qualified property paths to a nested Object structure, and vice versa.
* Also some utility methods for:
  * Handling initial PegaForm state given View from API
  * Finding correct PageGroup/List based on property reference
  * Getting blank entry for PageGroup/List when adding new element
* When posting data to the server via API, it must be nested.
* When retrieving field information from the server, the property paths are flat and qualified.

## `views/main/pega-form/controls/DataPageDropdown.vue`

This is an example of a self-contained Vue component that has some Pega-API-specific logic.
In this case, the DataPageDropdown creates a dropdown form element that sources its options from a DataPage.


## Additional Run Options

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Other Resources
```
The [Dashboard Vue and Element scaffolding example](https://github.com/zce/dashboard) was leveraged as the starting point for this app, and various unused portions have been eliminated
