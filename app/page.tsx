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
import { FileDown, AlertCircle, Settings, Plus, Trash2, Briefcase, Pencil, Eye } from "lucide-react"
import { FunnyLoadingBar } from "@/components/funny-loading-bar"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
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
const STORAGE_KEY_COMPANY = "resume_company_name"
const STORAGE_KEY_USE_COMPANY = "resume_use_company_name"
const STORAGE_KEY_DOWNLOAD_JD = "resume_download_jd_with_pdf"

const PROMPT_TEXT = `First, I will provide my template resume. Then, I will share different job descriptions one by one. For each job description, tailor my resume specifically to that role. Each tailored resume should align only with the provided job description and should not reference or relate to any others.

- Tailor Conditions:
    1. Resume Structure
        
        Resume must have only 4 sections:
        - target_company
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
    3. target_company
        - Extract the company name from the job description exactly as written
        - If no company name is present, use ""
    4. For Professional Experience Section:
        - Work experience from all companies (mentioned in Template Resume) must be included and fully detailed
        - Each bullet point must align with the job description’s responsibilities and required technical skills.
        - Each sentence must be LONG and descriptive, clearly outlining detailed responsibilities, achievements, and accomplishments, while naturally incorporating the technical skills, tools, and technologies used.
        - Every sentence should include action verbs, technical skills, and soft skills from the job description where relevant.
        - Each sentence must not be skills list sentence. They must be human readable, senior professional, outcome and achievement focused rather than what I did.
        - Sentences must be written in a professional, Outcome and achievement focused, and results-oriented style suitable for ATS scanning and recruiter readability.
        - Write each company’s experience with real-world projects from my Template Resumes’ Experience.
        - Ensure each company’s listed experience reflects its respective role.
        - Write each companies’ experience based on job description and my Template Resume’s Experience.
        - Incorporate “nice-to-have” skills from the job description where relevant.
        - Include soft skills from the job description, aligned with each company’s role.
        - Ensure the timeline of skills is historically accurate (e.g., FastAPI, released in December 2018, should not be included in Stripe company experience, since employment ended in Auguest 2015). Apply this logic to all skills.
        - Minimum 9 bullet points per company
    5. For Technical Skills Section:
        - Must include all technical skills, programming languages, frameworks, cloud, DevOps, tools and others mentioned in the job description.
        - Also include “nice-to-have” skills.
        - Include up to 60 skills if relevant.
        - Always include my Template Resume’s Technical Skills
        - Add all related skills from both required and nice-to-have lists.
    6. Final Requirements:
        - Resume must achieve **100% ATS score**.
        - No spelling, grammar, readability, or formatting errors.
        - Never include am dash or an dash like this GPT style symbols.
    7. Output
        - First save tailored resume in draft(don't show drafted resume) and evaluate how strong tailored resume matched with JD. (ATS score, Human Review Score, Seniority Score, like ATS: X/10 Human Review: Y/10 Seniority: Z/10) - (Seniority mean which parts are look like junior like resume)
        - Provide why ATS score is X and why Human Review score is Y and why Seniority score is Z.
        - Detect AI written style phrases like “Proven track record of”, “Results-driven professional”, “Highly motivated self-starter”, “Leveraged cutting-edge technologies”, “Passionate about driving innovation”, etc.
        - Provide recommended fixes to increase ATS score and Human Review score and Seniority score.
        - Then for the next step fix your recommend fixes and convert detected AI written style phrases to human style
        - And again recommend fixes to increase ATS score, Human Review score and Seniority score, and also again detect AI written style phrases.
        - Then for the next step fix your second recommend fixes and convert second detected AI written style phrases to human style.
        - Repeat these steps until ATS score >= 9.5, Human Review score >= 9.3, Seniority score >=9.3
        - After scores satisfied minimum requirements, provide again ATS score and Human Review score and Seniority score.
        - And then provide final resume with below JSON format:
            {
              "target_company": "...",
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

<<<<<<< Updated upstream
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
"target_company": "...",
"summary": "...",
"skills": ["...", "..."],
"workexperience": [
{
"companyname": "...",
"role": "...",
"duration": "MMM YYYY - MMM YYYY",(like Mar 2020 - Apr 2024)
"experience": ["...", "...", "..."]
}
]
}

---

Field Requirements

target_company

* Extract the company name from the job description exactly as written
* If no company name is present, use ""

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
=======
Template Resume:
>>>>>>> Stashed changes

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
  const [useCompanyName, setUseCompanyName] = useState(true)
  const [saveInFolder, setSaveInFolder] = useState(false)
  const [downloadJDWithPDF, setDownloadJDWithPDF] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
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
    const savedCompany = localStorage.getItem(STORAGE_KEY_COMPANY)
    if (savedCompany) {
      setCompanyName(savedCompany)
    }
    const savedUseCompany = localStorage.getItem(STORAGE_KEY_USE_COMPANY)
    if (savedUseCompany !== null) {
      try {
        setUseCompanyName(JSON.parse(savedUseCompany))
      } catch {
        setUseCompanyName(savedUseCompany === 'true')
      }
    }
    const savedDownloadJD = localStorage.getItem(STORAGE_KEY_DOWNLOAD_JD)
    if (savedDownloadJD !== null) {
      try {
        setDownloadJDWithPDF(JSON.parse(savedDownloadJD))
      } catch {
        setDownloadJDWithPDF(savedDownloadJD === 'true')
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
    localStorage.setItem(STORAGE_KEY_COMPANY, String(companyName || ''))
    localStorage.setItem(STORAGE_KEY_USE_COMPANY, JSON.stringify(useCompanyName))
    localStorage.setItem(STORAGE_KEY_DOWNLOAD_JD, JSON.stringify(downloadJDWithPDF))
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
      setError("Please add your Template Resume in Settings first")
      return
    }

    setError("")
    setIsGenerating(true)

    try {
      // Build the full prompt
      const fullPrompt = `${PROMPT_TEXT.replace("Template Resume:", `Template Resume:\n${careerMilestones}`).replace("JD:", `JD:\n${jobDescription}`)}`

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

      handleSetCompanyName(parsed.target_company)

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
    if (isDownloading) return
    setIsDownloading(true)

    try {
      const { generateResumePDF } = await import("@/lib/pdf-templates")
      // Build a safe folder name: YYYY-MM-DD_HH-MM-SS - CompanyName
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, "0")
      const mm1 = String(now.getMinutes()).padStart(2, "0")
      const ss = String(now.getSeconds()).padStart(2, "0")
      const mm = String(now.getMonth() + 1).padStart(2, "0")
      const dd = String(now.getDate()).padStart(2, "0")
      const yyyy = String(now.getFullYear())
      const safeCompany = useCompanyName && companyName?.trim() ? companyName.trim().replace(/[^a-zA-Z0-9 _-]/g, "_") : ""
      const safeCompanyPart = safeCompany || ""
      // folderName shown to user as YYYY-MM-DD_HH-MM-SS - Company, use this for creation
      const safeFolder = `${yyyy}-${mm}-${dd}_${hh}-${mm1}-${ss}${safeCompany ? ` - ${safeCompany}` : ""}`
      // always name the file `resume.pdf`
      const safeFullName = personalInfo.fullName
        ? String(personalInfo.fullName).trim().replace(/[^a-zA-Z0-9 _-]/g, "_")
        : "resume"

      if (saveInFolder) {
        const filename = `${safeFullName}.pdf`
        await generateResumePDF(
          resumeData,
          filename,
          saveInFolder,
          selectedTemplate,
          safeFolder,
          downloadJDWithPDF ? jobDescription : undefined,
        )
      } else {
        // Download as a single file: "Full Name - TargetCompany.pdf"
        const filename = safeCompanyPart
          ? `${safeFullName} - ${safeCompanyPart}.pdf`
          : `${safeFullName}.pdf`
        await generateResumePDF(resumeData, filename, saveInFolder, selectedTemplate)
      }
    } catch (error) {
      console.error("PDF generation error:", error)
      setError("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
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
            {/* Template Resumes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Template Resume</h3>
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
            </div>

            {/* Download Options */}
            <div>
              <h3 className="text-sm font-medium mb-3">Download Options</h3>
              <div className="flex flex-column gap-3">
                <div className="mt-4 space-x-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={saveInFolder}
                      onCheckedChange={(v) => setSaveInFolder(Boolean(v))}
                    />
                    <div>
                      <div className="text-sm font-medium">Save inside dated folder (yyyy-mm-dd_hh-mm-ss - Target Company Name)</div>
                      <p className="text-xs text-muted-foreground">When enabled, the PDF will be saved inside a dated folder. When disabled, it will download as a single file..</p>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={downloadJDWithPDF}
                        onCheckedChange={(v) => {
                          if (!saveInFolder) return
                          setDownloadJDWithPDF(Boolean(v))
                        }}
                        disabled={!saveInFolder}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium">Also download job description with resume</div>
                        <p className="text-xs text-muted-foreground">When enabled and "Save inside dated folder" is on, your pasted job description will be saved as job-description.txt alongside the PDF download.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={useCompanyName}
                      onCheckedChange={(v) => setUseCompanyName(Boolean(v))}
                    />
                    <div>
                      <div className="text-sm font-medium">Include company name in folder/file name</div>
                      <p className="text-xs text-muted-foreground">When enabled, the target company name will be appended to folder and file names where applicable.</p>
                    </div>
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
            {useCompanyName && (
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
            )}
            <Button onClick={handleDownloadPDF} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Downloading
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  )
}
