declare module 'react-markdown' {
  import { ComponentType, ReactNode } from 'react'
  interface ReactMarkdownProps {
    children: string
    remarkPlugins?: any[]
    rehypePlugins?: any[]
    components?: Record<string, ComponentType<any>>
  }
  export default function ReactMarkdown(props: ReactMarkdownProps): ReactNode
}