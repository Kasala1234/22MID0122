require("dotenv").config();
const axios = require("axios");

async function Log(stack, level, packageName, message) {
    try {
        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: packageName,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Log created:", response.data);

    } catch (error) {
        console.error("Logging failed:", error.response?.data || error.message);
    }
}

module.exports = Log;