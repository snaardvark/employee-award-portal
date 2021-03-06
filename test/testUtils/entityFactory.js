const { createUser } = require('../../services/users')
const { createRegion } = require('../../services/regions')
const { createAwardType } = require('../../services/awardTypes')

function getRandomString(len=7) {
    return Math.random().toString(36).substring(len)
}

async function createTestUser(attrs) {
    const defaultAttrs = {
        first_name: getRandomString(),
        last_name: getRandomString(),
        email: `${getRandomString()}@${getRandomString()}.com`,
        region: null,
        password: getRandomString(),
    }

    const userAttrs = {
        ...defaultAttrs,
        ...attrs,
    }

    return createUser(userAttrs)
}

async function createTestRegion(attrs) {
    const defaultAttrs = {
        description: getRandomString(),
    }

    const regionAttrs = {
        ...defaultAttrs,
        ...attrs,
    }

    return createRegion(regionAttrs)
}

async function createTestAwardType(attrs) {
    const defaultAttrs = {
        name: getRandomString(),
    }

    const awardTypeAttrs = {
        ...defaultAttrs,
        ...attrs,
    }

    return createAwardType(awardTypeAttrs)
}

module.exports = {
    createAwardType: createTestAwardType,
    createUser: createTestUser,
    createRegion: createTestRegion,
}
