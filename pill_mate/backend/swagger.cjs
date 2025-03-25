const swaggerJsdoc = require('swagger-jsdoc');

/**
 * @type swaggerJsdoc.OAS3Options
 */
const options = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pill Mate Backend API',
            version: '1.0.0',
        },
        components: {
            schemas: {
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            // eslint-disable-next-line max-len
                            description: 'A descriptive message indicating the result of the operation.',
                            example: 'Operation completed successfully.',
                        },
                    },
                },
                ErrorMessageResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            // eslint-disable-next-line max-len
                            description: 'A descriptive message indicating the error that occurred.',
                        },
                    },
                },
            },
        },
    },
    apis: [],
};

module.exports = swaggerJsdoc(options);
