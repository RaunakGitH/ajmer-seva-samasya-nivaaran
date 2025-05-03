
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Paperclip, Smile } from "lucide-react";

// Mock data for chat
const contacts = [
  { id: '1', name: 'Sanitation Department', avatar: '/placeholder.svg', status: 'online', lastSeen: 'online', unread: 0, lastMessage: "We'll look into the garbage collection issue right away." },
  { id: '2', name: 'Road Maintenance Crew', avatar: '/placeholder.svg', status: 'online', lastSeen: 'online', unread: 3, lastMessage: 'The pothole repair has been scheduled for tomorrow.' },
  { id: '3', name: 'Parks Department', avatar: '/placeholder.svg', status: 'offline', lastSeen: '2 hours ago', unread: 0, lastMessage: 'Thank you for the feedback on the park renovations.' },
  { id: '4', name: 'Water Department', avatar: '/placeholder.svg', status: 'offline', lastSeen: '4 hours ago', unread: 0, lastMessage: 'The water supply will be restored within 3 hours.' },
  { id: '5', name: 'Electricity Department', avatar: '/placeholder.svg', status: 'offline', lastSeen: '1 day ago', unread: 0, lastMessage: 'We have registered your complaint about frequent power cuts.' },
];

// Mock messages
const mockMessages = [
  { id: '1', sender: 'other', text: 'Hello! How can I assist you today?', time: '10:32 AM' },
  { id: '2', sender: 'me', text: 'Hi there. I wanted to check on the progress of the garbage collection complaint in Green Park area.', time: '10:33 AM' },
  { id: '3', sender: 'other', text: 'Let me check that for you. Just a moment please.', time: '10:34 AM' },
  { id: '4', sender: 'other', text: 'I can see the complaint has been assigned to our sanitation team. They have scheduled a pickup for today at 2:00 PM.', time: '10:36 AM' },
  { id: '5', sender: 'me', text: "That sounds good. Could you also make sure they check the recycling bins? Those haven't been emptied in two weeks.", time: '10:38 AM' },
  { id: '6', sender: 'other', text: "I've made a note of that and added it to the work order. Is there anything else you would like me to address?", time: '10:40 AM' },
];

export default function AdminChat() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const filteredContacts = searchQuery
    ? contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: (messages.length + 1).toString(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: (messages.length + 2).toString(),
        sender: 'other',
        text: "I've noted your message and will update you as soon as possible.",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-10rem)]">
      <div className="flex h-full border rounded-lg overflow-hidden">
        {/* Contacts sidebar */}
        <div className="w-80 border-r flex flex-col bg-background">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search contacts" 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-muted transition-colors ${
                    activeContact.id === contact.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${
                      contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <p className="font-medium truncate">{contact.name}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {contact.status === 'online' ? 'now' : contact.lastSeen}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <Badge className="ml-auto">{contact.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50">
          {/* Chat header */}
          <div className="p-4 border-b bg-background flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{activeContact.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeContact.status === 'online' ? 'Online' : `Last active ${activeContact.lastSeen}`}
                </p>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Message input */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                type="text" 
                placeholder="Type a message" 
                className="flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
