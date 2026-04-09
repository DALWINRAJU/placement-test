async function testJava() {
  const data = {
    language_id: 62, // Java (OpenJDK 13.0.1)
    source_code: 'public class Main { public static void main(String[] args) { System.out.println("java works on judge0!"); } }',
    stdin: ""
  };

  try {
    console.log("Submitting to Judge0...");
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

testJava();
