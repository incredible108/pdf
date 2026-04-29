export interface Education {
  degree: string
  school: string
  year: string
}

export type PersonalInfo = {
  fullName: string
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
  skills: string[]
  workexperience: {
    role: string
    companyname: string
    duration: string
    experience: string[]
  }[]
}

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  fullName: "",
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
