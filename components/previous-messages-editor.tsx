"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export interface Message {
    role: "user" | "assistant" | "system"
    content: string
}

interface PreviousMessagesEditorProps {
    messages: Message[]
    setMessages: (messages: Message[]) => void
}

export default function PreviousMessagesEditor({
    messages,
    setMessages,
}: PreviousMessagesEditorProps) {
    const [newRole, setNewRole] = useState<"user" | "assistant" | "system">("user")
    const [newContent, setNewContent] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        // Auto-resize the textarea based on content
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [newContent])

    const handleAddMessage = () => {
        if (!newContent.trim()) return

        const newMessage: Message = {
            role: newRole,
            content: newContent.trim(),
        }

        setMessages([...messages, newMessage])
        setNewContent("")
    }

    const handleRemoveMessage = (index: number) => {
        const updatedMessages = [...messages]
        updatedMessages.splice(index, 1)
        setMessages(updatedMessages)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Previous Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {messages.length > 0 && (
                    <div className="space-y-2">
                        <Label>Existing Messages</Label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-md flex justify-between items-start ${message.role === "user"
                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                            : message.role === "assistant"
                                                ? "bg-green-50 dark:bg-green-900/20"
                                                : "bg-purple-50 dark:bg-purple-900/20"
                                        }`}
                                >
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm mb-1 capitalize">{message.role}</div>
                                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleRemoveMessage(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Add New Message</Label>
                    <div className="flex gap-2 mb-2">
                        <Button
                            variant={newRole === "user" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewRole("user")}
                        >
                            User
                        </Button>
                        <Button
                            variant={newRole === "assistant" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewRole("assistant")}
                        >
                            Assistant
                        </Button>
                        <Button
                            variant={newRole === "system" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewRole("system")}
                        >
                            System
                        </Button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        onInput={(e) => {
                            e.currentTarget.style.height = "auto"
                            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                        }}
                        className="w-full min-h-[100px] p-3 font-mono resize-none border rounded-md"
                        placeholder={`Enter ${newRole} message...`}
                    />
                    <Button onClick={handleAddMessage} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Message
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 