import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Copy, CheckCircle, AlertCircle, ArrowLeft, FileText, FileDown, Plus, Trash2, ChevronDown, ChevronUp, User, Briefcase, GraduationCap, Wrench, Award, Target } from 'lucide-react'

export default function Build() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'linkedin.com/in/johndoe',
      portfolio: 'johndoe.dev'
    },
    professionalSummary: 'Experienced software engineer with 5+ years of experience in full-stack development. Specialized in JavaScript, React, Node.js, and cloud technologies. Passionate about building scalable web applications and mentoring junior developers.',
    targetJob: 'Senior Software Engineer',
    workExperience: [{
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      description: 'Lead development of microservices architecture. Mentored junior developers. Improved application performance by 40%.'
    }, {
      company: 'StartUpXYZ',
      position: 'Full Stack Developer',
      startDate: 'Jun 2020',
      endDate: 'Dec 2021',
      current: false,
      description: 'Built React frontend and Node.js backend. Implemented CI/CD pipeline. Reduced page load time by 60%.'
    }],
    education: [{
      school: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      graduationDate: 'May 2020',
      gpa: '3.9/4.0'
    }, {
      school: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Software Engineering',
      graduationDate: 'May 2018',
      gpa: '3.8/4.0'
    }],
    skills: 'JavaScript, React, Node.js, Python, TypeScript, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Git, CI/CD',
    certifications: 'AWS Certified Developer, Google Cloud Professional, React Developer Certification'
  })

  const updatePersonalInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateWorkExperience = (index, field, value) => {
    const newExperience = [...formData.workExperience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setFormData(prev => ({ ...prev, workExperience: newExperience }))
  }

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]
    }))
  }

  const removeWorkExperience = (index) => {
    const newExperience = formData.workExperience.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, workExperience: newExperience }))
  }

  const updateEducation = (index, field, value) => {
    const newEducation = [...formData.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setFormData(prev => ({ ...prev, education: newEducation }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', graduationDate: '', gpa: '' }]
    }))
  }

  const removeEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, education: newEducation }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResults(null)
    setLoading(true)

    try {
      const response = await fetch('/api/create-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create resume')
      setResults({
        resume: {
          name: data?.resume?.name || formData.personalInfo.fullName,
          contact: data?.resume?.contact || formData.personalInfo,
          summary: data?.resume?.summary || '',
          skills: data?.resume?.skills || [],
          experience: data?.resume?.experience || [],
          education: data?.resume?.education || [],
          certifications: data?.resume?.certifications || []
        },
        cover_letter: data?.cover_letter || ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!results) return;

      const text = `
    ${results.resume.name}

    ${results.resume.summary}

    Skills: ${results.resume.skills?.join(', ')}

    Experience:
    ${results.resume.experience?.map(e => `${e.position} - ${e.company}`).join('\n')}
    `;

      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  

  const downloadAsText = () => {
    const content = `RESUME
      ${'='.repeat(50)}

      ${results.resume.name}

      ${results.resume.summary}

      Skills: ${results.resume.skills?.join(', ')}

      Experience:
      ${results.resume.experience?.map(e => `${e.position} - ${e.company}`).join('\n')}

      ${'='.repeat(50)}
      COVER LETTER
      ${'='.repeat(50)}
      ${results.cover_letter || 'N/A'}
    `
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const steps = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Summary', icon: Target },
    { num: 3, title: 'Experience', icon: Briefcase },
    { num: 4, title: 'Education', icon: GraduationCap },
    { num: 5, title: 'Skills', icon: Wrench }
  ]

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-light transition-colors mb-8 animate-slide-in-left">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-slide-up">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Build Your Resume</h1>
            <p className="text-text-muted">Fill out the form to generate a professional resume</p>
          </div>
        </div>

        {!results ? (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 animate-slide-up">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <button
                    onClick={() => setStep(s.num)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      step >= s.num ? 'text-primary bg-primary/10' : 'text-text-muted'
                    }`}
                  >
                    <s.icon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`w-8 sm:w-12 h-0.5 mx-1 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 animate-slide-up card-lift">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Personal Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-muted mb-2 text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        value={formData.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-2 text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-2 text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-2 text-sm font-medium">Location</label>
                      <input
                        type="text"
                        value={formData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        placeholder="City, State"
                        className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-2 text-sm font-medium">LinkedIn</label>
                      <input
                        type="url"
                        value={formData.personalInfo.linkedIn}
                        onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                        className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-2 text-sm font-medium">Portfolio / Website</label>
                      <input
                        type="url"
                        value={formData.personalInfo.portfolio}
                        onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                        placeholder="johndoe.com"
                        className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Summary & Target Job */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Professional Summary
                  </h2>

                  <div>
                    <label className="block text-text-muted mb-2 text-sm font-medium">Target Job Title</label>
                    <input
                      type="text"
                      value={formData.targetJob}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetJob: e.target.value }))}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-text-muted mb-2 text-sm font-medium">Professional Summary</label>
                    <textarea
                      value={formData.professionalSummary}
                      onChange={(e) => setFormData(prev => ({ ...prev, professionalSummary: e.target.value }))}
                      placeholder="Brief overview of your experience and goals..."
                      rows={5}
                      className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                    <p className="text-text-muted text-xs mt-2">Describe your experience, skills, and career goals in 2-4 sentences.</p>
                  </div>
                </div>
              )}

              {/* Step 3: Work Experience */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Work Experience
                  </h2>

                  {formData.workExperience.map((exp, index) => (
                    <div key={index} className="p-4 bg-bg-dark rounded-xl border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">Position {index + 1}</span>
                        {formData.workExperience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWorkExperience(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">Position</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                            placeholder="Job Title"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                            placeholder="Jan 2020"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">End Date</label>
                          <input
                            type="text"
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                            placeholder="Dec 2023 or Present"
                            disabled={exp.current}
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current-${index}`}
                          checked={exp.current}
                          onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor={`current-${index}`} className="text-sm text-text-light">Currently working here</label>
                      </div>

                      <div>
                        <label className="block text-text-muted mb-2 text-xs">Description / Achievements</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and key achievements..."
                          rows={3}
                          className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm resize-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addWorkExperience}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Another Position
                  </button>
                </div>
              )}

              {/* Step 4: Education */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" /> Education
                  </h2>

                  {formData.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-bg-dark rounded-xl border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">Education {index + 1}</span>
                        {formData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">School / University</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                            placeholder="University Name"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            placeholder="Bachelor's, Master's, etc."
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            placeholder="Computer Science"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                            placeholder="May 2024"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-text-muted mb-2 text-xs">GPA (Optional)</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                            placeholder="3.8/4.0"
                            className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-text-light focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Another Education
                  </button>
                </div>
              )}

              {/* Step 5: Skills & Certifications */}
              {step === 5 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-primary" /> Skills & Certifications
                  </h2>

                  <div>
                    <label className="block text-text-muted mb-2 text-sm font-medium">Technical Skills</label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker..."
                      rows={4}
                      className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                    <p className="text-text-muted text-xs mt-2">List your technical skills, separated by commas.</p>
                  </div>

                  <div>
                    <label className="block text-text-muted mb-2 text-sm font-medium">Certifications / Awards (Optional)</label>
                    <textarea
                      value={formData.certifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                      placeholder="AWS Certified Developer, Google Analytics, Dean's List..."
                      rows={3}
                      className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-text-muted hover:text-text-light transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 rounded-xl text-white font-medium transition-all"
                  >
                    Next <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient px-8 py-3 rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-50 btn-press transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-5 h-5" />
                        <span>Generating Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Resume</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 flex items-center gap-2 animate-scale-in">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}
            </form>
          </>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Resume Card */}
            <div className="bg-white text-black p-6 rounded-xl shadow-lg space-y-4">
              {/* Name */}
              <h1 className="text-2xl font-bold">
                {results.resume.name}
              </h1>

              {/* Contact */}
              <p className="text-sm text-gray-600">
                {results.resume.contact.email} | {results.resume.contact.phone}
              </p>

              {/* Summary */}
              <div>
                <h2 className="font-semibold border-b">Summary</h2>
                <p>{results.resume.summary}</p>
              </div>

              {/* Skills */}
              <div>
                <h2 className="font-semibold border-b">Skills</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {results.resume.skills?.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h2 className="font-semibold border-b">Experience</h2>
                {results.resume.experience?.map((exp, i) => (
                  <div key={i} className="mt-2">
                    <p className="font-medium">{exp.position} - {exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.duration}</p>
                    <ul className="list-disc ml-5">
                      {exp.description?.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div>
                <h2 className="font-semibold border-b">Education</h2>
                {results.resume.education?.map((edu, i) => (
                  <p key={i}>
                    {edu.degree} - {edu.school} ({edu.year})
                  </p>
                ))}
              </div>

            </div>

            {/* Cover Letter Card */}
            {results.cover_letter && (
              <div className="bg-bg-card border border-border rounded-2xl overflow-hidden animate-slide-up delay-100 card-lift">
                <div className="flex items-center gap-3 p-5 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Cover Letter</h4>
                    <p className="text-sm text-text-muted">Generated for {formData.targetJob || 'your target position'}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="bg-bg-dark p-5 rounded-xl text-sm leading-relaxed">
                    {results.cover_letter.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Build Another Button */}
            <button
              onClick={() => {
                setResults(null)
                setStep(1)
              }}
              className="w-full py-4 bg-bg-card border border-border rounded-xl text-text-light hover:bg-bg-dark transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Build Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
