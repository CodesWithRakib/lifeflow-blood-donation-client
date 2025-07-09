import { useState, useEffect } from 'react';
import { MoreVertical, User, Mail, Shield, Lock, Unlock, UserPlus, Star } from 'lucide-react';

const AllUsers = () => {
  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
      role: 'donor',
      status: 'active',
      lastActive: '2023-05-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '',
      role: 'volunteer',
      status: 'active',
      lastActive: '2023-05-14'
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@example.com',
      avatar: '',
      role: 'admin',
      status: 'active',
      lastActive: '2023-05-10'
    },
    {
      id: 4,
      name: 'Blocked User',
      email: 'blocked@example.com',
      avatar: '',
      role: 'donor',
      status: 'blocked',
      lastActive: '2023-04-20'
    },
    {
      id: 5,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: '',
      role: 'donor',
      status: 'active',
      lastActive: '2023-05-12'
    },
    {
      id: 6,
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: '',
      role: 'volunteer',
      status: 'blocked',
      lastActive: '2023-03-30'
    },
    {
      id: 7,
      name: 'Emily Davis',
      email: 'emily@example.com',
      avatar: '',
      role: 'donor',
      status: 'active',
      lastActive: '2023-05-13'
    },
    {
      id: 8,
      name: 'David Wilson',
      email: 'david@example.com',
      avatar: '',
      role: 'volunteer',
      status: 'active',
      lastActive: '2023-05-11'
    },
    {
      id: 9,
      name: 'Lisa Miller',
      email: 'lisa@example.com',
      avatar: '',
      role: 'donor',
      status: 'active',
      lastActive: '2023-05-09'
    },
    {
      id: 10,
      name: 'Robert Taylor',
      email: 'robert@example.com',
      avatar: '',
      role: 'admin',
      status: 'active',
      lastActive: '2023-05-08'
    },
  ]);

  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Filter users based on status
  const filteredUsers = users.filter(user => {
    if (statusFilter === 'all') return true;
    return user.status === statusFilter;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle dropdown
  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen !== null) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  // User action handlers
  const handleBlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'blocked' } : user
    ));
    setDropdownOpen(null);
  };

  const handleUnblockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    setDropdownOpen(null);
  };

  const handleMakeVolunteer = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: 'volunteer' } : user
    ));
    setDropdownOpen(null);
  };

  const handleMakeAdmin = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: 'admin' } : user
    ));
    setDropdownOpen(null);
  };

  // Get role icon and color
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'volunteer':
        return <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <User className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {/* Header with title and filter */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Manage Users
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </label>
              <select
                id="status-filter"
                className="bg-gray-50 border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-md px-3 py-1 text-sm focus:ring-amber-500 focus:border-amber-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          {user.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          className="inline-flex justify-center items-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(user.id);
                          }}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {dropdownOpen === user.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleBlockUser(user.id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  role="menuitem"
                                >
                                  <Lock className="mr-3 h-5 w-5" />
                                  Block User
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUnblockUser(user.id)}
                                  className="flex items-center px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  role="menuitem"
                                >
                                  <Unlock className="mr-3 h-5 w-5" />
                                  Unblock User
                                </button>
                              )}
                              {user.role !== 'volunteer' && user.role !== 'admin' && (
                                <button
                                  onClick={() => handleMakeVolunteer(user.id)}
                                  className="flex items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  role="menuitem"
                                >
                                  <Star className="mr-3 h-5 w-5" />
                                  Make Volunteer
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleMakeAdmin(user.id)}
                                  className="flex items-center px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                  role="menuitem"
                                >
                                  <Shield className="mr-3 h-5 w-5" />
                                  Make Admin
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
                  </span>{' '}
                  of <span className="font-medium">{filteredUsers.length}</span> users
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">First</span>
                    «
                  </button>
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-amber-50 dark:bg-amber-900 border-amber-500 text-amber-600 dark:text-amber-300'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    ›
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Last</span>
                    »
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;