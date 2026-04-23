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
import { FileDown, FileText, AlertCircle, Settings } from "lucide-react"
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

const SAMPLE_CONTENT = `Summary
Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean code, system design, and mentoring junior developers.

Technical Skills
JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, GraphQL, REST APIs, Git, CI/CD

Professional Experience
Senior Software Engineer | TechCorp Inc. | 2021 - Present
- Led development of a real-time analytics dashboard serving 100K+ daily users
- Architected microservices infrastructure reducing system latency by 40%
- Mentored team of 5 junior developers through code reviews and pair programming
- Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes

Software Engineer | StartupXYZ | 2018 - 2021
- Built core features for SaaS platform using React and Node.js
- Designed and implemented RESTful APIs handling 1M+ requests daily
- Collaborated with product team to deliver features 20% ahead of schedule
- Reduced application bundle size by 35% through code splitting and optimization

Junior Developer | WebAgency | 2016 - 2018
- Developed responsive websites for 50+ clients using modern web technologies
- Created reusable component library adopted across multiple projects
- Participated in agile ceremonies and contributed to sprint planning`

const STORAGE_KEY_PERSONAL = "resume_personal_info"
const STORAGE_KEY_EDUCATION = "resume_education"

export default function Home() {
  const [content, setContent] = useState("")
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(DEFAULT_PERSONAL_INFO)
  const [education, setEducation] = useState<Education>(DEFAULT_EDUCATION)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Load saved data on mount
  useEffect(() => {
    const savedPersonal = localStorage.getItem(STORAGE_KEY_PERSONAL)
    const savedEducation = localStorage.getItem(STORAGE_KEY_EDUCATION)

    if (savedPersonal) {
      try {
        setPersonalInfo(JSON.parse(savedPersonal))
      } catch {
        // ignore parse errors
      }
    }

    if (savedEducation) {
      try {
        setEducation(JSON.parse(savedEducation))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY_PERSONAL, JSON.stringify(personalInfo))
    localStorage.setItem(STORAGE_KEY_EDUCATION, JSON.stringify(education))
    setSettingsOpen(false)
  }

  const handleGenerate = () => {
    if (!content.trim()) {
      setError("Please enter your resume content")
      return
    }

    setError("")
    setIsGenerating(true)

    const parsed = parseResumeContent(content)

    const fullResumeData: ResumeData = {
      personalInfo,
      education,
      summary: parsed.summary || "",
      technicalSkills: parsed.technicalSkills || [],
      professionalExperience: parsed.professionalExperience || [],
    }

    setResumeData(fullResumeData)
    setIsGenerating(false)
    setPreviewOpen(true)
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

  const handleLoadSample = () => {
    setContent(SAMPLE_CONTENT)
    setError("")
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

        {/* Resume Content Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Content
            </CardTitle>
            <CardDescription>
              Paste your Summary, Technical Skills, and Professional Experience below.
              Click the settings button to edit personal info and education.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Summary
Your professional summary here...

Technical Skills
JavaScript, React, Node.js, etc...

Professional Experience
Job Title | Company | Duration
- Achievement 1
- Achievement 2`}
              className="min-h-[400px] font-mono text-sm"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
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
              <Button variant="outline" onClick={handleLoadSample}>
                Load Sample
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personal Information & Education</DialogTitle>
            <DialogDescription>
              Update your contact details and education. This info will be saved for future use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
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
              <h3 className="text-sm font-medium mb-3">Education</h3>
              <FieldGroup>
                <Field>
                  <FieldLabel>Degree</FieldLabel>
                  <Input
                    value={education.degree}
                    onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>School</FieldLabel>
                    <Input
                      value={education.school}
                      onChange={(e) => setEducation({ ...education, school: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Year</FieldLabel>
                    <Input
                      value={education.year}
                      onChange={(e) => setEducation({ ...education, year: e.target.value })}
                    />
                  </Field>
                </div>
              </FieldGroup>
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
    </main>
  )
}
