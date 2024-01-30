import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;
    if ([username, email, fullName, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "All Fields are Required");
    }

    const existingUser = User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(409, "Username or Email Already Exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(410, "Avatar Is Compulsary");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    if (!avatar) {
        throw new ApiError(410, "Avatar Is Compulsary");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        password,
        email,
        coverImage: coverImage?.url || '',
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something Went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"Created User")
    )

})

export { registerUser }