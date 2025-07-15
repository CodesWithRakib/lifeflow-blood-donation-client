import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const AllDonationRequest = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useQuery({
    queryKey: ["all-donations", statusFilter, page],
    queryFn: async () => {
      const res = await axios.get(
        `/donations?page=${page}&limit=${limit}&status=${statusFilter}`
      );
      return res.data;
    },
  });

  const { data: userInfo } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/users/role/${user?.email}`);
      return res.data;
    },
  });

  const role = userInfo?.role;

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axios.patch(`/donations/status/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries(["all-donations"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`/donations/${id}`);
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
      queryClient.invalidateQueries(["all-donations"]);
    },
  });

  const handleStatusChange = (id, newStatus) => {
    mutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this donation request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  const { donations, totalPages } = data;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Blood Donation Requests</h2>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          className="select select-bordered"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table border">
          <thead>
            <tr className="bg-amber-100 text-left">
              <th>Recipient</th>
              <th>Location</th>
              <th>Group</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations?.map((req) => (
              <tr key={req._id}>
                <td>{req.recipientName}</td>
                <td>
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>
                <td>{req.bloodGroup}</td>
                <td>
                  {req.donationDate} @ {req.donationTime}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      req.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "inprogress"
                        ? "bg-blue-100 text-blue-700"
                        : req.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="text-right space-x-2">
                  {/* View is always available */}
                  <Link
                    to={`/donation-request/${req._id}`}
                    className="btn btn-sm bg-blue-500 text-white"
                  >
                    View
                  </Link>

                  {/* Status update (for volunteer + admin) */}
                  {req.status === "inprogress" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(req._id, "done")}
                        className="btn btn-sm bg-green-500 text-white"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, "canceled")}
                        className="btn btn-sm bg-red-500 text-white"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* Admin-only controls */}
                  {role === "admin" && (
                    <>
                      <Link
                        to={`/dashboard/edit-donation/${req._id}`}
                        className="btn btn-sm bg-amber-400 text-white"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-sm bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn btn-sm mx-1 ${
              i + 1 === page ? "bg-amber-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllDonationRequest;
