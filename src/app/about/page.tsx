import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, Mail, Globe, MessageCircle, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">About This Blog</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to my personal corner of the internet.
        </p>
      </div>

      <div className="grid gap-12">
        <section className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center text-6xl shadow-inner border-4 border-background">
            👨‍💻
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold">The Author</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              I am a passionate developer and writer who loves sharing knowledge about web technology, 
              software architecture, and personal growth. This blog is a platform where I document 
              my journey and help others build better software.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <Card className="bg-muted/30 border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              To provide high-quality, easy-to-understand content that empowers developers 
              to stay ahead in the rapidly evolving world of technology.
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">Feel free to reach out for collaborations or just to say hi!</p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
