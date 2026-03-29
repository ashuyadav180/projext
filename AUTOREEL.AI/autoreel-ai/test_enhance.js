async function test() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/ai/enhance-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: "The dark psychology of why people stay poor",
        duration: 60,
        category: "motivation"
      })
    });
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
