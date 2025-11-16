import asyncHandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUserByEmail, findUserByUsername, createUser } from '../models/user.model.js'

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, full_name, role, graduation_year } = req.body

    if ([username, email, password, full_name].some((f) => !f || String(f).trim() === '')) {
        throw new ApiError(400, 'Username, email, password and full_name are required')
    }

    const normalizedRole = (role || 'STUDENT').toString().toUpperCase()
    if (!['STUDENT', 'ADMIN'].includes(normalizedRole)) {
        throw new ApiError(400, 'Invalid role')
    }

    if (normalizedRole === 'STUDENT') {
        if (!graduation_year) {
            throw new ApiError(400, 'graduation_year is required for STUDENT role')
        }
    }

    // check existing
    const existingByEmail = await findUserByEmail(email)
    if (existingByEmail) throw new ApiError(409, 'Email already in use')

    const existingByUsername = await findUserByUsername(username)
    if (existingByUsername) throw new ApiError(409, 'Username already in use')

    // hash password
    const hashed = await bcrypt.hash(password, 10)

    // build payload for createUser; only include graduation_year for STUDENT
    const payload = { username, email, password: hashed, full_name, role: normalizedRole }
    if (normalizedRole === 'STUDENT') payload.graduation_year = graduation_year
    console.log(payload);
    
    const user = await createUser(payload)
    return res.status(201).json(new ApiResponse(201, { user }, 'User registered successfully'))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (![email, password].every((f) => f && String(f).trim() !== '')) {
        throw new ApiError(400, 'Email and password are required')
    }

    const user = await findUserByEmail(email)
    if (!user) throw new ApiError(401, 'Invalid credentials')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new ApiError(401, 'Invalid credentials')

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) throw new ApiError(500, 'JWT secret not configured')

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' })

    return res.status(200).json(new ApiResponse(200, { token, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name, role: user.role } }, 'Logged in'))
})

export { registerUser, loginUser }