async function test() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/dashboard/analytics?days=30');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e.message);
  }
}
test();
