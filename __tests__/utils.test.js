const { formatTopics, formatUsers, createArticlesReference, formatArticles } = require("../db/utils/data-manipulation.js");
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
})