async function testC() {
  const data = {
    language_id: 50, // C (GCC 9.2.0)
    source_code: '#include <stdio.h>\nint main() { printf("c works on judge0!"); return 0; }',
    stdin: ""
  };

  try {
    console.log("Submitting C to Judge0...");
    const res = await fetch("https://ce.judge0.com/submissions?wait=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testC();
