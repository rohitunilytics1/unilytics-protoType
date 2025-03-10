// src/pages/ChatPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Clock, 
  ChevronDown, 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Share2,
  Info,
  Menu,
  Loader2 // <-- Spinner icon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

// Define message type
interface Messages {
  role: 'user' | 'assistant';
  content: string;
}

// Chat history type now includes the full messages array
interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  messages: Messages[];
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('performance');
  
  // Load chat history from localStorage if available
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  // State for mobile sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Autofocus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save chat history changes to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Messages = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);
    
    try {
      // Make API call to our backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
      
      const data = await response.json();
      
      // Add assistant message
      if (data.choices && data.choices[0]?.message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        setError('Received unexpected response format from API');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  // When a history item is clicked, load its messages and close mobile sidebar if open
  const handleHistoryItemClick = (item: ChatHistoryItem) => {
    setMessages(item.messages);
    setSidebarOpen(false);
  };
  
  // Example questions to suggest to the user
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Messages = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Trigger API call
    setIsLoading(true);
    setError(null);
    
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        messages: [...messages, userMessage]
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Failed to get response');
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.choices && data.choices[0]?.message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        setError('Received unexpected response format from API');
      }
    })
    .catch((err: Error) => {
      console.error('Chat error:', err);
      setError(err.message || 'An error occurred while processing your request');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  // Save current conversation (if any) to history and reset chat
  const handleNewChat = () => {
    if (messages.length > 0) {
      const firstUserMessage = messages.find(msg => msg.role === 'user')?.content || 'New Chat';
      const newItem: ChatHistoryItem = {
        id: Date.now().toString(),
        title: firstUserMessage.length > 20 ? firstUserMessage.substring(0, 20) + '...' : firstUserMessage,
        preview: messages[messages.length - 1].content.substring(0, 50),
        messages: messages
      };
      setChatHistory(prev => [...prev, newItem]);
    }
    setMessages([]);
    setError(null);
  };

  // Top navigation bar exactly matching screenshot
  const TopNavBar = () => (
    <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="flex items-center border rounded px-2 py-1 hover:bg-gray-50 cursor-pointer">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#4285F4"/>
          </svg>
          Google Ads + GA4
          <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
        </div>
        
        <div className="flex items-center border rounded px-2 py-1 hover:bg-gray-50 cursor-pointer">
          <span className="text-sm">Last 7 Days</span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
        </div>
        
        <div className="flex items-center text-gray-500 text-sm ml-2">
          <RefreshCw className="w-4 h-4 mr-1" />
          Updated about 4 hours ago
        </div>
      </div>
    </div>
  );

  // Chat toolbar matching screenshot plus a mobile toggle for chat history
  const ChatToolbar = () => (
    <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        {/* Mobile sidebar toggle button (visible only on mobile) */}
        <div className="md:hidden">
          <Button variant="outline" size="sm" className="h-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="flex items-center h-8" onClick={handleNewChat}>
          <Plus className="w-4 h-4 mr-1" />
          New chat
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center h-8">
          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
          </svg>
          Saved charts
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="flex items-center h-8">
          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          Connect Slack Account (Beta)
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center h-8">
          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Custom Instructions
        </Button>
        
        <Button variant="default" size="sm" className="flex items-center h-8 bg-blue-600 text-white">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );

  // Render content cards based on the current tab
  const renderCards = () => {
    const cards = [
      {
        category: 'performance',
        icon: (
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <path d="M12 17.5c-.55 0-1-.45-1-1v-4.5H7.5c-.55 0-1-.45-1-1s.45-1 1-1H12c.55 0 1 .45 1 1v5.5c0 .55-.45 1-1 1z" fill="currentColor"/>
          </svg>
        ),
        title: 'Weekly Reports',
        description: 'Generate overall insights into campaign performance from 2024-11-25 to 2024-12-01. Find patterns that a marketer could have missed.',
        onClick: () => handleQuickQuestion('Generate weekly performance insights for campaigns from Nov 25 to Dec 1, 2024')
      },
      {
        category: 'optimization',
        icon: (
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
            <path d="M7 12h2v5H7v-5zm4-7h2v12h-2V5zm4 4h2v8h-2v-8z" fill="currentColor"/>
          </svg>
        ),
        title: 'Strategic Budget Allocation',
        description: 'How should an extra $1000 be distributed among campaigns to maximize performance from 2024-11-25 to 2024-12-01?',
        onClick: () => handleQuickQuestion('How should an extra $1000 be distributed among campaigns to maximize performance from 2024-11-25 to 2024-12-01?')
      },
      {
        category: 'assets',
        icon: (
          <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" fill="currentColor"/>
          </svg>
        ),
        title: 'Assets Comparative Performance',
        description: 'Which assets are performing better than others based on all available key metrics from 2024-11-25 to 2024-12-01?',
        onClick: () => handleQuickQuestion('Which assets are performing better than others based on all available key metrics from 2024-11-25 to 2024-12-01?')
      },
      {
        category: 'metrics',
        icon: (
          <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="currentColor"/>
          </svg>
        ),
        title: 'CTR Trends',
        description: 'Analyze the Click-Through Rate (CTR) trends across all campaigns. Which campaign showed the most improvement?',
        onClick: () => handleQuickQuestion('Analyze the Click-Through Rate (CTR) trends across all campaigns. Which campaign showed the most improvement?')
      }
    ];

    if (currentTab === 'performance') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {cards
            .filter(card => card.category === 'performance' || card.category === 'optimization')
            .map((card, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer"
                onClick={card.onClick}
              >
                <div className="flex items-center mb-2">
                  {card.icon}
                  <h3 className="text-base font-semibold ml-2">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            ))
          }
        </div>
      );
    } else if (currentTab === 'assets' || currentTab === 'metrics') {
      return (
        <div className="grid grid-cols-2 gap-4">
          {cards
            .filter(card => card.category === 'assets' || card.category === 'metrics')
            .map((card, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer"
                onClick={card.onClick}
              >
                <div className="flex items-center mb-2">
                  {card.icon}
                  <h3 className="text-base font-semibold ml-2">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            ))
          }
        </div>
      );
    }
    
    return null;
  };



  return (
    <div className="flex flex-col h-full">
      {/* Top navigation and toolbar */}
      <TopNavBar />
      <ChatToolbar />
      
      <div className="flex flex-1 overflow-auto relative">
        {/* Desktop sidebar with chat history (visible on md and up) */}
        <div className="w-56 border-r border-gray-200 bg-white flex flex-col hidden md:flex">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              Chat History
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {chatHistory.map(item => (
              <div 
                key={item.id} 
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleHistoryItemClick(item)}
              >
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-gray-500 text-xs truncate">{item.preview}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile sidebar overlay for chat history */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white p-4 md:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <Button variant="outline" size="sm" onClick={() => setSidebarOpen(false)}>
                <ChevronLeft className="w-4 h-4" />
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              {chatHistory.map(item => (
                <div 
                  key={item.id} 
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="text-gray-500 text-xs truncate">{item.preview}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat content area */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <RotateCcw className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Chat Explore</h2>
              <p className="text-gray-500 mb-8">Explore your data</p>
              
              <div className="w-full max-w-3xl">
                <div className="grid grid-cols-4 gap-4 mb-8 text-center">
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'performance' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('performance')}
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                      <path d="M12 17.5c-.55 0-1-.45-1-1v-4.5H7.5c-.55 0-1-.45-1-1s.45-1 1-1H12c.55 0 1 .45 1 1v5.5c0 .55-.45 1-1 1z" fill="currentColor"/>
                    </svg>
                    Performance
                  </div>
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'optimization' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('optimization')}
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
                      <path d="M7 12h2v5H7v-5zm4-7h2v12h-2V5zm4 4h2v8h-2v-8z" fill="currentColor"/>
                    </svg>
                    Optimization
                  </div>
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'assets' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('assets')}
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                      <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" fill="currentColor"/>
                    </svg>
                    Asset Analysis
                  </div>
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'metrics' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('metrics')}
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="currentColor"/>
                    </svg>
                    Metrics
                  </div>
                </div>
                
                {renderCards()}
                
                <div className="flex justify-between items-center mt-8">
                  {/* Pagination dots matching screenshot */}
                  <div className="flex items-center space-x-2">
                    <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4 chat-messages">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block max-w-3xl rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {/* Loader (spinner) while waiting for AI response */}
              {isLoading && (
                <div className="mb-4">
                  <div className="inline-block max-w-3xl rounded-lg p-3 bg-white border border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  Error: {error}
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={handleNewChat}>
                      Start New Chat
                    </Button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Bottom message area matching screenshot */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <Info className="h-4 w-4 mr-1 text-blue-500" />
              For best results, ask one question at a time. Start a new chat when you switch topics.
            </div>
            
            <form onSubmit={handleSubmit} className="relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question about your data..."
                className="pr-12 py-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100 text-gray-600"
                disabled={!input.trim() || isLoading}
                variant={input.trim() ? 'ghost' : 'ghost'}
              >
                <Send className={`h-5 w-5 ${input.trim() ? 'text-blue-500' : 'text-gray-400'}`} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;