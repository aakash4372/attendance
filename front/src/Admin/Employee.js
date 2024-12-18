import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import './Admin.css'

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const departments = ["All", "Frontend", "Backend", "UI/UX", "Digital Marketing"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/auth/users/${id}`);
      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
      filterUsersByDepartment(selectedDepartment, updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedData({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/auth/users/${editingUserId}`,
        editedData
      );
      const updatedUsers = users.map((user) =>
        user._id === editingUserId ? { ...user, ...editedData } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  const filterUsersByDepartment = (department, allUsers = users) => {
    if (department === "All") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) => user.department === department);
      setFilteredUsers(filtered);
    }
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    filterUsersByDepartment(department);
  };

  return (
    <div className="users-container">
      <h2 className="text-center">Users</h2>

      <div className="filter-container mb-3">
        <label htmlFor="departmentFilter" className="form-label">
          Filter by Department
        </label>
        <select
          id="departmentFilter"
          className="form-select"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              {editingUserId === user._id ? (
                <>
                  <td>{index + 1}</td> 
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editedData.name || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editedData.phone || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <select
                      name="department"
                      value={editedData.department || ""}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {departments.slice(1).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={handleSave}
                      className="btn btn-success me-2"
                    >
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn btn-secondary">
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{index + 1}</td> 
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.department}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-warning me-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)} 
                      className="btn btn-danger"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default Users;
