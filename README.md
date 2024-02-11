# Proshop E-Commerce

The goal of this project was to gather experience with the mern stack. Very interesting were the Redux Toolkit/Query library for managing state,
Chakra UI to quickly build the Frontend and MongoDB for the database. 

## Technology

- [React as Frontend](https://reactjs.org/)
- [Redux Toolkit & RTK Query for State Management](https://redux-toolkit.js.org/)
- [Chakra UI](https://chakra-ui.com/docs/components)
- [NodeJS as Frontend](https://nodejs.org/)
- [Express JS as Framework](https://expressjs.com/)
- [Object Data Modeling with Mongoose](https://mongoosejs.com/)
- [MongoDB](https://mongodb.com/)

## Demo

Functionality of the app:

- Authentication
- CRUD functionalities (Users/Products)
- Comments
- Payment Method via Paypal (Sandbox is activated, full payment flow possible with paypal developer accounts)
- Admin Area for maintaining Products & Users

Demo: https://proshop.srabodev.de/

## Run Development
Rename frontend/.env.env to frontend/.env adjust the file values

Rename backend/config/.env.env to backend/config/.env adjust the file values


``` 
npm i
npm run dev

If you want to seed your MongoDB
npm run data:import
