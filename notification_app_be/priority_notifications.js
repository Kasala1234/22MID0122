const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2YW1zaWtyaXNobmEuazIwMjJhQHZpdHN0dWRlbnQuYWMuaW4iLCJleHAiOjE3Nzg5Mjg5NzAsImlhdCI6MTc3ODkyODA3MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjFlMzQ0YTRjLWRkYTEtNDRiOS04OTI5LTg2ZjJkMmE3ZTc3YiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImsgdmFtc2kga3Jpc2huYSIsInN1YiI6IjE0MTkzNDY1LTM0MWItNGE4Yy1hZGFlLThhYjNmNjkyZjlmNSJ9LCJlbWFpbCI6InZhbXNpa3Jpc2huYS5rMjAyMmFAdml0c3R1ZGVudC5hYy5pbiIsIm5hbWUiOiJrIHZhbXNpIGtyaXNobmEiLCJyb2xsTm8iOiIyMm1pZDAxMjIiLCJhY2Nlc3NDb2RlIjoiU2ZGdVdnIiwiY2xpZW50SUQiOiIxNDE5MzQ2NS0zNDFiLTRhOGMtYWRhZS04YWIzZjY5MmY5ZjUiLCJjbGllbnRTZWNyZXQiOiJjRFd4TVJNd0FaVXBUQnZBIn0.A1_sHzbtHVwEjekBu-w3JmFiXhiu6pyhud8oq_iQmOs";

function getPriority(type) {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    if (type === "Event") return 1;
    return 0;
}

function calculateScore(notification) {
    const priority = getPriority(notification.Type);
    const timeScore = new Date(notification.Timestamp).getTime() / 1000000000;
    return priority * 100000 + timeScore;
}

async function fetchNotifications() {
    try {
        const response = await axios.get(
            "http://4.224.186.213/evaluation-service/notifications",
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        const notifications = response.data.notifications;

        notifications.sort((a, b) => calculateScore(b) - calculateScore(a));

        const top10 = notifications.slice(0, 10);

        console.log("TOP 10 PRIORITY NOTIFICATIONS");
        console.log("--------------------------------");

        top10.forEach((item, index) => {
            console.log(
                `${index + 1}. ${item.Type} | ${item.Message} | ${item.Timestamp}`
            );
        });

    } catch (error) {
        console.log(error.response?.data || error.message);
    }
}

fetchNotifications();