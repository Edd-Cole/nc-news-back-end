const db = require('../db/connection.js');
const request = require("supertest")
const app = require("../routers/app.js")
const testData = require('../db/data/test-data/index.js');
const fs = require("fs/promises")
const seed = require('../db/seeds/seed.js');
require("jest-sorted")

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
    describe("/ - GET", () => {
        describe("status 200 - Success", () => {
            test("returns all available endpoints one can use", () => {
                return request(app).get("/api/").expect(200)
                    .then(async(response) => {
                        let endpoints = await fs.readFile(`${__dirname}/../routers/endpoints.json`, "utf8")
                        endpoints = JSON.parse(endpoints)
                        expect(typeof(response.body.endpoints)).toBe("object")
                        expect(response.body.endpoints).toEqual(endpoints)
                    })
            })
        })
    })

    describe("/topics", () => {
        describe("/ - GET", () => {
            describe("status 200 - Success", () => {
                test("returns all the topics", () => {
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
    })

    describe("/users", () => {
        describe("/ - GET", () => {
            describe("status 200 - Success", () => {
                test("returns all the users", () => {
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

        describe("/:username", () => {
            describe("/ - GET", () => {
                describe("status 200 - Success", () => {
                    test("grabs a user by their username", () => {
                        return request(app).get("/api/users/lurker").expect(200)
                            .then(response => {
                                expect(response.body.users).toMatchObject({
                                    username: "lurker",
                                    avatar_url: expect.any(String),
                                    name: expect.any(String)
                                })
                            })
                    })
                })

                describe("status 404 - Page Not Found", () => {
                    test("user does not exist", () => {
                        return request(app).get("/api/users/dogman").expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("user does not exist")
                            })
                    })

                    test("safe against SQL Injection", () => {
                        return request(app).get("/api/users/'DROP TABLE articles").expect(404)
                            .then(response => expect(response.body.msg).toBe("user does not exist"))
                    })
                })
            })
        })
    })

    describe("/articles", () => {
        describe("/ - GET", () => {
            describe("status 200 - Success", () => {
                test("returns all the articles, default limit of 10", () => {
                    return request(app).get("/api/articles").expect(200)
                        .then(response => {
                            expect(response.body.articles).not.toHaveLength(0)
                            response.body.articles.forEach(article => {
                                expect(article).toMatchObject({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.anything(),
                                    comment_count: expect.any(String)
                                })
                            })
                        })
                })

                test("returns the articles sorted by the query", () => {
                    return request(app).get("/api/articles?sortBy=topic").expect(200)
                        .then(response => {
                            expect(response.body.articles).not.toHaveLength(0)
                            response.body.articles.forEach(article => {
                                expect(article).toMatchObject({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.anything(),
                                    comment_count: expect.any(String)
                                })
                            })
                            expect(response.body.articles).toBeSortedBy('topic')
                        })
                })

                test("returns the articles ordered using orderBy query", () => {
                    return request(app).get("/api/articles?orderBy=DESC").expect(200)
                        .then(response => {
                            expect(response.body.articles).not.toHaveLength(0);
                            response.body.articles.forEach(article => {
                                expect(article).toMatchObject({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.anything(),
                                    comment_count: expect.any(String)
                                })
                            })
                            expect(response.body.articles).toBeSortedBy("article_id", { descending: true })
                        })
                })

                test("returns a list of articles filtered by the topic query", () => {
                    return request(app).get("/api/articles?topic=cats").expect(200)
                        .then(response => {
                            expect(response.body.articles).not.toHaveLength(0)
                            response.body.articles.forEach(article => {
                                expect(article).toMatchObject({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    topic: "cats",
                                    author: expect.any(String),
                                    created_at: expect.anything(),
                                    comment_count: expect.any(String)
                                })
                            })
                        })
                })

                test("returns a list of articles when all queries used", () => {
                    return request(app).get("/api/articles?sortBy=title&orderBy=desc&topic=mitch").expect(200)
                        .then(response => {
                            expect(response.body.articles).not.toHaveLength(0)
                            response.body.articles.forEach(article => {
                                expect(article).toMatchObject({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    topic: "mitch",
                                    author: expect.any(String),
                                    created_at: expect.anything(),
                                    comment_count: expect.any(String)
                                })
                            })
                            expect(response.body.articles).toBeSortedBy("title", { descending: true })
                        })
                })

                test("returns a set number of articles if specified a limit", () => {
                    return request(app).get("/api/articles?limit=2").expect(200)
                        .then(response => {
                            expect(response.body.articles).toHaveLength(2)
                        })
                })

                test("returns a set number of articles from the start of a page", () => {
                    return request(app).get("/api/articles?limit=2&page=2").expect(200)
                        .then(response => {
                            expect(response.body.articles[0].article_id).toBe(3)
                            expect(response.body.articles[1].article_id).toBe(4)
                        })
                })

            })

            describe("status 400 - Bad Request", () => {
                test("rejects when passed invalid queries - sortBy", () => {
                    return request(app).get("/api/articles?sortBy=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - orderBy", () => {
                    return request(app).get("/api/articles?orderBy=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - topics", () => {
                    return request(app).get("/api/articles?topic=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - limit", () => {
                    return request(app).get("/api/articles?topic=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - page", () => {
                    return request(app).get("/api/articles?topic=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("safe against SQL Injection #1", async() => {
                    await request(app).get("/api/articles?sortBy=DROP TABLE articles").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?orderBy=DROP TABLE articles").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?topic=DROP TABLE articles").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?limit=DROP TABLE articles").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?page=DROP TABLE articles").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await db.query("SELECT * FROM articles").then(articles => expect(articles.rows).not.toBe(0))
                })

                test("safe against SQL injection #2", async() => {
                    await request(app).get("/api/articles?sortBy='DROP TABLE articles'").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?orderBy='DROP TABLE articles'").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?topic='DROP TABLE articles'").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?limit='DROP TABLE articles'").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await request(app).get("/api/articles?page='DROP TABLE articles'").expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid query"))
                    await db.query("SELECT * FROM articles").then(articles => expect(articles.rows).not.toBe(0))
                })
            })
        })

        describe("/ - POST", () => {
            describe("status 201 - Created", () => {
                test("returns the newly created article and article is in database", async() => {
                    await request(app).post("/api/articles")
                        .send({
                            title: "Who ate all the cats?",
                            body: "I am going to create a new song to rival 'Who let the dogs out!'",
                            topic: "cats",
                            author: "lurker"
                        })
                        .expect(201)
                        .then(response => {
                            expect(response.body.articles[0]).toMatchObject({
                                article_id: expect.any(Number),
                                title: "Who ate all the cats?",
                                body: "I am going to create a new song to rival 'Who let the dogs out!'",
                                topic: "cats",
                                author: "lurker",
                                votes: 0,
                                created_at: expect.anything(),
                                created_on: expect.anything()
                            })
                        })
                    await db.query("SELECT * FROM articles ORDER BY article_id DESC LIMIT 1;")
                        .then(response => expect(response.rows[0].title).toBe("Who ate all the cats?"))
                })

                test("safe against SQL Injection", () => {
                    return request(app).post("/api/articles")
                        .send({ title: 'DROP TABLE articles', author: "lurker", topic: "cats", body: 'DROP TABLE articles' })
                        .then(response => {
                            expect(response.body.articles).not.toBe(undefined)
                        })
                })
            })

            describe("status 400 - Bad Request", () => {
                test("returns an error if required info is missing", () => {
                    return request(app).post("/api/articles")
                        .send({ title: "Bingo!", body: "Some missing info soon", topic: "cats" })
                        .expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("ensure object is {title: String, body: String, author: String, topic: String}")
                        })
                })

                test("returns an error if incorrect info is passed for foreign keys", () => {
                    return request(app).post("/api/articles")
                        .send({ title: "Bingo", body: "Bongo", author: "lurker", topic: "Bingo" })
                        .expect(400)
                        .then(response => expect(response.body.msg).toBe("author and topic must exist"))
                })
            })
        })

        describe("/:article_id", () => {
            describe("/ - GET", () => {
                describe("status 200 - Success", () => {
                    test("returns a specific article", () => {
                        return request(app).get("/api/articles/5").expect(200)
                            .then(response => {
                                expect(response.body.articles[0]).toMatchObject({
                                    article_id: 5,
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.anything(),
                                    comment_count: expect.any(String)
                                })
                            })
                    })
                })

                describe("status 400 - Bad Request", () => {
                    test("returns an error when id is not of proper type", () => {
                        return request(app).get("/api/articles/dog").expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("article_id is not of correct type")
                            })
                    })
                })

                describe("status 404 - Page Not Found", () => {
                    test("returns an error when id is not present", () => {
                        return request(app).get("/api/articles/100000").expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("article_id does not exist")
                            })
                    })
                })
            })

            describe("/ - PATCH", () => {
                describe("status 200 - Success", () => {
                    test("updates only one part of an article", () => {
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

                    test("can update any part of an article and multiple fields", () => {
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

                    test("accepts an inc_vote: newVote and increments the votes value by newVote", () => {
                        return request(app).patch("/api/articles/1")
                            .send({ inc_votes: 1 })
                            .expect(200)
                            .then(response => {
                                expect(response.body.articles[0]).toMatchObject({
                                    article_id: 1,
                                    title: expect.any(String),
                                    body: expect.any(String),
                                    votes: 101,
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.anything()
                                })
                            })
                    })

                    test("returns article when only invalid keys are used", () => {
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

                    test("updates only the relevant data when passed a mix of valid and invalid keys", () => {
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
                })

                describe("status 400 - Bad Request", () => {
                    test("returns an error when passed an invalid type of article_id", () => {
                        return request(app).patch("/api/articles/badarticle_id").send({ title: "Bingo" }).expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("invalid type for key")
                            })
                    })

                    test("updating foreign key with incorrect info", () => {
                        return request(app).patch("/api/articles/1").send({ topic: "Not a valid topic" }).expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("cannot create an original value for topic and/or author")
                            })
                    })

                    test("patched info is too large for columns", () => {
                        return request(app).patch("/api/articles/1").send({ title: "I have no idea how long this title will go on for, I really really really really really hope that it will reach 128 characters long soon, otherwise this will be absolutely ridiculously long. I cannot believe that I am still typing this out, I must have hit 128 characters now, surely!" })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("at least one value exceeds character limit")
                            })
                    })

                    test("invalid type of info to update", () => {
                        return request(app).patch("/api/articles/1").send({ votes: "not a valid type" }).expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("invalid type for key")
                            })
                    })

                    test("safe to SQL Injection #1", () => {
                        return request(app).patch("/api/articles/1; DROP TABLE articles;").send({ body: "something; DROP TABLE articles" }).expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("invalid type for key")
                            })
                    })

                    test("safe to SQL Injection #2", () => {
                        return request(app).patch("/api/articles/1; 'DROP TABLE articles;'")
                            .send({ body: "something;  'DROP TABLE articles'" })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("invalid type for key")
                            })
                    })

                    test("safe to SQL Injection #3", () => {
                        return request(app).patch("/api/articles/1; ''DROP TABLE articles;''")
                            .send({ body: "something; ''DROP TABLE articles''", votes: '19; DROP TABLE articles' })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("invalid type for key")
                            })
                    })
                })

                describe("status 404 - Page Not Found", () => {
                    test("article_id is a number but does not exist", () => {
                        return request(app).patch("/api/articles/100000").send({ title: "Bingo" }).expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("article does not exist")
                            })
                    })
                })
            })

            describe("/comments", () => {
                describe("/ - GET", () => {
                    describe("status 200 - Success", () => {
                        test("return comments associated with an article", () => {
                            return request(app).get("/api/articles/1/comments").expect(200)
                                .then(response => {
                                    response.body.comments.forEach(comment => {
                                        expect(comment).toMatchObject({
                                            comment_id: expect.any(Number),
                                            title: expect.any(String),
                                            author: expect.any(String),
                                            article_id: 1,
                                            votes: expect.any(Number),
                                            body: expect.any(String)
                                        })
                                    })
                                })
                        })

                        test("return comments with a limit", () => {
                            return request(app).get("/api/articles/1/comments?limit=1").expect(200)
                                .then(response => {
                                    expect(response.body.comments).toHaveLength(1)
                                })
                        })

                        test("return comments from the specified page with a limit", () => {
                            return request(app).get("/api/articles/1/comments?limit=1&page=2").expect(200)
                                .then(response => {
                                    expect(response.body.comments[0].comment_id).toBe(3);
                                    expect(response.body.comments[1]).toBe(undefined)
                                })
                        })
                    })

                    describe("status 400 - Bad Request", () => {
                        test("returns an error when passed an invalid type of article_id", () => {
                            return request(app).get("/api/articles/dog/comments").expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("invalid type for endpoint")
                                })
                        })

                        test("returns an error when passed an invalid type for queries", async() => {
                            await request(app).get("/api/articles/1/comments?limit=bing").expect(400)
                                .then(response => { expect(response.body.msg).toBe("invalid type for endpoint") })
                            await request(app).get("/api/articles/1/comments?page=bing").expect(400)
                                .then(response => { expect(response.body.msg).toBe("invalid type for endpoint") })

                        })

                        test("safe against SQL Injection #1", () => {
                            return request(app).get("/api/articles/1; DROP TABLE articles;/comments").expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("invalid type for endpoint")
                                })
                        })

                        test("safe against SQL Injection #2", async() => {
                            await request(app).get("/api/articles/1/comments?limit='DROP TABLE articles'").expect(400)
                                .then(response => { expect(response.body.msg).toBe("invalid type for endpoint") })
                        })
                    })

                    describe("status 404 - Page Not Found", () => {
                        test("returns error when article_id is of correct type but does not exist", () => {
                            return request(app).get("/api/articles/100000/comments").expect(404)
                                .then(response => {
                                    expect(response.body.msg).toBe("article does not exist")
                                })
                        })
                    })
                })

                describe("/ - POST", () => {
                    describe("status 201 - Created", () => {
                        test("Adds a new comment to database and returns comment, all fields complete", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker", body: "I've invented a new O(n) sorting algorithm!" })
                                .expect(201)
                                .then(response => {

                                    expect(response.body.comments).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: "lurker",
                                        body: "I've invented a new O(n) sorting algorithm!",
                                        article_id: 1,
                                        votes: 0
                                    })
                                    return db.query("SELECT * FROM comments")
                                }).then(data => {
                                    expect(data.rows[data.rows.length - 1]).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: "lurker",
                                        body: "I've invented a new O(n) sorting algorithm!",
                                        article_id: 1,
                                        votes: 0
                                    })
                                })
                        })

                        test("creates comment even if additional information is provided", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker", body: "I've invented a new O(n) sorting algorithm!", burger: "not relevant info" })
                                .expect(201)
                                .then(response => {
                                    expect(response.body.comments).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: "lurker",
                                        body: "I've invented a new O(n) sorting algorithm!",
                                        article_id: 1,
                                        votes: 0
                                    })
                                    expect(response.body.comments).not.toMatchObject({
                                        burger: expect.any(String)
                                    })
                                })
                        })

                        test("safe against SQL Injection #1", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker", body: "Bye; DROP TABLE articles;" })
                                .expect(201)
                                .then(() => {
                                    return db.query("SELECT * FROM articles")
                                })
                                .then(a => {
                                    expect(a.rows.length).not.toBe(0)
                                    expect(a.rows).toEqual(expect.anything())
                                })
                        })

                        test("safe against SQL Injection #2", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker", body: "bye; 'DROP TABLE articles'" })
                                .expect(201)
                                .then(() => {
                                    return db.query("SELECT * FROM articles")
                                })
                                .then(a => {
                                    expect(a.rows.length).not.toBe(0)
                                    expect(a.rows).toEqual(expect.anything())
                                })
                        })
                    })

                    describe("status 400 - Bad Request", () => {
                        test("must include author and body in post request", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({})
                                .expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("author and body must be specified")
                                })

                        })

                        test("article_id is not of correct type", () => {
                            return request(app).post("/api/articles/dog/comments")
                                .send({ author: "lurker", body: "hi" })
                                .expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("article_id must be a number")
                                })
                        })

                        test("invalid types for author and/or body", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: 4, body: 5 })
                                .expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("author must reference a username, article_id must exist and body must be of type String")
                                })
                        })

                        test("article_id is not in the database but is of correct type", () => {
                            return request(app).post("/api/articles/100000/comments")
                                .send({ author: "lurker", body: "hi" })
                                .expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("author must reference a username, article_id must exist and body must be of type String")
                                })
                        })
                    })
                })
            })
        })
    })

    describe("/comments", () => {
        describe("/ - GET", () => {
            describe("status 200 - Success", () => {
                test("returns all the comments", () => {
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

                test("returns the comments when applied a limit", () => {
                    return request(app).get("/api/comments?limit=10").expect(200)
                        .then(response => {
                            expect(response.body.comments).toHaveLength(10)
                        })
                })

                test("returns the comments on the correct page, works for both", () => {
                    return request(app).get("/api/comments?limit=5&page=3").expect(200)
                        .then(response => {
                            expect(response.body.comments[0].comment_id).toBe(11)
                            expect(response.body.comments[1].comment_id).toBe(12)
                            expect(response.body.comments[2].comment_id).toBe(13)
                            expect(response.body.comments[3].comment_id).toBe(14)
                            expect(response.body.comments[4].comment_id).toBe(15)
                            expect(response.body.comments[5]).toBe(undefined)
                        })
                })
            })

            describe("status 400 - Bad Request", () => {
                test("rejects invalid query attempts", async() => {
                    await request(app).get("/api/comments?limit='number'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("invalid query") })
                    await request(app).get("/api/comments?page='number'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("invalid query") })
                })

                test("safe against SQL Injection", async() => {
                    await request(app).get("/api/comments?limit='DROP TABLE comments'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("invalid query") })
                    await request(app).get("/api/comments?page='DROP TABLE comments'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("invalid query") })

                })
            })
        })

        describe("/:comment_id", () => {
            describe("/ - DELETE", () => {
                describe("status 204 - Success: No Content", () => {
                    test("deletes a comment", async() => {
                        await request(app).delete("/api/comments/1").expect(204)
                        await db.query("SELECT * FROM comments WHERE comment_id = 1")
                            .then(response => expect(response.rows).toHaveLength(0))
                    })
                })
            })
        })
    })
})