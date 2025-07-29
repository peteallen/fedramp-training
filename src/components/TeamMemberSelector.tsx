import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TeamMemberSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  required?: boolean
}

const TEAM_MEMBERS = [
  { value: 'pete-allen', name: 'Pete Allen' },
  { value: 'dave-schmitt', name: 'Dave Schmitt' },
  { value: 'shelly-huber', name: 'Shelly Huber' },
  { value: 'savvy-gunawardena', name: 'Savvy Gunawardena' },
  { value: 'braden-bissegger', name: 'Braden Bissegger' },
  { value: 'krista-thompson', name: 'Krista Thompson' },
  { value: 'scalesec', name: 'ScaleSec' }
]

export function TeamMemberSelector({
  value,
  onChange,
  error,
  label = 'Your name',
  required = true
}: TeamMemberSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedMember = TEAM_MEMBERS.find(member => member.name === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2 text-left bg-white dark:bg-gray-700 border rounded-md shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "flex items-center justify-between",
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="team-member-select"
      >
        <span className={cn(
          "block truncate",
          selectedMember ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
        )}>
          {selectedMember ? selectedMember.name : 'Select your name'}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-400 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
          <ul
            className="max-h-60 overflow-auto py-1"
            role="listbox"
            aria-labelledby="team-member-select"
          >
            {TEAM_MEMBERS.map((member) => (
              <li key={member.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(member.name)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600",
                    "focus:bg-gray-100 dark:focus:bg-gray-600 focus:outline-none",
                    value === member.name && "bg-blue-50 dark:bg-blue-900/30"
                  )}
                  role="option"
                  aria-selected={value === member.name}
                >
                  {member.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}