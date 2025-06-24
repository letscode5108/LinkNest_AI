import  { useState, useEffect } from 'react';
import { ArrowRight, Link, Shield, Users, Zap, BookmarkPlus, Eye, Tag, Globe, CheckCircle } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
const Landing = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

interface ScrollToSectionProps {
    sectionId: string;
}

const scrollToSection = ({ sectionId }: ScrollToSectionProps): void => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #001219 0%, #005f73 50%, #0a9396 100%)' }}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-black/20 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">LinkKeeper</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'How It Works', 'Pricing'].map((item) => {
                // Fix: Replace ALL spaces with hyphens, not just the first one
                const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection({ sectionId })}
                    className={`transition-colors font-medium ${
                      activeSection === sectionId
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Save, Organize & 
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Discover</span> Your Links
                </h1>
                <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                  Enterprise-grade link management platform with AI-powered tagging, smart organization, and seamless collaboration for teams of all sizes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <RouterLink
                  to="/auth?mode=register"
                
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-center group">
                    Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </RouterLink>

                <RouterLink
                  to="/auth?mode=login"
                 className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                Sign In
                </RouterLink>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-white/60 text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-white/60 text-sm">Links Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-white/60 text-sm">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-lg font-semibold">Recent Links</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {[
                    { title: 'Advanced React Patterns', domain: 'react.dev', tag: 'Blog', color: 'bg-blue-500' },
                    { title: 'Design System Guidelines', domain: 'figma.com', tag: 'Image', color: 'bg-purple-500' },
                    { title: 'AI in Web Development', domain: 'techcrunch.com', tag: 'News', color: 'bg-green-500' }
                  ].map((link, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">{link.title}</h4>
                          <p className="text-white/60 text-sm">{link.domain}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`${link.color} text-white text-xs px-2 py-1 rounded-full`}>{link.tag}</span>
                            <span className="text-white/40 text-xs">2 min ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6" style={{ backgroundColor: '#005f73' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Powerful Features for 
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Modern Teams</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to save, organize, and collaborate on web content with enterprise-grade security and AI-powered insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookmarkPlus,
                title: 'Smart Link Saving',
                description: 'One-click saving with automatic metadata extraction, Open Graph images, and intelligent categorization.',
                color: 'from-cyan-400 to-blue-500'
              },
              {
                icon: Tag,
                title: 'AI-Powered Tagging',
                description: 'Automatic content classification into categories like News, Blog, Video, Music, and Social Media using advanced AI.',
                color: 'from-amber-400 to-orange-500'
              },
              {
                icon: Eye,
                title: 'Rich Link Previews',
                description: 'Beautiful card layouts with titles, images, domains, and AI-generated summaries for quick content overview.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Share collections, collaborate on link curation, and maintain team knowledge bases with granular permissions.',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption, SSO integration, compliance certifications, and advanced audit logging.',
                color: 'from-red-400 to-rose-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized performance with instant search, real-time sync, and seamless mobile experience.',
                color: 'from-yellow-400 to-amber-500'
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6" style={{ backgroundColor: '#0a9396' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Simple Process,
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Powerful Results</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get started in minutes with our intuitive workflow designed for both individual users and enterprise teams.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up with email and password. Enterprise SSO available.',
                icon: Users
              },
              {
                step: '02',
                title: 'Save Links',
                description: 'Add links manually or use our browser extension for one-click saving.',
                icon: BookmarkPlus
              },
              {
                step: '03',
                title: 'AI Processing',
                description: 'Our AI automatically extracts metadata, images, and categorizes content.',
                icon: Zap
              },
              {
                step: '04',
                title: 'Organize & View',
                description: 'View in beautiful cards, search, filter, and collaborate with your team.',
                icon: Eye
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6" style={{ backgroundColor: '#94d2bd' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Perfect Plan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From individual productivity to enterprise collaboration, we have the right solution for your needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                description: 'Perfect for individual users getting started',
                features: ['Up to 10 links', 'Basic AI tagging', 'Web access', 'Email support'],
                popular: false,
                color: 'from-slate-700 to-slate-800'
              },
              {
                name: 'Professional',
                price: '$12',
                period: 'per month',
                description: 'Ideal for power users and small teams',
                features: ['Unlimited links', 'Advanced AI features', 'Team collaboration', 'Priority support', 'Browser extension', 'API access'],
                popular: true,
                color: 'from-amber-500 to-orange-600'
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'contact us',
                description: 'For large organizations with advanced needs',
                features: ['Everything in Pro', 'SSO integration', 'Advanced security', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
                popular: false,
                color: 'from-slate-700 to-slate-800'
              }
            ].map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`bg-white rounded-2xl p-8 shadow-xl border-2 ${plan.popular ? 'border-orange-500' : 'border-gray-100'} h-full`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-slate-800">{plan.price}</span>
                      {plan.period && (
                        <span className="text-slate-600 ml-2">/{plan.period}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transform hover:scale-105' 
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ backgroundColor: '#001219' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">LinkNest_AI</span>
            </div>
            
            <div className="text-white/60">
              © 2025 LinkNest_AI. Enterprise link management platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;