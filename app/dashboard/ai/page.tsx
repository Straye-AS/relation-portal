// app/ai/page.tsx
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";

type Task = {
  id: string;
  time: string;
  task: string;
  completed: boolean;
};

export default function AIPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const generateTasks = async () => {
    setLoading(true);
    const prompt = `Create a time-based schedule for: ${input}. Limit with 6 tasks maximum. Each section must be like this format:

### Morning: 8:00 AM - 10:00 AM
- Research and generate logo ideas

### Late Morning: 10:00 AM - 12:00 PM
- Continue logo development`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com",
        "X-Title": "Your AI Boilerplate"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-prover-v2:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    const parsedTasks: Task[] = [];

    const sections = content.split("###").slice(1);
    for (const section of sections) {
      const [header, ...lines] = section.trim().split("\n");
      const timeMatch = header.match(/(\d{1,2}:\d{2}.*)/);
      const time = timeMatch ? timeMatch[1].trim() : "Unscheduled";

      for (const line of lines) {
        const clean = line.replace(/^[-*\s]+/, "").trim();
        if (clean) {
          parsedTasks.push({
            id: uuidv4(),
            time,
            task: clean,
            completed: false
          });
        }
      }
    }

    setTasks(parsedTasks);
    setLoading(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl mb-2">AI</h1>
        <p className="text-muted-foreground">Generate time-based task plans with AI.</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Design a logo and website"
        />
        <Button onClick={generateTasks} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {sortedTasks.map(task => (
                <li
                  key={task.id}
                  className={clsx(
                    "p-3 rounded-md border flex items-start justify-between",
                    {
                      "bg-muted text-muted-foreground": task.completed,
                      "bg-background": !task.completed
                    }
                  )}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{task.task}</div>
                      <div className="text-xs text-muted-foreground">{task.time}</div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
