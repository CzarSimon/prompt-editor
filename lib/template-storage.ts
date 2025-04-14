import { v4 as uuidv4 } from 'uuid'
import { Message } from '@/components/previous-messages-editor'

export interface Template {
    id: string
    name: string
    template: string
    systemPrompt?: string
    previousMessages?: Message[]
    createdAt: string
    updatedAt: string
}

const STORAGE_KEY = 'promptTemplates'

export function saveTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Template {
    const templates = getAllTemplates()
    const newTemplate: Template = {
        ...template,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    templates.push(newTemplate)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    return newTemplate
}

export function updateTemplate(id: string, updates: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>): Template {
    const templates = getAllTemplates()
    const index = templates.findIndex(t => t.id === id)

    if (index === -1) {
        throw new Error('Template not found')
    }

    const updatedTemplate: Template = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    }

    templates[index] = updatedTemplate
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    return updatedTemplate
}

export function deleteTemplate(id: string): void {
    const templates = getAllTemplates()
    const filteredTemplates = templates.filter(t => t.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates))
}

export function getTemplate(id: string): Template | null {
    const templates = getAllTemplates()
    return templates.find(t => t.id === id) || null
}

export function getAllTemplates(): Template[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    try {
        return JSON.parse(stored)
    } catch (e) {
        console.error('Failed to parse stored templates:', e)
        return []
    }
} 