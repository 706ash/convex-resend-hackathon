import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Key, 
  Copy, 
  CheckCircle, 
  X, 
  Eye, 
  EyeOff,
  Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GlassmorphicCard from "./glassmorphic-card";

interface AddKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddKeyDialog({ open, onOpenChange }: AddKeyDialogProps) {
  const [keyName, setKeyName] = useState("");
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [generatedSentinelKey, setGeneratedSentinelKey] = useState("");
  const [step, setStep] = useState(1); // 1: Add API Key, 2: Show Sentinel Key
  const [copiedKey, setCopiedKey] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createApiKeyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/keys", "POST", data);
    },
    onSuccess: async (newApiKey) => {
      // Create sentinel key automatically
      const sentinelData = {
        apiKeyId: newApiKey.id,
        rateLimit: 1000,
        trustedOnly: false,
        allowedEndpoints: ["/v1/*"],
        ipRestrictions: []
      };
      
      const sentinelKey = await apiRequest("/api/sentinel-keys", "POST", sentinelData);
      setGeneratedSentinelKey(sentinelKey.key);
      setStep(2);
      
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["/api/keys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sentinel-keys"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName || !provider || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createApiKeyMutation.mutate({
      ownerId: "demo-user-1", // In real app, get from auth
      keyName,
      provider,
      encryptedKey: btoa(apiKey), // Simple base64 encoding for demo
      scopes: [],
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(true);
      toast({
        title: "Copied!",
        description: "Sentinel key copied to clipboard.",
      });
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const resetDialog = () => {
    setKeyName("");
    setProvider("");
    setApiKey("");
    setShowApiKey(false);
    setGeneratedSentinelKey("");
    setStep(1);
    setCopiedKey(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
      <DialogContent className="glass border-sky/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Shield className="w-6 h-6 text-sky" />
            <span>Add API Key</span>
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="keyName" className="text-sm font-medium">
                  Key Name *
                </Label>
                <Input
                  id="keyName"
                  data-testid="input-keyname"
                  placeholder="e.g., OpenAI Production Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="glass border-sky/30 focus:border-sky/50"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="provider" className="text-sm font-medium">
                  Provider *
                </Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger className="glass border-sky/30 focus:border-sky/50" data-testid="select-provider">
                    <SelectValue placeholder="Select API provider" />
                  </SelectTrigger>
                  <SelectContent className="glass border-sky/30">
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="claude">Anthropic Claude</SelectItem>
                    <SelectItem value="mistral">Mistral AI</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="apiKey" className="text-sm font-medium">
                  API Key *
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    data-testid="input-apikey"
                    type={showApiKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="glass border-sky/30 focus:border-sky/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    data-testid="button-toggle-key-visibility"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Your API key will be encrypted and stored securely.
                </p>
              </motion.div>

              <motion.div
                className="flex space-x-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDialog}
                  className="flex-1 glass border-gray-600 hover:border-gray-500"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createApiKeyMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-sky to-coral hover:shadow-lg"
                  data-testid="button-create-key"
                >
                  {createApiKeyMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Create Key
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-sky to-coral rounded-full mx-auto flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Sentinel Key Generated!</h3>
              <p className="text-gray-400">
                Your API key has been securely stored and a Sentinel key has been generated for your applications.
              </p>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Sentinel Key:</span>
                  <span className="text-xs text-green-400">Ready to use</span>
                </div>
                
                <motion.div 
                  className="flex items-center space-x-2 p-3 glass-dark rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <code className="flex-1 text-sm font-mono text-coral break-all">
                    {generatedSentinelKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedSentinelKey)}
                    className="flex-shrink-0"
                    data-testid="button-copy-sentinel-key"
                  >
                    {copiedKey ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                  <div>
                    <span className="font-medium">Rate Limit:</span>
                    <div>1000 req/hour</div>
                  </div>
                  <div>
                    <span className="font-medium">Endpoints:</span>
                    <div>All allowed</div>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>

            <div className="space-y-3 text-left text-sm text-gray-400">
              <h4 className="font-medium text-white">Usage Instructions:</h4>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Use this Sentinel key in your applications instead of your real API key</li>
                <li>Set it as the authorization header: <code className="text-coral">Bearer {generatedSentinelKey.slice(0, 20)}...</code></li>
                <li>Monitor usage and security in your dashboard</li>
              </ol>
            </div>

            <Button
              onClick={resetDialog}
              className="w-full bg-gradient-to-r from-sky to-coral hover:shadow-lg"
              data-testid="button-done"
            >
              Done
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}