// Using global fetch (available in Node 18+)

async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'c',
        version: '10.2.1',
        files: [{ content: '#include <stdio.h>\nint main() { printf("hello"); return 0; }' }]
      })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
