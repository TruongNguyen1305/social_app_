import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minLength: 2, maxLength: 50},
    lastName: {type: String, required: true, minLength:2, maxLength: 50},
    email: {type: String, required: true, maxLength: 50, unique: true},
    password: { type: String, required: true, minLength: 5 },
    picturePath: { type: String, default: "" },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
},{
    timestamps: true
})

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', UserSchema);
export default User