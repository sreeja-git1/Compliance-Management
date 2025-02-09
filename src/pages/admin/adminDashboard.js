import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

// Admin Dashboard Component
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_to: "",
  });

  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      showNotification(
        error.response?.data?.detail || "Error fetching tasks",
        "error"
      );
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: theme.palette.common.black,
      // color: theme.palette.common.white,
      textAlign: "center",
      border: "1px solid #ededed",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      textAlign: "center",
      border: "1px solid #ededed !important",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // function createData(
  //   name: string,
  //   calories: number,
  //   fat: number,
  //   carbs: number,
  //   protein: number,
  // ) {
  //   return { name, calories, fat, carbs, protein };
  // }
  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9),
  // ];

  return (
    <>
      <div className="min-h-screen" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Typography variant="h5" className="bold left-align m200" >All Tasks</Typography>
          {notification.message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                notification.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {notification.message}
            </div>
          )}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow >
                  <StyledTableCell className="bold">Title </StyledTableCell>
                  <StyledTableCell className="bold">Assigned To</StyledTableCell>
                  <StyledTableCell className="bold">Due Date</StyledTableCell>
                  <StyledTableCell className="bold">Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length !== 0 ? tasks.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell className="capitalize">{row.title}</StyledTableCell>
                    <StyledTableCell className="capitalize">{row.assignee}</StyledTableCell>
                    <StyledTableCell className="capitalize">{new Date(row.due_date).toLocaleDateString()}</StyledTableCell>
                    {console.log(row.status,"row.status")}
                    <StyledTableCell className="capitalize"
                    style={{color: row.status === "completed" ? "#3dbb74" : "#ED5A6B" }}
                    >{row.status}</StyledTableCell>
                  </StyledTableRow>
                )) : <StyledTableCell className="m200 center-align">No tasks found</StyledTableCell>}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
