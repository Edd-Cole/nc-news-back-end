const db = require('../db/connection.js');
const request = require("supertest")
const app = require("../routers/app.js")
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
    describe("/topics - GET", () => {
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