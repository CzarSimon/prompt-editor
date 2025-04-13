import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Prompt Engineer</h1>
      <p className="text-lg mb-8">Build, test, and refine your AI prompts with our interactive editor.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
            <CardDescription>Start from scratch with a new prompt template</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Build a prompt template with variables, test it with different inputs, and refine it based on feedback.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/editor/new" className="w-full">
              <Button className="w-full">Create New Template</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Templates</CardTitle>
            <CardDescription>View and edit your saved templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access your previously created templates, continue refining them, or create variations.</p>
          </CardContent>
          <CardFooter>
            <Link href="/templates" className="w-full">
              <Button className="w-full" variant="outline">
                View Templates
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
