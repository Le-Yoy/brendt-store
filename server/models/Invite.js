// server/models/Invite.js
// Single-use signup invites. An admin generates an invite for a given role
// (e.g. 'atelier' for Simo); the invitee opens the link and sets their own
// name + password, which creates their account with that role.
const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['user', 'admin', 'atelier'], default: 'atelier' },
    email: { type: String, trim: true, lowercase: true }, // optional pre-fill
    label: { type: String, trim: true }, // optional note, e.g. "Simo BALO"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date }, // optional expiry
  },
  { timestamps: true }
);

inviteSchema.methods.isValid = function () {
  if (this.used) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  return true;
};

module.exports = mongoose.model('Invite', inviteSchema);
