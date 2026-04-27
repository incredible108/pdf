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
import { FileDown, FileText, AlertCircle, Settings, Plus, Trash2, Briefcase, Pencil, Eye } from "lucide-react"
import { FunnyLoadingBar } from "@/components/funny-loading-bar"
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
const STORAGE_KEY_CAREER_MILESTONES = "resume_career_milestones"

const PROMPT_TEXT = `Generate a fully tailored, ATS-optimized, and professionally written resume based on my career milestones and the provided job description.

The system must ITERATE and SELF-IMPROVE the resume until the ATS score exceeds 90%.

---

## 🔁 Iteration & ATS Optimization Loop (MANDATORY)

After generating the resume:

1. Evaluate the resume against the job description using an ATS scoring model (0–100%).
2. Provide a breakdown of the ATS score based on:

   - Keyword match
   - Skills alignment
   - Experience relevance
   - Role/title alignment
   - Use of measurable impact
   - Formatting & ATS readability
3. If the ATS score is BELOW 90%:

   - Identify ALL gaps (missing keywords, weak phrasing, missing tools, etc.)
   - Improve the resume by:
     - Injecting missing keywords naturally
     - Strengthening bullet points with more measurable impact
     - Improving alignment with required and preferred skills
     - Adjusting phrasing to match recruiter search patterns
     - Enhancing technical depth where needed
4. Regenerate the FULL resume with improvements.
5. Repeat this process until:
   ✅ ATS Score ≥ 90%
6. Output ONLY the FINAL optimized resume (do NOT include intermediate versions unless explicitly requested).

---

## Required Output Format

The final output must strictly follow this exact structure:

**Title:**
**Professional Summary:**
**Skills:**
**Work Experience:**

Do not change this format.

---

## Title

Generate a highly targeted and job-specific professional title that directly matches the job description.

The title should reflect seniority and alignment with the target role.

Examples:

* Senior Full Stack Software Engineer
* Senior .NET / React Engineer
* Principal Software Engineer
* Senior Cloud Application Developer
* Lead Backend Engineer

The title must be ATS-friendly and recruiter-search optimized.

---

## Professional Summary

Write a strong, concise, and impactful professional summary.

Requirements:

* 4–6 lines
* senior-level tone
* highly tailored to the job description
* include top ATS keywords naturally
* highlight years of experience
* mention core technical strengths
* include relevant domain/industry expertise
* reflect architecture, development, modernization, and leadership capabilities

The summary must immediately position the candidate as a strong match for the role.

---

## Skills

Generate the most important and critical technical skills up to 45 items, strictly separated by commas in a single line.

This section must be highly ATS-optimized and based on:

1. the exact job description
2. top recruiter search keywords
3. closely related technologies
4. industry-critical terminology
5. adjacent tools and platforms commonly searched for this role

The skills must prioritize the most critical technologies first.

Maximum: 45 skills
Format: comma-separated only

---

## Work Experience

This section must be the strongest part of the output.

For each company, generate more than 8 bullet points
(minimum 9 bullet points per company).

Each company must have:

* unique bullet points
* unique project scope
* unique business goals
* unique engineering challenges
* unique measurable outcomes

---

## Technical Requirements for Work Experience

Every bullet point must clearly explain:

* what project/system was worked on
* what technologies were used
* why those technologies were chosen
* what business problem was solved
* what measurable impact was delivered

Preferred structure:

Action + Technology + Project Scope + Business Impact

---

## Timeline Accuracy Rule

All technologies must be period-accurate.

Do not include tools or frameworks that were not available during that time.

This rule is mandatory.

---

## Tailoring Requirements

The resume must be fully customized to the provided job description.

Include:

* all required skills
* preferred skills
* role-specific terminology
* architecture keywords
* domain language
* leadership expectations
* critical engineering keywords recruiters search for

---

## Uniqueness Requirement

Every company must reflect its own:

* business domain
* engineering priorities
* system architecture
* product objectives
* measurable business value

No repeated bullets.
No repeated sentence structures.
No recycled wording.

---

## Final Output Rule

Only output the FINAL resume version that achieves:

✅ ATS Score ≥ 90%
❌ Do NOT show intermediate drafts
❌ Do NOT show scoring iterations unless asked

The result must be production-ready and recruiter-quality.

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

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
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
  }, [])

  // Prompt is no longer saved to localStorage

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY_PERSONAL, JSON.stringify(personalInfo))
    localStorage.setItem(STORAGE_KEY_EDUCATION, JSON.stringify(education))
    localStorage.setItem(STORAGE_KEY_CAREER_MILESTONES, careerMilestones)
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
      const response = await fetch("https://pdf-backend-495j.onrender.com/scrape-qwen", {
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

      // Parse the generated resume content
      const parsed = parseResumeContent(generatedContent)

      const fullResumeData: ResumeData = {
        personalInfo,
        education,
        summary: parsed.summary || "",
        technicalSkills: parsed.technicalSkills || [],
        professionalExperience: parsed.professionalExperience || [],
        title: parsed.title || "",
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
                editable={false}
              />
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
