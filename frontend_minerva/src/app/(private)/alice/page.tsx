"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot } from "lucide-react"

export default function AlicePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Fale com Alice</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Assistente Virtual Alice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Olá! Eu sou a Alice, sua assistente virtual. Como posso te ajudar hoje?
          </p>
          
          <div className="flex gap-2">
            <Button>
              Iniciar Conversa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}