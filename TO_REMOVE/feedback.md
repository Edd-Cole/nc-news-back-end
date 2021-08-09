# BE Northcoders NC News Portfolio Check List

## Readme - Remove the one that was provided and write your own

- [x] Link to hosted version
- [x] Write a summary of what the project is
- [x] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [x] Include information about how to create `.env.test` and `.env.development` files
- [x] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [x] Remove any unnecessary `console.logs` and comments
      I saw one console log, also still working on endpoints but something to be aware of when complete
- [x] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
      folder structure is ..... not ...... clear
- [x] .gitignore the `.env` files
      this is done but they are in a folder?

## Connection to db

- [x] Throw error if `process.env.PGDATABASE` is not set

## Creating tables

- [x] Use `NOT NULL` on required fields
      do we need not null on serial keys?

- [x] Default `created_at` in articles and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`
      why split from created_at/on ??

- [x] Delete all comments when the article they are related to is deleted: Add `ON DELETE CASCADE` to `article_id` column in `comments` table.
      you have casacde on dropping tables we want it on indiv tables so when we delete a review it gets rid of the comments

Could promise.all some of the seed file if you wanted to be a show off

## Inserting data

- [x] Make sure util functions do not mutate data
- [x] Make util functions easy to follow with well named functions and variables
- [x] Test util functions

- [x] Drop tables and create tables in seed function
      Utils functions: replaceBelongsTo, why map then foreach??? double itterations

db in utils test, watch for unused variables!

\*Talk though tests

## Tests

- [x] Seeding before each test
- [x] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
      not doing this!!

- [x] Ensure all tests are passing
- [x] Cover all endpoints and errors

thorough/ too thourough in places but not thouogh enough in others e.g 400 post user

think about the language used for test desciption

Users:username sending back users??? array???

- `GET /api/topics`

  - [x] Status 200, array of topic objects

- `GET /api/articles/:article_id`

  - [x] Status 200, single article object (including `comment_count`)
        sending back articles in an array?

  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
        borders on not being secure

  - [x] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/articles/:article_id`

  - [x] Status 200, updated single article object
        test decription isnt testing in 200
        ask for specific values
        more functionality than requested

  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
        not tested inc_votes

  - [x] Status 400, missing / incorrect body, e.g. `inc_votes` property is not a number, or missing

- `GET /api/articles`

  - [x] Status 200, array of article objects (including `comment_count`, excluding `body`)
        doesnt check the length of the returned array

  - [x] Status 200, default sort & order: `created_at`, `desc`
  - [x] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
        sortBy used not sort_by.

  - [x] Status 200, accepts `order` query, e.g. `?order=desc`
        wanted order, got orderBy

  - [x] Status 200, accepts `topic` query, e.g. `?topic=coding`
  - [x] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [x] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [x] Status 404. non-existent `topic` query, e.g. `?topic=bananas`
        sending back 400 when should be a 404

  - [x] Status 200. valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`
        not tested for

- `GET /api/articles/:article_id/comments`

  - [x] Status 200, array of comment objects for the specified article
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 200, valid ID, but has no comments responds with an empty array of comments
        not tested

- `POST /api/articles/:article_id/comments`

  - [x] Status 201, created comment object
        returning comments when only serving one
        not checking created at or on key
        dont like that your checking its in the db

  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
        would not say not a number, inconsistent
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 400, missing required field(s), e.g. no username or body properties
  - [x] Status 404, username does not exist
        you have it as 400, plus I wouldnt give so much info away
  - [x] Status 201, ignores unnecessary properties

not covered

- `GET /api`

  - [x] Status 200, JSON describing all the available endpoints

wouldnt have tested that way you did

## Routing

- [x] Split into api, topics, users, comments and articles routers
      dont like that other stuff is in routers

- [x] Use `.route` for endpoints that share the same path

## Controllers

- [x] Name functions and variables well
- [x] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)
  would use promise. reject in models not controllers

not catch on getTopics

## Models

- Protected from SQL injection

  - [x] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [ ] Sanitizing any data for tables/columns, e.g. whitelisting when using template literals or pg-format's `%s`
        no, your SQL sanitisation is wokring but not how or why it should

- [ ] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [x] Use `LEFT JOIN` for comment counts

## Errors

- [x] Use error handling middleware functions in app and extracted to separate directory/file
      your only using 1 midleware function

- [x] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an article body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an article by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get articles created in last 10 minutes
- [ ] Get: Get all articles that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for topics