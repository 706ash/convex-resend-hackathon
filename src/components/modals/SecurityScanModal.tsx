'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Shield, CheckCircle, AlertTriangle, Loader2, Eye, Lock, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScanResult {
  category: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
  icon: React.ReactNode;
}

export function SecurityScanModal({ isOpen, onClose }: SecurityScanModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  const runSecurityScan = async () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanResults([]);

    // Simulate security scan with progressive results
    const scanSteps = [
      {
        category: 'Key Encryption',
        status: 'passed' as const,
        message: 'All API keys are properly encrypted',
        icon: <Lock className="w-4 h-4" />
      },
      {
        category: 'Access Control',
        status: 'passed' as const,
        message: 'Rate limits and scopes are properly configured',
        icon: <Eye className="w-4 h-4" />
      },
      {
        category: 'Audit Trail',
        status: 'passed' as const,
        message: 'All API requests are being logged',
        icon: <FileText className="w-4 h-4" />
      },
      {
        category: 'Anomaly Detection',
        status: 'warning' as const,
        message: 'Unusual usage pattern detected on OpenAI key',
        icon: <AlertTriangle className="w-4 h-4" />
      }
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanResults(prev => [...prev, scanSteps[i]]);
    }

    setIsScanning(false);
    setScanComplete(true);
    toast.success('Security scan completed');
  };

  useEffect(() => {
    if (isOpen && !scanComplete) {
      runSecurityScan();
    }
  }, [isOpen]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
  };

  const handleClose = () => {
    setScanComplete(false);
    setScanResults([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Security Scan Results" size="lg">
      <div className="space-y-6">
        <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
          <Shield className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="font-semibold text-white">Comprehensive Security Analysis</h3>
            <p className="text-sm text-slate-400">
              Scanning API keys, access controls, and usage patterns
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {scanResults.map((result, index) => (
            <motion.div
              key={result.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <div className="flex items-center space-x-3">
                <div className="text-slate-400">
                  {result.icon}
                </div>
                <div>
                  <h4 className="font-medium text-white">{result.category}</h4>
                  <p className="text-sm text-slate-400">{result.message}</p>
                </div>
              </div>
              {getStatusIcon(result.status)}
            </motion.div>
          ))}

          {isScanning && scanResults.length < 4 && (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                <span className="text-slate-300">Running security analysis...</span>
              </div>
            </div>
          )}
        </div>

        {scanComplete && (
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Overall Security Score</span>
              <span className="text-blue-400 text-sm">92/100</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
              />
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Good security posture with minor recommendations
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
          {scanComplete && (
            <Button onClick={runSecurityScan} disabled={isScanning}>
              Run Again
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}