import OpenAI from 'openai'
import { CalendarEvent, AIQuery } from '@/types/calendar'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class CalendarAIAgent {
  private openai: OpenAI

  constructor() {
    this.openai = openai
  }

  async processQuery(
    query: string,
    events: CalendarEvent[],
    userId: string
  ): Promise<AIQuery> {
    const systemPrompt = this.buildSystemPrompt(events)
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      const response = completion.choices[0]?.message?.content || 'I apologize, but I could not process your request.'

      return {
        id: crypto.randomUUID(),
        query,
        response,
        timestamp: new Date(),
        context: events,
        userId
      }
    } catch (error) {
      console.error('AI Agent Error:', error)
      throw new Error('Failed to process AI query')
    }
  }

  async generateDailyDigest(events: CalendarEvent[]): Promise<string> {
    const today = new Date()
    const todayEvents = events.filter(event => 
      event.start.toDateString() === today.toDateString()
    )

    const systemPrompt = `You are a helpful family calendar assistant. Generate a friendly daily digest for today's events. 
    Include:
    - A warm greeting
    - Summary of today's events
    - Any important reminders
    - Weather-appropriate suggestions
    - Departure time recommendations
    
    Keep it concise and family-friendly.`

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Today's events: ${JSON.stringify(todayEvents, null, 2)}`
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      })

      return completion.choices[0]?.message?.content || 'Good morning! Here\'s your daily calendar summary.'
    } catch (error) {
      console.error('Daily Digest Error:', error)
      return 'Good morning! Check your calendar for today\'s events.'
    }
  }

  private buildSystemPrompt(events: CalendarEvent[]): string {
    return `You are a helpful family calendar assistant for TrifSync. You can help with:

1. **Event Information**: Answer questions about upcoming events, schedules, and appointments
2. **Planning**: Help plan activities, suggest meeting times, and coordinate family schedules
3. **Reminders**: Set up reminders and notifications for important events
4. **Travel**: Calculate departure times, suggest routes, and provide travel updates
5. **General Questions**: Answer questions about the family calendar and provide insights

Current calendar events:
${JSON.stringify(events, null, 2)}

Guidelines:
- Be friendly and family-appropriate
- Provide specific, actionable information
- Suggest alternatives when possible
- Consider travel time and preparation needs
- Keep responses concise but helpful
- If you don't know something, say so and suggest how to find out`
  }
}
