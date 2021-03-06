const _ = require('lodash')
const { UNAUTHORIZED } = require('http-status-codes')

const cookieLib = require('../lib/cookies')
const authLib = require('../lib/auth')


async function convertTokenToUser(req, res, next) {
    let token
    // check cookie for token
    const cookieToken = cookieLib.parseRequestForCookie(req, 'eap-token')
    if (cookieToken) {
        token = cookieToken
    // otherwise check bearer authorization for token
    } else if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1]
    // finally check query params for token
    } else if (req.query.token) {
        token = req.query.token
    }

    if (token) {
        let tokenPayload
        try {
            tokenPayload = await authLib.verifyToken(token)
            req.user = tokenPayload.user
        } catch (err) {
            // continue
        }
    }

    next()
}

async function assertLoggedIn(req, res, next) {
    if (!req.user) {
        return res.status(UNAUTHORIZED).send()
    } 
    next()
}

async function assertIsAdmin(req, res, next) {
    if (!req.user) {
        return res.status(UNAUTHORIZED).send()
    }
    if (!req.user.isAdmin) {
        return res.status(UNAUTHORIZED).send()
    }
    next()
}

async function assertIsAdminOrSelf(req, res, next) {
    const isAdmin = _.get(req, 'user.isAdmin')
    const userId = _.get(req, 'user.id')
    
    let isSelf
    if (!userId) {
        isSelf = false
    } else {
        isSelf = req.params.id === 'me' || String(req.params.id) === String(userId)
    }

    if (isSelf || isAdmin) {
        next()
    } else {
        return res.status(UNAUTHORIZED).send()
    }
}

async function assertIsNotAdmin(req, res, next) {
    if (!req.user) {
        return res.status(UNAUTHORIZED).send()
    }
    if (req.user.isAdmin) {
        return res.status(UNAUTHORIZED).send()
    }
    next()
}

module.exports = {
    assertLoggedIn,
    assertIsAdmin,
    assertIsAdminOrSelf,
    assertIsNotAdmin,
    convertTokenToUser,
}
