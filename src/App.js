import React from 'react';
import DataTable from './components/DataTable'; // adjust the path if needed

function App() {
  // Function to add or update a comment
  const addOrUpdateComment = async () => {
    const userId = 12345; // replace with your user ID
    const comment = "This is a sample comment"; // replace with your comment

    try {
      const response = await fetch('http://localhost:5001/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, comment })
      });

      const result = await response.json();
      console.log('Comment response:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>My Data Table</h1>
      <DataTable />
      <button onClick={addOrUpdateComment}>Submit Comment</button>
    </div>
  );
}

export default App;
