# Backend of NC News Project
---

Please ensure you have Node version 16.2.0 and PostgreSQL version 12.7 to run this project.

To find out your Node.js and PSQL versions type these commands into your terminal.

```http
node --version

psql --version
```

### [Click here to see the hosted version](https://eddncnewsproject.herokuapp.com/api/)
---
## Summary
---
### Goal
---
The goal of this project was to build a fully functioning backend with RESTful API's using TDD principles to mimic the Reddit platform.

### Structure
---
The project is sectioned into tests (__tests__), database (db), and routers directories. There are additional files such as app.js and listen.js that are stored on the root as standard.

Inside the tests directory, you will find the tests for all util functions which can be found in ./db/utils/data-manipulation.js. These tests where built from the trivial case to more complex problems which were the intended target of the functions.

Inside the db directory, you will find all the seeding data (for test and dev, saved as JSON files), the seeding files to create the required tables within the database, the util functions, and the connection file which establishes the correct connection to the desired database using the .env.* files.

Lastly, inside the routers directory, we have all the controllers, models and routes available. Additionally, we have a json file that will show the current, functional endpoints of the project.

---

## Instructions
---
### Cloning the Repo & installing packages
---
To clone this Repo, you should fork it to your own github account, then copy the web-url and in your terminal run:

```http
git clone [your_URL_here]
```

To add the requisite packages for the project to work properly, please run these in your terminal, in the projects's root directory.

```http
npm init -y

npm install
```
and then follow the instructions on your terminal.

Do ensure all packages have installed properly before continuing!!!

### Adding the .env files
---
This command will create the required .env.* files to connect to the relevant database

```http
npm run create-env-files
```
This will create the necessary env files for this project to run. 

### To create, seed and populate the database
---
First, we need to create the database. Run the following script in the root directory:

```http
npm run setup-dbs
```
Then, execute the following command to seed the database:

```http
npm run seed
```
Your database is created and seeded with data.

### To run the tests
---
To run the tests, execute the following script in your terminal, whilst in the root directory:

```http
npm test
```
If you only want to test the endpoints or the util functions, run the appropriate command from below:
```http
npm test a      <----- to only test endpoints

npm test u      <----- to only test util functions
```

### Running externally
If you have really enjoyed yourself (and I can't see why not!), you take this project to the next level and add data into the databases permanently!

But how?

That's easy! 

First, run this script in the terminal in the root directory:
```http
npm run start
```

Make sure you have some way of communicating with the server (e.g. insomnia) and type into the blank field:

```http
localhost:7070/api/[your_endpoint_in_here]
```

And you can have fun adding, deleting, updating and getting information to the database for as long as you want!!!