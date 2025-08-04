'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { editApiKeySchema, type EditApiKeyData } from '../../lib/validations';
import { Save, Trash2 } from 'lucide-react';

interface EditKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  keyData?: {
    id: string;
    name: string;
    description?: string;
    rateLimit: number;
    scopes: string[];
    isActive: boolean;
  };
}

export function EditKeyModal({ isOpen, onClose, onSuccess, keyData }: EditKeyModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditApiKeyData>({
    resolver: zodResolver(editApiKeySchema),
    defaultValues: keyData,
  });

  const onSubmit = async (data: EditApiKeyData) => {
    try {
      // Simulate API call to Convex
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('API key updated successfully!');
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to update API key. Please try again.');
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API call to Convex
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('API key revoked successfully!');
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to revoke API key. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit API Key" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Key Name"
          placeholder="e.g., Production OpenAI"
          error={errors.name?.message}
          {...register('name')}
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

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-300">
            Key is active
          </label>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-700">
          <Button 
            type="button"
            variant="ghost" 
            icon={Trash2}
            onClick={handleRevoke}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Revoke Key
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              icon={Save} 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}