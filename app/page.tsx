"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResumePreview } from "@/components/resume-preview"
import {
  parseResumeContent,
  DEFAULT_PERSONAL_INFO,
  DEFAULT_EDUCATION,
  type ResumeData,
  type PersonalInfo,
  type Education,
} from "@/lib/parse-resume"
import { FileDown, FileText, AlertCircle, Settings, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const STORAGE_KEY_PERSONAL = "resume_personal_info"
const STORAGE_KEY_EDUCATION = "resume_education"
const STORAGE_KEY_TEMPLATE = "resume_template"

const PROMPT_TEXT = `First, I will provide my template resume. Then, I will share different job descriptions one by one. For each job description, tailor my resume specifically to that role. Each tailored resume should align only with the provided job description and should not reference or relate to any others.

- Tailor Conditions:
    1. Resume Structure

        Resume must have only 3 sections:

        - Summary
        - Technical Skills
        - Professional Experience
    2. Professional Summary
        - Concise, professional, and clearly aligned with the job description, without subjects like "I" or "We".
        - Include years of IT development experience from the Template Resume.
        - Highlight experience and achievements with technical skills required in the job description.
        - Emphasize experience with soft skills required in the job description and my Template Resume.
        - Mention relevant industry experience from the job description with other industries from Template Resume.
    - Up to 3-4 lines.
    3. For Professional Experience Section:
        - Each bullet point must align with the job description's responsibilities and required technical skills.
        - Each sentence must be and descriptive, clearly outlining detailed responsibilities, achievements, and accomplishments, while naturally incorporating the technical skills, tools, and technologies used.
        - Every sentence should include action verbs, technical skills, and soft skills from the job description where relevant.
        - Each sentence should demonstrate impact, preferably with metrics, numbers (as much as possible), or measurable results (e.g., "improved system efficiency by 35%" or "reduced deployment time from 2 hours to 20 minutes").
    - Each sentence must not be skills list sentence. They must be human readable, senior professional, outcome and achievement focused rather than what I did.
        - Sentences must be written in a professional, Outcome and achievement focused, and results-oriented style suitable for ATS scanning and recruiter readability.
        - Write each company's experience with real-world projects from my Template Resumes' Experience.
        - Ensure each company's listed experience reflects its respective role.
        - Write each  companies' experience based on job description and my Template Resume's Experience.
        - Incorporate "nice-to-have" skills from the job description where relevant.
        - Include soft skills from the job description, aligned with each company's role.
        - Ensure the timeline of skills is historically accurate (e.g., FastAPI, released in December 2018, should not be included in Stripe company experience, since employment ended in Auguest 2015). Apply this logic to all skills.
        - Use a fixed number of detailed bullets for each company:
        - Most recent role: 9–12 bullets
        - Next role: 7–10 bullets
        - Roles with 4+ years tenure: 7–10 bullets
        - Older roles: 7–8 bullets each
    - Formatting:
        * Bold section title (Professional Experience)
        * Section header: job titles | company names | dates.
        * Do not bold experience contents.
        * No bullet characters or numbered lists in FINAL RESUME.
        * Each bullet is a plain paragraph on its own line.
        * Separate bullets with a blank line.
    4. For Technical Skills Section:
        - Must include all technical skills, programming languages, frameworks, cloud, DevOps, tools and others mentioned in the job description.
        - Also include "nice-to-have" skills.
        - Don't Categorize skills
    - Bold section title (Technical Skills)
        - All skills must be comma-separated.
        - Include up to 60 skills if relevant.
        - Always include my Template Resume's Technical Skills
        - Add all related skills from both required and nice-to-have lists.
    - Formatting:
        * bullet character should be "-" in FINAL RESUME.
        * Each bullet is a plain paragraph on its own line.
        * Separate bullets with a blank line.
- Final Requirements:
    - Resume must achieve **100% ATS score**.
    - No spelling, grammar, readability, or formatting errors.
    - Never include am dash or an dash like this GPT style symbols.
- Output
  * First save tailored resume in draft(don't show drafted resume) and evaluate how strong tailored resume matched with JD. (ATS score, Human Review Score, Seniority Score, like ATS: X/10 Human Review: Y/10 Seniority: Z/10) - (Seniority mean which parts are look like junior like resume)
  * Provide why ATS score is X and why Human Review score is Y and why Seniority score is Z.
  * Detect AI written style phrases like "Proven track record of", "Results-driven professional", "Highly motivated self-starter", "Leveraged cutting-edge technologies", "Passionate about driving innovation", etc.
  * Provide recommended fixes to increase ATS score and Human Review score and Seniority score.
  * Then for the next step fix your recommend fixes and convert detected AI written style phrases to human style
  * And again recommend fixes to increase ATS score, Human Review score and Seniority score, and also again detect AI written style phrases.
  * Then for the next step fix your second recommend fixes and convert second detected AI written style phrases to human style.
  * Repeat these steps until ATS score >= 9.5, Human Review score >= 9.3, Seniority score >=9.3
  * After scores satisfied minimum requirements, provide again ATS score and Human Review score and Seniority score.
  * And then provide final resume.

TEMPLATE RESUME:`

export default function Home() {
  const [jobDescription, setJobDescription] = useState("")
  const [templateResume, setTemplateResume] = useState("")
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(DEFAULT_PERSONAL_INFO)
  const [education, setEducation] = useState<Education[]>(DEFAULT_EDUCATION)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)

  // Load saved data on mount
  useEffect(() => {
    const savedPersonal = localStorage.getItem(STORAGE_KEY_PERSONAL)
    const savedEducation = localStorage.getItem(STORAGE_KEY_EDUCATION)
    const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE)

    if (savedPersonal) {
      try {
        setPersonalInfo(JSON.parse(savedPersonal))
      } catch {
        // ignore parse errors
      }
    }

    if (savedEducation) {
      try {
        const parsed = JSON.parse(savedEducation)
        // Handle migration from old object format to new array format
        if (Array.isArray(parsed)) {
          setEducation(parsed)
        } else if (parsed && typeof parsed === "object" && parsed.degree) {
          // Old format was a single object, convert to array
          setEducation([parsed])
        }
      } catch {
        // ignore parse errors
      }
    }

    if (savedTemplate) {
      setTemplateResume(savedTemplate)
    }
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY_PERSONAL, JSON.stringify(personalInfo))
    localStorage.setItem(STORAGE_KEY_EDUCATION, JSON.stringify(education))
    localStorage.setItem(STORAGE_KEY_TEMPLATE, templateResume)
    setSettingsOpen(false)
  }

  const handleAddEducation = () => {
    if (education.length < 2) {
      setEducation([...education, { degree: "", school: "", year: "" }])
    }
  }

  const handleRemoveEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index))
    }
  }

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    setEducation(updated)
  }

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    if (!templateResume.trim()) {
      setError("Please enter your template resume in Settings")
      return
    }

    setError("")
    setIsGenerating(true)

    try {
      // Build the full prompt
      const fullPrompt = `${PROMPT_TEXT}

${templateResume}

JD:
${jobDescription}`

      // Call Python backend
      const response = await fetch("http://127.0.0.1:8000/scrape-qwen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      const data = await response.json()
      const responseText = data.response || data.text || data.content || ""

      // Parse the response text into resume data
      const parsed = parseResumeContent(responseText)

      const fullResumeData: ResumeData = {
        personalInfo,
        education,
        summary: parsed.summary || "",
        technicalSkills: parsed.technicalSkills || [],
        professionalExperience: parsed.professionalExperience || [],
      }

      setResumeData(fullResumeData)
      setPreviewOpen(true)
    } catch (err) {
      console.error("Generation error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate resume. Make sure the Python backend is running.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeData) return

    try {
      const { generateResumePDF } = await import("@/lib/generate-pdf")
      const filename = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
      await generateResumePDF(resumeData, filename)
    } catch (error) {
      console.error("PDF generation error:", error)
      setError("Failed to generate PDF. Please try again.")
    }
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Settings Button */}
        <div className="flex items-start justify-between mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              PDF Resume Generator
            </h1>
            <p className="text-muted-foreground">
              Paste your resume content and generate a professional PDF
            </p>
          </div>

          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Job Description Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Description
            </CardTitle>
            <CardDescription>
              Paste the job description below. Your template resume can be configured in Settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Paste the job description here...

Example:
We are looking for a Senior Software Engineer with experience in:
- React, TypeScript, Node.js
- Cloud services (AWS/GCP)
- CI/CD pipelines
...`}
              className="min-h-[400px] font-mono text-sm"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value)
                setError("")
              }}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Resume"}
              </Button>
              <Button variant="outline" onClick={() => setPromptOpen(true)}>
                Prompt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Settings</DialogTitle>
            <DialogDescription>
              Configure your template resume, contact details, and education. This info will be saved for future use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Template Resume */}
            <div>
              <h3 className="text-sm font-medium mb-3">Template Resume</h3>
              <Textarea
                placeholder={`Paste your full template resume here...

Summary
Your professional summary here...

Technical Skills
JavaScript, React, Node.js, etc...

Professional Experience
Job Title | Company | Duration
- Achievement 1
- Achievement 2`}
                className="min-h-[300px] font-mono text-sm"
                value={templateResume}
                onChange={(e) => setTemplateResume(e.target.value)}
              />
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium mb-3">Contact Details</h3>
              <FieldGroup>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Job Title</FieldLabel>
                    <Input
                      value={personalInfo.jobTitle}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, jobTitle: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Location</FieldLabel>
                    <Input
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>LinkedIn</FieldLabel>
                    <Input
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Education</h3>
                {education.length < 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddEducation}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="relative border rounded-lg p-4">
                    {education.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Degree</FieldLabel>
                        <Input
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                        />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>School</FieldLabel>
                          <Input
                            value={edu.school}
                            onChange={(e) => handleUpdateEducation(index, "school", e.target.value)}
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Year</FieldLabel>
                          <Input
                            value={edu.year}
                            onChange={(e) => handleUpdateEducation(index, "year", e.target.value)}
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
            <DialogDescription>
              Review your resume before downloading
            </DialogDescription>
          </DialogHeader>

          {resumeData && (
            <div className="border rounded-lg overflow-hidden shadow-sm my-4">
              <ResumePreview data={resumeData} />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prompt Modal */}
      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Tailoring Prompt</DialogTitle>
            <DialogDescription>
              Use this prompt with AI to tailor your resume for specific job descriptions
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-x-auto">
              {PROMPT_TEXT}
            </pre>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(PROMPT_TEXT)
              }}
            >
              Copy to Clipboard
            </Button>
            <Button onClick={() => setPromptOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
