import { pdf } from "@react-pdf/renderer"
import type { ResumeData } from "../parse-resume"
import type { TemplateId } from "./types"

import { ClassicTemplate } from "./classic"
import { ModernTemplate } from "./modern"
import { MinimalTemplate } from "./minimal"
import { ExecutiveTemplate } from "./executive"
import { AcademicTemplate } from "./academic"
import { TechTemplate } from "./tech"
import { ElegantTemplate } from "./elegant"
import { BoldTemplate } from "./bold"
import { CorporateTemplate } from "./corporate"

export { TEMPLATES, DEFAULT_TEMPLATE } from "./types"
export type { TemplateId, TemplateInfo } from "./types"

const templateComponents: Record<TemplateId, React.ComponentType<{ data: ResumeData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  academic: AcademicTemplate,
  tech: TechTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
  corporate: CorporateTemplate,
}

export async function generateResumePDF(
  data: ResumeData,
  filename: string,
  templateId: TemplateId = "classic"
): Promise<void> {
  const TemplateComponent = templateComponents[templateId]
  const blob = await pdf(<TemplateComponent data={data} />).toBlob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
