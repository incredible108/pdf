export interface Education {
  degree: string
  school: string
  year: string
}

export type PersonalInfo = {
  fullName: string
  jobTitle: string
  phone: string
  email: string
  location: string
  linkedin: string
}

export interface ResumeData {
  title: string
  personalInfo: PersonalInfo
  education: Education[]
  summary: string
  technicalSkills: string[]
  professionalExperience: {
    role: string
    company: string
    duration: string
    bullets: string[]
  }[]
}

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  fullName: "",
  jobTitle: "",
  phone: "",
  email: "",
  location: "",
  linkedin: "",
}

export const DEFAULT_EDUCATION: Education[] = [
  {
    degree: "",
    school: "",
    year: "",
  },
]

/**
 * Parses the structured backend response format.
 * Expected format:
 * Title: ...
 * Professional Summary: ...
 * Skills: skill1, skill2, ...
 * Work Experience:
 * Company | Location | Role | MM/YYYY - MM/YYYY
 * bullet points...
 */
export function parseBackendResponse(content: string): Partial<ResumeData> {
  const sections: Partial<ResumeData> = {
    title: "",
    summary: "",
    technicalSkills: [],
    professionalExperience: [],
  }

  const lines = content.split("\n").map((line) => line.trim())
  let currentSection = ""
  let experienceLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Parse Title
    if (line.startsWith("Title:")) {
      sections.title = line.replace("Title:", "").trim()
      continue
    }

    // Parse Professional Summary
    if (line.startsWith("Professional Summary:")) {
      currentSection = "summary"
      const summaryContent = line.replace("Professional Summary:", "").trim()
      if (summaryContent) {
        sections.summary = summaryContent
      }
      continue
    }

    // Parse Skills
    if (line.startsWith("Skills:")) {
      currentSection = "skills"
      const skillsContent = line.replace("Skills:", "").trim()
      if (skillsContent) {
        sections.technicalSkills = skillsContent
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      }
      continue
    }

    // Parse Work Experience header
    if (line.startsWith("Work Experience:")) {
      currentSection = "experience"
      continue
    }

    // Accumulate content based on current section
    if (currentSection === "summary" && line && !line.startsWith("Skills:") && !line.startsWith("Work Experience:")) {
      sections.summary = sections.summary ? `${sections.summary} ${line}` : line
    } else if (currentSection === "experience" && line) {
      experienceLines.push(line)
    }
  }

  // Parse the accumulated experience lines
  if (experienceLines.length > 0) {
    sections.professionalExperience = parseBackendExperience(experienceLines)
  }

  return sections
}

/**
 * Parses work experience entries from the backend format.
 * Format: Company | Location | Role | MM/YYYY - MM/YYYY
 * Followed by bullet points (plain text lines)
 */
function parseBackendExperience(lines: string[]): ResumeData["professionalExperience"] {
  const experiences: ResumeData["professionalExperience"] = []
  let current: {
    role: string
    company: string
    duration: string
    bullets: string[]
  } | null = null

  // Pattern to match: Company | Location | Role | Date Range
  // Date formats: MM/YYYY - MM/YYYY or MM/YYYY - Present
  const jobHeaderPattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(\d{2}\/\d{4}\s*-\s*(?:\d{2}\/\d{4}|Present))$/i

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    const headerMatch = trimmedLine.match(jobHeaderPattern)

    if (headerMatch) {
      // Save previous experience
      if (current) {
        experiences.push(current)
      }

      const [, company, location, role, duration] = headerMatch
      current = {
        role: role.trim(),
        company: `${company.trim()}, ${location.trim()}`,
        duration: formatDuration(duration.trim()),
        bullets: [],
      }
    } else if (current) {
      // This is a bullet point - remove any leading bullet characters
      const bulletText = trimmedLine.replace(/^[-•*]\s*/, "").trim()
      if (bulletText) {
        current.bullets.push(bulletText)
      }
    }
  }

  // Don't forget the last experience
  if (current) {
    experiences.push(current)
  }

  return experiences
}

/**
 * Converts date format from MM/YYYY to Mon YYYY
 */
function formatDuration(duration: string): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  return duration.replace(/(\d{2})\/(\d{4})/g, (_, month, year) => {
    const monthIndex = parseInt(month, 10) - 1
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]} ${year}`
    }
    return `${month}/${year}`
  })
}

export function parseResumeContent(content: string): Partial<ResumeData> {
  const sections: Partial<ResumeData> = {
    title: "",
    summary: "",
    technicalSkills: [],
    professionalExperience: [],
  }

  // Normalize line breaks
  const normalizedContent = content.replace(/\r\n/g, "\n")

  // Split content into sections
  const sectionRegex = /^(summary|technical skills|professional experience)[:]*\s*$/im
  const lines = normalizedContent.split("\n")

  let currentSection = ""
  let currentContent: string[] = []
  let currentExperience: {
    role: string
    company: string
    duration: string
    bullets: string[]
  } | null = null

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Check if this line is a section header
    const sectionMatch = trimmedLine.toLowerCase()
    if (
      sectionMatch === "summary" ||
      sectionMatch === "summary:" ||
      sectionMatch === "professional summary" ||
      sectionMatch === "professional summary:"
    ) {
      // Save previous section
      saveSection()
      currentSection = "summary"
      currentContent = []
      continue
    } else if (
      sectionMatch === "technical skills" ||
      sectionMatch === "technical skills:" ||
      sectionMatch === "skills" ||
      sectionMatch === "skills:"
    ) {
      saveSection()
      currentSection = "skills"
      currentContent = []
      continue
    } else if (
      sectionMatch === "professional experience" ||
      sectionMatch === "professional experience:" ||
      sectionMatch === "experience" ||
      sectionMatch === "experience:" ||
      sectionMatch === "work experience" ||
      sectionMatch === "work experience:"
    ) {
      saveSection()
      currentSection = "experience"
      currentContent = []
      currentExperience = null
      continue
    }

    // Add content to current section
    if (currentSection && trimmedLine) {
      currentContent.push(trimmedLine)
    }
  }

  // Save the last section
  saveSection()

  function saveSection() {
    if (currentSection === "summary") {
      sections.summary = currentContent.join(" ")
    } else if (currentSection === "skills") {
      const skills: string[] = []

      for (const line of currentContent) {
        // Split by common delimiters (comma, bullet, pipe)
        const parts = line.split(/[,•|\u2022]/)

        for (let part of parts) {
          part = part.trim()

          // Remove leading dash if exists
          part = part.replace(/^[-–]\s*/, "")

          if (part.length > 1) {
            skills.push(part)
          }
        }
      }
      // Remove duplicates
      sections.technicalSkills = Array.from(new Set(skills))
    } else if (currentSection === "experience") {
      sections.professionalExperience = parseExperience(currentContent)
    }
  }

  return sections
}

function parseExperience(
  lines: string[]
): ResumeData["professionalExperience"] {
  const experiences: ResumeData["professionalExperience"] = []
  let current: {
    role: string
    company: string
    duration: string
    bullets: string[]
  } | null = null

  // Date pattern: "Month Year - Month Year" or "Month Year - Present"
  // Examples: "Mar 2020 - Feb 2026", "Nov 2017 - Present"
  const datePattern = /([A-Z][a-z]+\s+\d{4})\s*[-–]\s*(Present|Current|[A-Z][a-z]+\s+\d{4})/i


  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine === '|') continue

    // Support pipe-separated job lines: Role | Company | Period
    if (trimmedLine.includes('|')) {
      const parts = trimmedLine.split('|').map(s => s.trim()).filter(Boolean)
      if (parts.length === 3) {
        if (current) experiences.push(current)
        current = {
          role: parts[0],
          company: parts[1],
          duration: parts[2],
          bullets: []
        }
        continue
      }
    }

    const dateMatch = trimmedLine.match(datePattern)
    const isJobHeader = dateMatch && dateMatch.index !== undefined && dateMatch.index > 0

    if (isJobHeader) {
      if (current) experiences.push(current)
      const duration = dateMatch![0].trim()
      const beforeDate = trimmedLine.substring(0, dateMatch!.index).trim()
      const tokens = beforeDate.split(/\s+/)
      let company = ""
      let role = ""
      if (tokens.length >= 2) {
        const possibleTwoWordCompany = tokens.slice(-2).join(" ")
        if (/^[A-Z][a-z]*\s+[A-Z][a-z]*$/.test(possibleTwoWordCompany)) {
          company = possibleTwoWordCompany
          role = tokens.slice(0, -2).join(" ")
        } else {
          company = tokens[tokens.length - 1]
          role = tokens.slice(0, -1).join(" ")
        }
      } else if (tokens.length === 1) {
        company = tokens[0]
        role = ""
      }
      current = { role, company, duration, bullets: [] }
    } else if (current && trimmedLine) {
      const bulletText = trimmedLine.replace(/^[-•*]\s*/, "").trim()
      if (bulletText) {
        current.bullets.push(bulletText)
      }
    }
  }

  // Don't forget the last experience
  if (current) {
    experiences.push(current)
  }

  return experiences
}
