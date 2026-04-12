import { Link } from 'react-router-dom'
import { Search, Sparkles, Mail, ArrowRight, FileText, Zap, Shield, Target } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8 animate-slide-up">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary-light font-medium">AI-Powered Resume Tools</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight animate-slide-up delay-100">
            Build Your Perfect{' '}
            <span className="gradient-text animate-gradient-border">Resume</span>{' '}
            with AI
          </h1>

          <p className="text-lg sm:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-200">
            Upload your resume and get instant AI-powered analysis, improvements, and cover letters tailored to your dream job.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up delay-300">
            <Link
              to="/analyze"
              className="btn-gradient px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 group btn-press transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              <Search className="w-5 h-5" /> Analyze Resume
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/build"
              className="bg-bg-card hover:bg-bg-cardHover border border-border px-8 py-4 rounded-xl font-semibold text-text-light flex items-center gap-2 transition-all group btn-press hover:scale-105 hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" /> Build Resume
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-slide-up delay-400">
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">3</div>
              <div className="text-sm text-text-muted">AI Tools</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">AI</div>
              <div className="text-sm text-text-muted">Powered</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">ATS</div>
              <div className="text-sm text-text-muted">Optimized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-slide-up">Powerful AI Tools</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto animate-slide-up delay-100">Everything you need to land your dream job, powered by cutting-edge AI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-8 h-8" />}
              title="Resume Analyzer"
              description="Get detailed feedback on your resume with scores, strengths, weaknesses, and ATS compatibility analysis."
              to="/analyze"
              color="from-blue-500 to-indigo-500"
              delay={0}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI Resume Builder"
              description="Improve and optimize your resume for specific job positions with intelligent AI suggestions."
              to="/build"
              color="from-indigo-500 to-purple-500"
              delay={100}
            />
            <FeatureCard
              icon={<Mail className="w-8 h-8" />}
              title="Cover Letter Generator"
              description="Generate professional cover letters tailored to any job application in seconds."
              to="/cover-letter"
              color="from-purple-500 to-pink-500"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-slide-up">How It Works</h2>
            <p className="text-text-muted text-lg animate-slide-up delay-100">Three simple steps to your perfect resume</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="1" title="Upload or Paste" description="Upload your resume PDF or paste your resume text into the tool." delay={0} />
            <StepCard number="2" title="AI Analysis" description="Our AI analyzes your resume against industry standards and job requirements." delay={100} />
            <StepCard number="3" title="Get Results" description="Receive detailed feedback, improvements, or a brand new cover letter." delay={200} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Stand Out with <span className="gradient-text">ATS-Optimized</span> Resumes
              </h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                Most resumes get rejected by Applicant Tracking Systems before a human ever sees them. Our AI tools ensure your resume passes ATS filters and impresses hiring managers.
              </p>
              <div className="space-y-4">
                <BenefitItem icon={<Shield className="w-5 h-5" />} text="ATS compatibility scoring" delay={0} />
                <BenefitItem icon={<Target className="w-5 h-5" />} text="Job-specific keyword optimization" delay={100} />
                <BenefitItem icon={<FileText className="w-5 h-5" />} text="Professional formatting suggestions" delay={200} />
                <BenefitItem icon={<Zap className="w-5 h-5" />} text="Instant AI-powered feedback" delay={300} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-card border border-border rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 animate-scale-in delay-100">
                <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                <div className="text-text-muted text-sm">ATS Pass Rate</div>
              </div>
              <div className="bg-bg-card border border-border rounded-2xl p-6 text-center mt-8 hover:scale-105 transition-transform duration-300 animate-scale-in delay-200">
                <div className="text-4xl font-bold gradient-text mb-2">3x</div>
                <div className="text-text-muted text-sm">More Interviews</div>
              </div>
              <div className="bg-bg-card border border-border rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 animate-scale-in delay-300">
                <div className="text-4xl font-bold gradient-text mb-2">50+</div>
                <div className="text-text-muted text-sm">ATS Checks</div>
              </div>
              <div className="bg-bg-card border border-border rounded-2xl p-6 text-center mt-8 hover:scale-105 transition-transform duration-300 animate-scale-in delay-400">
                <div className="text-4xl font-bold gradient-text mb-2">10s</div>
                <div className="text-text-muted text-sm">Analysis Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <div className="bg-bg-card border border-border rounded-3xl p-10 sm:p-14 card-lift">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Improve Your Resume?</h2>
            <p className="text-text-muted text-lg mb-8">Start with our free AI tools and take your job application to the next level.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/analyze" className="btn-gradient px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 btn-press transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                <Search className="w-5 h-5" /> Analyze Resume
              </Link>
              <Link to="/cover-letter" className="bg-bg-dark hover:bg-bg-cardHover border border-border px-8 py-4 rounded-xl font-semibold text-text-light flex items-center gap-2 transition-all btn-press hover:scale-105">
                <Mail className="w-5 h-5" /> Generate Cover Letter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, to, color, delay }) {
  return (
    <Link
      to={to}
      className="bg-bg-card border border-border rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-xl hover:shadow-primary/10 group animate-slide-up card-lift"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-light transition-colors duration-300">{title}</h3>
      <p className="text-text-muted mb-4">{description}</p>
      <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
        Get Started <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  )
}

function StepCard({ number, title, description, delay }) {
  return (
    <div className="text-center animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-text-muted">{description}</p>
    </div>
  )
}

function BenefitItem({ icon, text, delay }) {
  return (
    <div className="flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-primary">{icon}</div>
      <span className="text-text-light">{text}</span>
    </div>
  )
}
