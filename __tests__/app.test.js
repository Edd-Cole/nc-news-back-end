const db = require('../db/connection.js');
const request = require("supertest")
const app = require("../app.js")
const testData = require('../db/data/test-data/index.js');
const fs = require("fs/promises")
const seed = require('../db/seed.js');
require("jest-sorted")

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
    describe("/ - GET", () => {
        describe("status 200 - Success", () => {
            test("returns all available endpoints within the project that are live and accessible", () => {
                return request(app).get("/api/").expect(200)
                    .then(async(response) => {
                        let endpoints = await fs.readFile(`${__dirname}/../db/endpoints.json`, "utf8")
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
                test("returns all the topics that exist within the database", () => {
                    return request(app).get("/api/topics").expect(200)
                        .then((response) => {
                            expect(response.body.topics).toHaveLength(4)
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

        describe("/ - POST", () => {
            describe("status 201 - Created", () => {
                test("takes a slug and description, returns the created topic and adds the topic to the database", () => {
                    return request(app).post("/api/topics")
                        .send({ slug: "dogs", description: "better than cats" })
                        .expect(201)
                        .then(response => {
                            expect(response.body.topics).toEqual({
                                slug: "dogs",
                                description: "better than cats"
                            })
                        })
                })
            })

            describe("status 400 - Bad Request", () => {
                test("cannot add a topic into the database if the slug has already been taken by another topic", () => {
                    return request(app).post("/api/topics").send({ slug: "cats", description: "no" })
                        .expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid data received")
                        })
                })

                test("slug and description must be posted to the database otherwise the promise will reject", async() => {
                    await request(app).post("/api/topics").send({ description: "me" })
                        .expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid data received")
                        })
                    await request(app).post("/api/topics").send({ slug: "Boom" })
                        .expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid data received")
                        })
                })
            })
        })

        describe("/:slug", () => {
            describe("/ - PATCH", () => {
                describe("status 200 - Success", () => {
                    test("correctly updates the description for the correct topic in the database", () => {
                        return request(app).patch("/api/topics/cats")
                            .send({ description: "Now including Tigers!" })
                            .expect(200)
                            .then(response => {
                                expect(response.body.topics[0]).toEqual({
                                    slug: "cats",
                                    description: "Now including Tigers!"
                                })
                            })
                    })
                })

                describe("status 400 - Bad Request", () => {
                    test("cannot change the slug once it has been created, patch will reject an attempt to do this", () => {
                        return request(app).patch("/api/topics/cats")
                            .send({ slug: "dogs" })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid data received")
                            })
                    })

                    test("trying to update a topic description that does not exist in the database will reject the promise", () => {
                        return request(app).patch("/api/topics/doesNotExist")
                            .send({ description: "does not exist" })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })
                })
            })
        })

        // describe.only("/ - DELETE", () => {
        //     describe("status 204 - Success: No Content", () => {
        //         test("deletes a topic", async() => {
        //             await request(app).delete("/api/topics/cats")
        //                 .expect(204)

        //             await db.query("SELECT * FROM topics WHERE slug = cats")
        //                 .then(response => {
        //                     expect(response.body).toBe(undefined)
        //                 })
        //         })
        //     })
        // })
    })

    describe("/users", () => {
        describe("/ - GET", () => {
            describe("status 200 - Success", () => {
                test("returns all the users that exist in the database", () => {
                    return request(app).get("/api/users").expect(200)
                        .then(response => {
                            expect(response.body.users).toHaveLength(5)
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

        describe("/ - POST", () => {
            describe("status 201 - Created", () => {
                test("creates a new user and adds it to the database, returning the user as the response", async() => {
                    await request(app).post("/api/users")
                        .send({ username: "TheBestNameEver", name: "Me", })
                        .expect(201)
                        .then(response => {
                            expect(response.body.users[0]).toEqual({
                                username: "TheBestNameEver",
                                name: "Me",
                                avatar_url: "no_avatar"
                            })
                        })
                    await db.query("SELECT * FROM users WHERE username = 'TheBestNameEver'")
                        .then(users => expect(users.rows[0]).toEqual({
                            username: "TheBestNameEver",
                            name: "Me",
                            avatar_url: "no_avatar"
                        }))
                })
            })

            describe("status 400 - Bad Request", () => {
                test("cannot create a new user when the username already exists in the database", () => {
                    return request(app).post("/api/users").send({ username: "lurker", name: "Me" })
                        .expect(400)
                        .then(users => {
                            expect(users.body.msg).toBe("Invalid data received")
                        })
                })
            })
        })

        describe("/:username", () => {
            describe("/ - GET", () => {
                describe("status 200 - Success", () => {
                    test("returns a specific user when identified with their username", () => {
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
                    test("returns a rejected promise when the username does not exist in the database", () => {
                        return request(app).get("/api/users/dogman").expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })
                })
            })

            describe("/ - PATCH", () => {
                describe("status 200 - Success", () => {
                    test("returns the updated user and updates the correct table in the database", () => {
                        return request(app).patch("/api/users/lurker")
                            .send({ name: "Paul" })
                            .expect(200)
                            .then(response => {
                                expect(response.body.users[0]).toEqual({
                                    avatar_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                                    name: "Paul",
                                    username: "lurker",
                                })
                            })
                    })

                    test("returns an updated user, all fields can be changed/edited", () => {
                        return request(app).patch("/api/users/lurker")
                            .send({ username: "Bingo", avatar_url: "new", name: "lichen" })
                            .expect(200)
                            .then(response => {
                                expect(response.body.users[0]).toEqual({
                                    username: "Bingo",
                                    avatar_url: "new",
                                    name: "lichen"
                                })
                            })
                    })
                })
                describe("status 400 - Bad Request", () => {
                    test("returns a rejected promise when patch is used and no information is sent to update the database with", () => {
                        return request(app).patch("/api/users/lurker").send({}).expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid data received")
                            })
                    })

                    test("user already exists", () => {
                        return request(app).patch("/api/users/lurker")
                            .send({ username: "rogersop" })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid data received")
                            })
                    })
                })

                describe("status 404 - Page Not Found", () => {
                    test("user does not exist in the database so it cannot be updated, rejects a promise", () => {
                        return request(app).patch("/api/users/dogman")
                            .send({ username: "Bingo", avatar_url: "new", name: "lichen" })
                            .expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })
                })
            })

            describe("/ - DELETE", () => {
                describe("status 204 - Success: No Content", () => {
                    test("deletes a user from the database", async() => {
                        await request(app).delete("/api/users/lurker").expect(204)
                        await db.query("SELECT * FROM users WHERE username = 'lurker';")
                            .then(response => {
                                expect(response.body).toBe(undefined)
                            })
                    })

                    test("if user is deleted, all comments and articles are still available on a deleted_user username,", async() => {
                        await request(app).delete("/api/users/rogersop").expect(204)
                        await db.query("SELECT * FROM articles WHERE author = 'deleted_user'")
                            .then(response => {
                                expect(response.rows.length).not.toBe(0)
                            })
                    })
                })
            })
        })
    })

    describe("/articles", () => {
        describe("/ - GET", () => {
            describe("status 200 - Success", () => {
                test("returns all articles that exist within the database", () => {
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

                test("returns the articles sorted by the inputted topic", () => {
                    return request(app).get("/api/articles?sort_by=topic").expect(200)
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

                test("returns the articles ordered using in either ascending or descending order", () => {
                    return request(app).get("/api/articles?order_by=ASC").expect(200)
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
                            expect(response.body.articles).toBeSortedBy("created_at")
                        })
                })

                test("returns a list of articles of the chosen topic as stated in the topic query", () => {
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

                test("can work with multiple queries, returns a list of articles", () => {
                    return request(app).get("/api/articles?sort_by=title&order_by=desc&topic=mitch").expect(200)
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

                test(`returns a set number of articles if specified a limit,
                if that limit is greater than total articles, returns all articles`, () => {
                    return request(app).get("/api/articles?limit=15").expect(200)
                        .then(response => {
                            expect(response.body.articles).toHaveLength(12)
                        })
                })

                test("returns a set number of articles from the start of a page", () => {
                    return request(app).get("/api/articles?limit=2&page=2").expect(200)
                        .then(response => {
                            expect(response.body.articles[0].article_id).toBe(2)
                            expect(response.body.articles[1].article_id).toBe(12)
                        })
                })

                test("default sort, order, limit and page of the get request are created_by, descending, 10, 1, respectively", () => {
                    return request(app).get("/api/articles?").expect(200)
                        .then(response => {
                            expect(response.body.articles).toHaveLength(10)
                            expect(response.body.articles).toBeSortedBy("created_at", { descending: true })
                            expect(response.body.articles[0].article_id).toBe(3)
                            expect(response.body.articles[9].article_id).toBe(8)
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

                test("returns an empty array of articles when a topic query is valid but has no articles associated with it", () => {
                    return request(app).get("/api/articles?topic=paper").expect(200)
                        .then(response => {
                            expect(response.body.articles).toEqual([])
                        })
                })
            })

            describe("status 400 - Bad Request", () => {
                test("rejects when passed invalid queries - sort_by", () => {
                    return request(app).get("/api/articles?sort_by=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - order_by", () => {
                    return request(app).get("/api/articles?order_by=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - limit", () => {
                    return request(app).get("/api/articles?limit=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })

                test("rejects when passed invalid queries - page", () => {
                    return request(app).get("/api/articles?page=Bingo").expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })
            })

            describe("status 404 - Page Not Found", () => {
                test("rejects when passed invalid queries - topics", () => {
                    return request(app).get("/api/articles?topic=Bingo").expect(404)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid query")
                        })
                })
            })
        })

        describe("/ - POST", () => {
            describe("status 201 - Created", () => {
                test("returns the newly created article and article added to the  database", async() => {
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
                            })
                        })
                    await db.query("SELECT * FROM articles ORDER BY article_id DESC LIMIT 1;")
                        .then(response => expect(response.rows[0].title).toBe("Who ate all the cats?"))
                })
            })

            describe("status 400 - Bad Request", () => {
                test("returns an error if title, topic, author or body are missing", () => {
                    return request(app).post("/api/articles")
                        .send({ title: "Bingo!", body: "Some missing info soon", topic: "cats" })
                        .expect(400)
                        .then(response => {
                            expect(response.body.msg).toBe("Invalid data received")
                        })
                })

                test("returns an error if author or topic do not match any foreign key values in the database", () => {
                    return request(app).post("/api/articles")
                        .send({ title: "Bingo", body: "Bongo", author: "lurker", topic: "Bingo" })
                        .expect(400)
                        .then(response => expect(response.body.msg).toBe("Invalid data received"))
                })
            })
        })

        describe("/:article_id", () => {
            describe("/ - GET", () => {
                describe("status 200 - Success", () => {
                    test("returns a specific article by the article_id", () => {
                        return request(app).get("/api/articles/5").expect(200)
                            .then(response => {
                                expect(response.body).toMatchObject({
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
                    test("returns an error when id is not of the same type as number", () => {
                        return request(app).get("/api/articles/dog").expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })
                })

                describe("status 404 - Page Not Found", () => {
                    test("returns an error when article_id is of correct type but does not exist in the database", () => {
                        return request(app).get("/api/articles/100000").expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("Endpoint does not exist")
                            })
                    })
                })
            })

            describe("/ - PATCH", () => {
                describe("status 200 - Success", () => {
                    test("accepts an inc_vote: newVote and increments the votes value by newVote", () => {
                        return request(app).patch("/api/articles/1")
                            .send({ inc_votes: 1 })
                            .expect(200)
                            .then(response => {
                                expect(response.body).toEqual({
                                    article_id: 1,
                                    title: "Living in the shadow of a great man",
                                    body: "I find this existence challenging",
                                    votes: 101,
                                    topic: "mitch",
                                    author: "butter_bridge",
                                    created_at: expect.any(String)
                                })
                            })
                    })
                })

                describe("status 400 - Bad Request", () => {
                    test("returns a rejected promise when passed an invalid type of article_id", () => {
                        return request(app).patch("/api/articles/badarticle_id").send({ inc_votes: 10 }).expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })

                    test("returns a rejected promise when inc_votes is not a number or udefined", () => {
                        return request(app).patch("/api/articles/1").send({ inc_votes: "badValue" })
                            .expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid object")
                            })
                    })
                })

                describe("status 404 - Page Not Found", () => {
                    test("article_id is a number but does not exist in the database", () => {
                        return request(app).patch("/api/articles/100000").send({ inc_votes: -17 }).expect(404)
                            .then(response => {
                                expect(response.body.msg).toBe("Endpoint does not exist")
                            })
                    })
                })
            })

            describe("/ - DELETE", () => {
                describe("status 204 - Success: No Content", () => {
                    test("successfullly deletes an article from the database", async() => {
                        await request(app).delete("/api/articles/1").expect(204)
                        await db.query("SELECT * FROM articles WHERE article_id = 1")
                            .then(article => expect(article.rows).toHaveLength(0))
                        await db.query("SELECT * FROM articles")
                            .then(response => {
                                expect(response.rows).not.toHaveLength(0)
                            })
                    })
                })

                describe("status 400 - Bad Request", () => {
                    test("does not match the type (number_ for article_id parametric endpoint", () => {
                        return request(app).delete("/api/articles/dog").expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })
                })
            })

            describe("/comments", () => {
                describe("/ - GET", () => {
                    describe("status 200 - Success", () => {
                        test("return comments associated with an article by article_id", () => {
                            return request(app).get("/api/articles/1/comments").expect(200)
                                .then(response => {
                                    expect(response.body.comments).not.toHaveLength(0)
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

                        test("returns an empty array when an article has no comments associated with it", () => {
                            return request(app).get("/api/articles/7/comments").expect(200)
                                .then(response => {
                                    expect(response.body.comments).toEqual([])
                                })
                        })

                        test("return a maximum number of comments specified by the limit query", () => {
                            return request(app).get("/api/articles/1/comments?limit=1").expect(200)
                                .then(response => {
                                    expect(response.body.comments).toHaveLength(1)
                                })
                        })

                        test("return comments from the specified page with a limit using a page query", () => {
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
                                    expect(response.body.msg).toBe("Invalid type for endpoint")
                                })
                        })

                        test("returns an error when passed an invalid type for queries", async() => {
                            await request(app).get("/api/articles/1/comments?limit=bing").expect(400)
                                .then(response => { expect(response.body.msg).toBe("Invalid query") })
                            await request(app).get("/api/articles/1/comments?page=bing").expect(400)
                                .then(response => { expect(response.body.msg).toBe("Invalid query") })

                        })
                    })

                    describe("status 404 - Page Not Found", () => {
                        test("returns error when article_id is of correct type but does not exist", () => {
                            return request(app).get("/api/articles/100000/comments").expect(404)
                                .then(response => {
                                    expect(response.body.msg).toBe("Article does not exist")
                                })
                        })
                    })
                })

                describe("/ - POST", () => {
                    describe("status 201 - Created", () => {
                        test("Adds a new comment to database and returns the comment, all fields complete", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker", body: "I've invented a new O(n) sorting algorithm!" })
                                .expect(201)
                                .then(response => {
                                    expect(response.body).toEqual({
                                        comment_id: 19,
                                        author: "lurker",
                                        body: "I've invented a new O(n) sorting algorithm!",
                                        article_id: 1,
                                        votes: 0,
                                        created_at: expect.anything()
                                    })
                                })
                        })

                        test("creates comment even if additional information is provided", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker", body: "I've invented a new O(n) sorting algorithm!", burger: "not relevant info" })
                                .expect(201)
                                .then(response => {
                                    expect(response.body).toEqual({
                                        comment_id: 19,
                                        author: "lurker",
                                        body: "I've invented a new O(n) sorting algorithm!",
                                        article_id: 1,
                                        votes: 0,
                                        created_at: expect.any(String)
                                    })
                                    expect(response.body).not.toMatchObject({
                                        burger: expect.any(String)
                                    })
                                })
                        })
                    })

                    describe("status 400 - Bad Request", () => {
                        test("comment must include a body in post request, otherwise reject promise", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "lurker" })
                                .expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("Invalid data received")
                                })
                        })

                        test("article_id parametric endpoint must be type number", () => {
                            return request(app).post("/api/articles/dog/comments")
                                .send({ author: "lurker", body: "hi" })
                                .expect(400)
                                .then(response => {
                                    expect(response.body.msg).toBe("Invalid endpoint")
                                })
                        })

                    })

                    describe("status 404 - Page Not Found", () => {
                        test("article_id is not in the database but is of correct type", () => {
                            return request(app).post("/api/articles/100000/comments")
                                .send({ author: "lurker", body: "hi" })
                                .expect(404)
                                .then(response => {
                                    expect(response.body.msg).toBe("Article does not exist")
                                })
                        })

                        test("author of comment does not exist in the database", () => {
                            return request(app).post("/api/articles/1/comments")
                                .send({ author: "12345", body: "I don't exist" })
                                .expect(404)
                                .then(response => {
                                    expect(response.body.msg).toBe("Invalid data received")
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
                test("returns all the comments that exist in the database", () => {
                    return request(app).get("/api/comments").expect(200)
                        .then(response => {
                            expect(response.body.comments).toHaveLength(18)
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

                test("returns a maximum number of comments when given a limit query", () => {
                    return request(app).get("/api/comments?limit=10").expect(200)
                        .then(response => {
                            expect(response.body.comments).toHaveLength(10)
                        })
                })

                test("returns the comments on the correct page", () => {
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
                test("rejects invalid query attempts for limit and page", async() => {
                    await request(app).get("/api/comments?limit='number'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("Invalid query") })
                    await request(app).get("/api/comments?page='number'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("Invalid query") })
                })

                test("safe against SQL Injection", async() => {
                    await request(app).get("/api/comments?limit='DROP TABLE comments'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("Invalid query") })
                    await request(app).get("/api/comments?page='DROP TABLE comments'").expect(400)
                        .then(response => { expect(response.body.msg).toBe("Invalid query") })

                })
            })
        })

        describe("/:comment_id", () => {
            describe("/ - DELETE", () => {
                describe("status 204 - Success: No Content", () => {
                    test("deletes a comment from the database", async() => {
                        await request(app).delete("/api/comments/1").expect(204)
                        await db.query("SELECT * FROM comments WHERE comment_id = 1")
                            .then(response => expect(response.rows).toHaveLength(0))
                    })
                })

                describe("status 400 - Bad Request", () => {
                    test("rejects a promise if the comment_id is not of the correct type i.e. number", () => {
                        return request(app).delete("/api/comments/dog").expect(400)
                            .then(response => {
                                expect(response.body.msg).toBe("Invalid endpoint")
                            })
                    })
                })
            })
        })
    })
})