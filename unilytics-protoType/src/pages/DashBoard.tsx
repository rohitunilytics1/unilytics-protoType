
import { Search, Bell, Home, Database, FolderClosed, LineChart, MessageSquare, FileText, Settings, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';


const UnilyticsApp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top header */}
      <header className="border-b bg-black text-white flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold">🔥</span>
            </div>
            <span className="font-bold text-lg">Unilytics</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-8 pr-4 py-2 w-80 bg-gray-800 border-gray-700 text-white rounded-md"
              placeholder="Search"
            />
            <div className="absolute right-2 top-2 text-xs text-gray-400">Ctrl + K</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Bell className="h-5 w-5 text-gray-300" />
          <Button variant="outline" className="bg-transparent text-white border-gray-700">Account Plans</Button>
          <Button variant="ghost" className="text-white">Support</Button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="w-60 border-r p-4 flex flex-col">
          <nav className="space-y-1 flex-1">
            <div className="flex items-center p-2 rounded-md text-gray-700">
              <Home className="h-5 w-5 mr-3" />
              <span>Home</span>
            </div>
            
            <div className="flex items-center p-2 rounded-md text-gray-700">
              <Database className="h-5 w-5 mr-3" />
              <span>Datasources</span>
            </div>
            
            <div className="flex items-center p-2 bg-blue-50 text-blue-600 rounded-md">
              <FolderClosed className="h-5 w-5 mr-3" />
              <span className="flex-1">Projects</span>
              <div className="bg-blue-100 text-blue-500 text-xs rounded-full px-2 py-0.5">9</div>
            </div>
            
            <div className="pl-10 space-y-1 mt-2">
              <div className="p-2 text-gray-500">Prepare</div>
              <div className="p-2 text-gray-500">Insights</div>
              <div className="p-2 text-blue-600">Chat</div>
              <div className="p-2 text-gray-500">Report</div>
            </div>
          </nav>
          
          <div className="mt-auto">
            <div className="flex items-center p-2 rounded-md text-gray-700">
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </div>
            
            <div className="flex items-center mt-4 p-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-3">
                T
              </div>
              <div>
                <div className="font-medium">User Name</div>
                <div className="text-sm text-gray-500">Trial</div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Data source selector */}
          <div className="border-b p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center border rounded-md p-2 mr-4">
                <span className="bg-orange-100 text-orange-500 p-1 rounded mr-2">
                  <span className="text-xs">G</span>
                </span>
                <span className="text-sm">Google Ads + GA4</span>
              </div>
              
              <div className="flex items-center border rounded-md p-2">
                <span className="text-sm">Last 7 Days</span>
              </div>
              
              <div className="ml-4 text-sm text-gray-500">
                Updated about 4 hours ago
              </div>
            </div>
          </div>
          
          {/* Chat interface */}
          <div className="flex-1 flex">
            {/* Left sidebar with history */}
            <div className="w-1/4 border-r">
              <div className="p-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700">Chat History</span>
              </div>
              
              <div className="px-4 py-2 border-b">
                <div className="text-sm text-gray-700 py-2">Generate a word cloud for...</div>
                <div className="text-sm text-gray-700 py-2">Show me a bar chart of s...</div>
              </div>
            </div>
            
            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
              {/* Chat controls */}
              <div className="p-3 border-b flex items-center gap-2">
                <Button variant="outline" className="text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  New chat
                </Button>
                
                <Button variant="outline" className="text-sm">
                  <LineChart className="h-4 w-4 mr-2" />
                  Saved charts
                </Button>
                
                <div className="flex-1"></div>
                
                <Button variant="outline" className="text-sm bg-gray-50">
                  <span className="bg-blue-500 text-white h-5 w-5 rounded-sm text-xs flex items-center justify-center mr-2">S</span>
                  Connect Slack Account (Beta)
                </Button>
                
                <Button variant="outline" className="text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Custom Instructions
                </Button>
                
                <Button className="bg-blue-600 hover:bg-blue-700 text-white p-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Chat content */}
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <LineChart className="h-6 w-6 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-1">Chat Explore</h2>
                <p className="text-gray-500 mb-8">Explore your data</p>
                
                {/* Card grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-1 rounded bg-purple-100 text-purple-500 mr-2">
                          <LineChart className="h-4 w-4" />
                        </div>
                        <span className="text-purple-500 text-sm">Performance</span>
                      </div>
                      
                      <h3 className="font-medium mb-1">Weekly Reports</h3>
                      <p className="text-xs text-gray-500">Review weekly traffic and campaign performance from 2024-11-25 to 2024-12-01. Find patterns that a marketer could have missed.</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-1 rounded bg-blue-100 text-blue-500 mr-2">
                          <Settings className="h-4 w-4" />
                        </div>
                        <span className="text-blue-500 text-sm">Optimization</span>
                      </div>
                      
                      <h3 className="font-medium mb-1">Strategic Budget Allocation</h3>
                      <p className="text-xs text-gray-500">How would an extra $1000 be distributed among campaigns to maximize performance from 2024-11-25 to 2024-12-01?</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-1 rounded bg-yellow-100 text-yellow-500 mr-2">
                          <LineChart className="h-4 w-4" />
                        </div>
                        <span className="text-yellow-500 text-sm">Asset Analysis</span>
                      </div>
                      
                      <h3 className="font-medium mb-1">Assets Comparative Performance</h3>
                      <p className="text-xs text-gray-500">Which assets are performing better than others based on all available key metrics from 2024-11-25 to 2024-12-01?</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="p-1 rounded bg-red-100 text-red-500 mr-2">
                          <LineChart className="h-4 w-4" />
                        </div>
                        <span className="text-red-500 text-sm">Metrics</span>
                      </div>
                      
                      <h3 className="font-medium mb-1">CTR Trends</h3>
                      <p className="text-xs text-gray-500">Analyze the Click-Through Rate (CTR) trends across all campaigns. Which campaign showed the most improvement?</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Pagination dots */}
                <div className="flex items-center justify-center mt-8 space-x-1">
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <span className="sr-only">Previous</span>
                    &lt;
                  </Button>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <span className="sr-only">Next</span>
                    &gt;
                  </Button>
                </div>
              </div>
              
              {/* Chat input */}
              <div className="p-4 border-t">
                <div className="text-sm text-gray-500 text-center mb-2">
                  <span>For best results, ask one question at a time. Start a new chat when you switch topics.</span>
                </div>
                <div className="relative">
                  <Input 
                    className="w-full p-4 pr-12 rounded-md border text-gray-800"
                    placeholder="Ask a question about your data..."
                  />
                  <Button className="absolute right-2 top-2 bg-transparent hover:bg-transparent text-gray-400">
                    <span className="transform rotate-45 inline-block">→</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnilyticsApp;