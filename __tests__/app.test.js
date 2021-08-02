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