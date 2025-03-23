const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Order Management API",
            version: "1.0.0",
            description: "API for managing orders, payments, and real-time tracking",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Local development server",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Point this to where your route files are located
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("✅ Swagger docs available at: http://localhost:5000/api-docs");
};

module.exports = setupSwagger;
