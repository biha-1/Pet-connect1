import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema({
  petType: {
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative']
  },
  photo: {
    type: String,
  },
  adoptionStatus: {
    type: String,
    enum: ['Available', 'Adopted', 'Fostered'],
    default: 'Available'
  },
  contactNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  breed: {
    type: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Pet', PetSchema);