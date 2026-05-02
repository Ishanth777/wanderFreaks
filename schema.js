const joi = require("joi");

const listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().trim().min(1).required(),
    description: joi.string().trim().min(1).required(),
    price: joi.number().min(0).required(),
    location: joi.string().trim().min(1).required(),
    country: joi.string().trim().min(1).required(),

    image: joi.object({
      url: joi.string().uri().allow("", null)
    }).optional()

  }).required()
});

const reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().min(1).max(5).optional(),
    comment: joi.string().trim().min(1).optional()
  }).optional()
});

module.exports = { listingSchema,reviewSchema } ;
