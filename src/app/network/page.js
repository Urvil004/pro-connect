// src/app/network/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Briefcase, 
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Network as NetworkIcon,
  Brain,
  Filter,
  Search,
  MapPin,
  Clock,
  Star,
  Zap,
  GitBranch,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info
} from 'lucide-react';

// ✅ DARK MODE: Network Graph Component
const NetworkGraph = ({ connections, onClose, currentUser }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const animationRef = useRef(null);

  // ✅ Initialize nodes with proper positioning
  useEffect(() => {
    if (!connections || connections.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Center node (current user)
    const centerNode = {
      id: 'center',
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      name: currentUser?.displayName || currentUser?.name || 'You',
      isCenter: true,
      color: '#3B82F6',
      radius: 40,
    };

    // Connection nodes in circular layout
    const connectionNodes = connections.slice(0, 15).map((person, index) => {
      const angle = (index / Math.min(15, connections.length)) * 2 * Math.PI;
      const radius = 250;
      
      return {
        id: person._id || `person-${index}`,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        name: person.name || `User ${index + 1}`,
        isCenter: false,
        color: person.matchScore >= 70 ? '#10B981' : person.matchScore >= 50 ? '#8B5CF6' : '#6B7280',
        matchScore: person.matchScore || 0,
        radius: 30,
        title: person.bio || person.headline || 'Professional',
        industry: person.industry || 'Technology',
      };
    });

    setNodes([centerNode, ...connectionNodes]);
  }, [connections, currentUser]);

  // ✅ Physics simulation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 16, 2);
      lastTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2 + offset.x, -canvas.height / 2 + offset.y);

      // Update physics (only if not dragging)
      if (!dragging) {
        setNodes(prevNodes => {
          const newNodes = prevNodes.map((node, i) => {
            if (node.isCenter) return node;

            const centerNode = prevNodes[0];
            let fx = 0, fy = 0;

            // Spring force to center
            const dx = centerNode.x - node.x;
            const dy = centerNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const targetDistance = 250;
            
            if (distance > 0) {
              const springForce = (distance - targetDistance) * 0.02;
              fx += (dx / distance) * springForce;
              fy += (dy / distance) * springForce;
            }

            // Repulsion from other nodes
            prevNodes.forEach((other, j) => {
              if (i !== j && !other.isCenter) {
                const odx = node.x - other.x;
                const ody = node.y - other.y;
                const odist = Math.sqrt(odx * odx + ody * ody);
                
                if (odist < 150 && odist > 0) {
                  const repulsion = 800 / (odist * odist);
                  fx += (odx / odist) * repulsion;
                  fy += (ody / odist) * repulsion;
                }
              }
            });

            // Update velocity with damping
            const newVx = (node.vx + fx) * 0.85;
            const newVy = (node.vy + fy) * 0.85;

            // Update position
            const newX = node.x + newVx * deltaTime;
            const newY = node.y + newVy * deltaTime;

            return { ...node, x: newX, y: newY, vx: newVx, vy: newVy };
          });

          return newNodes;
        });
      }

      // Draw connections
      const centerNode = nodes[0];
      nodes.forEach((node, i) => {
        if (!node.isCenter) {
          const isHovered = hoveredNode === node.id;
          
          // Draw line
          ctx.strokeStyle = isHovered ? 'rgba(59, 130, 246, 0.6)' : 'rgba(156, 163, 175, 0.3)';
          ctx.lineWidth = isHovered ? 3 : 1.5;
          ctx.beginPath();
          ctx.moveTo(centerNode.x, centerNode.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();

          // Animated particle on hover
          if (isHovered) {
            const time = Date.now() * 0.002;
            const progress = (time % 1);
            const px = centerNode.x + (node.x - centerNode.x) * progress;
            const py = centerNode.y + (node.y - centerNode.y) * progress;
            
            ctx.fillStyle = node.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = node.color;
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode === node.id;
        const radius = node.radius + (isHovered ? 5 : 0);

        // Shadow for hovered nodes
        if (isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = node.color;
        }

        // Draw node circle
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, node.color + 'CC');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = isHovered ? '#ffffff' : node.color;
        ctx.lineWidth = isHovered ? 4 : 3;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Draw initials
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${node.isCenter ? 20 : 16}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = node.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        ctx.fillText(initials, node.x, node.y);

        // Draw labels
        if (isHovered || node.isCenter) {
          // Name
          ctx.fillStyle = '#1F2937';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.fillText(node.name, node.x, node.y + radius + 20);
          
          // Additional info for non-center nodes
          if (!node.isCenter) {
            // Match score
            ctx.fillStyle = node.color;
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(`${node.matchScore}% Match`, node.x, node.y + radius + 38);
            
            // Title/Industry
            if (isHovered) {
              ctx.fillStyle = '#6B7280';
              ctx.font = '11px Inter, sans-serif';
              const text = node.title || node.industry;
              const maxWidth = 150;
              const truncated = text.length > 25 ? text.substring(0, 25) + '...' : text;
              ctx.fillText(truncated, node.x, node.y + radius + 54);
            }
          }
        }
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, zoom, offset, hoveredNode, dragging]);

  // ✅ Convert screen coordinates to canvas coordinates
  const screenToCanvas = (screenX, screenY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = (screenX - rect.left - canvas.width / 2) / zoom + canvas.width / 2 - offset.x;
    const y = (screenY - rect.top - canvas.height / 2) / zoom + canvas.height / 2 - offset.y;
    
    return { x, y };
  };

  // ✅ Mouse/Touch handlers
  const handleMouseDown = (e) => {
    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    
    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < node.radius;
    });

    if (clickedNode) {
      setDragging(clickedNode.id);
      e.preventDefault();
    } else {
      setPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === dragging 
          ? { ...node, x, y, vx: 0, vy: 0 }
          : node
      ));
    } else if (panning) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else {
      // Update hovered node
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      
      const hovered = nodes.find(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < node.radius;
      });
      
      setHoveredNode(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setPanning(false);
  };

  // ✅ Zoom handlers
  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.3));
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // ✅ Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.max(0.3, Math.min(3, zoom * delta)));
  };

  return (
    <div className="fixed inset-0 bg-black dark:bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-3xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-transparent dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Interactive Network Graph
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Drag nodes to rearrange • Hover to see details • {nodes.length - 1} connections shown
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleZoomIn}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-gray-700 dark:text-gray-300"
          >
            <ZoomIn className="w-4 h-4" />
            Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-gray-700 dark:text-gray-300"
          >
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-gray-700 dark:text-gray-300"
          >
            <Maximize2 className="w-4 h-4" />
            Reset
          </button>
          
          <div className="ml-auto flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              <span className="text-gray-600 dark:text-gray-400">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600 dark:bg-green-400"></div>
              <span className="text-gray-600 dark:text-gray-400">Best Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600 dark:bg-purple-400"></div>
              <span className="text-gray-600 dark:text-gray-400">Good Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-600 dark:bg-gray-400"></div>
              <span className="text-gray-600 dark:text-gray-400">Others</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-hidden p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
        >
          <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            className="w-full h-full rounded-xl shadow-inner cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <strong>💡 Tip:</strong> Drag any node to reorganize your network • Nodes automatically maintain optimal spacing • Hover over nodes to see connection details • Use mouse wheel to zoom
          </p>
        </div>
      </div>
    </div>
  );
};

export default function NetworkPage() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNetworkGraph, setShowNetworkGraph] = useState(false);

  const filterCategories = [
    { id: 'all', label: 'All Suggestions', icon: Users },
    { id: 'high-match', label: 'Best Matches', icon: Sparkles },
    { id: 'same-industry', label: 'Same Industry', icon: Briefcase },
    { id: 'skill-based', label: 'Skill Match', icon: Target },
    { id: 'location', label: 'Nearby', icon: MapPin },
  ];

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      const users = await response.json();
      
      const filtered = users.filter(u => u.firebaseUid !== user?.uid);
      
      const withScores = filtered.map(person => ({
        ...person,
        matchScore: calculateMatchScore(person),
      }));
      
      withScores.sort((a, b) => b.matchScore - a.matchScore);
      
      setSuggestions(withScores.slice(0, 20));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching network data:', error);
      setLoading(false);
    }
  };

  const calculateMatchScore = (person) => {
    let score = 0;
    
    if (person.industry === user?.industry) score += 30;
    
    const commonSkills = person.skills?.filter(skill => 
      user?.skills?.includes(skill)
    )?.length || 0;
    score += Math.min(commonSkills * 5, 25);
    
    if (person.location === user?.location) score += 20;
    if (person.experience === user?.experience) score += 15;
    score += Math.min(person.connectionsCount || 0, 10);
    
    return Math.min(score, 100);
  };

  const getMatchLevel = (score) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30', icon: Star };
    if (score >= 60) return { label: 'Great Match', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', icon: Sparkles };
    if (score >= 40) return { label: 'Good Match', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', icon: Target };
    return { label: 'Potential Match', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-700', icon: Users };
  };

  const handleConnect = async (userId) => {
    console.log('Connecting with user:', userId);
  };

  const filteredSuggestions = suggestions.filter(person => {
    if (searchQuery && !person.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    switch (activeFilter) {
      case 'high-match':
        return person.matchScore >= 70;
      case 'same-industry':
        return person.industry === user?.industry;
      case 'skill-based':
        return person.skills?.some(skill => user?.skills?.includes(skill));
      case 'location':
        return person.location === user?.location;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-white dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Network</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your professional network</p>
            </div>
            <button
              onClick={() => setShowNetworkGraph(!showNetworkGraph)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <GitBranch className="w-5 h-5" />
              View Network Graph
            </button>
          </div>

          {/* Smart Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">Total Connections</p>
                  <p className="text-3xl font-bold mt-1">{connections.length}</p>
                </div>
                <Users className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 dark:text-green-200 text-sm">Best Matches</p>
                  <p className="text-3xl font-bold mt-1">
                    {suggestions.filter(s => s.matchScore >= 70).length}
                  </p>
                </div>
                <Sparkles className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">Same Industry</p>
                  <p className="text-3xl font-bold mt-1">
                    {suggestions.filter(s => s.industry === user?.industry).length}
                  </p>
                </div>
                <Briefcase className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 dark:text-orange-200 text-sm">Nearby</p>
                  <p className="text-3xl font-bold mt-1">
                    {suggestions.filter(s => s.location === user?.location).length}
                  </p>
                </div>
                <MapPin className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Smart Filters
              </h2>
              <div className="space-y-2">
                {filterCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      activeFilter === category.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    {category.id !== 'all' && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeFilter === category.id
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {category.id === 'high-match' && suggestions.filter(s => s.matchScore >= 70).length}
                        {category.id === 'same-industry' && suggestions.filter(s => s.industry === user?.industry).length}
                        {category.id === 'skill-based' && suggestions.filter(s => s.skills?.some(skill => user?.skills?.includes(skill))).length}
                        {category.id === 'location' && suggestions.filter(s => s.location === user?.location).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Industry Trends</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'AI & Machine Learning', trend: '+145%', color: 'text-green-600 dark:text-green-400' },
                  { title: 'Remote Collaboration', trend: '+89%', color: 'text-blue-600 dark:text-blue-400' },
                  { title: 'Web3 Development', trend: '+67%', color: 'text-purple-600 dark:text-purple-400' },
                  { title: 'Cloud Computing', trend: '+52%', color: 'text-orange-600 dark:text-orange-400' },
                ].map((trend, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{trend.title}</p>
                      <p className={`text-xs font-semibold mt-1 ${trend.color}`}>
                        {trend.trend} growth
                      </p>
                    </div>
                    <Zap className={`w-5 h-5 ${trend.color}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, skills, or industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>
            </div>

            {/* AI-Powered Suggestions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      AI-Powered Suggestions
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Based on smart matching algorithm • {filteredSuggestions.length} professionals found
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggestions.map((person) => {
                    const matchInfo = getMatchLevel(person.matchScore);
                    const MatchIcon = matchInfo.icon;
                    
                    return (
                      <div 
                        key={person._id} 
                        className="border-2 border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl dark:hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        {/* Match Score Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${matchInfo.bg}`}>
                            <MatchIcon className={`w-4 h-4 ${matchInfo.color}`} />
                            <span className={`text-xs font-semibold ${matchInfo.color}`}>
                              {person.matchScore}% Match
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active now
                          </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                            {person.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                              {person.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                              {person.bio || person.headline || 'Professional'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Briefcase className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {person.industry || 'Technology'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="mb-4 space-y-2">
                          {person.matchScore >= 30 && person.industry === user?.industry && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Same industry</span>
                            </div>
                          )}
                          {person.skills?.some(skill => user?.skills?.includes(skill)) && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg">
                              <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                              <span>Matching skills</span>
                            </div>
                          )}
                          {person.location === user?.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
                              <MapPin className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                              <span>Same location</span>
                            </div>
                          )}
                        </div>

                        {/* Connect Button */}
                        <button
                          onClick={() => handleConnect(person._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <UserPlus className="w-4 h-4" />
                          Connect Now
                        </button>
                      </div>
                    );
                  })}
                </div>

                {filteredSuggestions.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No professionals found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Graph Modal */}
      {showNetworkGraph && (
        <NetworkGraph 
          connections={suggestions} 
          onClose={() => setShowNetworkGraph(false)}
          currentUser={user}
        />
      )}
    </div>
  );
}
