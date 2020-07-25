# COVID-19 Questionnaire
This is the React application for the COVID-19 Questionnaire and requires the API to work.

## About

This open source application is free to use or modify, however, it does not include detailed documentation or instructions.

This COVID-19 Questionnaire solution is a public preview of parts of a custom solution which was purpose-built for Glenbrook High School District 225 in Northfield Township, Cook County, Illinois.

This public previvew release has been modified to make it more suitable for use by other districts by removing features and integrations which are Glenbrook-specific. The application is being provided as-is free of charge for any school district with the development and infrastructure resources to customize and deploy it for their own use.

If you are interested in a turnkey solution, visit https://www.soliantconsulting.com/school-covid-questionnaire/ for more information.

## Setup

* If you are running a development copy (npm start) update .env.development to point to your api server
* if you are running a production copy (npm run build) update .env.production to point to your api server

## Development

To run a development copy of the React frontend first update .env.development to point to your api server and update 
REACT_APP_AUTH_MODE to either AD or DOB to match the setting from the api.
If you are running both on the same computer the default values should be fine.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Production

For a production deployment first update .env.production to point to your production api server and update 
REACT_APP_AUTH_MODE to either AD or DOB to match the setting from the api.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed by hosting it on a web server like nginx/apache/iis.

## Minimum Browser Requirement

Latest version of one of the following
* Firefox
* Chrome
* Safari
* Microsoft Edge
