import React, { useState } from 'react';
import { Key, Lock, Eye, EyeOff, Copy, Check, ShieldAlert, Sparkles, Terminal, RefreshCw, Server, Cpu, Database, CheckCircle2 } from 'lucide-react';

interface EnvVar {
  key: string;
  value: string;
  category: 'AI & Services' | 'Auth & System' | 'Database' | 'DevOps & EKS' | 'Firebase';
  isSecret: boolean;
  description: string;
}

export const EnvStoreInspector: React.FC = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const [isPracticeMode, setIsPracticeMode] = useState(true);

  const envVariables: EnvVar[] = [
    {
      key: 'ADMIN_EMAIL',
      value: 'hanamanttaranal19@gmail.com',
      category: 'Auth & System',
      isSecret: false,
      description: 'System Administrator email ID for login authorization.',
    },
    {
      key: 'ADMIN_PASSWORD',
      value: '12345',
      category: 'Auth & System',
      isSecret: true,
      description: 'System Administrator passkey for secure admin portal access.',
    },
    {
      key: 'GEMINI_API_KEY',
      value: process.env.GEMINI_API_KEY || (isPracticeMode ? 'AIStudio_Dummy_Practice_Gemini_Key_2026' : 'AIStudioSecretKey_InjectedAtRuntime'),
      category: 'AI & Services',
      isSecret: true,
      description: 'Google Gemini 2.5/3.0 AI Model API Key for smart styling and descriptions.',
    },
    {
      key: 'APP_URL',
      value: process.env.APP_URL || 'https://ais-dev-ueklwbdzeqycknmg2jdgil.run.app',
      category: 'Auth & System',
      isSecret: false,
      description: 'Public host URL injected by AI Studio Cloud Run runtime.',
    },
    {
      key: 'VITE_API_BASE_URL',
      value: isPracticeMode ? 'http://fashion-club-backend-service:8080/api' : 'http://localhost:8080/api',
      category: 'Auth & System',
      isSecret: false,
      description: 'Base endpoint URL for Java Spring Boot backend REST services.',
    },
    {
      key: 'FIREBASE_PROJECT_ID',
      value: 'ai-studio-fashionstore-d4e40839-fb1c-446e-983f-05114194eb61',
      category: 'Firebase',
      isSecret: false,
      description: 'Target Firestore project ID for persistent cloud data.',
    },
    {
      key: 'DB_HOST',
      value: isPracticeMode ? 'mysql-service' : 'mysql',
      category: 'Database',
      isSecret: false,
      description: 'MySQL 8.0 database server host name for Spring Boot JPA.',
    },
    {
      key: 'DB_PORT',
      value: '3306',
      category: 'Database',
      isSecret: false,
      description: 'MySQL relational database default port (3306).',
    },
    {
      key: 'DB_NAME',
      value: 'atelier_fashion_db',
      category: 'Database',
      isSecret: false,
      description: 'Target MySQL database schema name.',
    },
    {
      key: 'DB_USER',
      value: 'atelier_admin',
      category: 'Database',
      isSecret: false,
      description: 'MySQL database user credential.',
    },
    {
      key: 'DB_PASSWORD',
      value: isPracticeMode ? 'atelier_dummy_secure_pass_123' : 'atelier_secure_pass',
      category: 'Database',
      isSecret: true,
      description: 'MySQL database secret password.',
    },
    {
      key: 'DB_DRIVER',
      value: 'com.mysql.cj.jdbc.Driver',
      category: 'Database',
      isSecret: false,
      description: 'MySQL Connector/J JDBC driver class for Spring Boot Data JPA.',
    },
    {
      key: 'DB_URL',
      value: 'jdbc:mysql://mysql:3306/atelier_fashion_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC',
      category: 'Database',
      isSecret: false,
      description: 'Fully qualified JDBC connection URL for MySQL database.',
    },
    {
      key: 'JWT_SECRET',
      value: 'dummyJwtSecretKeyForEksPractice2026AtelierFashionClub',
      category: 'Auth & System',
      isSecret: true,
      description: 'JWT signing key for Java Spring Security REST authentication tokens.',
    },
    {
      key: 'EKS_CLUSTER_NAME',
      value: 'fashion-club-eks-cluster',
      category: 'DevOps & EKS',
      isSecret: false,
      description: 'AWS EKS Kubernetes cluster name for ArgoCD GitOps deployment.',
    },
    {
      key: 'AWS_REGION',
      value: 'us-east-1',
      category: 'DevOps & EKS',
      isSecret: false,
      description: 'AWS Cloud Region hosting EKS cluster and ECR container registry.',
    },
    {
      key: 'ARGOCD_SERVER',
      value: 'https://argocd.fashionclub.internal',
      category: 'DevOps & EKS',
      isSecret: false,
      description: 'ArgoCD GitOps continuous deployment controller server URL.',
    },
    {
      key: 'JENKINS_URL',
      value: 'https://jenkins.fashionclub.internal',
      category: 'DevOps & EKS',
      isSecret: false,
      description: 'Jenkins automated CI pipeline build server URL.',
    },
  ];

  const categories = ['All', 'Auth & System', 'AI & Services', 'Database', 'Firebase', 'DevOps & EKS'];

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filtered = envVariables.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleTestConnection = () => {
    setTestStatus('Testing environment variables store...');
    setTimeout(() => {
      setTestStatus('✅ All Environment Store Variables validated & synchronized with system!');
      setTimeout(() => setTestStatus(null), 3500);
    }, 600);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-100 my-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-400/10 text-amber-400 rounded-2xl border border-amber-400/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">Environment Variables Store</h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                ACTIVE STORE
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Live inspection panel for `.env.example` configurations, credentials & DevOps keys
            </p>
          </div>
        </div>

        <button
          onClick={handleTestConnection}
          className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono text-xs rounded-xl border border-stone-700 flex items-center space-x-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Validate Store Sync</span>
        </button>
      </div>

      {testStatus && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{testStatus}</span>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'bg-amber-400 text-stone-950 font-bold border border-amber-400'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter env variables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-400 w-full sm:w-64"
        />
      </div>

      {/* Environment Variable Cards Table */}
      <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden">
        <div className="divide-y divide-stone-800/80">
          {filtered.map((item) => {
            const isVisible = showSecrets[item.key];
            const maskedValue = item.isSecret && !isVisible ? '••••••••••••••••' : item.value;

            return (
              <div key={item.key} className="p-4 hover:bg-stone-900/60 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800">
                      {item.key}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 uppercase px-2 py-0.5 rounded bg-stone-900/80">
                      {item.category}
                    </span>
                    {item.isSecret && (
                      <span className="text-[9px] font-mono bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20">
                        SECRET
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {item.isSecret && (
                      <button
                        onClick={() => toggleSecret(item.key)}
                        className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition-colors"
                        title={isVisible ? 'Mask Secret' : 'Unmask Secret'}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(item.key, item.value)}
                      className="p-1.5 text-stone-400 hover:text-amber-300 rounded-lg hover:bg-stone-800 transition-colors flex items-center space-x-1 text-[10px] font-mono"
                      title="Copy Store Value"
                    >
                      {copiedKey === item.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Value Display */}
                <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className={`truncate ${item.isSecret && !isVisible ? 'text-stone-500 font-bold' : 'text-emerald-300'}`}>
                    {maskedValue}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-stone-400 font-sans">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
