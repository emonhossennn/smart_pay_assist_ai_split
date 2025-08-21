import React, { useState, useEffect } from 'react';
import { Camera, Upload, Users, CreditCard, Bell, DollarSign, Receipt, CheckCircle, Clock, AlertTriangle, Home, Settings, User } from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
}

interface Bill {
  id: string;
  title: string;
  imageUrl?: string;
  totalAmount: number;
  items: BillItem[];
  participants: User[];
  createdAt: Date;
  status: 'processing' | 'split' | 'paid' | 'partial';
  payments: Payment[];
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  dueDate: Date;
  paidAt?: Date;
}

const sampleUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' }
];

const sampleBills: Bill[] = [
  {
    id: '1',
    title: 'Dinner at Restaurant ABC',
    totalAmount: 120.50,
    items: [
      { id: '1', name: 'Pasta Carbonara', price: 18.99, assignedTo: ['1'] },
      { id: '2', name: 'Grilled Salmon', price: 24.99, assignedTo: ['2'] },
      { id: '3', name: 'Caesar Salad', price: 12.99, assignedTo: ['3', '4'] },
      { id: '4', name: 'Wine Bottle', price: 32.99, assignedTo: ['1', '2', '3', '4'] },
      { id: '5', name: 'Dessert Platter', price: 15.99, assignedTo: ['1', '2', '3', '4'] },
      { id: '6', name: 'Service Charge', price: 15.55, assignedTo: ['1', '2', '3', '4'] }
    ],
    participants: sampleUsers,
    createdAt: new Date('2024-01-15'),
    status: 'partial',
    payments: [
      { id: '1', userId: '1', amount: 35.24, status: 'paid', dueDate: new Date('2024-01-20'), paidAt: new Date('2024-01-18') },
      { id: '2', userId: '2', amount: 41.24, status: 'pending', dueDate: new Date('2024-01-20') },
      { id: '3', userId: '3', amount: 22.01, status: 'pending', dueDate: new Date('2024-01-20') },
      { id: '4', userId: '4', amount: 22.01, status: 'paid', dueDate: new Date('2024-01-20'), paidAt: new Date('2024-01-19') }
    ]
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    totalAmount: 85.30,
    items: [
      { id: '1', name: 'Milk & Bread', price: 12.50, assignedTo: ['1', '2'] },
      { id: '2', name: 'Vegetables', price: 25.80, assignedTo: ['1', '2', '3'] },
      { id: '3', name: 'Snacks', price: 47.00, assignedTo: ['1', '2', '3', '4'] }
    ],
    participants: sampleUsers,
    createdAt: new Date('2024-01-12'),
    status: 'split',
    payments: [
      { id: '1', userId: '1', amount: 27.33, status: 'pending', dueDate: new Date('2024-01-25') },
      { id: '2', userId: '2', amount: 27.33, status: 'pending', dueDate: new Date('2024-01-25') },
      { id: '3', userId: '3', amount: 18.08, status: 'pending', dueDate: new Date('2024-01-25') },
      { id: '4', userId: '4', amount: 11.75, status: 'pending', dueDate: new Date('2024-01-25') }
    ]
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'upload' | 'bills' | 'profile'>('home');
  const [bills, setBills] = useState<Bill[]>(sampleBills);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        simulateImageProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateImageProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBill: Bill = {
        id: Date.now().toString(),
        title: `Receipt ${new Date().toLocaleDateString()}`,
        imageUrl: uploadedImage || undefined,
        totalAmount: 67.45,
        items: [
          { id: '1', name: 'Coffee x2', price: 8.50, assignedTo: [] },
          { id: '2', name: 'Sandwich', price: 12.99, assignedTo: [] },
          { id: '3', name: 'Salad Bowl', price: 15.99, assignedTo: [] },
          { id: '4', name: 'Smoothie', price: 7.50, assignedTo: [] },
          { id: '5', name: 'Tax', price: 5.41, assignedTo: [] },
          { id: '6', name: 'Tip (18%)', price: 17.06, assignedTo: [] }
        ],
        participants: sampleUsers.slice(0, 2),
        createdAt: new Date(),
        status: 'processing',
        payments: []
      };
      setBills([newBill, ...bills]);
      setSelectedBill(newBill);
      setShowBillDetails(true);
      setActiveTab('bills');
    }, 3000);
  };

  const handlePayment = async (paymentId: string) => {
    // Simulate SSLCommerce payment gateway
    const payment = bills.flatMap(b => b.payments).find(p => p.id === paymentId);
    if (payment) {
      // In real implementation, this would redirect to SSLCommerce
      const confirmed = window.confirm(`Process payment of $${payment.amount} through SSLCommerce?`);
      if (confirmed) {
        setBills(prevBills => 
          prevBills.map(bill => ({
            ...bill,
            payments: bill.payments.map(p => 
              p.id === paymentId 
                ? { ...p, status: 'paid' as const, paidAt: new Date() }
                : p
            ),
            status: bill.payments.every(p => p.id === paymentId || p.status === 'paid') ? 'paid' as const : 'partial' as const
          }))
        );
      }
    }
  };

  const assignItemToUser = (billId: string, itemId: string, userId: string) => {
    setBills(prevBills => 
      prevBills.map(bill => {
        if (bill.id === billId) {
          return {
            ...bill,
            items: bill.items.map(item => {
              if (item.id === itemId) {
                const isAssigned = item.assignedTo.includes(userId);
                return {
                  ...item,
                  assignedTo: isAssigned 
                    ? item.assignedTo.filter(id => id !== userId)
                    : [...item.assignedTo, userId]
                };
              }
              return item;
            })
          };
        }
        return bill;
      })
    );
  };

  const generatePayments = (bill: Bill) => {
    const userTotals: { [userId: string]: number } = {};
    
    bill.items.forEach(item => {
      if (item.assignedTo.length > 0) {
        const amountPerPerson = item.price / item.assignedTo.length;
        item.assignedTo.forEach(userId => {
          userTotals[userId] = (userTotals[userId] || 0) + amountPerPerson;
        });
      }
    });

    const payments: Payment[] = Object.entries(userTotals).map(([userId, amount]) => ({
      id: `${bill.id}-${userId}`,
      userId,
      amount: Math.round(amount * 100) / 100,
      status: 'pending' as const,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }));

    setBills(prevBills => 
      prevBills.map(b => 
        b.id === bill.id 
          ? { ...b, payments, status: 'split' as const }
          : b
      )
    );
  };

  const getPendingAmount = () => {
    return bills.reduce((total, bill) => {
      return total + bill.payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
    }, 0);
  };

  const getPaidAmount = () => {
    return bills.reduce((total, bill) => {
      return total + bill.payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
    }, 0);
  };

  const getDuePayments = () => {
    return bills.flatMap(bill => 
      bill.payments.filter(p => p.status === 'pending')
    );
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pending</p>
              <p className="text-2xl font-bold text-orange-600">${getPendingAmount().toFixed(2)}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">${getPaidAmount().toFixed(2)}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Bills</p>
              <p className="text-2xl font-bold text-blue-600">{bills.filter(b => b.status !== 'paid').length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Due Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Pending Payments</h2>
          </div>
        </div>
        <div className="p-6">
          {getDuePayments().length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending payments</p>
          ) : (
            <div className="space-y-4">
              {getDuePayments().map((payment) => {
                const user = sampleUsers.find(u => u.id === payment.userId);
                const bill = bills.find(b => b.payments.some(p => p.id === payment.id));
                return (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{bill?.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                      <button
                        onClick={() => handlePayment(payment.id)}
                        className="mt-1 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full hover:shadow-lg transition-all duration-200"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bills</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bills.slice(0, 3).map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div>
                  <p className="font-medium text-gray-900">{bill.title}</p>
                  <p className="text-sm text-gray-500">{bill.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${bill.totalAmount.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                    bill.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    bill.status === 'split' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Upload Receipt</h2>
          <p className="text-gray-500 mt-1">Take a photo or upload an image of your receipt</p>
        </div>
        <div className="p-6">
          {isProcessing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Processing receipt...</p>
              <p className="text-gray-500">Our AI is extracting items and amounts</p>
            </div>
          ) : uploadedImage ? (
            <div className="space-y-6">
              <div className="relative">
                <img src={uploadedImage} alt="Uploaded receipt" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
              </div>
              <div className="text-center">
                <button
                  onClick={() => setUploadedImage(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Upload Different Image
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors duration-200">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Receipt Image</h3>
              <p className="text-gray-500 mb-6">Drag and drop or click to select</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    <Upload className="h-5 w-5" />
                    Choose File
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    <Camera className="h-5 w-5" />
                    Take Photo
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBillDetails = (bill: Bill) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowBillDetails(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{bill.title}</h1>
          <p className="text-gray-500">{bill.createdAt.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Bill Items</h2>
            <p className="text-2xl font-bold text-gray-900">${bill.totalAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bill.items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-lg font-semibold text-blue-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Assign to:</p>
                  <div className="flex flex-wrap gap-2">
                    {bill.participants.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => assignItemToUser(bill.id, item.id, user.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          item.assignedTo.includes(user.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {bill.items.some(item => item.assignedTo.length > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => generatePayments(bill)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Generate Payment Split
              </button>
            </div>
          )}
        </div>
      </div>

      {bill.payments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Payment Summary</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {bill.payments.map((payment) => {
                const user = sampleUsers.find(u => u.id === payment.userId);
                return (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                      {payment.status === 'pending' ? (
                        <button
                          onClick={() => handlePayment(payment.id)}
                          className="mt-1 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full hover:shadow-lg transition-all duration-200"
                        >
                          Pay via SSLCommerce
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Bills</h1>
        <button
          onClick={() => setActiveTab('upload')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          New Bill
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bills.map((bill) => (
          <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bill.title}</h3>
                  <p className="text-gray-500">{bill.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${bill.totalAmount.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                    bill.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    bill.status === 'split' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{bill.participants.length} participants</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedBill(bill);
                    setShowBillDetails(true);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">SSLCommerce Integration</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">SSLCommerce Connected</p>
                  <p className="text-sm text-green-700">Ready to process payments</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Payment Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Credit/Debit Cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Mobile Banking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Internet Banking</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Security Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Fraud Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Payment Reminders</p>
                <p className="text-sm text-gray-500">Get notified about due payments</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">New Bill Notifications</p>
                <p className="text-sm text-gray-500">When someone adds you to a bill</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Payment Confirmations</p>
                <p className="text-sm text-gray-500">When payments are completed</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartPay Assist AI</h1>
                <p className="text-xs text-gray-500">Split bills intelligently</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBillDetails && selectedBill ? (
          renderBillDetails(selectedBill)
        ) : (
          <>
            {activeTab === 'home' && renderHome()}
            {activeTab === 'upload' && renderUpload()}
            {activeTab === 'bills' && renderBills()}
            {activeTab === 'profile' && renderProfile()}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around items-center">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'upload', icon: Camera, label: 'Scan' },
              { id: 'bills', icon: Receipt, label: 'Bills' },
              { id: 'profile', icon: Settings, label: 'Settings' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id as any);
                  setShowBillDetails(false);
                }}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom spacing for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
}

export default App;