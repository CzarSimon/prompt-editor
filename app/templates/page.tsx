"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Template, getAllTemplates, deleteTemplate } from "@/lib/template-storage"

export default function TemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const savedTemplates = getAllTemplates()
    setTemplates(savedTemplates)
  }, [])

  const handleDeleteTemplate = (id: string) => {
    try {
      deleteTemplate(id)
      setTemplates(getAllTemplates())
      toast({
        title: "Template Deleted",
        description: "The template has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the template.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Templates</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No Templates Found</h2>
          <p className="mb-6">You haven't created any templates yet.</p>
          <Link href="/editor/new">
            <Button>Create Your First Template</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                </p>
                <p className="line-clamp-3">{template.template}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/editor/${template.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
