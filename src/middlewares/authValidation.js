import Joi from "joi";

export const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required"
    }),
    email: Joi.string().trim().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).max(100).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.max": "Password cannot exceed 100 characters",
        "any.required": "Password is required"
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "any.required": "Password is required"
    })
});

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            const errorMessages = error.details.map((d) => d.message);
            return res.status(400).json({
                status: 400,
                message: errorMessages[0],
                errors: errorMessages
            });
        }

        next();
    };
};
