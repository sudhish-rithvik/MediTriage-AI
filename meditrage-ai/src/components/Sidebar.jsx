import { LayoutDashboard, Activity, Settings, Bell, Search, Menu, Users } from "lucide-react";

export default function Sidebar({ currentView, onNavigate }) {
    return (
        <div className="hidden lg:flex flex-col w-64 h-screen bg-cyber-card border-r border-white/5 fixed left-0 top-0 p-6 z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-accent flex items-center justify-center">
                    <Activity className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-wide text-white">MediTriage<span className="text-cyber-primary">.AI</span></h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-2">
                <NavItem icon={<LayoutDashboard />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                <NavItem icon={<Activity />} label="Patients" active={currentView === 'patients'} onClick={() => onNavigate('patients')} />
                <NavItem icon={<Users />} label="Doctors" active={currentView === 'doctors'} onClick={() => onNavigate('doctors')} />
                <NavItem icon={<Settings />} label="Settings" active={currentView === 'settings'} onClick={() => onNavigate('settings')} />
            </nav>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-cyber-primary text-white shadow-lg shadow-cyber-primary/25' : 'text-cyber-muted hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </div>
    )
}
