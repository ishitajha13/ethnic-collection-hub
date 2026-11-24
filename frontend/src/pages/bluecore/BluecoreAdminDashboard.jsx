import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, Calendar, FileText,
  TrendingUp, Settings, LogOut, Bell, ShieldCheck,
  Briefcase, Clock, CheckCircle2, AlertCircle, X, Plus
} from 'lucide-react';
import {
  getBluecoreSession,
  bluecoreLogout,
  bluecoreGetAllEmployees,
  bluecoreCreateEmployee,
  BC_ROLES,
} from '../../services/bluecoreAuthService';
import './BlueCoreDashboard.css';

/* ─── Shared sidebar nav ─────────────────────────────────────────────────── */
const ADMIN_NAV = [
  { label: 'Dashboard', path: '/bluecore/admin', icon: LayoutDashboard },
  { label: 'All Employees', path: '/bluecore/admin', icon: Users, tab: 'employees' },
  { label: 'Add Employee', path: '/bluecore/admin', icon: UserPlus, tab: 'add' },
  { label: 'Attendance', path: '/bluecore/admin', icon: Calendar, tab: 'attendance' },
  { label: 'Reports', path: '/bluecore/admin', icon: TrendingUp, tab: 'reports' },
];

/* ─── Add Employee Modal ─────────────────────────────────────────────────── */
function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: BC_ROLES.STAFF, department: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', password: '', role: BC_ROLES.STAFF, department: '', phone: '' });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Name, email and password are required.');
      return;
    }
    setIsLoading(true);
    try {
      const emp = bluecoreCreateEmployee(form);
      onSuccess(emp);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldStyle = {
    width: '100%', height: '42px', padding: '8px 12px',
    border: '1.5px solid #E8ECF0', borderRadius: '8px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    color: '#062945', marginBottom: '5px',
  };

  return (
    <div className="bc-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bc-modal-card" style={{ maxWidth: '480px' }}>
        <button className="bc-modal-close" onClick={onClose}><X size={18} /></button>
        <div className="bc-modal-icon-wrap"><UserPlus size={24} /></div>
        <h2 className="bc-modal-heading">Add New Employee</h2>
        <p className="bc-modal-subtext">Create an employee account. They can log in immediately.</p>

        {error && (
          <div className="bc-alert bc-alert-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={16} className="bc-alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input style={fieldStyle} value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Employee full name" required />
          </div>
          <div>
            <label style={labelStyle}>Work Email *</label>
            <input style={fieldStyle} type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="name@bluecore.com" required />
          </div>
          <div>
            <label style={labelStyle}>Temporary Password *</label>
            <input style={fieldStyle} type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select style={{ ...fieldStyle, cursor: 'pointer' }} value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                <option value={BC_ROLES.STAFF}>Staff</option>
                <option value={BC_ROLES.ADMIN}>Admin</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <input style={fieldStyle} value={form.department} onChange={(e) => handleChange('department', e.target.value)} placeholder="e.g. Operations" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Phone (optional)</label>
            <input style={fieldStyle} value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 9XXXXXXXXX" />
          </div>
          <button
            type="submit"
            className="bc-modal-submit-btn"
            disabled={isLoading}
            style={{ marginTop: '4px' }}
          >
            {isLoading ? <><span className="bc-spinner" /> Creating…</> : <><Plus size={16} /> Create Employee Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ────────────────────────────────────────────────────── */
export default function BluecoreAdminDashboard() {
  const navigate = useNavigate();
  const session = getBluecoreSession();
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try { setEmployees(bluecoreGetAllEmployees()); } catch {}
  }, []);

  const refreshEmployees = () => {
    try { setEmployees(bluecoreGetAllEmployees()); } catch {}
  };

  const handleLogout = () => {
    bluecoreLogout();
    navigate('/bluecore/login', { replace: true });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleEmployeeAdded = (emp) => {
    refreshEmployees();
    showToast(`Employee "${emp.name}" (${emp.employeeId}) created successfully.`);
  };

  const totalStaff   = employees.filter((e) => e.role === BC_ROLES.STAFF).length;
  const totalAdmins  = employees.filter((e) => e.role === BC_ROLES.ADMIN).length;
  const depts        = [...new Set(employees.map((e) => e.department).filter(Boolean))];

  const navItems = [
    { label: 'Overview',       tab: 'overview',   icon: LayoutDashboard },
    { label: 'All Employees',  tab: 'employees',  icon: Users },
    { label: 'Attendance',     tab: 'attendance', icon: Calendar },
    { label: 'Reports',        tab: 'reports',    icon: TrendingUp },
  ];

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
              <span className="bc-sidebar-brand-sub">Management System</span>
            </div>
          </div>
          {session && (
            <div className="bc-sidebar-user-card">
              <div className="bc-user-avatar">
                {session.name?.charAt(0) || 'A'}
              </div>
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
          <span className="bc-nav-group-label">Main Navigation</span>
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
                {item.tab === 'employees' && (
                  <span className="bc-nav-link-badge">{employees.length}</span>
                )}
              </button>
            );
          })}

          <div className="bc-nav-divider" />
          <span className="bc-nav-group-label">Actions</span>
          <button className="bc-nav-link" onClick={() => setAddModalOpen(true)}>
            <UserPlus size={17} className="bc-nav-icon" />
            <span className="bc-nav-link-label">Add Employee</span>
          </button>
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
            <span className="bc-topbar-title">Admin Command Centre</span>
            <span className="bc-topbar-subtitle">
              BLUECORE · Employer & Staff Management
            </span>
          </div>
          <div className="bc-topbar-actions">
            <button
              className="bc-section-action"
              onClick={() => setAddModalOpen(true)}
              style={{ background: '#062945', color: '#fff', border: 'none' }}
            >
              <Plus size={15} /> Add Employee
            </button>
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

          {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="bc-stats-grid">
                {[
                  { label: 'Total Employees', value: employees.length, sub: `${totalAdmins} Admin · ${totalStaff} Staff`, icon: Users, bg: 'bc-icon-bg-navy' },
                  { label: 'Departments', value: depts.length, sub: depts.slice(0, 2).join(', ') || 'N/A', icon: Briefcase, bg: 'bc-icon-bg-gold' },
                  { label: 'Active Today', value: Math.ceil(employees.length * 0.85), sub: 'Est. based on roster', icon: CheckCircle2, bg: 'bc-icon-bg-green' },
                  { label: 'On Leave', value: Math.floor(employees.length * 0.1), sub: 'Approved & pending', icon: Clock, bg: 'bc-icon-bg-purple' },
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

              {/* Quick actions */}
              <div className="bc-section-card">
                <div className="bc-section-header">
                  <div className="bc-section-title-group">
                    <span className="bc-section-title">Quick Actions</span>
                    <span className="bc-section-sub">Common administrative tasks</span>
                  </div>
                </div>
                <div className="bc-section-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {[
                    { label: 'Add Employee', action: () => setAddModalOpen(true), primary: true },
                    { label: 'View All Employees', action: () => setActiveTab('employees') },
                    { label: 'Attendance Report', action: () => setActiveTab('attendance') },
                    { label: 'Generate Reports', action: () => setActiveTab('reports') },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      className={`bc-action-btn ${btn.primary ? 'bc-action-btn-primary' : 'bc-action-btn-ghost'}`}
                      style={{ padding: '10px 20px', fontSize: '0.875rem' }}
                      onClick={btn.action}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent employees */}
              <div className="bc-section-card">
                <div className="bc-section-header">
                  <div className="bc-section-title-group">
                    <span className="bc-section-title">Recent Employees</span>
                    <span className="bc-section-sub">Latest accounts in the system</span>
                  </div>
                  <button className="bc-section-action" onClick={() => setActiveTab('employees')}>
                    View All
                  </button>
                </div>
                <div className="bc-table-wrap">
                  <table className="bc-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.slice(0, 5).map((emp) => (
                        <tr key={emp.id}>
                          <td><code style={{ fontSize: '0.78rem', background: '#F4F6F9', padding: '2px 6px', borderRadius: '4px' }}>{emp.employeeId}</code></td>
                          <td><strong>{emp.name}</strong><div style={{ fontSize: '0.75rem', color: '#8E99A8' }}>{emp.email}</div></td>
                          <td>{emp.department || '—'}</td>
                          <td>
                            <span className={`bc-pill ${emp.role === BC_ROLES.ADMIN ? 'bc-pill-admin' : 'bc-pill-staff'}`}>
                              {emp.role}
                            </span>
                          </td>
                          <td style={{ color: '#8E99A8', fontSize: '0.82rem' }}>{emp.joinedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── EMPLOYEES TAB ─────────────────────────────────────────── */}
          {activeTab === 'employees' && (
            <div className="bc-section-card">
              <div className="bc-section-header">
                <div className="bc-section-title-group">
                  <span className="bc-section-title">Employee Directory</span>
                  <span className="bc-section-sub">{employees.length} accounts registered</span>
                </div>
                <button
                  className="bc-section-action"
                  style={{ background: '#062945', color: '#fff', border: 'none' }}
                  onClick={() => setAddModalOpen(true)}
                >
                  <Plus size={14} /> Add Employee
                </button>
              </div>
              <div className="bc-table-wrap">
                <table className="bc-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name & Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td><code style={{ fontSize: '0.78rem', background: '#F4F6F9', padding: '2px 6px', borderRadius: '4px' }}>{emp.employeeId}</code></td>
                        <td>
                          <strong style={{ display: 'block' }}>{emp.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#8E99A8' }}>{emp.email}</span>
                        </td>
                        <td>{emp.department || '—'}</td>
                        <td>
                          <span className={`bc-pill ${emp.role === BC_ROLES.ADMIN ? 'bc-pill-admin' : 'bc-pill-staff'}`}>
                            {emp.role}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#5F6B7A' }}>{emp.phone || '—'}</td>
                        <td style={{ color: '#8E99A8', fontSize: '0.82rem' }}>{emp.joinedAt}</td>
                        <td><span className="bc-pill bc-pill-active">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ATTENDANCE TAB ────────────────────────────────────────── */}
          {activeTab === 'attendance' && (
            <div className="bc-section-card">
              <div className="bc-section-header">
                <div className="bc-section-title-group">
                  <span className="bc-section-title">Attendance Overview</span>
                  <span className="bc-section-sub">Today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="bc-table-wrap">
                <table className="bc-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, i) => {
                      const statuses = ['Present', 'Present', 'Present', 'On Leave', 'Present'];
                      const st = statuses[i % statuses.length];
                      const checkIn  = st === 'Present' ? `0${8 + (i % 2)}:${i % 2 === 0 ? '00' : '30'} AM` : '—';
                      const checkOut = st === 'Present' ? `0${5 + (i % 2)}:${i % 2 === 0 ? '30' : '00'} PM` : '—';
                      const hours    = st === 'Present' ? `${7 + (i % 2)}h ${i % 2 === 0 ? '30' : '00'}m` : '—';
                      return (
                        <tr key={emp.id}>
                          <td><strong>{emp.name}</strong></td>
                          <td>{emp.department || '—'}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{checkIn}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{checkOut}</td>
                          <td style={{ fontWeight: 600 }}>{hours}</td>
                          <td>
                            <span className={`bc-pill ${st === 'Present' ? 'bc-pill-active' : 'bc-pill-leave'}`}>{st}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REPORTS TAB ───────────────────────────────────────────── */}
          {activeTab === 'reports' && (
            <div className="bc-section-card">
              <div className="bc-section-header">
                <div className="bc-section-title-group">
                  <span className="bc-section-title">Workforce Reports</span>
                  <span className="bc-section-sub">Summary analytics for November 2026</span>
                </div>
              </div>
              <div className="bc-section-body">
                <div className="bc-info-grid" style={{ marginBottom: '24px' }}>
                  {[
                    { label: 'Total Headcount',     value: employees.length },
                    { label: 'Staff',               value: totalStaff },
                    { label: 'Admins',              value: totalAdmins },
                    { label: 'Departments',         value: depts.length },
                    { label: 'Avg Attendance %',    value: '87%' },
                    { label: 'Leaves This Month',   value: Math.floor(employees.length * 0.15) },
                  ].map((r) => (
                    <div className="bc-info-item" key={r.label}
                      style={{ background: '#F4F6F9', borderRadius: '10px', padding: '16px 18px' }}>
                      <span className="bc-info-label">{r.label}</span>
                      <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#062945' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#FBF4E2', border: '1px solid rgba(214,161,43,0.3)', borderRadius: '10px', padding: '16px 18px', fontSize: '0.875rem', color: '#A57816' }}>
                  <strong>Note:</strong> Export functionality (PDF / Excel) would connect to backend reporting APIs in production. This is a demo view.
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleEmployeeAdded}
      />

      {/* Toast */}
      {toast && (
        <div className="bc-toast">
          <CheckCircle2 size={18} color="#D6A12B" />
          {toast}
        </div>
      )}
    </div>
  );
}
