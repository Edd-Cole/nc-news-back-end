# Backend of NC News Project
---

## Link

        https://eddncnewsproject.herokuapp.com/api

---

## Summary
---
### Goal

The goal of this project was to build a fully functioning backend with RESTful API's using TDD principles to mimic the Reddit platform.

### Structure

The project is sectioned into tests (__tests__), database (db), and routers directories. There are additional files such as app.js and listen.js that are stored on the root as standard.

Inside the tests directory, you will find the tests for all util functions which can be found in ./db/utils/data-manipulation.js. These tests where built from the trivial case to more complex problems which were the intended target of the functions.

Inside the db directory, you will find all the seeding data (for test and dev, saved as JSON files), the seeding files to create the required tables within the database, the util functions, and the connection file which establishes the correct connection to the desired database using the .env.* files.

Lastly, inside the routers directory, we have all the controllers, models and routes available. Additionally, we have a json file that will show the current, functional endpoints of the project.

---

## Instructions
---
### Cloning the Repo

To clone this Repo, you should fork it to your own github account, then copy the web-url and in your terminal run:

```http
git clone [your_URL_here]
```
and then follow the instructions on your terminal.

### Adding the .env files

To add the requisite env files. First, install all the needed dependencies using the following code, in order...

```http
npm init -y
npm install
```
Next, use this command when all the needed packages have been created...

```http
npm run create-env-files
```
This should create the necessary env files for this project to run. 

#### Alternative if last script fails

- Create 2 files in the root directory called .env.development and .env.test
- In test write,
```http
PGDATABASE=nc_news_test
```
- and in development write,
```http
PGDATABASE=nc_news
```