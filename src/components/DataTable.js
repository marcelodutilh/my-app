import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

function DataTable() {
  const [users, setUsers] = useState([]); // State to hold the users data
  const [comments, setComments] = useState({}); // State to hold fetched comments for each user
  const [newComment, setNewComment] = useState({}); // State to hold new comments for each user
  const [drawerOpen, setDrawerOpen] = useState(false); // State to control drawer visibility
  const [selectedUserComments, setSelectedUserComments] = useState([]); // State to hold comments of the selected user

  useEffect(() => {
    // Fetch users from jsonplaceholder API
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fetch stored comments from the backend
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5001/comments');
        if (response.ok) {
          const data = await response.json();
          // Group comments by userId
          const groupedComments = data.reduce((acc, comment) => {
            if (!acc[comment.userId]) {
              acc[comment.userId] = [];
            }
            acc[comment.userId].push(comment.comment);
            return acc;
          }, {});
          setComments(groupedComments);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchUsers();
    fetchComments();
  }, []);

  // Handle comment input change
  const handleCommentChange = (userId, comment) => {
    setNewComment((prev) => ({
      ...prev,
      [userId]: comment,
    }));
  };

  // Function to add a new comment in the backend
  const submitComment = async (userId) => {
    const comment = newComment[userId]; // Get the new comment for the user

    try {
      const response = await fetch('http://localhost:5001/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, comment })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Comment response:', result);
        // Update the comments state to include the new comment
        setComments((prevComments) => ({
          ...prevComments,
          [userId]: [...(prevComments[userId] || []), comment]
        }));
        setNewComment((prev) => ({ ...prev, [userId]: '' })); // Clear the input field
      } else {
        console.error('Failed to save comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle opening the drawer and setting selected user's comments
  const handleOpenDrawer = (userId) => {
    setSelectedUserComments(comments[userId] || []); // Set comments of the selected user
    setDrawerOpen(true); // Open the drawer
  };

  // Handle closing the drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: 1000 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Comments</strong></TableCell>
              <TableCell><strong>Add/Edit Comment</strong></TableCell>
              <TableCell><strong>Submit Comment</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDrawer(user.id)}>
                    <CommentIcon
                      color={comments[user.id] && comments[user.id].length > 0 ? 'primary' : 'disabled'}
                    />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={newComment[user.id] || ''}
                    onChange={(e) => handleCommentChange(user.id, e.target.value)}
                    placeholder="Add a comment"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submitComment(user.id)}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer to show comments */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Paper sx={{ width: 300, padding: '20px' }}>
          <h3>User Comments</h3>
          <List>
            {selectedUserComments.length > 0 ? (
              selectedUserComments.map((comment, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${comment}`} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No comments available" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Drawer>
    </>
  );
}

export default DataTable;
