require("dotenv").config();
const axios = require("axios");

const TOKEN = process.env.ACCESS_TOKEN;

async function fetchDepots() {
    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/depots",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.depots;
}

async function fetchVehicles() {
    const response = await axios.get(
        "http://4.224.186.213/evaluation-service/vehicles",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    return response.data.vehicles;
}

function optimizeTasks(vehicles, maxHours) {
    const n = vehicles.length;

    const dp = Array(n + 1)
        .fill(null)
        .map(() => Array(maxHours + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const duration = vehicles[i - 1].Duration;
        const impact = vehicles[i - 1].Impact;

        for (let h = 0; h <= maxHours; h++) {
            if (duration <= h) {
                dp[i][h] = Math.max(
                    impact + dp[i - 1][h - duration],
                    dp[i - 1][h]
                );
            } else {
                dp[i][h] = dp[i - 1][h];
            }
        }
    }

    let selectedTasks = [];
    let h = maxHours;

    for (let i = n; i > 0; i--) {
        if (dp[i][h] !== dp[i - 1][h]) {
            selectedTasks.push(vehicles[i - 1]);
            h -= vehicles[i - 1].Duration;
        }
    }

    return selectedTasks.reverse();
}

async function runScheduler() {
    try {
        const depots = await fetchDepots();
        const vehicles = await fetchVehicles();

        for (const depot of depots) {
            console.log("\n===============================");
            console.log(`Depot ID: ${depot.ID}`);
            console.log(`Mechanic Hours: ${depot.MechanicHours}`);

            const selected = optimizeTasks(vehicles, depot.MechanicHours);

            console.log("Selected Tasks:");

            selected.forEach(task => {
                console.log(
                    `Task ${task.TaskID} | Duration: ${task.Duration} | Impact: ${task.Impact}`
                );
            });
        }

    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
    }
}

runScheduler();