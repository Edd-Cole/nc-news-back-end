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

module.exports = { formatTopics, formatUsers }