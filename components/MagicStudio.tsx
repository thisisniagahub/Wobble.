// components/MagicStudio.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Video, MessageSquare, Upload, Sparkles, Loader2, FileSearch } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const getGenAI = () => {
  return new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
};

export default function MagicStudio({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('image-gen');
  const [isCheckingKey, setIsCheckingKey] = useState(false);

  const checkApiKey = async () => {
    setIsCheckingKey(true);
    try {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      }
    } catch (e) {
      console.error("API Key check failed", e);
    } finally {
      setIsCheckingKey(false);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col text-white"
    >
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold">Magic Studio</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          <TabButton active={activeTab === 'image-gen'} onClick={() => setActiveTab('image-gen')} icon={ImageIcon} label="Generate Image" />
          <TabButton active={activeTab === 'video-gen'} onClick={() => setActiveTab('video-gen')} icon={Video} label="Generate Video" />
          <TabButton active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} icon={FileSearch} label="Analyze Media" />
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={MessageSquare} label="Fast Chat" />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isCheckingKey ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'image-gen' && <ImageGenTab />}
                {activeTab === 'video-gen' && <VideoGenTab />}
                {activeTab === 'analyze' && <AnalyzeTab />}
                {activeTab === 'chat' && <ChatTab />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left whitespace-nowrap md:whitespace-normal ${active ? 'bg-pink-500/20 text-pink-400' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function ImageGenTab() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: size as any
          }
        }
      });
      
      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) setError('No image generated.');
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h3 className="text-xl font-bold mb-2">Generate Images with Nano Banana Pro</h3>
        <p className="text-white/60 text-sm">Create stunning visuals for your next Wobble flavor.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-400 min-h-[100px]"
            placeholder="A delicious jar of strawberry panna cotta..."
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-white/80">Aspect Ratio</label>
            <select 
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-400"
            >
              {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(ar => (
                <option key={ar} value={ar} className="bg-gray-900">{ar}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-white/80">Image Size</label>
            <select 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-400"
            >
              {['1K', '2K', '4K'].map(s => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">{error}</div>}

      {result && (
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-4">Result</h4>
          <img src={result} alt="Generated" className="w-full rounded-2xl border border-white/10 shadow-2xl" />
        </div>
      )}
    </div>
  );
}

function VideoGenTab() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setStatus('Initializing generation...');
    try {
      const ai = getGenAI();
      const payload: any = {
        model: 'veo-3.1-fast-generate-preview',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      };
      
      if (prompt) payload.prompt = prompt;
      if (image) {
        payload.image = {
          imageBytes: image.data,
          mimeType: image.mimeType
        };
      }

      if (!prompt && !image) {
        throw new Error("Please provide a prompt or an image.");
      }

      let operation = await ai.models.generateVideos(payload);
      
      while (!operation.done) {
        setStatus('Generating video... this may take a few minutes.');
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus('Fetching video...');
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: { 'x-goog-api-key': apiKey || '' },
        });
        const blob = await response.blob();
        setResult(URL.createObjectURL(blob));
      } else {
        throw new Error("Video generation failed.");
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h3 className="text-xl font-bold mb-2">Animate Images with Veo</h3>
        <p className="text-white/60 text-sm">Generate stunning videos from text prompts or uploaded images.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">Prompt (Optional if image provided)</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-400 min-h-[80px]"
            placeholder="A cinematic shot of a dessert jar..."
          />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2 text-white/80">Starting Image (Optional)</label>
           <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
             <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             {image ? (
               <div className="flex flex-col items-center gap-2">
                 <img src={`data:${image.mimeType};base64,${image.data}`} alt="Preview" className="h-32 rounded-lg object-cover" />
                 <span className="text-sm text-pink-400">Image selected. Click to change.</span>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-2 text-white/50">
                 <Upload className="w-8 h-8" />
                 <span>Click or drag image to upload</span>
               </div>
             )}
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">Aspect Ratio</label>
          <select 
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-400"
          >
            {['16:9', '9:16'].map(ar => (
              <option key={ar} value={ar} className="bg-gray-900">{ar}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || (!prompt && !image)}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
          {loading ? 'Generating...' : 'Generate Video'}
        </button>
      </div>

      {status && <div className="text-center text-sm text-pink-400 animate-pulse">{status}</div>}
      {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">{error}</div>}

      {result && (
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-4">Result</h4>
          <video src={result} controls autoPlay loop className="w-full rounded-2xl border border-white/10 shadow-2xl" />
        </div>
      )}
    </div>
  );
}

function AnalyzeTab() {
  const [prompt, setPrompt] = useState('Describe this media in detail.');
  const [media, setMedia] = useState<{ data: string, mimeType: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setMedia({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!media) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: media.data, mimeType: media.mimeType } },
            { text: prompt }
          ]
        }
      });
      setResult(response.text || 'No description provided.');
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h3 className="text-xl font-bold mb-2">Video & Image Understanding</h3>
        <p className="text-white/60 text-sm">Upload a photo or video and let Gemini Pro analyze it.</p>
      </div>
      
      <div className="space-y-4">
        <div>
           <label className="block text-sm font-medium mb-2 text-white/80">Upload Media (Image or Video)</label>
           <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
             <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             {media ? (
               <div className="flex flex-col items-center gap-2">
                 {media.mimeType.startsWith('image/') ? (
                   <img src={`data:${media.mimeType};base64,${media.data}`} alt="Preview" className="h-32 rounded-lg object-cover" />
                 ) : (
                   <video src={`data:${media.mimeType};base64,${media.data}`} className="h-32 rounded-lg object-cover" />
                 )}
                 <span className="text-sm text-pink-400">Media selected. Click to change.</span>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-2 text-white/50">
                 <Upload className="w-8 h-8" />
                 <span>Click or drag media to upload</span>
               </div>
             )}
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-white/80">Question / Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-pink-400 min-h-[80px]"
          />
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={loading || !media}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSearch className="w-5 h-5" />}
          {loading ? 'Analyzing...' : 'Analyze Media'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">{error}</div>}

      {result && (
        <div className="mt-8 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h4 className="text-lg font-bold mb-4">Analysis Result</h4>
          <p className="whitespace-pre-wrap leading-relaxed text-white/90">{result}</p>
        </div>
      )}
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    
    try {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [...messages.map(m => m.text), userMsg].join('\n') // Simple history for demo
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || '' }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pb-20">
      <div>
        <h3 className="text-xl font-bold mb-2">Fast AI Responses</h3>
        <p className="text-white/60 text-sm mb-6">Chat with Gemini Flash Lite for ultra-low latency responses.</p>
      </div>
      
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto flex flex-col gap-4 mb-4 min-h-[300px]">
        {messages.length === 0 && (
          <div className="m-auto text-white/40 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Start a conversation...</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="w-5 h-5 animate-spin text-white/50" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-400"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
