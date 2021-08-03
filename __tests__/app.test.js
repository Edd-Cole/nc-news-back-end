const db = require('../db/connection.js');
const request = require("supertest")
const app = require("../routers/app.js")
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
    describe("/topics", () => {
        describe("/ - GET", () => {
            test("status 200 - returns all the topics", () => {
                return request(app).get("/api/topics").expect(200)
                    .then((response) => {
                        response.body.topics.forEach(topic => {
                            expect(topic).toMatchObject({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        })
                    })
            })
        })
    })

    describe("/users", () => {
        describe("/ - GET", () => {
            test("status 200 - returns all the users", () => {
                return request(app).get("/api/users").expect(200)
                    .then(response => {
                        response.body.users.forEach(user => {
                            expect(user).toMatchObject({
                                username: expect.any(String),
                                avatar_url: expect.any(String),
                            })
                            expect(user).not.toMatchObject({
                                name: expect.any(String)
                            })
                        })
                    })
            })
        })
    })

    describe("/articles", () => {
        describe("/ - GET", () => {
            test("status 200 - returns all the articles", () => {
                return request(app).get("/api/articles").expect(200)
                    .then(response => {
                        response.body.articles.forEach(article => {
                            expect(article).toMatchObject({
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                body: expect.any(String),
                                votes: expect.any(Number),
                                topic: expect.any(String),
                                author: expect.any(String),
                            })
                        })
                    })
            })
        })
        describe("/:article_id - GET", () => {
            test("status 200 - returns a specific article", () => {
                return request(app).get("/api/articles/5").expect(200)
                    .then(response => {
                        expect(response.body.articles[0]).toMatchObject({
                            article_id: 5,
                            title: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                        })
                    })
            })

            test("status 404 - returns an error when id is not present", () => {
                return request(app).get("/api/articles/100000").expect(404)
                    .then(response => {
                        expect(response.body.msg).toBe("article_id does not exist")
                    })
            })

            test("status 400 - returns an error when id is not of proper type", () => {
                return request(app).get("/api/articles/dog").expect(400)
                    .then(response => {
                        expect(response.body.msg).toBe("article_id is not of correct type")
                    })
            })
        })

        describe.only("/:article_id - PATCH", () => {
            //404 - article_id does not exist
            //400 - invalid type of info to update
            //400 - patched info is too large for table column
            //400 - value has not been entered
            test("status 200 - updates only one part of an article", () => {
                return request(app).patch("/api/articles/1").send({ title: "Bing" }).expect(200)
                    .then(response => {
                        expect(response.body.articles[0]).toMatchObject({
                            article_id: 1,
                            title: "Bing",
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String)
                        })
                    })
            })

            test("status 200 - can update any part of an article and multiple fields", () => {
                return request(app).patch("/api/articles/1").send({ title: "Bing", body: "Bong", votes: 17, topic: "cats", author: "rogersop" }).expect(200)
                    .then(response => {
                        expect(response.body.articles[0]).toMatchObject({
                            article_id: 1,
                            title: "Bing",
                            body: "Bong",
                            votes: 17,
                            topic: "cats",
                            author: "rogersop"
                        })
                    })
            })

            test("status 200 - returns article when when only invalid keys are used", () => {
                return request(app).patch("/api/articles/1").send({ subtitle: "Not valid" }).expect(200)
                    .then(response => {
                        expect(response.body.articles[0]).toMatchObject({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                        })
                        expect(response.body.articles[0]).not.toMatchObject({
                            subtitle: expect.any(String)
                        })
                    })
            })

            test("status 200 - updates only the relevant data when passed a mix of valid and invalid keys", () => {
                return request(app).patch("/api/articles/1").send({ title: "Bingo", subtitle: "Not valid" }).expect(200)
                    .then(response => {
                        expect(response.body.articles[0]).toMatchObject({
                            article_id: expect.any(Number),
                            title: "Bingo",
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                        })
                        expect(response.body.articles[0]).not.toMatchObject({
                            subtitle: expect.any(String)
                        })
                    })
            })

            test("status 400 - returns an error when passed an invalid type of article_id", () => {
                return request(app).patch("/api/articles/1000000").send({ title: "Bingo" }).expect(400)
                    .then(response => {
                        expect(response.body.msg).toBe("article_id does not exist")
                    })
            })

            test("status 400 - updating foreign key with incorrect info", () => {
                return request(app).patch("/api/articles/1").send({ topic: "Not a valid topic" }).expect(400)
                    .then(response => {
                        expect(response.body.msg).toBe("cannot create an original value for topic and/or author")
                    })
            })

            test("status 400 - patched info is too large for columns", () => {
                return request(app).patch("/api/articles/1").send({ title: "I have no idea how long this title will go on for, I really really really really really hope that it will reach 128 characters long soon, otherwise this will be absolutely ridiculously long. I cannot believe that I am still typing this out, I must have hit 128 characters now, surely!" })
                    .expect(400)
                    .then(response => {
                        expect(response.body.msg).toBe("at least one value exceeds character limit")
                    })
            })

            test("status 400 - is not vulnerable to SQL Injection", () => {
                return request(app).patch("/api/articles/1").send({ body: "something; DROP TABLE articles;" })
                    .then(response => {
                        expect(response.body.articles).not.toHaveLength(0)
                        expect(response.body.articles[0]).toMatchObject({
                            article_id: 1,
                            title: 'Living in the shadow of a great man',
                            body: 'something; DROP TABLE articles;',
                            votes: 100,
                            topic: 'mitch',
                            author: 'butter_bridge'
                        })
                    })
            })
        })
    })

    describe("/comments", () => {
        describe("/ - GET", () => {
            test("status 200 - returns all the comments", () => {
                return request(app).get("/api/comments").expect(200)
                    .then(response => {
                        response.body.comments.forEach(comment => {
                            expect(comment).toMatchObject({
                                comment_id: expect.any(Number),
                                author: expect.any(String),
                                title: expect.any(String),
                                votes: expect.any(Number),
                                body: expect.any(String)
                            })
                        })
                    })
            })
        })
    })
})