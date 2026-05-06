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
  templateId: TemplateId = "classic",
  isDirectory: boolean,
  folderName?: string
): Promise<void> {
  const TemplateComponent = templateComponents[templateId]
  const blob = await pdf(<TemplateComponent data={data} />).toBlob()

  if (isDirectory) {
    try {
      // @ts-ignore - these APIs may not exist in all browsers
      if (window.showDirectoryPicker) {
        // Ask user to pick a parent folder
        // This will prompt the user to select where they want to save the generated folder
        // and file. The app cannot write without explicit user permission.
        // eslint-disable-next-line no-undef
        const parentHandle = await (window as any).showDirectoryPicker()

        // Sanitize folder name and use fallback if none provided
        const safeFolder = folderName && String(folderName).trim().length > 0 ? String(folderName) : 'Resume'

        // Create (or get) the dated/company folder
        const dirHandle = await parentHandle.getDirectoryHandle(safeFolder, { create: true })

        // Create (or get) the file handle
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
        return
      }
    } catch (err) {
      // If something goes wrong with FS API, we'll fallback to download below
      // eslint-disable-next-line no-console
      console.warn('File System Access API failed, falling back to download', err)
      return
    }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
