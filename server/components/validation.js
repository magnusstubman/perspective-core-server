(function (undefined) {

    var isNode = typeof module !== 'undefined' && module.exports,
        _;

    if (isNode) {
        _ = require("underscore");
    }

    var validators = {
        required: {
            validator: function(attribute) {
                return !_.isEmpty(attribute)
            },
            message: "is required"
        }
    }

    var validation = function(data, validations) {
        var validatorModule, errors = {};

        _.each(validations, function(fieldValue, fieldName) {
            _.each(fieldValue, function(validationValue, validationKey) {
                validatorModule = validators[validationKey];
                fieldValue = data[fieldName];
                if (!validatorModule.validator(fieldValue)) {
                    errors[fieldName] = validatorModule.message;
                }
            });
        });

        if (!_.isEmpty(errors)) {
            return {errors: errors};
        }
    }


    if (isNode) {
        module.exports = validation;
    }

    if (typeof define === "function" && define.amd) {
        define("validation", [], function () {
            return validation;
        });
    }

}).call(this);