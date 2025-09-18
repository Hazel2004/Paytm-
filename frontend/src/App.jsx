import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Send, LogOut, User, DollarSign, Search } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api/v1'; // Adjust this to your backend URL

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentView, setCurrentView] = useState('signin');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Validate token and get user info
      setCurrentView('dashboard');
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCurrentView('signin');
  };

  if (!token || currentView === 'signin' || currentView === 'signup') {
    return <AuthPage currentView={currentView} setCurrentView={setCurrentView} setToken={setToken} loading={loading} setLoading={setLoading} />;
  }

  return <Dashboard token={token} logout={logout} loading={loading} setLoading={setLoading} />;
}

function AuthPage({ currentView, setCurrentView, setToken, loading, setLoading }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = currentView === 'signin' ? '/user/signin' : '/user/signup';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PaymentApp</h1>
          <p className="text-gray-600 mt-2">
            {currentView === 'signin' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {currentView === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={handleSubmit}
          >
            {loading ? 'Please wait...' : (currentView === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {currentView === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setCurrentView(currentView === 'signin' ? 'signup' : 'signin')}
              className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200"
            >
              {currentView === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ token, logout, loading, setLoading }) {
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchBalance();
    fetchUsers();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${API_BASE}/account/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const fetchUsers = async (filter = '') => {
    try {
      const response = await fetch(`${API_BASE}/user/bulk?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.user || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers(searchFilter);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchFilter]);

  const handleTransfer = async () => {
    if (!selectedUser || !transferAmount || transferAmount <= 0) {
      setMessage('Please select a user and enter a valid amount');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/account/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(transferAmount),
          to: selectedUser,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Transfer successful!');
        setMessageType('success');
        setTransferAmount('');
        setSelectedUser('');
        fetchBalance(); // Refresh balance
      } else {
        setMessage(data.message || 'Transfer failed');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-emerald-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">PaymentApp</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-gray-700 hover:text-gray-900 transition duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl p-6 text-white mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 mb-2">Your Balance</p>
              <h2 className="text-3xl font-bold">${balance.toFixed(2)}</h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Transfer Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Send Money</h3>
          
          {/* User Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by first or last name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Users List */}
          <div className="mb-6 max-h-64 overflow-y-auto">
            {users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedUser === user._id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedUser(user._id)}
                  >
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No users found</p>
            )}
          </div>

          {/* Transfer Form */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              disabled={loading || !selectedUser}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={handleTransfer}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Money
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
