import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileText, Bell, User,
  Clock, CheckCircle2, LogOut, ShieldCheck, Briefcase,
  ChevronRight, TrendingUp
} from 'lucide-react';
import {
  getBluecoreSession,
  bluecoreLogout,
} from '../../services/bluecoreAuthService';
import './BlueCoreDashboard.css';

/* ── Mock data for staff view ────────────────────────────────────────────── */
function getStaffMockData(session) {
  return {
    attendance: [
      { date: '2026-11-18', checkIn: '09:02 AM', checkOut: '06:03 PM', hours: '9h 01m', status: 'Present' },
      { date: '2026-11-19', checkIn: '08:55 AM', checkOut: '05:58 PM', hours: '9h 03m', status: 'Present' },
      { date: '2026-11-20', checkIn: '—',         checkOut: '—',         hours: '—',       status: 'Leave' },
      { date: '2026-11-21', checkIn: '09:10 AM', checkOut: '06:15 PM', hours: '9h 05m', status: 'Present' },
      { date: '2026-11-22', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
    ],
    tasks: [
      { id: 1, title: 'Submit November attendance summary', due: '2026-11-25', status: 'Pending' },
      { id: 2, title: 'Complete HR onboarding documentation', due: '2026-11-24', status: 'Completed' },
      { id: 3, title: 'Review Q4 performance appraisal form', due: '2026-11-30', status: 'Pending' },
      { id: 4, title: 'Update emergency contact details', due: '2026-11-23', status: 'Completed' },
    ],
    announcements: [
      { id: 1, title: 'Public Holiday – Nov 27', text: 'Office will remain closed on account of Guru Nanak Jayanti.' },
      { id: 2, title: 'Health Insurance Renewal', text: 'Please submit your insurance renewal forms by December 5.' },
      { id: 3, title: 'Year-End Party', text: 'Annual celebration on December 20 at the main conference hall.' },
    ],
  };
}

/* ─── Staff Dashboard ────────────────────────────────────────────────────── */
export default function BluecoreStaffDashboard() {
  const navigate = useNavigate();
  const session = getBluecoreSession();
  const [activeTab, setActiveTab] = useState('overview');

  const data = getStaffMockData(session);

  const handleLogout = () => {
    bluecoreLogout();
    navigate('/bluecore/login', { replace: true });
  };

  const navItems = [
    { label: 'Overview',    tab: 'overview',    icon: LayoutDashboard },
    { label: 'My Attendance', tab: 'attendance', icon: Calendar },
    { label: 'My Tasks',    tab: 'tasks',       icon: FileText },
    { label: 'Announcements', tab: 'announcements', icon: Bell },
    { label: 'My Profile',  tab: 'profile',     icon: User },
  ];

  const attendanceSummary = {
    present: data.attendance.filter((a) => a.status === 'Present').length,
    leave:   data.attendance.filter((a) => a.status === 'Leave').length,
    total:   data.attendance.length,
  };
  const pendingTasks = data.tasks.filter((t) => t.status === 'Pending').length;

  return (
    <div className="bc-dash-shell">
      {/* ── Sidebar ── */}
      <aside className="bc-sidebar">
        <div className="bc-sidebar-header">
          <div className="bc-sidebar-logo">
            <div className="bc-sidebar-logo-mark">
              <ShieldCheck size={18} color="#D6A12B" />
            </div>
            <div className="bc-sidebar-brand-text">
              <span className="bc-sidebar-brand-name">BLUE<span>CORE</span></span>
              <span className="bc-sidebar-brand-sub">Staff Portal</span>
            </div>
          </div>
          {session && (
            <div className="bc-sidebar-user-card">
              <div className="bc-user-avatar">{session.name?.charAt(0) || 'S'}</div>
              <div className="bc-user-meta">
                <div className="bc-user-name">{session.name}</div>
                <div className="bc-user-role-badge">
                  <span className="bc-role-dot" />
                  {session.role}
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="bc-sidebar-nav">
          <span className="bc-nav-group-label">My Workspace</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                className={`bc-nav-link${activeTab === item.tab ? ' active' : ''}`}
                onClick={() => setActiveTab(item.tab)}
              >
                <Icon size={17} className="bc-nav-icon" />
                <span className="bc-nav-link-label">{item.label}</span>
                {item.tab === 'tasks' && pendingTasks > 0 && (
                  <span className="bc-nav-link-badge">{pendingTasks}</span>
                )}
                {item.tab === 'announcements' && (
                  <span className="bc-nav-link-badge">{data.announcements.length}</span>
                )}
              </button>
            );
          })}
          <div className="bc-nav-divider" />
          <Link to="/" className="bc-nav-link">
            <Briefcase size={17} className="bc-nav-icon" />
            <span className="bc-nav-link-label">Visit Storefront</span>
          </Link>
        </nav>

        <div className="bc-sidebar-footer">
          <button className="bc-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="bc-dash-main">
        {/* Top bar */}
        <div className="bc-dash-topbar">
          <div className="bc-topbar-title-group">
            <span className="bc-topbar-title">My Workspace</span>
            <span className="bc-topbar-subtitle">
              {session?.department && `${session.department} · `}
              {session?.employeeId} · BLUECORE Staff Portal
            </span>
          </div>
          <div className="bc-topbar-actions">
            {session && (
              <div className="bc-topbar-user-chip">
                <div className="bc-chip-avatar">{session.name?.charAt(0)}</div>
                {session.name}
              </div>
            )}
          </div>
        </div>

        {/* Page canvas */}
        <div className="bc-dash-canvas">

          {/* ── OVERVIEW ─────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="bc-stats-grid">
                {[
                  { label: 'Days Present',  value: attendanceSummary.present, sub: `of ${attendanceSummary.total} working days`, icon: CheckCircle2, bg: 'bc-icon-bg-green' },
                  { label: 'Days on Leave', value: attendanceSummary.leave,   sub: 'approved & recorded',                       icon: Clock,         bg: 'bc-icon-bg-purple' },
                  { label: 'Pending Tasks', value: pendingTasks,              sub: `${data.tasks.length - pendingTasks} completed`, icon: FileText,  bg: 'bc-icon-bg-gold' },
                  { label: 'Announcements', value: data.announcements.length, sub: 'from HR & management',                       icon: Bell,          bg: 'bc-icon-bg-navy' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div className="bc-stat-card" key={s.label}>
                      <div className={`bc-stat-icon-wrap ${s.bg}`}><Icon size={22} /></div>
                      <div>
                        <div className="bc-stat-label">{s.label}</div>
                        <div className="bc-stat-value">{s.value}</div>
                        <div className="bc-stat-sub">{s.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Announcements preview */}
              <div className="bc-section-card">
                <div className="bc-section-header">
                  <div className="bc-section-title-group">
                    <span className="bc-section-title">Latest Announcements</span>
                    <span className="bc-section-sub">From HR & Management</span>
                  </div>
                  <button className="bc-section-action" onClick={() => setActiveTab('announcements')}>
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="bc-section-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.announcements.map((ann) => (
                    <div key={ann.id}
                      style={{
                        background: '#F4F6F9', borderRadius: '10px', padding: '14px 16px',
                        borderLeft: '3px solid #D6A12B',
                      }}
                    >
                      <strong style={{ fontSize: '0.9rem', color: '#062945', display: 'block', marginBottom: '4px' }}>{ann.title}</strong>
                      <span style={{ fontSize: '0.82rem', color: '#5F6B7A' }}>{ann.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks preview */}
              <div className="bc-section-card">
                <div className="bc-section-header">
                  <div className="bc-section-title-group">
                    <span className="bc-section-title">My Tasks</span>
                    <span className="bc-section-sub">{pendingTasks} pending</span>
                  </div>
                  <button className="bc-section-action" onClick={() => setActiveTab('tasks')}>
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="bc-table-wrap">
                  <table className="bc-table">
                    <thead>
                      <tr><th>Task</th><th>Due Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {data.tasks.slice(0, 3).map((t) => (
                        <tr key={t.id}>
                          <td>{t.title}</td>
                          <td style={{ fontSize: '0.82rem', color: '#8E99A8' }}>{t.due}</td>
                          <td>
                            <span className={`bc-pill ${t.status === 'Completed' ? 'bc-pill-approved' : 'bc-pill-pending'}`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── ATTENDANCE TAB ────────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <div className="bc-section-card">
              <div className="bc-section-header">
                <div className="bc-section-title-group">
                  <span className="bc-section-title">My Attendance</span>
                  <span className="bc-section-sub">Recent 5 working days</span>
                </div>
              </div>
              <div className="bc-table-wrap">
                <table className="bc-table">
                  <thead>
                    <tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {data.attendance.map((a, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{a.date}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.checkIn}</td>
                        <td style={{ fontFamily: 'monospace' }}>{a.checkOut}</td>
                        <td style={{ fontWeight: 600 }}>{a.hours}</td>
                        <td>
                          <span className={`bc-pill ${a.status === 'Present' ? 'bc-pill-active' : 'bc-pill-leave'}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TASKS TAB ─────────────────────────────────────────────── */}
          {activeTab === 'tasks' && (
            <div className="bc-section-card">
              <div className="bc-section-header">
                <div className="bc-section-title-group">
                  <span className="bc-section-title">My Tasks</span>
                  <span className="bc-section-sub">{pendingTasks} pending · {data.tasks.length - pendingTasks} completed</span>
                </div>
              </div>
              <div className="bc-table-wrap">
                <table className="bc-table">
                  <thead>
                    <tr><th>#</th><th>Task</th><th>Due Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {data.tasks.map((t) => (
                      <tr key={t.id}>
                        <td style={{ color: '#8E99A8', fontSize: '0.82rem' }}>{t.id}</td>
                        <td style={{ fontWeight: 500 }}>{t.title}</td>
                        <td style={{ color: '#8E99A8', fontSize: '0.82rem' }}>{t.due}</td>
                        <td>
                          <span className={`bc-pill ${t.status === 'Completed' ? 'bc-pill-approved' : 'bc-pill-pending'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS TAB ─────────────────────────────────────── */}
          {activeTab === 'announcements' && (
            <div className="bc-section-card">
              <div className="bc-section-header">
                <div className="bc-section-title-group">
                  <span className="bc-section-title">Announcements</span>
                  <span className="bc-section-sub">From HR & Management Team</span>
                </div>
              </div>
              <div className="bc-section-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.announcements.map((ann) => (
                  <div key={ann.id}
                    style={{
                      background: '#FBF4E2', border: '1px solid rgba(214,161,43,0.25)',
                      borderRadius: '12px', padding: '18px 20px', borderLeft: '4px solid #D6A12B',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Bell size={16} color="#D6A12B" />
                      <strong style={{ fontSize: '0.95rem', color: '#062945' }}>{ann.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#5F6B7A', lineHeight: 1.6, margin: 0 }}>{ann.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROFILE TAB ───────────────────────────────────────────── */}
          {activeTab === 'profile' && session && (
            <>
              <div className="bc-profile-hero">
                <div className="bc-profile-avatar-lg">{session.name?.charAt(0)}</div>
                <div>
                  <div className="bc-profile-name">{session.name}</div>
                  <div className="bc-profile-id">{session.employeeId} · {session.department}</div>
                  <span className="bc-pill bc-pill-active" style={{ marginTop: '8px' }}>Active Employee</span>
                </div>
              </div>

              <div className="bc-section-card">
                <div className="bc-section-header">
                  <div className="bc-section-title-group">
                    <span className="bc-section-title">My Details</span>
                  </div>
                </div>
                <div className="bc-section-body">
                  <div className="bc-info-grid">
                    {[
                      { label: 'Full Name',    value: session.name },
                      { label: 'Employee ID',  value: session.employeeId },
                      { label: 'Work Email',   value: session.email },
                      { label: 'Phone',        value: session.phone || '—' },
                      { label: 'Department',   value: session.department || '—' },
                      { label: 'Role',         value: session.role },
                      { label: 'Joined On',    value: session.joinedAt },
                      { label: 'Last Login',   value: new Date(session.authenticatedAt).toLocaleString('en-IN') },
                    ].map((item) => (
                      <div className="bc-info-item" key={item.label}>
                        <span className="bc-info-label">{item.label}</span>
                        <span className="bc-info-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
