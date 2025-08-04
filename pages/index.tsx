import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Shield, Key, BarChart3, Lock, Eye, Tag, Play, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import FloatingElements from "../components/ui/floating-elements";
import GlassmorphicCard from "../components/ui/glassmorphic-card";

export default function Homepage() {
  const router = useRouter();

  const features = [
    {
      icon: Key,
      title: "Sentinel Keys",
      description: "Generate scoped proxy keys with granular access controls and automatic rotation capabilities.",
      features: ["Rate limiting", "IP restrictions", "Auto expiration"]
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor API usage patterns, performance metrics, and security events in real-time.",
      features: ["Usage dashboards", "Performance tracking", "Cost optimization"]
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Comprehensive security monitoring with anomaly detection and instant alerts.",
      features: ["Anomaly detection", "Instant alerts", "Audit logging"]
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "AES-256 encryption for all stored keys and data transmission"
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      description: "We never see your actual API keys in plaintext"
    },
    {
      icon: Tag,
      title: "SOC 2 Compliant",
      description: "Certified security controls and regular audits"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <FloatingElements />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.div 
                className="inline-block px-4 py-2 glass rounded-full text-sm text-coral border border-coral/30"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Enterprise-grade security
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold leading-tight"
                variants={itemVariants}
              >
                Secure Your{" "}
                <span className="bg-gradient-to-r from-sky via-coral to-sky bg-clip-text text-transparent">
                  API Keys
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 leading-relaxed"
                variants={itemVariants}
              >
                Professional API key management with advanced monitoring, scoped access controls, and real-time security alerts. Built for developers who prioritize security.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button 
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-sky to-coral hover:shadow-2xl transition-all hover:scale-105 text-lg font-semibold"
                size="lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline"
                className="px-8 py-4 glass hover:scale-105 transition-all text-lg font-semibold border-sky/30"
                size="lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="flex gap-8 pt-8"
              variants={containerVariants}
            >
              {[
                { label: "Uptime", value: "99.9%", color: "text-sky" },
                { label: "Requests Secured", value: "10M+", color: "text-coral" },
                { label: "Avg Response", value: "500ms", color: "text-sky" }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Hero Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <GlassmorphicCard className="p-8 relative">
              <motion.div 
                className="space-y-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">API Key Monitor</h3>
                  <motion.div 
                    className="w-3 h-3 bg-green-400 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">OpenAI GPT-4</span>
                    <span className="text-sky">Active</span>
                  </div>
                  <div className="w-full bg-navy/50 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-sky to-coral h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">65% quota used</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="glass p-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-coral">1,247</div>
                    <div className="text-xs text-gray-400">Requests Today</div>
                  </motion.div>
                  <motion.div 
                    className="glass p-4 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-sky">98.2%</div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 glass rounded-xl flex items-center justify-center"
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <Lock className="text-coral text-xl" />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 w-12 h-12 glass rounded-full flex items-center justify-center"
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              >
                <BarChart3 className="text-sky" />
              </motion.div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Enterprise-Grade{" "}
              <span className="bg-gradient-to-r from-coral to-sky bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced security controls and monitoring tools designed for modern development teams
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <GlassmorphicCard className="p-8 h-full hover:border-sky/40 transition-all duration-300">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-sky to-coral rounded-xl flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="text-white text-xl" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-coral mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-gradient-to-b from-transparent to-navy/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Bank-Level{" "}
                <span className="bg-gradient-to-r from-sky to-coral bg-clip-text text-transparent">
                  Security
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Your API keys are encrypted and secured with enterprise-grade protocols. Zero-trust architecture ensures maximum protection.
              </p>
              
              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <motion.div 
                    key={feature.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-8 h-8 bg-coral/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <feature.icon className="text-coral text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Security Status</h3>
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm text-green-400">Secure</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      "Encryption Status",
                      "Access Control", 
                      "Audit Logging",
                      "Anomaly Detection"
                    ].map((item, index) => (
                      <motion.div 
                        key={item}
                        className="flex justify-between items-center p-3 glass rounded-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-sm">{item}</span>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="p-4 bg-gradient-to-r from-sky/10 to-coral/10 rounded-lg border border-sky/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-sky" />
                      <span className="text-sm font-medium">Security Score</span>
                    </div>
                    <motion.div 
                      className="text-2xl font-bold text-sky"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      98/100
                    </motion.div>
                    <div className="text-xs text-gray-400">Excellent security posture</div>
                  </motion.div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
