LOCAL GROCERY PRICE TRACKER
------------------------------------

FEATURES:
- TRACK GROCERY PRICES ACROSS AMAZON, TARGET, AND FRY'S
- VIEW AND FILTER DIFFERENT PRODUCTS BY STORE, PRICE, PRODUCT TYPE, ETC.
- CREATE AND MANAGE ACCOUNT

------------------------------------

SETUP
=====
Prerequisites:
- Node.js
- PostgreSQL
- npm

Database Setup:
- Create a PostgreSQL database named grocery-price-tracker
- Restore the database from backup file in the database folder:
- pg_restore -U postgres -d grocery-price-tracker database/grocery-price-tracker-db.backup

Backend Setup:
- Navigate to backend directory (cd backend)
- Run npm install
- Update or create .env file to your specifications
- Start backend server with npm run dev

Frontend Setup:
- Open new terminal and navigate to main (grocery-price-tracker) directory
- Run npm install
- Start application with npm start
