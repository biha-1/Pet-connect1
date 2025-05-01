import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema({
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  name: {
    type: String,
    required: [true, 'Pet name is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative']
  },
  photo: {
    type: String,
    required: [true, 'Photo URL is required']
  },
  adoptionStatus: {
    type: String,
    enum: ['Available', 'Adopted', 'Fostered'],
    default: 'Available'
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  breed: {
    type: String
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Pet', PetSchema);