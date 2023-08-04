const Joi = require("joi");

const taskJoiSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  tags: Joi.array().items(Joi.string().required()),
  assignedUsers: Joi.array().items(Joi.string()),
  status: Joi.string()
    .valid("start", "inprogress", "onhold", "done")
    .default("start"),
});

module.exports = taskJoiSchema;
