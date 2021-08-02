const { formatTopics, formatUsers, formatArticles, createRefTable, formatComments, replaceBelongsToWithArticleID } = require("../db/utils/data-manipulation.js");
const db = require("../db/connection.js")

describe("Utility functions db/utils/data-manip", () => {
    describe("formatTopics()", () => {
        test("formats the topics into the [[s, d], [s, d], [s, d]] shape", () => {
            const topics = [{
                    description: 'The man, the Mitch, the legend',
                    slug: 'mitch'
                },
                {
                    description: 'Not dogs',
                    slug: 'cats'
                },
                {
                    description: 'what books are made of',
                    slug: 'paper'
                }
            ]

            expect(formatTopics(topics)).toEqual([
                ["mitch", "The man, the Mitch, the legend"],
                ["cats", "Not dogs"],
                ["paper", "what books are made of"]
            ])
        })

        test("creates a new array when invoked", () => {
            const topics = [{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }]
            const newTopics = formatTopics(topics);
            expect(newTopics).not.toBe(topics);
        })

        test("creates new nested arrays for each topic", () => {
            const topics = [{
                    description: 'The man, the Mitch, the legend',
                    slug: 'mitch'
                },
                {
                    description: 'Not dogs',
                    slug: 'cats'
                },
                {
                    description: 'what books are made of',
                    slug: 'paper'
                }
            ]
            const newTopics = formatTopics(topics);
            newTopics.forEach((topic, index) => {
                expect(topic).not.toBe(topics[index])
            })
        })

        test("does not mutate original array", () => {
            const topics = [{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }]
            formatTopics(topics);
            expect(topics).toEqual([{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }])
        })

        test("does not mutate objects inside topics", () => {
            const topics = [{
                    description: 'The man, the Mitch, the legend',
                    slug: 'mitch'
                },
                {
                    description: 'Not dogs',
                    slug: 'cats'
                },
                {
                    description: 'what books are made of',
                    slug: 'paper'
                }
            ]
            const topics2 = topics.map(topic => {
                return {...topic };
            })
            formatTopics(topics);
            topics.forEach((topic, index) => {
                expect(topic).toEqual(topics2[index])
            })
        })
    })

    describe("formatUsers()", () => {
        test("creates an array of arrays with the information in the correct order", () => {
            const users = [{
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                },
                {
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                },
                {
                    username: 'rogersop',
                    name: 'paul',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                },
                {
                    username: 'lurker',
                    name: 'do_nothing',
                    avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                }
            ];
            const newUsers = formatUsers(users)
            expect(newUsers).toEqual([
                ["butter_bridge", 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', "jonny"],
                ["icellusedkars", 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4', "sam"],
                ["rogersop", 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4', "paul"],
                ["lurker", 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', "do_nothing"]
            ])
        })

        test("creates a new array when invoked", () => {
            const users = [{
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            }]
            const newUsers = formatUsers(users);
            expect(newUsers).not.toBe(users);
        })

        test("creates new inner arrays when invoked", () => {
            const users = [{
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                },
                {
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                },
                {
                    username: 'rogersop',
                    name: 'paul',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                },
                {
                    username: 'lurker',
                    name: 'do_nothing',
                    avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                }
            ];
            const newUsers = formatUsers(users);
            users.forEach((user, index) => {
                expect(user).not.toBe(newUsers[index])
            })
        })

        test("does not mutate original array", () => {
            const users = [{
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            }]
            formatUsers(users);
            expect(users).toEqual([{
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            }])
        })

        test("does not mutate objects in array", () => {
            const users = [{
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                },
                {
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                },
                {
                    username: 'rogersop',
                    name: 'paul',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                },
                {
                    username: 'lurker',
                    name: 'do_nothing',
                    avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                }
            ];
            const newUsers = users.map(user => {
                return {...user };
            })
            formatUsers(users);
            users.forEach((user, index) => {
                expect(user).toEqual(newUsers[index])
            })
        })
    })

    describe("formatArticles()", () => {
        test("creates an array of arrays with the info in the correct order", () => {
            const articles = [{
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: new Date(1594329060000),
                votes: 100
            }, {
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: new Date(1604394720000),
                votes: 0
            }, {
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                created_at: new Date(1596464040000),
                votes: 0
            }]
            expect(formatArticles(articles)).toEqual([
                ["Living in the shadow of a great man", 'I find this existence challenging', 100, 'mitch', 'butter_bridge', new Date(1594329060000)],
                ['Eight pug gifs that remind me of mitch', 'some gifs', 0, 'mitch', 'icellusedkars', new Date(1604394720000)],
                ['UNCOVERED: catspiracy to bring down democracy', 'Bastet walks amongst us, and the cats are taking arms!', 0, "cats", 'rogersop', new Date(1596464040000)]
            ])
        })

        test("creates a new array when invoked", () => {
            const articles = [];
            expect(formatArticles(articles)).not.toBe(articles);
        })

        test("creates new inner array when invoked", () => {
            const articles = [{
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: new Date(1594329060000),
                votes: 100
            }, {
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: new Date(1604394720000),
                votes: 0
            }, {
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                created_at: new Date(1596464040000),
                votes: 0
            }]
            const newArticles = formatArticles(articles)
            newArticles.forEach((article, index) => {
                expect(article).not.toBe(articles[index])
            })
        })

        test("does not mutate original array", () => {
            const articles = [];
            formatArticles(articles)
            expect(articles).toEqual([]);
        })

        test("does not mutate objects in original array", () => {
            const articles = [{
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: new Date(1594329060000),
                votes: 100
            }, {
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: new Date(1604394720000),
                votes: 0
            }, {
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                created_at: new Date(1596464040000),
                votes: 0
            }];
            const newArticles = articles.map(article => {
                return {...article }
            })
            formatArticles(articles);
            articles.forEach((article, index) => {
                expect(article).toEqual(newArticles[index])
            })
        })
    })

    describe('createRefTable()', () => {
        test("throws an error if parameters are empty", () => {
            const input = [{ name: "Edd" }]
            expect(() => createRefTable(input)).toThrow(Error);
        })
        test('returns an empty object, when passed an empty array', () => {
            const input = [];
            const actual = createRefTable(input, "phone", "name");
            const expected = {};
            expect(actual).toEqual(expected);
        });

        test("createRefTable takes 2 additional string arguments that will set as the key-value pair for the reference book", () => {
            const people = [{ name: "Edd", phoneNumber: "0123456789" }, { name: "Bill", phoneNumber: "07123456789" }];
            expect(createRefTable(people, "name", "phoneNumber")).toEqual({ "Edd": "0123456789", "Bill": "07123456789" })
            const songs = [{
                    track: '11:11',
                    article_id: 'Dinosaur Pile-Up',
                    releaseYear: 2015,
                    album: 'Eleven Eleven'
                },
                {
                    track: 'Powder Blue',
                    article_id: 'Elbow',
                    releaseYear: 2001,
                    album: 'Asleep In The Back'
                }
            ];
            expect(createRefTable(songs, "track", "article_id")).toEqual({ "11:11": "Dinosaur Pile-Up", "Powder Blue": "Elbow" });
        })

        test("does not mutate original array", () => {
            const people = [{ name: "Edd", phoneNumber: "0123456789" }, { name: "Bill", phoneNumber: "07123456789" }];
            createRefTable(people, "phone", "name")
            expect(people).toEqual([{ name: "Edd", phoneNumber: "0123456789" }, { name: "Bill", phoneNumber: "07123456789" }])
        })

        test("creates a new array", () => {
            const people = [{ name: "Edd", phoneNumber: "0123456789" }, { name: "Bill", phoneNumber: "07123456789" }];
            expect(createRefTable(people, "phone", "name")).not.toBe(people)
        })

        test("creates new objects of array", () => {
            const people = [{ name: "Edd", phoneNumber: "0123456789" }, { name: "Bill", phoneNumber: "07123456789" }];
            const newPeople = createRefTable(people, "phone", "name");
            expect(newPeople[0]).not.toBe(people[0]);
            expect(newPeople[1]).not.toBe(people[1]);
        });

        test("does not mutate original array objects", () => {
            const people = [{ name: "Edd", phoneNumber: "0123456789" }, { name: "Bill", phoneNumber: "07123456789" }];
            createRefTable(people, "phone", "name")
            expect(people[0]).toEqual({ name: "Edd", phoneNumber: "0123456789" })
            expect(people[1]).toEqual({ name: "Bill", phoneNumber: "07123456789" })
        })

    });

    describe('replaceBelongsToWithArticleID()', () => {
        test("replaces title with article_id", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            expect(replaceBelongsToWithArticleID(comments, refTable)).toEqual([{ article_id: 1 }, { article_id: 2 }])
        })

        test("creates a new array", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            expect(replaceBelongsToWithArticleID(comments, refTable)).not.toBe(comments)
        })

        test("creates new objects", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            const newArticles = replaceBelongsToWithArticleID(comments, refTable);
            newArticles.forEach((article, index) => {
                expect(article).not.toBe(comments[index])
            })
        })

        test("does not mutate original array", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            replaceBelongsToWithArticleID(comments, refTable);
            expect(comments).toEqual([{ belongs_to: "bing" }, { belongs_to: "bong" }])
        })

        test("does not mutate objects", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            const newArticles = comments.map(article => { return {...article } })
            replaceBelongsToWithArticleID(comments, refTable);
            newArticles.forEach((article, index) => {
                expect(article).toEqual(comments[index])
            })
        })
    })

    describe.only("formatComments()", () => {
        test("creates an array of arrays with the data properly formatted", () => {
            const comments = [{
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 1,
                    created_by: 'butter_bridge',
                    votes: 16,
                    created_at: new Date(1586179020000)
                },
                {
                    body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                    article_id: 2,
                    created_by: 'butter_bridge',
                    votes: 14,
                    created_at: new Date(1604113380000)
                },
                {
                    body: ' I carry a log — yes. Is it funny to you? It is not to me.',
                    article_id: 3,
                    created_by: 'icellusedkars',
                    votes: -100,
                    created_at: new Date(1582459260000)
                },
            ];
            const newComments = formatComments(comments);
            expect(newComments).toEqual([
                ['butter_bridge', 1, 16, new Date(1586179020000), "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"],
                ["butter_bridge", 2, 14, new Date(1604113380000), 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'],
                ['icellusedkars', 3, -100, new Date(1582459260000), ' I carry a log — yes. Is it funny to you? It is not to me.', ]
            ])
        })

        test("creates a new array", () => {
            const comments = [];
            const newComments = formatComments(comments);
            expect(newComments).not.toBe(comments)
        })

        test("creates new objects", () => {
            const comments = [{
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 1,
                    created_by: 'butter_bridge',
                    votes: 16,
                    created_at: new Date(1586179020000)
                },
                {
                    body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                    article_id: 2,
                    created_by: 'butter_bridge',
                    votes: 14,
                    created_at: new Date(1604113380000)
                },
                {
                    body: ' I carry a log — yes. Is it funny to you? It is not to me.',
                    article_id: 3,
                    created_by: 'icellusedkars',
                    votes: -100,
                    created_at: new Date(1582459260000)
                },
            ];
            const newComments = formatComments(comments);
            newComments.forEach((comment, index) => {
                expect(comment).not.toBe(comments[index])
            })
        })

        test("does not mutate original array", () => {
            const comments = [];
            formatComments(comments)
            expect(comments).toEqual([])
        })

        test("does not mutate objects in original array", () => {
            const comments = [{
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 1,
                    created_by: 'butter_bridge',
                    votes: 16,
                    created_at: new Date(1586179020000)
                },
                {
                    body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                    article_id: 2,
                    created_by: 'butter_bridge',
                    votes: 14,
                    created_at: new Date(1604113380000)
                },
                {
                    body: ' I carry a log — yes. Is it funny to you? It is not to me.',
                    article_id: 3,
                    created_by: 'icellusedkars',
                    votes: -100,
                    created_at: new Date(1582459260000)
                },
            ];
            const newComments = comments.map(comment => { return {...comment } })
            formatComments(comments);
            newComments.forEach((comment, index) => {
                expect(comment).toEqual(comments[index])
            })
        })
    })
})