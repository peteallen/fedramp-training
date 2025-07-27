import { describe, it, expect } from 'vitest'
import module1 from './modules/1.json'
import module2 from './modules/2.json'

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
  category: string
  estimatedTime: string
  difficulty: string
  objectives: string[]
  content: ModuleContent[]
  quiz: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
}

describe('Module Data Structure with Roles', () => {
  const modules = [module1, module2] as TrainingModule[]

  it('should have valid module structure', () => {
    modules.forEach((module) => {
      expect(module).toHaveProperty('id')
      expect(module).toHaveProperty('title')
      expect(module).toHaveProperty('content')
      expect(Array.isArray(module.content)).toBe(true)
    })
  })

  it('should have valid role data types when present', () => {
    modules.forEach((module) => {
      module.content.forEach((section) => {
        if (section.roles) {
          expect(Array.isArray(section.roles)).toBe(true)
          section.roles.forEach((role) => {
            expect(['Development', 'Non-Development']).toContain(role)
          })
        }
      })
    })
  })

  it('should have at least 3 sections with role information across all modules', () => {
    let sectionsWithRoles = 0
    
    modules.forEach((module) => {
      module.content.forEach((section) => {
        if (section.roles && section.roles.length > 0) {
          sectionsWithRoles++
        }
      })
    })

    expect(sectionsWithRoles).toBeGreaterThanOrEqual(3)
  })

  it('should maintain backward compatibility for sections without roles', () => {
    modules.forEach((module) => {
      module.content.forEach((section) => {
        // Sections without roles should still have required fields
        expect(section).toHaveProperty('type')
        expect(section).toHaveProperty('title')
        expect(section).toHaveProperty('content')
        expect(typeof section.type).toBe('string')
        expect(typeof section.title).toBe('string')
        expect(typeof section.content).toBe('string')
      })
    })
  })

  it('should have specific role assignments in test modules', () => {
    // Module 1 should have Development role section
    const module1DevSection = module1.content.find(
      section => section.title === 'Scope & Context'
    )
    expect(module1DevSection?.roles).toEqual(['Development'])

    // Module 2 should have Development role section
    const module2DevSection = module2.content.find(
      section => section.title === 'Just‑in‑Time Training'
    )
    expect(module2DevSection?.roles).toEqual(['Development'])

    // Module 2 should have both roles section
    const module2BothSection = module2.content.find(
      section => section.title === 'AT‑2(02): Insider Threat Awareness'
    )
    expect(module2BothSection?.roles).toEqual(['Development', 'Non-Development'])
  })

  it('should not break existing content structure', () => {
    modules.forEach((module) => {
      // Ensure all required module properties exist
      expect(module.id).toBeTypeOf('number')
      expect(module.title).toBeTypeOf('string')
      expect(module.description).toBeTypeOf('string')
      expect(module.category).toBeTypeOf('string')
      expect(Array.isArray(module.objectives)).toBe(true)
      expect(Array.isArray(module.content)).toBe(true)
      expect(Array.isArray(module.quiz)).toBe(true)
    })
  })
})