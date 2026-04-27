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
  const lines = normalizedContent.split("\n")

  let currentSection = ""
  let currentContent: string[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Parse "Title:" line (backend format)
    if (trimmedLine.startsWith("Title:")) {
      sections.title = trimmedLine.replace("Title:", "").trim()
      continue
    }

    // Check if this line is a section header
    const sectionMatch = trimmedLine.toLowerCase()
    if (
      sectionMatch === "summary" ||
      sectionMatch === "summary:" ||
      sectionMatch === "professional summary" ||
      sectionMatch === "professional summary:" ||
      trimmedLine.startsWith("Professional Summary:")
    ) {
      // Save previous section
      saveSection()
      currentSection = "summary"
      currentContent = []
      // Handle inline content after "Professional Summary:"
      if (trimmedLine.startsWith("Professional Summary:")) {
        const inlineContent = trimmedLine.replace("Professional Summary:", "").trim()
        if (inlineContent) {
          currentContent.push(inlineContent)
        }
      }
      continue
    } else if (
      sectionMatch === "technical skills" ||
      sectionMatch === "technical skills:" ||
      sectionMatch === "skills" ||
      sectionMatch === "skills:" ||
      trimmedLine.startsWith("Skills:")
    ) {
      saveSection()
      currentSection = "skills"
      currentContent = []
      // Handle inline content after "Skills:"
      if (trimmedLine.startsWith("Skills:")) {
        const inlineContent = trimmedLine.replace("Skills:", "").trim()
        if (inlineContent) {
          currentContent.push(inlineContent)
        }
      }
      continue
    } else if (
      sectionMatch === "professional experience" ||
      sectionMatch === "professional experience:" ||
      sectionMatch === "experience" ||
      sectionMatch === "experience:" ||
      sectionMatch === "work experience" ||
      sectionMatch === "work experience:" ||
      trimmedLine.startsWith("Work Experience:")
    ) {
      saveSection()
      currentSection = "experience"
      currentContent = []
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
        const parts = line.split(/[,•\u2022]/)

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

  // Patterns for various formats
  // 1. Company | Role | MM/YYYY - MM/YYYY
  const pipePattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(\d{2}\/\d{4}\s*-\s*(?:\d{2}\/\d{4}|Present|Current))$/i
  // 2. Company | Role, MM/YYYY - MM/YYYY
  const pipeCommaPattern = /^(.+?)\s*\|\s*(.+?),\s*(\d{2}\/\d{4}\s*-\s*(?:\d{2}\/\d{4}|Present|Current))$/i
  // 3. Company, Role, MM/YYYY - MM/YYYY
  const commaPattern = /^(.+?),\s*(.+?),\s*(\d{2}\/\d{4}\s*-\s*(?:\d{2}\/\d{4}|Present|Current))$/i

  // Date pattern: "Month Year - Month Year" or "Month Year - Present"
  const datePattern = /([A-Z][a-z]+\s+\d{4})\s*[-–]\s*(Present|Current|[A-Z][a-z]+\s+\d{4})/i

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine === '|') continue

    // 1. Company | Role | MM/YYYY - MM/YYYY
    let m = trimmedLine.match(pipePattern)
    if (m) {
      if (current) experiences.push(current)
      const [, company, role, duration] = m
      current = {
        role: role.trim(),
        company: company.trim(),
        duration: formatDuration(duration.trim()),
        bullets: []
      }
      continue
    }

    // 2. Company | Role, MM/YYYY - MM/YYYY
    m = trimmedLine.match(pipeCommaPattern)
    if (m) {
      if (current) experiences.push(current)
      const [, company, role, duration] = m
      current = {
        role: role.trim(),
        company: company.trim(),
        duration: formatDuration(duration.trim()),
        bullets: []
      }
      continue
    }

    // 3. Company, Role, MM/YYYY - MM/YYYY
    m = trimmedLine.match(commaPattern)
    if (m) {
      if (current) experiences.push(current)
      const [, company, role, duration] = m
      current = {
        role: role.trim(),
        company: company.trim(),
        duration: formatDuration(duration.trim()),
        bullets: []
      }
      continue
    }

    // Support simple pipe-separated job lines: Role | Company | Period
    if (trimmedLine.includes('|')) {
      const parts = trimmedLine.split('|').map(s => s.trim()).filter(Boolean)
      if (parts.length === 3) {
        if (current) experiences.push(current)
        // Try to guess which part is company/role/duration
        // If last part matches MM/YYYY - MM/YYYY, treat as duration
        if (/\d{2}\/\d{4}\s*-\s*(\d{2}\/\d{4}|Present|Current)/.test(parts[2])) {
          current = {
            company: parts[0],
            role: parts[1],
            duration: formatDuration(parts[2]),
            bullets: []
          }
        } else {
          // fallback: role, company, duration
          current = {
            role: parts[0],
            company: parts[1],
            duration: parts[2],
            bullets: []
          }
        }
        continue
      }
    }

    // Support comma-separated job lines: Company, Role, Period
    if (trimmedLine.split(',').length === 3) {
      const parts = trimmedLine.split(',').map(s => s.trim())
      if (/\d{2}\/\d{4}\s*-\s*(\d{2}\/\d{4}|Present|Current)/.test(parts[2])) {
        if (current) experiences.push(current)
        current = {
          company: parts[0],
          role: parts[1],
          duration: formatDuration(parts[2]),
          bullets: []
        }
        continue
      }
    }

    // Fallback: detect date at end
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
