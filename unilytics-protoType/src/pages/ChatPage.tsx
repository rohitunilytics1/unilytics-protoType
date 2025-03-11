import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Clock, 
  ChevronDown, 
  RefreshCw, 
  ChevronLeft,
  ChevronRight,
  Share2,
  Info,
  Loader2,
  X,
  ChevronUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import googleIcon from '../assets/googleIcon.png';

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


  const TopNavBar: React.FC = () => {
    return (
      <div className="flex items-center gap-3 py-2.5 px-6 border-b border-gray-200 bg-white">
        <div className="relative flex items-center justify-between h-10 px-4 py-2 border border-gray-200 bg-white rounded-md shadow-sm cursor-pointer">
          <div className="flex items-center gap-2">
            {/* Google icon will be added by you */}
            <img  src={googleIcon} />
            <span className="text-base font-medium text-[#5C5C66]">Google Ads + GA4</span>
          </div>
          <div className="ml-6 flex flex-col -my-2 -space-y-1">
          <ChevronUp className="h-4 w-4 text-gray-400" />
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        </div>
        
        <div className="relative flex items-center justify-between h-10 px-4 py-2 border border-gray-200 bg-white rounded-md shadow-sm cursor-pointer min-w-[160px]">
          <div className="flex items-center">
            <span className="text-base font-medium text-[#5C5C66]">Last 7 Days</span>
          </div>
          <div>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center text-[#94949E]">
          <RefreshCw className="h-4 w-4 mr-2" />
          <span className="text-sm text-[#94949E]">Updated about 4 hours ago</span>
        </div>
      </div>
    );
  };

  // Chat toolbar matching screenshot plus a mobile toggle for chat history
  const ChatToolbar = () => (
    <div className="flex items-center justify-between p-2 sm:px-4 sm:py-3 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
        {/* Toggle chat history on mobile */}
        <button 
          className="flex md:hidden items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </button>
        
        {/* Document icon button */}
        <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100">
          <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
        
        {/* New chat button */}
        <button 
          className="flex items-center px-2 py-1 sm:px-3 sm:py-2 space-x-1 sm:space-x-2 border border-gray-200 rounded-md hover:bg-gray-50"
          onClick={handleNewChat}
        >
          <span className="text-gray-700 font-bold">+</span>
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">New chat</span>
        </button>
        
        {/* Saved charts button - hidden on small screens */}
        <button className="hidden sm:flex items-center px-3 py-2 space-x-2 border border-gray-200 rounded-md hover:bg-gray-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span className="text-sm font-medium">Saved charts</span>
        </button>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Connect Slack Account button - hide on small screens */}
        <button className="hidden sm:flex items-center px-3 py-2 space-x-2 border border-gray-200 rounded-md hover:bg-gray-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="#E01E5A"/>
            <path d="M18 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="#2EB67D"/>
            <path d="M12 9a3 3 0 1 0-6 0 3 3 0 0 0 6 0z" fill="#ECB22E"/>
            <path d="M12 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" fill="#36C5F0"/>
          </svg>
          <span className="text-sm font-medium">Connect Slack Account (Beta)</span>
        </button>
        
        {/* Custom Instructions button - hide text on small screens */}
        <button className="flex items-center px-2 py-1 sm:px-3 sm:py-2 space-x-1 sm:space-x-2 border border-gray-200 rounded-md hover:bg-gray-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3v4a1 1 0 0 0 1 1h4M14 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8M14 3l4 5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="hidden sm:inline text-sm font-medium">Custom Instructions</span>
        </button>
        
        {/* Share button */}
        <button className="flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline text-sm font-medium">Share</span>
        </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {cards
            .filter(card => card.category === 'performance' || card.category === 'optimization')
            .map((card, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg p-3 sm:p-4 hover:shadow-md cursor-pointer"
                onClick={card.onClick}
              >
                <div className="flex items-center mb-2">
                  {card.icon}
                  <h3 className="text-sm sm:text-base font-semibold ml-2">{card.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{card.description}</p>
              </div>
            ))
          }
        </div>
      );
    } else if (currentTab === 'assets' || currentTab === 'metrics') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {cards
            .filter(card => card.category === 'assets' || card.category === 'metrics')
            .map((card, index) => (
              <div 
                key={index} 
                className="bg-white border rounded-lg p-3 sm:p-4 hover:shadow-md cursor-pointer"
                onClick={card.onClick}
              >
                <div className="flex items-center mb-2">
                  {card.icon}
                  <h3 className="text-sm sm:text-base font-semibold ml-2">{card.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{card.description}</p>
              </div>
            ))
          }
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Top navigation and toolbar - both fixed */}
      <TopNavBar />
      <ChatToolbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar with chat history (visible on md and up) - fixed height */}
        <div className="w-56 border-r border-gray-200 bg-white h-full hidden md:flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              Chat History
            </div>
          </div>
          
          {/* This is the only scrollable part in the sidebar */}
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
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            {/* Sidebar */}
            <div className="relative w-72 max-w-[80%] bg-white h-full flex flex-col shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold">Chat History</h2>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto">
                {chatHistory.length > 0 ? (
                  chatHistory.map(item => (
                    <div 
                      key={item.id} 
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-gray-500 text-xs truncate">{item.preview}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No chat history yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {messages.length === 0 ? (
            /* Empty state - content fixed in view */
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <RotateCcw className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Chat Explore</h2>
              <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">Explore your data</p>
              
              <div className="w-full max-w-3xl">
                <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 text-center text-xs sm:text-sm">
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'performance' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('performance')}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                      <path d="M12 17.5c-.55 0-1-.45-1-1v-4.5H7.5c-.55 0-1-.45-1-1s.45-1 1-1H12c.55 0 1 .45 1 1v5.5c0 .55-.45 1-1 1z" fill="currentColor"/>
                    </svg>
                    Performance
                  </div>
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'optimization' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('optimization')}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
                      <path d="M7 12h2v5H7v-5zm4-7h2v12h-2V5zm4 4h2v8h-2v-8z" fill="currentColor"/>
                    </svg>
                    Optimization
                  </div>
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'assets' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('assets')}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                      <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z" fill="currentColor"/>
                    </svg>
                    Assets
                  </div>
                  <div 
                    className={`p-2 cursor-pointer ${currentTab === 'metrics' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
                    onClick={() => setCurrentTab('metrics')}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="currentColor"/>
                    </svg>
                    Metrics
                  </div>
                </div>
                
                {renderCards()}
                
                <div className="flex justify-between items-center mt-6 sm:mt-8">
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
            <div className="flex-1 overflow-auto p-3 sm:p-4 chat-messages">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`mb-3 sm:mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block max-w-full sm:max-w-3xl rounded-lg p-2 sm:p-3 ${
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
                <div className="mb-3 sm:mb-4">
                  <div className="inline-block max-w-full sm:max-w-3xl rounded-lg p-2 sm:p-3 bg-white border border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 mb-3 sm:mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
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
          <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
              For best results, ask one question at a time. Start a new chat when you switch topics.
            </div>
            
            <form onSubmit={handleSubmit} className="relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question about your data..."
                className="pr-10 sm:pr-12 py-2 sm:py-3 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-100 text-gray-600"
                disabled={!input.trim() || isLoading}
                variant={input.trim() ? 'ghost' : 'ghost'}
              >
                <Send className={`h-4 w-4 sm:h-5 sm:w-5 ${input.trim() ? 'text-blue-500' : 'text-gray-400'}`} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;