const formatArray = (tableName, desiredKeys) => {
    return tableName.map(table => {
        const info = [table[desiredKeys[0]],
            table[desiredKeys[1]],
            table[desiredKeys[2]],
            table[desiredKeys[3]],
            table[desiredKeys[4]],
            table[desiredKeys[5]]
        ]
        return info.filter(i => i !== undefined)
    })
}

const createRefTable = (reference, key, value) => {
    if (value === undefined) {
        throw new Error("createRefTable() needs an array of objects, and 2 keys for parameters, respectively")
    }
    const referenceKey = {}
    reference.forEach(item => referenceKey[item[key]] = item[value])
    return referenceKey;
};

const replaceBelongsToWithArticleID = (comments, refTable) => {
    const newComments = comments.map(comment => {
        return {...comment }
    })
    newComments.forEach(comment => {
        comment.article_id = refTable[comment.belongs_to];
        delete comment.belongs_to;
    })
    return newComments;
}

module.exports = { createRefTable, replaceBelongsToWithArticleID, formatArray }