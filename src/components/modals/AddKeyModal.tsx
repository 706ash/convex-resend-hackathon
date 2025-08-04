'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { addApiKeySchema, type AddApiKeyData } from '../../lib/validations';
import { Key, Shield } from 'lucide-react';

interface AddKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddKeyModal({ isOpen, onClose, onSuccess }: AddKeyModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddApiKeyData>({
    resolver: zodResolver(addApiKeySchema),
    defaultValues: {
      rateLimit: 1000,
      scopes: [],
    },
  });

  const providerOptions = [
    { value: '', label: 'Select a provider' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'gemini', label: 'Google Gemini' },
  ];

  const onSubmit = async (data: AddApiKeyData) => {
    try {
      // Simulate API call to Convex
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('API key added successfully!');
      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add API key. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New API Key" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Key Name"
            placeholder="e.g., Production OpenAI"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Select
            label="Provider"
            options={providerOptions}
            error={errors.provider?.message}
            {...register('provider')}
          />
        </div>

        <Input
          label="API Key"
          type="password"
          placeholder="Enter your API key"
          error={errors.apiKey?.message}
          helperText="Your key will be encrypted and stored securely"
          {...register('apiKey')}
        />

        <Input
          label="Description (Optional)"
          placeholder="Brief description of this key's purpose"
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Rate Limit (requests/hour)"
          type="number"
          min="1"
          max="10000"
          error={errors.rateLimit?.message}
          {...register('rateLimit', { valueAsNumber: true })}
        />

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Security Features</span>
          </div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• End-to-end encryption for stored keys</li>
            <li>• Automatic rate limiting and monitoring</li>
            <li>• Real-time usage analytics and alerts</li>
            <li>• Scoped access controls (coming soon)</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            icon={Key} 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Adding...' : 'Add Key'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}