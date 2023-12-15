import { Document, Schema, model } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"


interface Avatar {
    url: string;
    pub_id: string;
}

interface UserDocument extends Document {
    avatar: Avatar;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    emailVerificationToken?: string;
    emailVerificationTokenExpiry?: Date;
    recoverPasswordToken?: string;
    recoverPasswordTokenExpiry?: Date;

    comparePassword: (pass: string) => Promise<boolean>;
    generateJWTAccessToken: () => string;
    generateRandomToken: () => { unHashToken: string; hashedToken: string; tokenExpiry: Date };
}


const userSchema = new Schema <UserDocument> ({

    avatar: {
        type: {
            url: String,
            pub_id: String
        },
        default: {
            url: "https://via.placeholder.com/200x200.png",
            pub_id: ""
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        select: false
    },
    emailVerificationToken: {
        type: String,
        select: false,
    },
    emailVerificationTokenExpiry: {
        type: Date,
        select: false,
    },
    recoverPasswordToken: {
        type: String,
        select: false,
    },
    recoverPasswordTokenExpiry: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true })


userSchema.pre<UserDocument>("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUNDS))
    next()
})

userSchema.methods.comparePassword = async function (pass: string): Promise<boolean> {
    return await bcrypt.compare(pass, this.password)
}

userSchema.methods.generateJWTAccessToken = function (): string {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        password: this.password,
    }, process.env.JWT_SECRET as string)
}

userSchema.methods.generateRandomToken = function (): { unHashToken: string; hashedToken: string; tokenExpiry: Date } {
    const unHashToken: string = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(unHashToken).digest("hex")
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000)

    return { unHashToken, hashedToken, tokenExpiry }
}

export const User = model("User", userSchema)