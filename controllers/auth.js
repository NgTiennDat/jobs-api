const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const newUser = await User.create({...req.body})
    const token = newUser.createJWT()
    res
        .status(StatusCodes.CREATED)
        .json({user: {name: newUser.name}, token})
}

const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        throw new BadRequestError('Please provide enough email and password!')
    }

    const user = await User.findOne({ email })
    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Password of that Credentials')
    }
    const token = user.createJWT()
    res
        .status(StatusCodes.OK)
        .json({user: {name: user.name}, token})
}

module.exports = {
    register,
    login,
}