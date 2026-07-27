import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaDna, FaMicroscope, FaChartLine, FaHistory, FaUserCog, 
  FaSignOutAlt, FaFileUpload, FaHeartbeat, FaBrain, FaBell,
  FaDownload, FaExclamationTriangle,
  FaCheckCircle, FaChartPie, FaChartBar, FaClipboardList,
  FaCog, FaUser, FaHome, FaClock, FaArrowRight, FaShieldAlt
} from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

// ====== BACKEND URL - CHANGE THIS IF YOUR RENDER URL CHANGES ======
const API = axios.create({
    baseURL: 'https://genome-backend.onrender.com/api',
    withCredentials: true
});
// ====================================================================

function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('welcome');
    const [result, setResult] = useState(null);
    const reportRef = useRef();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await API.get('/auth/check');
            if (res.data.authenticated) {
                setUser(res.data.user);
                setPage('dashboard');
            }
        } catch (error) {
            setPage('welcome');
        }
    };

    const DnaBackground = () => (
        <div className="dna-bg">
            <div className="dna-helix">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="dna-strand" style={{ left: `${8 + i * 14}%` }}>
                        {[...Array(8)].map((_, j) => (
                            <div key={j} className="dna-node" style={{ top: `${j * 14}%`, animationDelay: `${j * 0.5}s` }} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    const Sidebar = ({ currentPage, setPage }) => {
        const menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
            { id: 'analysis', label: 'DNA Upload', icon: <FaFileUpload /> },
            { id: 'results', label: 'Results', icon: <FaMicroscope /> },
            { id: 'history', label: 'History', icon: <FaHistory /> },
            { id: 'profile', label: 'Profile', icon: <FaUser /> },
        ];

        return (
            <div className="sidebar">
                <div className="logo"><FaDna /> <span>Helix</span>Counsel</div>
                <ul className="sidebar-menu">
                    {menuItems.map(item => (
                        <li key={item.id} className={currentPage === item.id ? 'active' : ''} onClick={() => setPage(item.id)}>
                            <span className="icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </li>
                    ))}
                    <li onClick={() => { setPage('welcome'); toast.success('Logged out'); }} style={{ marginTop: '30px', borderTop: '1px solid #F0F2F5', paddingTop: '16px' }}>
                        <span className="icon"><FaSignOutAlt /></span>
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
        );
    };

    const Welcome = () => {
        return (
            <div className="landing-page">
                <DnaBackground />
                <nav className="landing-nav">
                    <div className="logo"><FaDna /> <span>Helix</span>Counsel</div>
                    <div className="nav-links">
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('welcome'); }}>Home</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('about'); }}>About</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); }}>Features</a>
                        <button className="nav-btn" onClick={() => setPage('login')}>Get Started</button>
                    </div>
                </nav>
                <div className="landing-hero">
                    <div className="hero-content">
                        <div className="badge">AI-Powered Genomics</div>
                        <h1>Intelligent <span>Genome</span> Analysis for <span>Better</span> Health</h1>
                        <p>Advanced artificial intelligence for early detection and prediction of hereditary diseases through comprehensive DNA analysis.</p>
                        <div className="hero-btns">
                            <button className="auth-btn" onClick={() => setPage('login')} style={{ width: 'auto', padding: '14px 40px' }}>
                                Get Started <FaArrowRight style={{ marginLeft: '10px' }} />
                            </button>
                            <button className="btn-secondary" onClick={() => setPage('about')}>Learn More</button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div style={{ fontSize: '200px', color: '#6C5CE7', opacity: 0.08 }}><FaDna /></div>
                    </div>
                </div>
                <div className="landing-features">
                    <h2>Why <span style={{ color: '#6C5CE7' }}>Helix Counsel</span></h2>
                    <p className="subtitle">Advanced genetic analysis powered by artificial intelligence</p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="icon"><FaDna /></div>
                            <h3>DNA Analysis</h3>
                            <p>Advanced genomic sequencing and analysis using state-of-the-art AI algorithms.</p>
                        </div>
                        <div className="feature-card">
                            <div className="icon"><FaBrain /></div>
                            <h3>AI Predictions</h3>
                            <p>Machine learning models trained on extensive genetic datasets for accurate risk assessment.</p>
                        </div>
                        <div className="feature-card">
                            <div className="icon"><FaShieldAlt /></div>
                            <h3>Secure & Private</h3>
                            <p>Your genetic data is encrypted and stored with the highest security standards.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const About = () => {
        return (
            <div className="auth-page">
                <DnaBackground />
                <div style={{ background: '#FFFFFF', padding: '48px 40px', borderRadius: '16px', maxWidth: '700px', width: '100%', border: '1px solid #F0F2F5' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px' }}>About <span style={{ color: '#6C5CE7' }}>Helix Counsel</span></h1>
                    <p style={{ color: '#6B7280', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
                        Helix Counsel is an AI-powered genomic analysis platform designed to predict hereditary disease risks through advanced DNA analysis.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '16px', background: '#F8F9FC', borderRadius: '10px' }}>
                            <h4 style={{ fontWeight: '600', color: '#1A1A2E' }}>Advanced AI Models</h4>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>Random Forest algorithms trained on extensive genomic datasets.</p>
                        </div>
                        <div style={{ padding: '16px', background: '#F8F9FC', borderRadius: '10px' }}>
                            <h4 style={{ fontWeight: '600', color: '#1A1A2E' }}>Secure & Confidential</h4>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>End-to-end encryption and compliance with healthcare privacy standards.</p>
                        </div>
                        <div style={{ padding: '16px', background: '#F8F9FC', borderRadius: '10px' }}>
                            <h4 style={{ fontWeight: '600', color: '#1A1A2E' }}>Comprehensive Reports</h4>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>Detailed medical and general reports with visual risk analysis.</p>
                        </div>
                    </div>
                    <button className="auth-btn" onClick={() => setPage('login')} style={{ marginTop: '24px' }}>Get Started</button>
                    <p style={{ textAlign: 'center', marginTop: '16px', color: '#6B7280', fontSize: '14px', cursor: 'pointer' }} onClick={() => setPage('welcome')}>Back to Home</p>
                </div>
            </div>
        );
    };

    const Login = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        const handleLogin = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await API.post('/auth/login', { email, password });
                if (res.data.message === 'Login successful') {
                    setUser(res.data.user);
                    setPage('dashboard');
                    toast.success('Welcome back!');
                }
            } catch (err) {
                setError('Invalid email or password');
                toast.error('Login failed');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="auth-page">
                <DnaBackground />
                <div className="auth-card">
                    <div className="logo"><FaDna /> <span>Helix</span>Counsel</div>
                    <p className="subtitle">Sign in to your account</p>
                    {error && <p style={{ color: '#EF4444', textAlign: 'center', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="footer-text">Don't have an account? <span onClick={() => setPage('register')}>Create Account</span></p>
                </div>
            </div>
        );
    };

    const Register = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');

        const handleRegister = async () => {
            setLoading(true);
            setError('');
            setSuccess('');
            try {
                await API.post('/auth/register', { name, email, password });
                setSuccess('Account created! Please login.');
                toast.success('Registration successful!');
                setTimeout(() => setPage('login'), 2000);
            } catch (err) {
                setError(err.response?.data?.error || 'Registration failed');
                toast.error('Registration failed');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="auth-page">
                <DnaBackground />
                <div className="auth-card">
                    <div className="logo"><FaDna /> <span>Helix</span>Counsel</div>
                    <p className="subtitle">Create your account</p>
                    {error && <p style={{ color: '#EF4444', textAlign: 'center', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
                    {success && <p style={{ color: '#10B981', textAlign: 'center', marginBottom: '12px', fontSize: '14px' }}>{success}</p>}
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button className="auth-btn" onClick={handleRegister} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <p className="footer-text">Already have an account? <span onClick={() => setPage('login')}>Sign In</span></p>
                </div>
            </div>
        );
    };

    const Dashboard = () => {
        const [history, setHistory] = useState([]);
        const [stats, setStats] = useState({ total: 0, highRisk: 0, healthScore: 0 });

        useEffect(() => {
            fetchHistory();
        }, []);

        const fetchHistory = async () => {
            try {
                const res = await API.get('/analysis/history');
                setHistory(res.data.history);
                const highRisk = res.data.history.filter(h => {
                    const risks = Object.values(h.diseases || {});
                    return risks.some(r => r > 0.5);
                }).length;
                setStats({
                    total: res.data.history.length,
                    highRisk: highRisk,
                    healthScore: res.data.history.length > 0 ? Math.round(100 - (highRisk / res.data.history.length) * 30) : 0
                });
            } catch (error) {}
        };

        const diseases = history.length > 0 ? history[0].diseases || {} : {};
        const chartData = {
            labels: Object.keys(diseases).slice(0, 6),
            datasets: [{
                label: 'Risk Percentage (%)',
                data: Object.values(diseases).slice(0, 6).map(v => (v * 100).toFixed(1)),
                backgroundColor: ['#6C5CE7', '#A29BFE', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
                borderRadius: 6,
            }]
        };

        const pieData = {
            labels: ['Low Risk', 'Moderate', 'High Risk'],
            datasets: [{
                data: [
                    Object.values(diseases).filter(v => v < 0.25).length,
                    Object.values(diseases).filter(v => v >= 0.25 && v <= 0.5).length,
                    Object.values(diseases).filter(v => v > 0.5).length
                ],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        const chartOptions = {
            responsive: true,
            plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } } },
            scales: { y: { beginAtZero: true, max: 100, grid: { color: '#F0F2F5' } } }
        };

        return (
            <div className="dashboard">
                <Sidebar currentPage="dashboard" setPage={setPage} />
                <div className="main-content">
                    <div className="top-nav">
                        <h2>Dashboard <span>/ Overview</span></h2>
                        <div className="user-section">
                            <FaBell style={{ fontSize: '18px', color: '#6B7280', cursor: 'pointer' }} />
                            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                            <button className="logout-btn" onClick={() => { setPage('welcome'); toast.success('Logged out'); }}><FaSignOutAlt /> Logout</button>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon"><FaDna /></div>
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Total Analyses</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaExclamationTriangle /></div>
                            <div className="stat-number" style={{ color: '#EF4444' }}>{stats.highRisk}</div>
                            <div className="stat-label">High Risk</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaHeartbeat /></div>
                            <div className="stat-number" style={{ color: '#10B981' }}>{stats.healthScore}%</div>
                            <div className="stat-label">Health Score</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaChartBar /></div>
                            <div className="stat-number">{history.length}</div>
                            <div className="stat-label">Reports</div>
                        </div>
                    </div>

                    {history.length > 0 && Object.keys(diseases).length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            <div className="card">
                                <div className="card-title"><FaChartBar /> Disease Risk Distribution</div>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                            <div className="card">
                                <div className="card-title"><FaChartPie /> Risk Categories</div>
                                <div style={{ maxWidth: '220px', margin: '0 auto' }}><Pie data={pieData} /></div>
                            </div>
                        </div>
                    )}

                    <div className="card" style={{ textAlign: 'center' }}>
                        <button className="btn-primary" onClick={() => setPage('analysis')}><FaDna /> Start New Analysis</button>
                    </div>

                    {history.length > 0 && (
                        <div className="card">
                            <div className="card-title"><FaHistory /> Recent Analyses</div>
                            {history.slice(0, 5).map(item => (
                                <div key={item.id} className="history-item">
                                    <span className="date"><FaClock /> {item.date}</span>
                                    <span className="count">{item.offspring_count} Offspring</span>
                                    <span className="status"><FaCheckCircle /> Completed</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const Analysis = () => {
        const [fatherName, setFatherName] = useState('');
        const [motherName, setMotherName] = useState('');
        const [offspringCount, setOffspringCount] = useState(50);
        const [loading, setLoading] = useState(false);
        const [fatherFile, setFatherFile] = useState(null);
        const [motherFile, setMotherFile] = useState(null);
        const [csvData, setCsvData] = useState(null);

        const handleFileUpload = async (e, type) => {
            const file = e.target.files[0];
            if (!file) return;
            const fileType = file.name.split('.').pop().toLowerCase();
            if (fileType !== 'pdf' && fileType !== 'csv') {
                toast.error('Please upload PDF or CSV files only');
                return;
            }
            const formData = new FormData();
            formData.append(`${type}_file`, file);
            try {
                await API.post('/analysis/upload', formData);
                if (type === 'father') setFatherFile(file);
                else setMotherFile(file);
                if (fileType === 'csv') {
                    Papa.parse(file, { complete: (result) => { setCsvData(result.data); toast.success(`CSV loaded: ${result.data.length} rows`); }, header: true });
                }
                toast.success(`${type} file uploaded: ${file.name}`);
            } catch (error) {
                toast.error('Upload failed');
            }
        };

        const handleAnalysis = async () => {
            if (!fatherName || !motherName) {
                toast.error('Please enter parent names');
                return;
            }
            setLoading(true);
            try {
                const res = await API.post('/analysis/mix', {
                    father_name: fatherName,
                    mother_name: motherName,
                    offspring_count: offspringCount,
                    csv_data: csvData
                });
                setResult(res.data);
                setPage('results');
                toast.success('Analysis complete!');
            } catch (error) {
                toast.error('Analysis failed');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="dashboard">
                <Sidebar currentPage="analysis" setPage={setPage} />
                <div className="main-content">
                    <div className="top-nav">
                        <h2>DNA Upload <span>/ Maternal & Paternal</span></h2>
                        <div className="user-section"><div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div></div>
                    </div>

                    <div className="card">
                        <div className="card-title"><FaDna /> Maternal Genome</div>
                        <div className="file-upload-area">
                            <p style={{ fontWeight: '500', color: '#1A1A2E', marginBottom: '4px' }}>Upload mother's genetic sequence</p>
                            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>PDF or CSV files only</p>
                            <input type="file" id="mother-file" accept=".pdf,.csv" onChange={e => handleFileUpload(e, 'mother')} />
                            <button className="btn-secondary" onClick={() => document.getElementById('mother-file').click()}>Choose File</button>
                            {motherFile && <p style={{ color: '#10B981', marginTop: '10px' }}>✓ {motherFile.name}</p>}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title"><FaDna style={{ color: '#6C5CE7' }} /> Paternal Genome</div>
                        <div className="file-upload-area">
                            <p style={{ fontWeight: '500', color: '#1A1A2E', marginBottom: '4px' }}>Upload father's genetic sequence</p>
                            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>PDF or CSV files only</p>
                            <input type="file" id="father-file" accept=".pdf,.csv" onChange={e => handleFileUpload(e, 'father')} />
                            <button className="btn-secondary" onClick={() => document.getElementById('father-file').click()}>Choose File</button>
                            {fatherFile && <p style={{ color: '#10B981', marginTop: '10px' }}>✓ {fatherFile.name}</p>}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title"><FaUser /> Parent Names</div>
                        <div className="input-group"><label>Mother's Name</label><input placeholder="e.g., Sarah" value={motherName} onChange={e => setMotherName(e.target.value)} /></div>
                        <div className="input-group"><label>Father's Name</label><input placeholder="e.g., Michael" value={fatherName} onChange={e => setFatherName(e.target.value)} /></div>
                    </div>

                    <div className="card">
                        <div className="card-title"><FaDna /> Simulation Scale</div>
                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>Select number of hypothetical offspring genotypes for Random Forest prediction.</p>
                        <div className="slider-container">
                            <label style={{ fontWeight: '500' }}>Samples: <strong>{offspringCount}</strong></label>
                            <input type="range" min="30" max="100" value={offspringCount} onChange={e => setOffspringCount(parseInt(e.target.value))} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}><span>30</span><span>100</span></div>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={handleAnalysis} disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Analyzing...' : <><FaMicroscope /> Start Analysis</>}
                    </button>
                </div>
            </div>
        );
    };

    const Results = () => {
        const downloadPDF = () => {
            const element = reportRef.current;
            const opt = {
                margin: 10,
                filename: 'Helix_Counsel_Report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
            toast.success('PDF downloaded!');
        };

        if (!result) {
            return (
                <div className="auth-page">
                    <DnaBackground />
                    <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '500px', border: '1px solid #F0F2F5' }}>
                        <h2 style={{ fontWeight: '400', color: '#6B7280' }}>No results found</h2>
                        <button className="btn-primary" onClick={() => setPage('analysis')} style={{ marginTop: '20px' }}><FaDna /> Start Analysis</button>
                    </div>
                </div>
            );
        }

        const diseases = result.diseases || {};
        const chartData = {
            labels: Object.keys(diseases),
            datasets: [{
                label: 'Risk Percentage (%)',
                data: Object.values(diseases).map(v => (v * 100).toFixed(1)),
                backgroundColor: ['#6C5CE7', '#A29BFE', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'],
                borderRadius: 6,
            }]
        };

        const pieData = {
            labels: ['Low Risk', 'Moderate', 'High Risk'],
            datasets: [{
                data: [
                    Object.values(diseases).filter(v => v < 0.25).length,
                    Object.values(diseases).filter(v => v >= 0.25 && v <= 0.5).length,
                    Object.values(diseases).filter(v => v > 0.5).length
                ],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        return (
            <div className="dashboard">
                <Sidebar currentPage="results" setPage={setPage} />
                <div className="main-content">
                    <div className="top-nav">
                        <h2>Analysis Results <span>/ Clinical Report</span></h2>
                        <div className="user-section">
                            <button className="btn-success" onClick={downloadPDF}><FaDownload /> Download PDF</button>
                            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                        </div>
                    </div>

                    <div ref={reportRef} style={{ background: '#FFFFFF', padding: '30px', borderRadius: '16px', border: '1px solid #F0F2F5' }}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A2E' }}>Helix Counsel</h1>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>Clinical Genomic Analysis Report</p>
                            <p style={{ color: '#6B7280', fontSize: '13px' }}>Generated on: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            <div className="stat-card">
                                <div className="stat-number" style={{ color: '#6C5CE7' }}>{Object.keys(diseases).length}</div>
                                <div className="stat-label">Genes Analyzed</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number" style={{ color: '#EF4444' }}>{Object.values(diseases).filter(v => v > 0.5).length}</div>
                                <div className="stat-label">High Risk</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number" style={{ color: '#F59E0B' }}>{Object.values(diseases).filter(v => v >= 0.25 && v <= 0.5).length}</div>
                                <div className="stat-label">Moderate Risk</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number" style={{ color: '#10B981' }}>{Object.values(diseases).filter(v => v < 0.25).length}</div>
                                <div className="stat-label">Low Risk</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title" style={{ color: '#1A1A2E', fontWeight: '700', fontSize: '18px' }}>MEDICAL REPORT</div>
                            <div style={{ 
                                background: '#FFFFFF', 
                                padding: '24px', 
                                borderRadius: '12px', 
                                whiteSpace: 'pre-wrap', 
                                fontSize: '14px', 
                                lineHeight: '1.8', 
                                color: '#1A1A2E', 
                                fontFamily: 'Inter, sans-serif',
                                border: '1px solid #E5E7EB'
                            }}>
                                {result.medical_report}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title" style={{ color: '#1A1A2E', fontWeight: '700', fontSize: '18px' }}>GENERAL REPORT</div>
                            <div style={{ 
                                background: '#FFFFFF', 
                                padding: '24px', 
                                borderRadius: '12px', 
                                whiteSpace: 'pre-wrap', 
                                fontSize: '14px', 
                                lineHeight: '1.8', 
                                color: '#1A1A2E', 
                                fontFamily: 'Inter, sans-serif',
                                border: '1px solid #E5E7EB'
                            }}>
                                {result.general_report}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="card">
                                <div className="card-title"><FaChartBar /> Disease Risk Chart</div>
                                <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                            </div>
                            <div className="card">
                                <div className="card-title"><FaChartPie /> Risk Distribution</div>
                                <div style={{ maxWidth: '250px', margin: '0 auto' }}>
                                    <Pie data={pieData} />
                                </div>
                            </div>
                        </div>

                        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F0F2F5' }}>
                            DISCLAIMER: This report is generated for educational/research purposes only. It does not constitute medical advice.
                        </p>
                    </div>

                    <button className="btn-primary" onClick={() => setPage('dashboard')} style={{ width: '100%', marginTop: '20px' }}><FaHome /> Back to Dashboard</button>
                </div>
            </div>
        );
    };

    const History = () => {
        const [history, setHistory] = useState([]);

        useEffect(() => {
            fetchHistory();
        }, []);

        const fetchHistory = async () => {
            try {
                const res = await API.get('/analysis/history');
                setHistory(res.data.history);
            } catch (error) {
                toast.error('Failed to load history');
            }
        };

        const clearHistory = async () => {
            try {
                await API.post('/analysis/clear-history');
                fetchHistory();
                toast.success('History cleared');
            } catch (error) {
                toast.error('Failed to clear history');
            }
        };

        return (
            <div className="dashboard">
                <Sidebar currentPage="history" setPage={setPage} />
                <div className="main-content">
                    <div className="top-nav">
                        <h2>History <span>/ All Records</span></h2>
                        <div className="user-section"><div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div></div>
                    </div>

                    <div className="card">
                        <div className="card-title"><FaClipboardList /> Counseling Reports</div>
                        {history.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px 0' }}>No history found. Start your first analysis.</p>
                        ) : (
                            <>
                                {history.map(item => (
                                    <div key={item.id} className="history-item">
                                        <span className="date"><FaClock /> {item.date}</span>
                                        <span className="count">{item.offspring_count} Offspring</span>
                                        <span className="status"><FaCheckCircle /> Completed</span>
                                    </div>
                                ))}
                                <button className="btn-danger" onClick={clearHistory} style={{ marginTop: '16px' }}>Clear History</button>
                            </>
                        )}
                    </div>

                    <button className="btn-primary" onClick={() => setPage('analysis')} style={{ width: '100%' }}><FaDna /> New Analysis</button>
                </div>
            </div>
        );
    };

    const Profile = () => {
        return (
            <div className="dashboard">
                <Sidebar currentPage="profile" setPage={setPage} />
                <div className="main-content">
                    <div className="top-nav">
                        <h2>Profile <span>/ Account</span></h2>
                        <div className="user-section"><div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div></div>
                    </div>

                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px', margin: '0 auto', borderRadius: '50%' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1A1A2E', marginTop: '12px' }}>{user?.name}</h2>
                            <p style={{ color: '#6B7280' }}>{user?.email}</p>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
                                <div style={{ padding: '12px 20px', background: '#F8F9FC', borderRadius: '10px' }}>
                                    <p style={{ fontSize: '12px', color: '#6B7280' }}>Member Since</p>
                                    <p style={{ fontWeight: '600', color: '#1A1A2E' }}>July 2026</p>
                                </div>
                                <div style={{ padding: '12px 20px', background: '#F8F9FC', borderRadius: '10px' }}>
                                    <p style={{ fontSize: '12px', color: '#6B7280' }}>Analyses</p>
                                    <p style={{ fontWeight: '600', color: '#1A1A2E' }}>12</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ========== RENDER ==========
    if (page === 'welcome') return <Welcome />;
    if (page === 'about') return <About />;
    if (page === 'login') return <Login />;
    if (page === 'register') return <Register />;
    if (page === 'dashboard') return <Dashboard />;
    if (page === 'analysis') return <Analysis />;
    if (page === 'results') return <Results />;
    if (page === 'history') return <History />;
    if (page === 'profile') return <Profile />;
    return <Welcome />;
}

export default App;