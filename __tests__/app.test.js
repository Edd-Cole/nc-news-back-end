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

    describe("/users", () => {
        describe("/ - GET", () => {
            test("status 200 - returns all the users", () => {

            })
        })
    })
})