const formatTopics = (topics) => {
    return topics.map(topic => {
        return [topic.slug, topic.description]
    })
}

const formatUsers = (users) => {
    return users.map((user) => {
        return [user.username, user.avatar_url, user.name]
    })
}

const formatArticles = (articles) => {
    return articles.map(article => {
        const { title, body, votes, topic, author, created_at } = article;
        return [title, body, votes, topic, author, created_at];
    })

}

const createRefTable = (reference, key, value) => {
    if (value === undefined) {
        throw new Error("createRefTable() needs an array of objects, and 2 keys for parameters, respectively")
    }
    key = key;
    value = value;
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

const formatComments = (comments) => {
    return comments.map(comment => {
        const { body, article_id, created_by, votes, created_at } = comment
        return [created_by, article_id, votes, created_at, body]
    })
}

module.exports = { formatTopics, formatUsers, createRefTable, formatArticles, formatComments, replaceBelongsToWithArticleID }