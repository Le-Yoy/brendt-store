const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
 {
   name: {
     type: String,
     required: [true, 'Please tell us your name'],
     trim: true,
     maxlength: [50, 'Name cannot be more than 50 characters']
   },
   email: {
     type: String,
     required: [true, 'Please provide your email'],
     unique: true,
     lowercase: true,
     validate: [validator.isEmail, 'Please provide a valid email']
   },
   password: {
     type: String,
     required: [true, 'Please provide a password'],
     minlength: [8, 'Password must be at least 8 characters long'],
     select: false
   },
   role: {
     type: String,
     enum: ['user', 'admin'],
     default: 'user'
   },
   shippingAddresses: [
     {
       fullName: {
         type: String,
         required: true,
         trim: true
       },
       phoneNumber: {
         type: String,
         required: true
       },
       address: {
         type: String,
         required: true,
         trim: true
       },
       isDefault: {
         type: Boolean,
         default: false
       }
     }
   ],
   paymentPreferences: {
     preferredMethod: {
       type: String,
       enum: ['card', 'cash'],
       default: 'card'
     }
   },
   emailVerified: {
     type: Boolean,
     default: false
   },
   verificationToken: String,
   verificationTokenExpires: Date
 },
 {
   timestamps: true,
 }
);

// Debug middleware
userSchema.pre('save', function(next) {
 console.log('[MODEL] Saving user:', { 
   email: this.email,
   name: this.name,
   passwordSet: !!this.password
 });
 next();
});

userSchema.pre('save', async function(next) {
 if (!this.isModified('password')) return next();
 
 try {
   console.log('[MODEL] Hashing password for user:', this.email);
   this.password = await bcrypt.hash(this.password, 12);
   console.log('[MODEL] Password successfully hashed');
   next();
 } catch (error) {
   console.error('[MODEL] Error hashing password:', error);
   next(error);
 }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
 try {
   console.log('[MODEL] Comparing passwords for user:', this.email);
   const isMatch = await bcrypt.compare(enteredPassword, this.password);
   console.log('[MODEL] Password match result:', isMatch);
   return isMatch;
 } catch (error) {
   console.error('[MODEL] Error comparing passwords:', error);
   return false;
 }
};

const User = mongoose.model('User', userSchema);

module.exports = User;