const { createRefTable, replaceBelongsToWithArticleID, formatArray } = require("../db/utils/data-manipulation.js");
const db = require("../db/connection.js")

describe("Utility functions db/utils/data-manip", () => {
    describe("formatArray()", () => {
        test("formatArray will create a new array from the original array of topic objects passed", () => {
            const topics = [{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }]
            const newTopics = formatArray(topics, ["slug", "description"]);
            expect(newTopics).not.toBe(topics);
        })

        test("formatArray will not mutate the original array when invoked with an array of topic objects as an argument", () => {
            const topics = [{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }]
            formatArray(topics, ["slug", "description"]);
            expect(topics).toEqual([{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }])
        })

        test(`formats the array of table objects into a 2 level deep array 
        into the order specified with the second argument of the function,
        handles an array with a single object`, () => {
            const topics = [{
                description: 'The man, the Mitch, the legend',
                slug: 'mitch'
            }]
            expect(formatArray(topics, ["slug", "description"])).toEqual([
                ["mitch", "The man, the Mitch, the legend"]
            ]);
        })

        test("formats the array of topic objects into a nested array of the shape [[s, d], [s, d], [s, d]] where s is slug, d is description", () => {
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
            expect(formatArray(topics, ["slug", "description"])).toEqual([
                ["mitch", "The man, the Mitch, the legend"],
                ["cats", "Not dogs"],
                ["paper", "what books are made of"]
            ])
        })

        test("formats the array for up to 6 keys that we wish to organise into a nested array", () => {
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
            expect(formatArray(articles, ["title", "body", "votes", "topic", "author", "created_at"])).toEqual([
                ["Living in the shadow of a great man", 'I find this existence challenging', 100, 'mitch', 'butter_bridge', new Date(1594329060000)],
                ['Eight pug gifs that remind me of mitch', 'some gifs', 0, 'mitch', 'icellusedkars', new Date(1604394720000)],
                ['UNCOVERED: catspiracy to bring down democracy', 'Bastet walks amongst us, and the cats are taking arms!', 0, "cats", 'rogersop', new Date(1596464040000)]
            ])
        })
    })

    describe('createRefTable()', () => {
        test("throws an error if parameters are empty", () => {
            const input = [{ name: "Edd" }]
            expect(() => createRefTable(input)).toThrow(Error);
        })

        test("returns an empty object when passed an empty array", () => {
            expect(createRefTable([], "name", "number")).toEqual({})
        })

        test("the reference object is assigned the memory reference from one of the objects within the original array of objects", () => {
            const input = [{ name: "Tom", house: "17 chestnut road" }]
            expect(createRefTable(input, "name", "house")).not.toBe(input[0])
        })

        test("can exchange pair up the two given keys (key1, key2) from an array of objects and create a new object where value1 is key and value2 is value", () => {
            const input = [{ name: "Edd", number: "0123456789" }]
            const output = { "Edd": "0123456789" }
            expect(createRefTable(input, "name", "number")).toEqual(output)
        })

        test("can create a reference object for an array with multiple object nested inside", () => {
            const input = [{ id: 1, name: "Edd" }, { id: 2, name: "Arthur" }, { id: 3, name: "Harry" }, { id: 4, name: "Bill" }]
            const output = { 1: "Edd", 2: "Arthur", 3: "Harry", 4: "Bill" }
            expect(createRefTable(input, "id", "name")).toEqual(output)
        })

        test("Original array of objects is not mutated when it is used as an argument for createRefTable", () => {
            const input = [{ food: "pizza", day: "monday" }, { food: "lasagne", day: "thursday" }]
            createRefTable(input, "food", "day")
            expect(input).toEqual([{ food: "pizza", day: "monday" }, { food: "lasagne", day: "thursday" }])
        })
    });

    describe('replaceBelongsToWithArticleID()', () => {
        test(`can replace a key-value pair  in an array of 1 object with the associated value in the given reference object that we provide,
         and replace the key with 'belongs_to'`, () => {
            const refTable = { "bing": 1 }
            const comments = [{ belongs_to: "bing" }]
            expect(replaceBelongsToWithArticleID(comments, refTable)).toEqual([{ article_id: 1 }])
        })

        test("can replicate the process for an array with more than one object", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            expect(replaceBelongsToWithArticleID(comments, refTable)).toEqual([{ article_id: 1 }, { article_id: 2 }])
        })

        test("creates a new array when the function is invoked", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            expect(replaceBelongsToWithArticleID(comments, refTable)).not.toBe(comments)
        })

        test("creates new objects that do not macth the memory reference of the original objects in the array of objects", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            const newArticles = replaceBelongsToWithArticleID(comments, refTable);
            newArticles.forEach((article, index) => {
                expect(article).not.toBe(comments[index])
            })
        })

        test("does not mutate original array and original objects when function is invoked", () => {
            const refTable = { "bing": 1, "bong": 2 };
            const comments = [{ belongs_to: "bing" }, { belongs_to: "bong" }];
            replaceBelongsToWithArticleID(comments, refTable);
            expect(comments).toEqual([{ belongs_to: "bing" }, { belongs_to: "bong" }])
        })
    })
})