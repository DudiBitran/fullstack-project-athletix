import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import "../../style/adminDash/userDetails.css";

function getLabel(key) {
  const labels = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    age: 'Age',
    gender: 'Gender',
    bio: 'Bio',
    role: 'Role',
    assignedTrainerId: 'Assigned Trainer ID',
    programs: 'Programs',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    stats: 'Stats',
    height: 'Height',
    weight: 'Weight',
    bodyFat: 'Body Fat',
    // Add more as needed
  };
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function UserDetails() {
  const { userId } = useParams();
  const { getUserById } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserById(userId);
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, getUserById]);

  if (loading) return <div className="loading-message">Loading user details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">No user found.</div>;

  return (
    <div className="user-details-outer-wrapper">
      <div className="user-details-wrapper">
        <div className="user-details-header">
          <button
            className="user-details-back-btn"
            onClick={() => navigate(-1)}
          >
            &#8592; Back
          </button>
          <h2>User Details</h2>
        </div>
        
        <div className="user-details-table-container">
          <table className="user-details-table">
            <tbody>
              {Object.entries(user)
                .filter(([key]) => key !== "image" && key !== "resetPasswordToken" && key !== "resetPassword" && key !== "resetPasswordExpires" && key !== "_id" && key !== "id")
                .flatMap(([key, value]) => {
                  if (key === "assignedTrainerId") {
                    return [
                      <tr key={key}>
                        <th>{getLabel(key)}</th>
                        <td>{(value === null || value === undefined) ? "Not assigned to trainer" : String(value)}</td>
                      </tr>
                    ];
                  }
                  if (key === "stats" && value && typeof value === "object") {
                    return Object.entries(value).map(([statKey, statValue]) => (
                      <tr key={`stats-${statKey}`}>
                        <th>{getLabel(statKey)}</th>
                        <td>
                          {statValue === null || statValue === undefined || statValue === "" 
                            ? "Not provided" 
                            : String(statValue)}
                        </td>
                      </tr>
                    ));
                  }
                  if (key === "programs" && Array.isArray(value)) {
                    if (value.length === 0) {
                      return [
                        <tr key={key}>
                          <th>{getLabel(key)}</th>
                          <td>No programs assigned</td>
                        </tr>
                      ];
                    } else {
                      return [
                        <tr key={key}>
                          <th>{getLabel(key)}</th>
                          <td>{value.map(String).join(", ")}</td>
                        </tr>
                      ];
                    }
                  }
                  return [
                    <tr key={key}>
                      <th>{getLabel(key)}</th>
                      <td>{typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}</td>
                    </tr>
                  ];
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDetails; 