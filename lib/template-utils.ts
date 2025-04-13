export function extractVariables(template: string): string[] {
  const regex = /\$([a-zA-Z0-9_]+)/g
  const matches = []
  let match

  // Find all matches
  while ((match = regex.exec(template)) !== null) {
    matches.push(match[1])
  }

  // Remove duplicates
  return [...new Set(matches)]
}

export function populateTemplate(template: string, variables: Record<string, string>): string {
  let populated = template
  Object.entries(variables).forEach(([key, value]) => {
    // Fix: Use the correct regex pattern to match $variableName
    populated = populated.replace(new RegExp(`\\$${key}`, "g"), value)
  })
  return populated
}
