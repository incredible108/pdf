"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResumePreview } from "@/components/resume-preview"
import {
  DEFAULT_PERSONAL_INFO,
  DEFAULT_EDUCATION,
  type ResumeData,
  type PersonalInfo,
  type Education,
} from "@/lib/parse-resume"
import { FileDown, FileText, AlertCircle, Settings, Plus, Trash2, Briefcase, Pencil, Eye } from "lucide-react"
import { FunnyLoadingBar } from "@/components/funny-loading-bar"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TemplateSelector } from "@/components/template-selector"
import { DEFAULT_TEMPLATE, type TemplateId } from "@/lib/pdf-templates"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Label } from "recharts"
import { Checkbox } from "@/components/ui/checkbox"

const STORAGE_KEY_PERSONAL = "resume_personal_info"
const STORAGE_KEY_EDUCATION = "resume_education"
const STORAGE_KEY_CAREER_MILESTONES = "resume_career_milestones"
const STORAGE_KEY_TEMPLATE = "resume_template"
const STORAGE_KEY_SAVE_IN_FOLDER = "resume_save_in_folder"

const PROMPT_TEXT = `Before doing ANY processing, you MUST analyze the job description for the following conditions:

### ✅ **PASS condition (continue to resume generation):**
- The job description explicitly says **remote**, **work from home**, **virtual**, or **any location** with no onsite requirement
- The job description is **hybrid but allows remote** (if remote is an option, PASS)
- The job description says **onsite with remote possible** (PASS)

### ❗ **STOP conditions (return error immediately):**
- onsite only (no possibility as remote)
- hybrid only (no possibility as remote)
- requires any level of security clearance
- requires in‑person meetings during the interview process
- requires onsite presence during onboarding

### ❗ If ANY stop condition matches, you MUST immediately stop and return ONLY one of these JSON responses:

{ "error": "this position is onsite" }
{ "error": "this position is hybrid" }
{ "error": "this position requires clearance" }
{ "error": "this position requires in-person meeting" }
{ "error": "this position requires onsite during onboarding" }

### ❗ If NO stop condition matches (including explicitly remote roles), you MUST proceed to resume generation.

This rule overrides ALL other instructions.

---

Generate a fully tailored, ATS optimized, professionally written resume based on the provided career milestones and job description.

The system must iterate and improve the resume until the ATS score exceeds 90 percent.

Return result only. Do not include explanations, notes, or intermediate versions.

The content should only consists with alphabetic letters, numbers, mathmatic operations. do not make special letters like "𝑣𝑠"

---

Iteration and ATS Optimization Loop

1 Evaluate the resume using an ATS scoring model from 0 to 100 percent based on:

* Keyword match
* Skills alignment
* Experience relevance
* Role and title alignment
* Measurable impact
* Formatting and ATS readability

2 If score is below 90 percent:

* Identify all gaps such as missing keywords, weak phrasing, or missing skills
* Improve the resume by:

  * Adding missing keywords naturally
  * Strengthening bullet points with measurable impact
  * Improving alignment with required and preferred skills
  * Adjusting phrasing for recruiter search optimization
  * Enhancing technical depth

3 Regenerate the full resume

4 Repeat until ATS score is at least 90 percent

5 Output only the final optimized resume

---

Required JSON Output Format

{
"summary": "...",
"skills": ["...", "..."],
"workexperience": [
{
"companyname": "...",
"role": "...",
"duration": "MMM-YYYY - MMM-YYYY",
"experience": ["...", "...", "..."]
}
]
}

---

Field Requirements

Summary

* 4 to 6 lines
* Senior level tone
* Include key ATS keywords naturally
* Highlight experience, technical strengths, domain expertise, and leadership

Skills

* Maximum 50 items
* Include all required and preferred skills from the job description
* Include related and commonly searched technologies
* No duplicates

Work Experience

* Minimum 9 bullet points per company
* Work experience from all companies (mentioned in Career Milestone) must be included and fully detailed
* Each company must reflect unique domain, system, project scope, business goals, challenges and measurable outcomes
* Each sentence must not be skills list sentence. They must be human readable, senior professional, outcome and achievement focused rather than what I did.
* Each sentence must be a bit long and descriptive.
* bullets must clearly describe:
  * What project/system was built
  * Technologies used
  * Why those technologies were chosen
  * Business problem solved
  * Impact delivered without EXACT numbers
* Use structure: Action plus Technology plus Scope plus Impact
* No repeated wording or structure across bullets

---

Rules

Timeline Accuracy

* Only include technologies available during the specified time period

Tailoring

* Fully align with job description
* Include all required and preferred skills
* Use role specific terminology and architecture language

---

Final Output Rule

Return only the final JSON resume with ATS score at least 90 percent

Do not include explanations or intermediate results

Career Milestone:

JD:`


export default function Home() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(DEFAULT_PERSONAL_INFO)
  const [education, setEducation] = useState<Education[]>(DEFAULT_EDUCATION)
  const [careerMilestones, setCareerMilestones] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewEditable, setPreviewEditable] = useState(false)

  const [companyName, setCompanyName] = useState("")
  const [saveInFolder, setSaveInFolder] = useState(true)
  // const [promptOpen, setPromptOpen] = useState(false)

  // Load saved data on mount (prompt is no longer loaded from storage)
  useEffect(() => {
    const savedPersonal = localStorage.getItem(STORAGE_KEY_PERSONAL)
    const savedEducation = localStorage.getItem(STORAGE_KEY_EDUCATION)
    const savedCareerMilestone = localStorage.getItem(STORAGE_KEY_CAREER_MILESTONES)

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

    if (savedCareerMilestone) {
      setCareerMilestones(savedCareerMilestone)
    }

    const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE)
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate as TemplateId)
    }
    const savedSaveInFolder = localStorage.getItem(STORAGE_KEY_SAVE_IN_FOLDER)
    if (savedSaveInFolder !== null) {
      try {
        setSaveInFolder(JSON.parse(savedSaveInFolder))
      } catch {
        setSaveInFolder(savedSaveInFolder === 'true')
      }
    }
  }, [])

  // Prompt is no longer saved to localStorage
  const handlePreviewEditable = () => {
    setPreviewEditable(!previewEditable)
  }

  const handleSetCompanyName = (name: string) => {
    setCompanyName(name)
  }

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY_PERSONAL, JSON.stringify(personalInfo))
    localStorage.setItem(STORAGE_KEY_EDUCATION, JSON.stringify(education))
    localStorage.setItem(STORAGE_KEY_CAREER_MILESTONES, careerMilestones)
    localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedTemplate)
    localStorage.setItem(STORAGE_KEY_SAVE_IN_FOLDER, JSON.stringify(saveInFolder))
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

    if (!careerMilestones.trim()) {
      setError("Please add your career milestones in Settings first")
      return
    }

    setError("")
    setIsGenerating(true)

    try {
      // Build the full prompt
      const fullPrompt = `${PROMPT_TEXT.replace("Career Milestone:", `Career Milestone:\n${careerMilestones}`).replace("JD:", `JD:\n${jobDescription}`)}`

      // Call the Python backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        setError("Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.")
        setIsGenerating(false)
        return
      }
      console.log("Using backend URL:", backendUrl)
      const response = await fetch(`${backendUrl}/scrape-deepseek`, {
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
      console.log("Raw response from backend:", data)
      const generatedContent = data.tailored_resume || data.text || data.result || ""

      if (!generatedContent) {
        throw new Error("No response received from backend")
      }

      const cleaned = generatedContent.slice(
        generatedContent.indexOf('{'),
        generatedContent.lastIndexOf('}') + 1
      );
      // Parse the generated resume content
      const parsed = JSON.parse(cleaned)
      console.log("title:", parsed.title)
      console.log("error:", parsed.error)

      if (parsed.error) {
        const msg = String(parsed.error)
        toast({ title: "Generation error", description: msg })
        setError(`Generation error: ${msg}`)
        return
      }

      const fullResumeData: ResumeData = {
        personalInfo,
        education,
        summary: parsed.summary || "",
        skills: parsed.skills || [],
        workexperience: parsed.workexperience || [],
      }

      setResumeData(fullResumeData)
      setPreviewOpen(true)
    } catch (err) {
      console.error("Generation error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate resume. Please check if the backend is running.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeData) return

    try {
      const { generateResumePDF } = await import("@/lib/generate-pdf")
      // const filename = `${personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
      // Build a safe folder name: MM-DD-YYYY - CompanyName
      const now = new Date()
      const mm = String(now.getMonth() + 1).padStart(2, "0")
      const dd = String(now.getDate()).padStart(2, "0")
      const yyyy = String(now.getFullYear())
      const safeCompany = companyName?.trim() ? companyName.trim().replace(/[^a-zA-Z0-9 _-]/g, "_") : ""
      // folderName shown to user as mm-dd-yyyy - Company, but use safe folder string for actual creation
      const safeFolder = `${mm}-${dd}-${yyyy}${safeCompany ? ` - ${safeCompany}` : ""}`

      console.log(saveInFolder)
      if (saveInFolder) {
        // Inside the folder, always name the file `resume.pdf`
        const safeFullName = personalInfo.fullName
          ? String(personalInfo.fullName).trim().replace(/[^a-zA-Z0-9 _-]/g, "_")
          : "resume"
        const filename = `${safeFullName}.pdf`
        await generateResumePDF(resumeData, filename, saveInFolder, safeFolder, safeCompany)
      } else {
        // Download as a single file: "Full Name - TargetCompany.pdf"
        const safeFullName = personalInfo.fullName
          ? String(personalInfo.fullName).trim().replace(/[^a-zA-Z0-9 _-]/g, "_")
          : "resume"
        const safeCompanyPart = safeCompany || ""
        const filename = safeCompanyPart
          ? `${safeFullName} - ${safeCompanyPart}.pdf`
          : `${safeFullName}.pdf`
        await generateResumePDF(resumeData, filename, saveInFolder)
      }
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
              Enter a job description to generate a tailored resume
            </p>
          </div>

          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Job Description Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Description
            </CardTitle>
            <CardDescription>
              Paste the job description below. Make sure to add your template resume in Settings first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`Paste the job description here...

Example:
Senior Software Engineer
Requirements:
- 5+ years of experience with JavaScript, React, Node.js
- Experience with cloud platforms (AWS, GCP)
- Strong system design skills
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

            <FunnyLoadingBar isLoading={isGenerating} />

            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Resume"}
              </Button>
              {/* <Button variant="outline" onClick={() => setPromptOpen(true)}>
                Prompt
              </Button> */}
              <Button
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                disabled={!resumeData}
              >
                Preview Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Modal - Now includes full resume template */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Content & Settings</DialogTitle>
            <DialogDescription>
              Enter your full template resume content, personal info, and education. This will be saved for future use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Career Milestones */}
            <div>
              <h3 className="text-sm font-medium mb-3">Career Milestones</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Include your career path. This will be used to tailor your resume.
              </p>
              <Textarea
                placeholder={`ScienceLogic
Senior Backend Engineer, 12/2021 - 04/2026

Allstate
Senior Golang Engineer, 09/2019 - 11/2021

L3 Technologies
Software Engineer, 09/2015 - 09/2019
`}
                className="min-h-[300px] font-mono text-sm"
                value={careerMilestones}
                onChange={(e) => setCareerMilestones(e.target.value)}
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
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
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

            {/* PDF Template Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">PDF Template</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Choose a template style for your PDF resume download.
              </p>
              <TemplateSelector
                value={selectedTemplate}
                onChange={setSelectedTemplate}
              />
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-3">Download Options</h3>
                <p className="text-xs text-muted-foreground mb-3">Control how the generated PDF is saved.</p>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={saveInFolder}
                    onCheckedChange={(v) => setSaveInFolder(Boolean(v))}
                  />
                  <div>
                    <div className="text-sm font-medium">Save inside dated folder (mm-dd-yyyy - Target Company Name)</div>
                    <p className="text-xs text-muted-foreground">When enabled, the PDF will be saved inside a dated folder. When disabled, it will download as a single file named &quot;Full Name - TargetCompany.pdf&quot;.</p>
                  </div>
                </div>
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

      {/* Preview Modal (edit functionality removed) */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
            <DialogDescription>
              Review your tailored resume before downloading
            </DialogDescription>
          </DialogHeader>

          {resumeData && (
            <div className="border rounded-lg overflow-hidden shadow-sm my-4">
              <ResumePreview
                data={resumeData}
                editable={previewEditable}
                onDataChange={setResumeData}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => handlePreviewEditable()}>
              {previewEditable ? "Done" : "Edit"}
            </Button>
            <div className="flex items-center gap-4 max-w-xl">
              <Label
                className="w-40 text-sm font-medium text-gray-700"
              >
                Target Company Name
              </Label>

              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => handleSetCompanyName(e.target.value)}
                placeholder="Enter target company name"
                className="flex-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
            <Button onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prompt Modal (read-only) */}
      {/* <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Tailoring Prompt</DialogTitle>
            <DialogDescription>
              This is the prompt used for resume generation. Editing is disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Textarea
              className="min-h-[300px] font-mono text-sm"
              value={PROMPT_TEXT}
              readOnly
              placeholder="Prompt is read-only."
            />
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
      </Dialog> */}
    </main>
  )
}
