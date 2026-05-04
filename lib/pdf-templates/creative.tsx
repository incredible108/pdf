import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData } from "../parse-resume"

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  sidebar: {
    width: 180,
    backgroundColor: "#7c3aed",
    padding: 20,
    paddingTop: 40,
  },
  mainContent: {
    flex: 1,
    padding: 30,
    paddingTop: 40,
  },
  sidebarName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  sidebarTitle: {
    fontSize: 10,
    color: "#e9d5ff",
    marginBottom: 20,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarSectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#e9d5ff",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#8b5cf6",
  },
  sidebarText: {
    fontSize: 9,
    color: "#ffffff",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  sidebarSkill: {
    fontSize: 8,
    color: "#ffffff",
    backgroundColor: "#8b5cf6",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 4,
    marginRight: 4,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#7c3aed",
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#e9d5ff",
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#4b5563",
  },
  experienceItem: {
    marginTop: 14,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  experienceRole: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
  },
  experienceDuration: {
    fontSize: 8,
    color: "#7c3aed",
    backgroundColor: "#f3e8ff",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  experienceCompany: {
    fontSize: 10,
    color: "#7c3aed",
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    color: "#7c3aed",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
    color: "#4b5563",
  },
  educationItem: {
    marginBottom: 8,
  },
  educationDegree: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
  },
  educationSchool: {
    fontSize: 9,
    color: "#6b7280",
  },
  educationYear: {
    fontSize: 8,
    color: "#7c3aed",
  },
})

export const CreativeTemplate = ({ data }: { data: ResumeData }) => {
  const { personalInfo, education, summary, skills, workexperience } = data
  const contactItems = [
    { label: "Phone", value: personalInfo.phone },
    { label: "Email", value: personalInfo.email },
    { label: "Location", value: personalInfo.location },
  ].filter((item) => item.value)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{personalInfo.fullName}</Text>
          <Text style={styles.sidebarTitle}>{personalInfo.title}</Text>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Contact</Text>
            {contactItems.map((item, index) => (
              <Text key={index} style={styles.sidebarText}>{item.value}</Text>
            ))}
          </View>

          {/* Skills in sidebar */}
          {skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              <View style={styles.skillsWrap}>
                {skills.slice(0, 15).map((skill, index) => (
                  <Text key={index} style={styles.sidebarSkill}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Education in sidebar */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={[styles.sidebarText, { fontFamily: "Helvetica-Bold" }]}>{edu.degree}</Text>
                <Text style={styles.sidebarText}>{edu.school}</Text>
                <Text style={[styles.sidebarText, { color: "#e9d5ff" }]}>{edu.year}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}

          {workexperience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {workexperience.map((exp, index) => (
                <View key={index} style={index === 0 ? undefined : styles.experienceItem} wrap={true}>
                  <View wrap={false}>
                    <View style={styles.experienceHeader}>
                      {exp.companyname && <Text style={styles.experienceRole}>{exp.companyname}</Text>}
                      {exp.duration && <Text style={styles.experienceDuration}>{exp.duration}</Text>}
                    </View>
                    <Text style={styles.experienceCompany}>{exp.role}</Text>
                  </View>
                  <View style={styles.bulletList}>
                    {exp.experience.map((bullet, bulletIndex) => (
                      <View key={bulletIndex} style={styles.bulletItem} wrap={false}>
                        <Text style={styles.bullet}>●</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Additional skills that didn't fit in sidebar */}
          {skills.length > 15 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Skills</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {skills.slice(15).map((skill, index) => (
                  <Text key={index} style={{
                    fontSize: 8,
                    backgroundColor: "#f3e8ff",
                    color: "#7c3aed",
                    paddingVertical: 3,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                  }}>{skill}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
