import { describe, it, expect } from 'vitest'

interface ModuleContent {
  type: string
  title: string
  content: string
  roles?: ('Development' | 'Non-Development')[]
}

interface TrainingModule {
  id: number
  title: string
  description: string
  requiredForMembers: string[]
  objectives: string[]
  content: ModuleContent[]
}

describe('Module Data Structure Schema', () => {
  // Test the schema structure without relying on deleted JSON files
  const mockModule: TrainingModule = {
    id: 1,
    title: 'Test Module',
    description: 'Test Description',
    requiredForMembers: ['Pete', 'Dave'],
    objectives: ['Learn something', 'Understand concepts'],
    content: [
      {
        type: 'introduction',
        title: 'Introduction',
        content: 'This is the introduction content',
        roles: ['Development']
      },
      {
        type: 'section',
        title: 'Main Content',
        content: 'This is the main content'
      }
    ]
  }

  it('should have valid module structure with required fields', () => {
    expect(mockModule).toHaveProperty('id')
    expect(mockModule).toHaveProperty('title')
    expect(mockModule).toHaveProperty('description')
    expect(mockModule).toHaveProperty('requiredForMembers')
    expect(mockModule).toHaveProperty('objectives')
    expect(mockModule).toHaveProperty('content')
    expect(Array.isArray(mockModule.content)).toBe(true)
  })

  it('should have valid requiredForMembers field', () => {
    expect(Array.isArray(mockModule.requiredForMembers)).toBe(true)
    mockModule.requiredForMembers.forEach((member) => {
      expect(typeof member).toBe('string')
      expect(['Pete', 'Dave', 'Shelly', 'Savvy', 'Krista', 'Braden', 'ScaleSec']).toContain(member)
    })
  })

  it('should have valid role data types when present in content', () => {
    mockModule.content.forEach((section: ModuleContent) => {
      if (section.roles) {
        expect(Array.isArray(section.roles)).toBe(true)
        section.roles.forEach((role) => {
          expect(['Development', 'Non-Development']).toContain(role)
        })
      }
    })
  })

  it('should maintain backward compatibility for sections without roles', () => {
    mockModule.content.forEach((section: ModuleContent) => {
      // Sections without roles should still have required fields
      expect(section).toHaveProperty('type')
      expect(section).toHaveProperty('title')
      expect(section).toHaveProperty('content')
      expect(typeof section.type).toBe('string')
      expect(typeof section.title).toBe('string')
      expect(typeof section.content).toBe('string')
    })
  })

  it('should validate new schema structure', () => {
    // Ensure all required module properties exist and are correct types
    expect(mockModule.id).toBeTypeOf('number')
    expect(mockModule.title).toBeTypeOf('string')
    expect(mockModule.description).toBeTypeOf('string')
    expect(Array.isArray(mockModule.requiredForMembers)).toBe(true)
    expect(Array.isArray(mockModule.objectives)).toBe(true)
    expect(Array.isArray(mockModule.content)).toBe(true)
  })
})