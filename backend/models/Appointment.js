// backend/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID of the user who booked the appointment
    required: true,
    index: true,
  },
  userEmail: { // Storing user email for easier admin lookup
    type: String,
    trim: true,
  },
  petName: {
    type: String,
    required: true,
    trim: true,
  },
  vetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vet', // Reference to a Vet model (you'll need to create this later if vets are users)
    required: false, // Make optional for now if Vet model isn't ready
  },
  vetName: { // Storing vet name for simpler display
    type: String,
    required: true,
    trim: true,
  },
  appointmentDate: {
    type: Date, // Store as Date object (e.g., YYYY-MM-DD)
    required: true,
  },
  appointmentTime: {
    type: String, // e.g., "10:00 AM", "14:30"
    required: true,
    trim: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AppointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);