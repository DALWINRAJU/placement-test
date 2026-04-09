const PORT = 5000;

async function test(lang, code) {
  console.log(`Testing ${lang}...`);
  try {
    const res = await fetch(`http://localhost:${PORT}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang,
        version: "*",
        files: [{ content: code }]
      })
    });
    const data = await res.json();
    console.log(`[${lang}] Result:`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`[${lang}] Error:`, err.message);
  }
}

async function runAll() {
  await test('python', 'print("python local works")');
  await test('javascript', 'console.log("javascript local works")');
  await test('java', 'public class Main { public static void main(String[] args) { System.out.println("java judge0 works"); } }');
  await test('c', '#include <stdio.h>\nint main() { printf("c judge0 works"); return 0; }');
}

runAll();
