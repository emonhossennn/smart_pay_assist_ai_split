import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

interface Bill {
  id: string;
  title: string;
  description?: string;
  total_amount: number;
  image?: string;
  items: BillItem[];
  participants: User[];
  created_at: string;
  updated_at: string;
  status: 'processing' | 'split' | 'paid' | 'partial';
  created_by: string;
}

interface BillItem {
  id: string;
  name: string;
  price: number;
  assigned_to: string[];
}

interface Payment {
  id: string;
  bill: string;
  user: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  due_date: string;
  paid_at?: string;
  payment_method?: string;
  transaction_id?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface BillsState {
  bills: Bill[];
  selectedBill: Bill | null;
  isLoading: boolean;
  setBills: (bills: Bill[]) => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  removeBill: (id: string) => void;
  setSelectedBill: (bill: Bill | null) => void;
  setLoading: (loading: boolean) => void;
}

interface PaymentsState {
  payments: Payment[];
  isLoading: boolean;
  setPayments: (payments: Payment[]) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  setLoading: (loading: boolean) => void;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (loading: boolean) => void;
}

interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeTab: 'home' | 'upload' | 'bills' | 'profile';
  showBillDetails: boolean;
  isMobile: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveTab: (tab: 'home' | 'upload' | 'bills' | 'profile') => void;
  setShowBillDetails: (show: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export const useBillsStore = create<BillsState>()((set, get) => ({
  bills: [],
  selectedBill: null,
  isLoading: false,
  setBills: (bills) => set({ bills }),
  addBill: (bill) => set((state) => ({ bills: [bill, ...state.bills] })),
  updateBill: (id, updates) =>
    set((state) => ({
      bills: state.bills.map((bill) =>
        bill.id === id ? { ...bill, ...updates } : bill
      ),
      selectedBill:
        state.selectedBill?.id === id
          ? { ...state.selectedBill, ...updates }
          : state.selectedBill,
    })),
  removeBill: (id) =>
    set((state) => ({
      bills: state.bills.filter((bill) => bill.id !== id),
      selectedBill: state.selectedBill?.id === id ? null : state.selectedBill,
    })),
  setSelectedBill: (bill) => set({ selectedBill: bill }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const usePaymentsStore = create<PaymentsState>()((set) => ({
  payments: [],
  isLoading: false,
  setPayments: (payments) => set({ payments }),
  updatePayment: (id, updates) =>
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      activeTab: 'home',
      showBillDetails: false,
      isMobile: false,
      setTheme: (theme) => set({ theme }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowBillDetails: (show) => set({ showBillDetails: show }),
      setIsMobile: (isMobile) => set({ isMobile }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarCollapsed: state.sidebarCollapsed 
      }),
    }
  )
);

// Computed selectors
export const useBillsSelectors = () => {
  const bills = useBillsStore((state) => state.bills);
  
  return {
    totalBills: bills.length,
    activeBills: bills.filter((b) => b.status !== 'paid'),
    paidBills: bills.filter((b) => b.status === 'paid'),
    pendingBills: bills.filter((b) => b.status === 'pending'),
    recentBills: bills.slice(0, 5),
  };
};

export const usePaymentsSelectors = () => {
  const payments = usePaymentsStore((state) => state.payments);
  
  return {
    totalPayments: payments.length,
    pendingPayments: payments.filter((p) => p.status === 'pending'),
    paidPayments: payments.filter((p) => p.status === 'paid'),
    failedPayments: payments.filter((p) => p.status === 'failed'),
    totalPendingAmount: payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    totalPaidAmount: payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0),
  };
};
