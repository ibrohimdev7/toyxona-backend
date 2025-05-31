const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'District name is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for venues
districtSchema.virtual('venues', {
  ref: 'Venue',
  localField: '_id',
  foreignField: 'district_id',
});

const District = mongoose.model('District', districtSchema);

module.exports = District;