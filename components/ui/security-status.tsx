import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import GlassmorphicCard from "./glassmorphic-card";

export default function SecurityStatus() {
  const securityChecks = [
    { name: "Encryption", status: "secure", icon: CheckCircle },
    { name: "Access Control", status: "secure", icon: CheckCircle },
    { name: "Audit Trail", status: "secure", icon: CheckCircle },
    { name: "Anomaly Detection", status: "warning", icon: AlertTriangle },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "critical": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <GlassmorphicCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Security Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Threat Level</span>
          <span className="text-green-400 text-sm font-medium">Low</span>
        </div>
        
        <div className="w-full bg-navy/50 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="bg-green-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
        
        <div className="space-y-3 pt-4">
          {securityChecks.map((check, index) => (
            <motion.div 
              key={check.name}
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="text-gray-400">{check.name}</span>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <check.icon className={`w-5 h-5 ${getStatusColor(check.status)}`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-sky/10 to-coral/10 rounded-lg border border-sky/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-sky" />
            <span className="text-sm font-medium">Security Score</span>
          </div>
          <motion.div 
            className="text-2xl font-bold text-sky"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            98/100
          </motion.div>
          <div className="text-xs text-gray-400">Excellent security posture</div>
        </motion.div>
      </div>
    </GlassmorphicCard>
  );
}
