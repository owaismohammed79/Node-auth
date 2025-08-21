import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: Date
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next) { //Just make sure to not use arrow functions in pre or post hooks
    if(this.isModified("password")){ //You don't really want to run this hook everytime, hence make use of the isModified with password so that you can encypt it when it changes
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model("User", userSchema);

export default User;