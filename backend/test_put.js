const axios = require('axios');

async function testUpdate() {
    try {
        const url = 'http://localhost:5000/api/predictions/69a458fe92616e289b536c04';
        const payload = {
            "player": "60d5ecb8b392d700153efabc",
            "injury": "60d5ecb8b392d700153efabd",
            "predictedDays": 1,
            "confidenceScore": 80,
            "recoveryRangeMin": 1,
            "recoveryRangeMax": 4,
            "predictionDate": "2026-03-01T00:00:00.000Z",
            "status": "Pending"
        };
        console.log("Sending PUT to", url);
        const res = await axios.put(url, payload);
        console.log("Success:", res.data);
    } catch (err) {
        console.log("Error status:", err.response?.status);
        console.log("Error data:", err.response?.data);
    }
}
testUpdate();
