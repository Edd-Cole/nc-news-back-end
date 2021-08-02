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

module.exports = { formatTopics, formatUsers, formatArticles }