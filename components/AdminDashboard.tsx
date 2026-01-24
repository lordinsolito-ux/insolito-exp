import React, { useEffect, useState, useMemo } from 'react';
import {
    X, Check, XCircle, Calendar, Clock, User, Phone, MapPin, Search,
    TrendingUp, DollarSign, Briefcase, AlertOctagon, RefreshCw, Wifi,
    WifiOff, BarChart3, ChevronLeft, ChevronRight, Edit2, Save,
    LayoutDashboard, List, PieChart, Settings, LogOut, Bell, Filter, FileText
} from 'lucide-react';
import { BookingRecord } from '../types';
import { sendBookingUpdateNotification, fetchAllBookings, saveBooking, isCloudConfigured } from '../services/bookingService';
import { generateInvoiceHTML } from '../services/invoiceService';
import { stripeService } from '../services/stripeService';
import { BUSINESS_INFO } from '../legalContent';

// --- TYPES ---
interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

type ViewMode = 'overview' | 'bookings' | 'analytics' | 'calendar' | 'blocktime';

// --- COMPONENTS ---

// 1. Sidebar Component (Desktop)
const Sidebar = ({ currentView, setView, onClose, isCloudMode }: { currentView: ViewMode, setView: (v: ViewMode) => void, onClose: () => void, isCloudMode: boolean }) => (
    <div className="hidden md:flex w-64 bg-black/90 border-r border-white/5 flex-col py-6 z-20 backdrop-blur-xl h-full">
        {/* Logo Area */}
        <div className="mb-10 px-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] shrink-0">
                IE
            </div>
            <div>
                <h2 className="text-gold-100 font-serif text-lg tracking-wider">INSOLITO</h2>
                <p className="text-[9px] text-gold-500/80 uppercase tracking-[0.2em]">Experiences Hub</p>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3">
            <NavItem icon={LayoutDashboard} label="Overview" active={currentView === 'overview'} onClick={() => setView('overview')} />
            <NavItem icon={List} label="Bookings" active={currentView === 'bookings'} onClick={() => setView('bookings')} />
            <NavItem icon={PieChart} label="Analytics" active={currentView === 'analytics'} onClick={() => setView('analytics')} />
            <NavItem icon={Calendar} label="Calendar" active={currentView === 'calendar'} onClick={() => setView('calendar')} />
            <NavItem icon={XCircle} label="Block Time" active={currentView === 'blocktime'} onClick={() => setView('blocktime')} />
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto px-3 space-y-2">
            <div className={`px-4 py-3 ${isCloudMode ? 'bg-gold-900/40 border-gold-500/30' : 'bg-red-900/20 border-red-500/20'} rounded-lg border mb-4`}>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Database Mode</div>
                <div className={`flex items-center gap-2 text-[10px] font-bold ${isCloudMode ? 'text-gold-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 ${isCloudMode ? 'bg-gold-500 animate-pulse' : 'bg-red-500'} rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]`} />
                    {isCloudMode ? 'SUPABASE NATIVE ACTIVE' : 'LOCAL BACKUP ONLY'}
                </div>
            </div>
            <button onClick={onClose} className="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all group">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Exit Dashboard</span>
            </button>
        </div>
    </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all relative group ${active
            ? 'bg-gold-900/20 text-gold-400'
            : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-gold-500' : 'group-hover:text-white'}`} />
        <span className={`text-sm font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold-500 rounded-r-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />}
    </button>
);

// 2. Bottom Navigation (Mobile)
const BottomNav = ({ currentView, setView, onClose }: { currentView: ViewMode, setView: (v: ViewMode) => void, onClose: () => void }) => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 flex justify-around items-center p-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <NavItemMobile icon={LayoutDashboard} label="Overview" active={currentView === 'overview'} onClick={() => setView('overview')} />
        <NavItemMobile icon={List} label="Bookings" active={currentView === 'bookings'} onClick={() => setView('bookings')} />
        <NavItemMobile icon={PieChart} label="Analytics" active={currentView === 'analytics'} onClick={() => setView('analytics')} />
        <NavItemMobile icon={Calendar} label="Calendar" active={currentView === 'calendar'} onClick={() => setView('calendar')} />
        <NavItemMobile icon={XCircle} label="Block" active={currentView === 'blocktime'} onClick={() => setView('blocktime')} />
        <button onClick={onClose} className="flex flex-col items-center gap-1 p-2 text-gray-600">
            <LogOut className="w-5 h-5" />
            <span className="text-[9px] font-medium tracking-wide">Exit</span>
        </button>
    </div>
);

const NavItemMobile = ({ icon: Icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${active ? 'text-gold-400' : 'text-gray-500'}`}>
        <Icon className={`w-6 h-6 ${active ? 'text-gold-500' : ''}`} />
        <span className="text-[9px] font-medium tracking-wide">{label}</span>
    </button>
);

// 3. Stat Card Component (Interactive)
const StatCard = ({ title, value, subtext, icon: Icon, trend, onClick }: any) => (
    <div
        onClick={onClick}
        className={`bg-gray-900/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-gold-500/30 transition-all duration-500 ${onClick ? 'cursor-pointer hover:bg-gray-800/50' : ''}`}
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            <Icon className="w-16 h-16 text-gold-500" />
        </div>
        <div className="relative z-10">
            <div className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">{title}</div>
            <div className="text-3xl md:text-4xl text-white font-serif mb-2 tracking-tight">{value}</div>
            <div className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : 'text-gray-500'}`}>
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {subtext}
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500/0 via-gold-500/20 to-gold-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
);

// 4. Custom SVG Area Chart
const RevenueChart = ({ data }: { data: number[] }) => {
    const height = 200;
    const width = 600;
    const max = Math.max(...data, 100);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (val / max) * height;
        return `${x},${y}`;
    }).join(' ');

    const areaPath = `${points} ${width},${height} 0,${height}`;

    return (
        <div className="w-full h-[200px] overflow-hidden relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d">
                <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M ${areaPath} Z`} fill="url(#goldGradient)" />
                <polyline points={points} fill="none" stroke="#D4AF37" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-white/20 w-full" />
                <div className="border-t border-white/20 w-full" />
                <div className="border-t border-white/20 w-full" />
                <div className="border-t border-white/20 w-full" />
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<ViewMode>('overview');
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isCloudMode, setIsCloudMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    // Filters for Bookings View
    const [bookingFilter, setBookingFilter] = useState<'all' | 'requested' | 'proposed' | 'confirmed' | 'declined' | 'rescheduled' | 'executed' | 'pending'>('all');

    // Phase 26: Approval Workflow State
    const [approvingBooking, setApprovingBooking] = useState<BookingRecord | null>(null);
    const [stripeLink, setStripeLink] = useState('');

    // Reschedule State
    const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');

    // Calendar State
    const [calendarDate, setCalendarDate] = useState(new Date());

    // Document Generation State
    const [documentModalBooking, setDocumentModalBooking] = useState<BookingRecord | null>(null);
    const [invoiceStep, setInvoiceStep] = useState<'select' | 'details'>('select');
    const [invoiceData, setInvoiceData] = useState({ businessName: '', vatId: '', address: '' });

    // Calendar Popup State
    const [selectedCalendarBooking, setSelectedCalendarBooking] = useState<BookingRecord | null>(null);

    // Block Time State
    const [showBlockForm, setShowBlockForm] = useState(false);
    const [blockDate, setBlockDate] = useState('');
    const [blockStartTime, setBlockStartTime] = useState('');
    const [blockEndTime, setBlockEndTime] = useState('');
    const [blockReason, setBlockReason] = useState('');

    // Reschedule State
    const [rescheduleReason, setRescheduleReason] = useState('');

    // Load Data
    const loadBookings = async () => {
        setIsLoading(true);
        try {
            if (!isCloudConfigured()) await new Promise(resolve => setTimeout(resolve, 600));
            const data = await fetchAllBookings();

            // Filter out cancelled bookings (unblocked blocks should not appear)
            const activeData = data.filter(booking => booking.status !== 'cancelled');


            // Sort Logic:
            // 1. Pending bookings FIRST
            // 2. Within Pending: Sort by SUBMISSION TIME (Newest first)
            // 3. Other bookings: Sort by TRIP DATE (Newest/Furthest first)
            const sorted = Array.isArray(activeData) ? activeData.sort((a, b) => {
                // 1. Priority: Requested bookings FIRST, then Proposed
                if ((a.status === 'requested' || a.status === 'pending') && b.status !== 'requested' && b.status !== 'pending') return -1;
                if (a.status !== 'requested' && a.status !== 'pending' && (b.status === 'requested' || b.status === 'pending')) return 1;

                // 2. Sorting (By Submission Timestamp - Newest First)
                if ((a.status === 'requested' || a.status === 'pending') && (b.status === 'requested' || b.status === 'pending')) {
                    const tA = a.timestamp ? new Date(a.timestamp).getTime() : Number(a.id);
                    const tB = b.timestamp ? new Date(b.timestamp).getTime() : Number(b.id);
                    return tB - tA; // Descending
                }

                // 3. Other Sorting (By Trip Date)
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateB.getTime() - dateA.getTime();
            }) : [];

            setBookings(sorted);
        } catch (e) {
            console.error("Failed to load", e);
        } finally {
            setIsLoading(false);
            setLastUpdated(new Date());
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadBookings();
            setIsCloudMode(isCloudConfigured());
            console.log("💎 [God Mode] Admin Dashboard initialized with Supabase:", isCloudConfigured());
            const interval = setInterval(loadBookings, 180000); // 3-minute auto-refresh cycle
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    // Derived Stats
    const stats = useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // Calculate start of week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);

        let totalRev = 0;
        let todayRev = 0;
        let weekRev = 0;
        let pending = 0;
        let upcoming = 0;

        // For Chart (Last 7 days)
        const last7Days = Array(7).fill(0);
        const dayLabels = Array(7).fill('');

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            dayLabels[i] = d.toLocaleDateString('en-US', { weekday: 'short' });
        }

        bookings.forEach(b => {
            if (!b.date) return;
            const bDate = new Date(b.date);
            const price = Number(b.estimatedPrice) || 0;

            if (b.status === 'pending' || b.status === 'requested') pending++;
            if (b.status === 'confirmed') {
                totalRev += price;

                // Today
                if (b.date === todayStr) todayRev += price;

                // Week
                if (bDate >= startOfWeek) weekRev += price;

                // Upcoming (Fixed Logic)
                const bDateTime = new Date(`${b.date}T${b.time}`);
                if (bDateTime > now) upcoming++;

                // Chart Data
                const diffDays = Math.floor((now.getTime() - bDate.getTime()) / (1000 * 3600 * 24));
                if (diffDays >= 0 && diffDays < 7) {
                    last7Days[6 - diffDays] += price;
                }
            }
        });

        return { totalRev, todayRev, weekRev, pending, upcoming, chartData: last7Days, dayLabels };
    }, [bookings]);

    // Actions
    const handleStatusUpdate = async (id: string, status: any, stripeLinkValue?: string) => {
        const booking = bookings.find(b => b.id === id);
        if (!booking) return;
        setIsProcessing(id);

        // Optimistic Update
        const updated = bookings.map(b => b.id === id ? { ...b, status, stripeLink: stripeLinkValue || b.stripeLink } : b);
        setBookings(updated);

        const newRecord = { ...booking, status, stripeLink: stripeLinkValue || booking.stripeLink };
        await saveBooking(newRecord); // Admin update (no flag needed)
        await sendBookingUpdateNotification(newRecord, status);
        setIsProcessing(null);
        setApprovingBooking(null);
        setStripeLink('');
    };

    const handleApproveProposal = async () => {
        if (!approvingBooking) return;

        setIsProcessing(approvingBooking.id);

        // 1. Generate Stripe Link automatically
        const { url, error } = await stripeService.createProposalPayment(approvingBooking);

        if (error || !url) {
            alert(`Stripe Error: ${error || 'Failed to generate link'}. Please check your Edge Function and STRIPE_SECRET_KEY.`);
            setIsProcessing(null);
            return;
        }

        // 2. Update status and send email
        await handleStatusUpdate(approvingBooking.id, 'proposed', url);
        setIsProcessing(null);
    };

    const handleMarkExecuted = async (id: string) => {
        await handleStatusUpdate(id, 'executed');
    };

    const openReschedule = (booking: BookingRecord) => {
        setEditingBooking(booking);
        setRescheduleDate(booking.date);
        setRescheduleTime(booking.time);
        setRescheduleReason(''); // Reset reason
    };

    const handleRescheduleSubmit = async () => {
        if (!editingBooking || !rescheduleDate || !rescheduleTime) return;

        setIsProcessing('rescheduling');
        try {
            const updatedBooking = {
                ...editingBooking,
                date: rescheduleDate,
                time: rescheduleTime,
                status: 'rescheduled' as any // Keep as rescheduled/pending
            };

            // Pass rescheduleReason to saveBooking
            await saveBooking(updatedBooking, false, true, rescheduleReason);

            setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
            setEditingBooking(null);

            // Force reload to ensure sync
            setTimeout(loadBookings, 1000);
        } catch (error) {
            console.error('Reschedule failed', error);
            alert('Failed to reschedule. Please check connection.');
        } finally {
            setIsProcessing(null);
        }
    };

    const handleOpenDocumentModal = (booking: BookingRecord) => {
        setDocumentModalBooking(booking);
        setInvoiceStep('select');
        setInvoiceData({ businessName: '', vatId: '', address: '' });
    };

    const generateDocument = (type: 'receipt' | 'invoice') => {
        if (!documentModalBooking) return;

        // If Invoice and in select step, go to details
        if (type === 'invoice' && invoiceStep === 'select') {
            setInvoiceStep('details');
            return;
        }

        const html = generateInvoiceHTML(documentModalBooking, type, type === 'invoice' ? invoiceData : undefined);
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
        }
        setDocumentModalBooking(null);
    };

    const sendViaWhatsApp = (booking: BookingRecord, type: 'receipt' | 'invoice') => {
        const tierLabel = booking.tier ?
            `Tier ${booking.tier.charAt(0).toUpperCase() + booking.tier.slice(1)}` :
            'il servizio';

        const message = `Gentile ${booking.name},\n\nLe invio ${type === 'invoice' ? 'la fattura' : 'la ricevuta'} per ${tierLabel} del ${booking.date}.\n\nGrazie per aver scelto INSOLITO PRIVÉ.\n\nMichael Jara\nLifestyle Guardian\n${BUSINESS_INFO.phone}`;

        const phone = booking.phone.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setDocumentModalBooking(null);
    };

    const sendViaEmail = (booking: BookingRecord, type: 'receipt' | 'invoice') => {
        const subject = `${type === 'invoice' ? 'Fattura' : 'Ricevuta'} INSOLITO PRIVÉ - ${booking.date}`;
        const tierInfo = booking.tier ? `Tier ${booking.tier.charAt(0).toUpperCase() + booking.tier.slice(1)}` : 'servizio';
        const body = `Gentile ${booking.name},\n\nIn allegato ${type === 'invoice' ? 'la fattura' : 'la ricevuta'} per ${tierInfo} del ${booking.date}.\n\nPer scaricare il documento, la preghiamo di generarlo dalla dashboard o contattarci direttamente.\n\nGrazie,\nMichael Jara\nINSOLITO PRIVÉ\n${BUSINESS_INFO.phone} | ${BUSINESS_INFO.email}`;

        window.location.href = `mailto:${booking.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setDocumentModalBooking(null);
    };

    const handleBlockTime = async () => {
        if (!blockDate || !blockStartTime) {
            alert('Please select a date and start time');
            return;
        }

        setIsProcessing('blocking');

        // Create a dummy booking to block the time slot
        const blockBooking: BookingRecord = {
            id: `block-${Date.now()}`,
            name: '🚫 BLOCKED',
            email: 'admin@block',
            phone: '-',
            pickupLocation: blockReason || 'Admin Block',
            destination: `END:${blockEndTime || blockStartTime}`, // Store end time with prefix to prevent number conversion
            date: blockDate,
            time: blockStartTime,
            serviceType: 'admin_block' as any,
            passengers: 1,
            estimatedPrice: 0,
            paymentMethod: 'cash',
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            isVIP: false,
            countryCode: '',
            stops: [],
            duration: 0,
            priceBreakdown: { total: 0, baseFare: 0, distanceFare: 0, nightSurcharge: 0, stopFee: 0, petFee: 0, serviceMultiplier: 1 },
            vehiclePreference: undefined,
            specialRequests: '',
            contactMethod: 'whatsapp',
            hasPets: false
        };

        // Save to DB (with isNewBooking=true to sync to cloud)
        await saveBooking(blockBooking, true);

        // Update local state immediately (don't wait for cloud sync)
        const updatedBookings = [blockBooking, ...bookings];
        setBookings(updatedBookings);

        // Reset form
        setBlockDate('');
        setBlockStartTime('');
        setBlockEndTime('');
        setBlockReason('');
        setIsProcessing(null);

        // Show success message
        alert(`✅ Time blocked: ${blockDate} from ${blockStartTime} to ${blockEndTime || blockStartTime}`);
    };

    if (!isOpen) return null;

    // --- VIEW RENDERERS ---

    const renderOverview = () => (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-0">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400 text-xs md:text-sm">Welcome back, Admin.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={loadBookings} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-white/5">
                        <RefreshCw className={`w-5 h-5 text-gold-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Today's Revenue" value={`€${stats.todayRev}`} subtext="Daily earnings" icon={DollarSign} trend="up" />
                <StatCard title="Weekly Revenue" value={`€${stats.weekRev}`} subtext="Since Monday" icon={TrendingUp} trend="up" />
                <StatCard
                    title="Pending Requests"
                    value={stats.pending}
                    subtext="Action required"
                    icon={AlertOctagon}
                    trend={stats.pending > 0 ? 'down' : 'neutral'}
                    onClick={() => {
                        setBookingFilter('requested');
                        setView('bookings');
                    }}
                />
                <StatCard
                    title="Confirmed Jobs"
                    value={stats.upcoming}
                    subtext="Scheduled"
                    icon={Calendar}
                    trend="neutral"
                    onClick={() => {
                        setBookingFilter('confirmed');
                        setView('bookings');
                    }}
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left: Revenue Chart */}
                <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-serif text-gold-100">Revenue Trend</h3>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Last 7 Days</div>
                    </div>
                    <RevenueChart data={stats.chartData} />
                    <div className="flex justify-between mt-4 text-xs text-gray-500 uppercase tracking-widest px-2">
                        {stats.dayLabels.map((d, i) => <span key={i}>{d}</span>)}
                    </div>
                </div>

                {/* Right: Next Up / Recent */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-900/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-bl-full -mr-4 -mt-4" />
                        <h3 className="text-sm font-bold text-gold-500 uppercase tracking-widest mb-4">Next Booking</h3>
                        {bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.time}`) > new Date()).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0] ? (
                            (() => {
                                const next = bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.time}`) > new Date()).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];
                                return (
                                    <div>
                                        <div className="text-2xl text-white font-serif mb-1">{next.time}</div>
                                        <div className="text-sm text-gray-400 mb-4">{next.date}</div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <User className="w-4 h-4 text-gold-500" /> {next.name}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                                <MapPin className="w-4 h-4 text-gold-500" /> {next.pickupLocation.split(',')[0]}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="text-gray-500 text-sm italic">No upcoming bookings scheduled.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBookings = () => {
        const filtered = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);

        return (
            <div className="space-y-6 animate-fade-in h-full flex flex-col pb-20 md:pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-serif text-white">Bookings</h1>
                    <div className="flex bg-gray-900/50 rounded-lg p-1 border border-white/5 w-full md:w-auto overflow-x-auto">
                        {(['all', 'requested', 'proposed', 'confirmed', 'executed', 'rescheduled', 'declined'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setBookingFilter(f)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${bookingFilter === f ? 'bg-gold-600 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar bg-gray-900/20 rounded-2xl border border-white/5 p-4 md:p-0">

                    {/* MOBILE CARD VIEW (< 768px) */}
                    <div className="md:hidden space-y-4">
                        {filtered.map(booking => (
                            <div key={booking.id} className="bg-gray-900/60 border border-white/10 rounded-xl p-5 space-y-4 relative overflow-hidden">
                                {/* Status Badge */}
                                <div className="flex justify-between items-start">
                                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                        booking.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50' :
                                            booking.status === 'rescheduled' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                                                'bg-red-900/20 text-red-400 border-red-900/50'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    <div className="text-right">
                                        <div className="font-mono text-gold-400 text-lg">€{booking.estimatedPrice}</div>
                                        <div className="text-[9px] text-gray-500 uppercase">{booking.paymentMethod}</div>
                                    </div>
                                </div>

                                {/* Client & Time */}
                                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                                    <div>
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Client</div>
                                        <div className="text-white font-bold text-sm">{booking.name}</div>
                                        <div className="text-xs text-gray-400">{booking.phone}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Date</div>
                                        <div className="text-white text-sm">{booking.date}</div>
                                        <div className="text-gold-500 font-mono text-xs">{booking.time}</div>
                                    </div>
                                </div>

                                {/* Route */}
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />
                                        <div className="text-xs text-gray-300 break-words">{booking.pickupLocation}</div>
                                    </div>
                                    <div className="pl-0.5 ml-[2px] border-l border-white/10 h-3" />
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white border border-gray-500 mt-1.5 shrink-0" />
                                        <div className="text-xs text-gray-300 break-words">{booking.destination}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                                    {(booking.status === 'requested' || booking.status === 'pending' || booking.status === 'rescheduled') && (
                                        <>
                                            <button
                                                onClick={() => setApprovingBooking(booking)}
                                                disabled={isProcessing === booking.id}
                                                className="flex-1 py-2 bg-gold-600/20 hover:bg-gold-600 text-gold-400 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Check className="w-3 h-3" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking.id, 'declined')}
                                                disabled={isProcessing === booking.id}
                                                className="flex-1 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X className="w-3 h-3" /> Decline
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'proposed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                            disabled={isProcessing === booking.id}
                                            className="flex-1 py-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-3 h-3" /> Mark Paid
                                        </button>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleMarkExecuted(booking.id)}
                                            disabled={isProcessing === booking.id}
                                            className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-3 h-3" /> Executed
                                        </button>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleOpenDocumentModal(booking)}
                                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors"
                                            title="Generate Document"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openReschedule(booking)}
                                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP TABLE VIEW (>= 768px) */}
                    <table className="hidden md:table w-full text-left border-collapse">
                        <thead className="bg-black/50 sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Status</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Client</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Tier/Service</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Date & Time</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Route</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium">Price</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-gray-500 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(booking => (
                                <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                            booking.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50' :
                                                booking.status === 'rescheduled' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                                                    'bg-red-900/20 text-red-400 border-red-900/50'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white text-sm">{booking.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">{booking.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        {booking.tier ? (
                                            <div>
                                                <div className="text-xs font-bold">
                                                    {booking.tier === 'essentials' && '⚡ Essentials'}
                                                    {booking.tier === 'signature' && '💎 Signature'}
                                                    {booking.tier === 'elite' && '👑 Elite'}
                                                </div>
                                                <div className="text-[9px] text-gray-500">
                                                    {booking.hours}h @ €{booking.hourlyRate}/h
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-[10px] text-gray-500 uppercase">
                                                {booking.serviceType?.replace('_', ' ')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs text-gray-300">{booking.date}</div>
                                        <div className="text-[10px] text-gold-500 font-mono">{booking.time}</div>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        {booking.tier ? (
                                            <div className="text-[10px] text-gray-400 italic">Details in invoice</div>
                                        ) : (
                                            <>
                                                <div className="text-[10px] text-gray-400 truncate max-w-[100px]" title={booking.pickupLocation}>From: {booking.pickupLocation}</div>
                                                <div className="text-[10px] text-gray-400 truncate max-w-[100px]" title={booking.destination}>To: {booking.destination}</div>
                                            </>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-mono text-gold-400 text-sm">€{booking.estimatedPrice}</div>
                                        <div className="text-[9px] text-gray-600 uppercase">{booking.paymentMethod}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            {(booking.status === 'requested' || booking.status === 'pending' || booking.status === 'rescheduled') && (
                                                <>
                                                    <button
                                                        onClick={() => setApprovingBooking(booking)}
                                                        disabled={isProcessing === booking.id}
                                                        className="p-1.5 bg-gold-600/20 hover:bg-gold-600 text-gold-400 hover:text-white rounded transition-colors"
                                                        title="Approve & Send Proposal"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking.id, 'declined')}
                                                        disabled={isProcessing === booking.id}
                                                        className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded transition-colors"
                                                        title="Decline Booking"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'proposed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                    disabled={isProcessing === booking.id}
                                                    className="p-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded transition-colors"
                                                    title="Mark as Paid/Confirmed"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleMarkExecuted(booking.id)}
                                                    disabled={isProcessing === booking.id}
                                                    className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded transition-colors"
                                                    title="Mark as Executed (Send Closing Email)"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleOpenDocumentModal(booking)}
                                                    className="p-1.5 text-gray-600 hover:text-white transition-colors"
                                                    title="Generate Document"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openReschedule(booking)}
                                                className="p-1.5 text-gray-600 hover:text-white transition-colors"
                                                title="Reschedule / Edit"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderAnalytics = () => (
        <div className="space-y-8 animate-fade-in pb-20 md:pb-0">
            <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-gold-100 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Total Revenue</span>
                            <span className="text-xl text-white font-mono">€{stats.totalRev}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">This Week</span>
                            <span className="text-xl text-gold-400 font-mono">€{stats.weekRev}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-gray-400">Today</span>
                            <span className="text-xl text-green-400 font-mono">€{stats.todayRev}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-serif text-gold-100 mb-4">Booking Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border-l-2 border-green-500">
                            <span className="text-gray-400">Confirmed</span>
                            <span className="text-white font-bold">{bookings.filter(b => b.status === 'confirmed').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border-l-2 border-yellow-500">
                            <span className="text-gray-400">Pending</span>
                            <span className="text-white font-bold">{bookings.filter(b => b.status === 'pending').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border-l-2 border-red-500">
                            <span className="text-gray-400">Declined</span>
                            <span className="text-white font-bold">{bookings.filter(b => b.status === 'declined').length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border-l-2 border-orange-500">
                            <span className="text-gray-400">Blocked</span>
                            <span className="text-white font-bold">{bookings.filter(b => b.email === 'admin@block' && b.status === 'confirmed').length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCalendar = () => {
        const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
        const monthName = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return (
            <div className="space-y-6 animate-fade-in h-full flex flex-col pb-20 md:pb-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-serif text-white">Calendar</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                        <span className="text-lg md:text-xl font-serif">{monthName}</span>
                        <button onClick={() => setCalendarDate(new Date(calendarDate.setMonth(calendarDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight /></button>
                    </div>
                </div>

                <div className="flex-1 bg-gray-900/40 border border-white/5 rounded-2xl p-4 md:p-6 overflow-auto">
                    <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center text-gray-500 text-[10px] md:text-xs uppercase tracking-widest">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 md:gap-4">
                        {days.map((day, i) => {
                            if (!day) return <div key={i} className="aspect-square" />;
                            const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            // INCLUDE RESCHEDULED BOOKINGS
                            const dayBookings = bookings.filter(b => b.date === dateStr && (b.status === 'confirmed' || b.status === 'rescheduled'));
                            const isToday = new Date().toISOString().split('T')[0] === dateStr;

                            return (
                                <div key={i} className={`aspect-square border border-white/5 rounded-lg p-1 md:p-2 relative group hover:border-gold-500/50 transition-colors ${isToday ? 'bg-gold-900/10 border-gold-500/30' : 'bg-black/20'}`}>
                                    <div className={`text-xs md:text-sm font-bold mb-1 ${isToday ? 'text-gold-400' : 'text-gray-400'}`}>{day}</div>
                                    <div className="space-y-1 overflow-hidden h-[calc(100%-20px)]">
                                        {dayBookings.map(b => {
                                            const isBlocked = b.email === 'admin@block';
                                            const isRescheduled = b.status === 'rescheduled';

                                            return (
                                                <div
                                                    key={b.id}
                                                    onClick={() => setSelectedCalendarBooking(b)}
                                                    className={`text-[6px] md:text-[8px] px-1 py-0.5 rounded truncate cursor-pointer transition-colors ${isBlocked
                                                        ? 'bg-red-600/30 text-red-200 hover:bg-red-600/50 border border-red-900/50'
                                                        : isRescheduled
                                                            ? 'bg-blue-600/30 text-blue-200 hover:bg-blue-600/50 border border-blue-900/50'
                                                            : 'bg-gold-600/20 text-gold-200 hover:bg-gold-600/40'
                                                        }`}
                                                    title={`${b.time} - ${b.name} (${b.status})`}
                                                >
                                                    <span className="hidden md:inline">{b.time} {b.name}</span>
                                                    <span className="md:hidden w-1 h-1 rounded-full block mx-auto" style={{ backgroundColor: isBlocked ? '#EF4444' : isRescheduled ? '#3B82F6' : '#D4AF37' }}></span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderBlockTime = () => {
        const blockedBookings = bookings.filter(b => b.email === 'admin@block' && b.status !== 'cancelled');

        return (
            <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">Block Time</h1>
                        <p className="text-gray-400 text-xs md:text-sm">Manage your unavailable time slots</p>
                    </div>
                    <button onClick={loadBookings} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-white/5">
                        <RefreshCw className={`w-5 h-5 text-gold-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Add New Block Form */}
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-900/30 rounded-2xl p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full -mr-4 -mt-4" />
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">🚫 Block New Time Slot</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Date</label>
                                <input
                                    type="date"
                                    value={blockDate}
                                    onChange={(e) => setBlockDate(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500/50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Start Time</label>
                                <select
                                    value={blockStartTime}
                                    onChange={(e) => setBlockStartTime(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500/50 focus:outline-none cursor-pointer"
                                >
                                    <option value="">Select hour</option>
                                    {Array.from({ length: 24 }, (_, i) => {
                                        const hour = i.toString().padStart(2, '0');
                                        return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">End Time</label>
                                <select
                                    value={blockEndTime}
                                    onChange={(e) => setBlockEndTime(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500/50 focus:outline-none cursor-pointer"
                                >
                                    <option value="">Select hour</option>
                                    {Array.from({ length: 24 }, (_, i) => {
                                        const hour = i.toString().padStart(2, '0');
                                        return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                                    })}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Reason (Optional)</label>
                            <input
                                type="text"
                                value={blockReason}
                                onChange={(e) => setBlockReason(e.target.value)}
                                placeholder="e.g., Personal event, Meeting, Dinner, etc."
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-red-500/50 focus:outline-none placeholder-gray-600"
                            />
                        </div>

                        <button
                            onClick={handleBlockTime}
                            disabled={isProcessing === 'blocking'}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing === 'blocking' ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Blocking...
                                </>
                            ) : (
                                '🚫 Block This Time'
                            )}
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-600 mt-4">This will block the selected time slot from customer bookings. Blocked times appear as confirmed bookings in your system.</p>
                </div>

                {/* Active Blocks List */}
                <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-4 md:p-6 relative z-50">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Active Blocks ({blockedBookings.length})</h3>

                    {blockedBookings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <XCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No blocked times yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {blockedBookings.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()).map(block => (
                                <div key={block.id} className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-gold-400 font-mono text-sm">{block.date}</span>
                                        <span className="text-red-400 font-mono text-sm">
                                            {block.time} - {block.destination}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">{block.pickupLocation}</p>

                                    <button
                                        onClick={async () => {
                                            if (!confirm(`Unblock ${block.date} from ${block.time} to ${block.destination}?`)) return;
                                            try {
                                                // Change status to cancelled and sync to Google Sheets
                                                const cancelledBlock = { ...block, status: 'cancelled' as any };
                                                await saveBooking(cancelledBlock, false, true); // forceCloudUpdate: true

                                                // Update local state (remove from UI)
                                                const updated = bookings.filter(b => b.id !== block.id);
                                                setBookings(updated);

                                                alert('✅ Unblocked! Time slots are now available.');
                                            } catch (err) {
                                                alert('❌ Error unblocking');
                                            }
                                        }}
                                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg"
                                    >
                                        🔓 Unblock
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black text-gray-200 font-sans flex animate-fade-in">
            {/* Calendar Details Modal */}
            {selectedCalendarBooking && (
                <div className="absolute inset-0 z-[220] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gold-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl animate-zoom-out">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl text-gold-400 font-serif">Booking Details</h3>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">{selectedCalendarBooking.id}</p>
                            </div>
                            <button onClick={() => setSelectedCalendarBooking(null)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Client</div>
                                    <div className="text-white font-bold">{selectedCalendarBooking.name}</div>
                                    <div className="text-xs text-gray-400">{selectedCalendarBooking.phone}</div>
                                    <div className="text-xs text-gray-400">{selectedCalendarBooking.email}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Date & Time</div>
                                    <div className="text-white font-bold">{selectedCalendarBooking.date}</div>
                                    <div className="text-gold-500 font-mono">{selectedCalendarBooking.time}</div>
                                </div>
                            </div>

                            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pickup</div>
                                        <div className="text-sm text-gray-200">{selectedCalendarBooking.pickupLocation}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Destination</div>
                                        <div className="text-sm text-gray-200">{selectedCalendarBooking.destination}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Service</div>
                                    <div className="text-xs text-white bg-white/10 px-2 py-1 rounded inline-block">
                                        {selectedCalendarBooking.serviceType?.replace('_', ' ').toUpperCase() || 'TRANSFER'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Price</div>
                                    <div className="text-lg text-gold-400 font-mono">€{selectedCalendarBooking.estimatedPrice}</div>
                                    <div className="text-[9px] text-gray-500 uppercase">{selectedCalendarBooking.paymentMethod}</div>
                                </div>
                            </div>

                            {selectedCalendarBooking.specialRequests && (
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Notes</div>
                                    <div className="text-xs text-gray-400 italic bg-white/5 p-3 rounded">
                                        "{selectedCalendarBooking.specialRequests}"
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/10 flex gap-3">
                            <button
                                onClick={() => {
                                    setDocumentModalBooking(selectedCalendarBooking);
                                    setSelectedCalendarBooking(null);
                                }}
                                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText className="w-3 h-3" /> Document
                            </button>
                            <button
                                onClick={() => setSelectedCalendarBooking(null)}
                                className="flex-1 py-2 bg-gold-600 text-black hover:bg-gold-500 rounded text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Phase 26: Fiduciary Proposal Modal */}
            {approvingBooking && (
                <div className="absolute inset-0 z-[230] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gold-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-zoom-out">
                        <div className="w-12 h-12 bg-gold-600/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Briefcase className="w-6 h-6 text-gold-500" />
                        </div>
                        <h3 className="text-xl text-gold-400 font-serif mb-2 text-center">Fiduciary Proposal</h3>
                        <p className="text-gray-400 text-[11px] mb-6 text-center leading-relaxed">
                            Stai approvando la richiesta di <span className="text-white font-bold">{approvingBooking.name}</span>.<br />
                            Inserisci il link di pagamento Stripe per finalizzare la proposta.
                        </p>

                        <div className="space-y-4">
                            <div className="bg-gold-900/10 border border-gold-900/20 rounded-lg p-4 text-[11px] text-gold-400 italic space-y-2">
                                <p>Cliccando su Genera, il sistema:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Creerà una sessione di pagamento Stripe da <strong>€{approvingBooking.estimatedPrice}</strong>.</li>
                                    <li>Aggiornerà lo stato della pratica a "Proposed".</li>
                                    <li>Invierà la proposta fiduciaria con termini legali al cliente.</li>
                                </ul>
                            </div>

                            <button
                                onClick={handleApproveProposal}
                                disabled={isProcessing === approvingBooking.id}
                                className="w-full py-3 bg-gold-600 text-black hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all uppercase text-xs font-bold tracking-widest shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2"
                            >
                                {isProcessing === approvingBooking.id ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                                        Generating & Sending...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 text-black" />
                                        Generate & Send Proposal
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setApprovingBooking(null)}
                                className="w-full py-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Generation Modal */}
            {documentModalBooking && (
                <div className="absolute inset-0 z-[220] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gold-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-zoom-out">
                        <h3 className="text-xl text-gold-400 font-serif mb-2">Generate Document</h3>
                        <p className="text-gray-400 text-xs mb-6">
                            {invoiceStep === 'select'
                                ? <span>Choose document type for <span className="text-white font-bold">{documentModalBooking.name}</span>.</span>
                                : <span>Enter billing details for <span className="text-white font-bold">{documentModalBooking.name}</span>.</span>
                            }
                        </p>

                        {invoiceStep === 'select' ? (
                            <div className="space-y-3">
                                <button
                                    onClick={() => generateDocument('receipt')}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white rounded transition-all uppercase text-xs font-bold tracking-widest flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" /> Receipt (Non-Fiscal)
                                </button>

                                <button
                                    onClick={() => generateDocument('invoice')}
                                    className="w-full py-3 bg-gold-600 text-black hover:bg-gold-500 rounded transition-all uppercase text-xs font-bold tracking-widest shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" /> Invoice (Fattura)
                                </button>

                                {/* WhatsApp/Email Delivery Buttons */}
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <p className="text-xs text-gray-400 mb-3">Oppure invia direttamente:</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => sendViaWhatsApp(documentModalBooking, 'receipt')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-all border border-green-600/30 hover:border-green-600"
                                        >
                                            <span className="text-lg">📱</span>
                                            <span className="text-xs font-medium">WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={() => sendViaEmail(documentModalBooking, 'receipt')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all border border-blue-600/30 hover:border-blue-600"
                                        >
                                            <span className="text-lg">✉️</span>
                                            <span className="text-xs font-medium">Email</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Business Name / Ragione Sociale</label>
                                    <input
                                        type="text"
                                        value={invoiceData.businessName}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, businessName: e.target.value })}
                                        placeholder="e.g. Acme Corp S.r.l."
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">VAT ID / P.IVA</label>
                                    <input
                                        type="text"
                                        value={invoiceData.vatId}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, vatId: e.target.value })}
                                        placeholder="IT00000000000"
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Address / Indirizzo (Optional)</label>
                                    <input
                                        type="text"
                                        value={invoiceData.address}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })}
                                        placeholder="Via Roma 1, Milano"
                                        className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none text-sm"
                                    />
                                </div>

                                <button
                                    onClick={() => generateDocument('invoice')}
                                    disabled={!invoiceData.businessName || !invoiceData.vatId}
                                    className="w-full py-3 bg-gold-600 text-black hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all uppercase text-xs font-bold tracking-widest shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2 mt-2"
                                >
                                    Confirm & Generate
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (invoiceStep === 'details') setInvoiceStep('select');
                                else setDocumentModalBooking(null);
                            }}
                            className="w-full mt-4 py-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors"
                        >
                            {invoiceStep === 'details' ? 'Back' : 'Cancel'}
                        </button>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {editingBooking && (
                <div className="absolute inset-0 z-[210] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gold-500/30 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-zoom-out">
                        <h3 className="text-xl text-gold-400 font-serif mb-4">Reschedule Booking</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">New Date</label>
                                <input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">New Time</label>
                                <input
                                    type="time"
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Reason for Change (Optional)</label>
                                <textarea
                                    value={rescheduleReason}
                                    onChange={(e) => setRescheduleReason(e.target.value)}
                                    placeholder="e.g. Heavy traffic, Unforeseen delay..."
                                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-gold-500 outline-none text-sm min-h-[80px]"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditingBooking(null)}
                                className="flex-1 py-3 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 transition-colors uppercase text-xs font-bold tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRescheduleSubmit}
                                className="flex-1 py-3 bg-gold-600 text-black rounded hover:bg-gold-500 transition-colors uppercase text-xs font-bold tracking-widest shadow-lg shadow-gold-900/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-screen bg-black overflow-hidden font-sans">
                {/* Desktop Sidebar */}
                <Sidebar
                    currentView={view}
                    setView={setView}
                    onClose={onClose}
                    isCloudMode={isCloudMode}
                />
                <div className="flex-1 flex flex-col min-w-0 bg-[#070707] relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" /> {/* Overlay */}

                    {/* Top Bar */}
                    <div className="relative z-10 h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/40 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-2">
                                {isCloudMode ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
                                <span className="hidden md:inline">{isCloudMode ? 'Cloud Sync Active' : 'Local Storage Mode'}</span>
                            </span>
                            <span className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
                            <span className="hidden md:block">Last Updated: {lastUpdated.toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                                <Bell className="w-5 h-5" />
                                {stats.pending > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gold-600 flex items-center justify-center text-black font-bold text-xs">
                                AD
                            </div>
                        </div>
                    </div>

                    {/* View Content */}
                    <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
                        {view === 'overview' && renderOverview()}
                        {view === 'bookings' && renderBookings()}
                        {view === 'analytics' && renderAnalytics()}
                        {view === 'calendar' && renderCalendar()}
                        {view === 'blocktime' && renderBlockTime()}
                    </div>

                    {/* Bottom Nav (Mobile) */}
                    <BottomNav currentView={view} setView={setView} onClose={onClose} />
                </div>
            </div>
        </div>
    );
};
