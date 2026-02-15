import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import StarRating from './StarRating';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  technicianName?: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
}

import { createPortal } from 'react-dom';

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, onClose, technicianName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await onSubmit({ rating, comment });
      toast({ title: 'Feedback submitted!', description: 'Thank you for your review.' });
      onClose();
    } catch {
      toast({ title: 'Error', description: 'Failed to submit feedback', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-md max-h-[90vh] overflow-y-auto glass-card p-6 shadow-2xl origin-center"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Rate Service</h2>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {technicianName && (
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-accent">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{technicianName}</p>
                  <p className="text-xs text-muted-foreground">Technician</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">How was the service?</label>
              <div className="flex justify-center">
                <StarRating value={rating} onChange={setRating} size={32} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience..."
                className="input-field resize-none w-full"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={rating === 0 || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading && <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              Submit Feedback
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default FeedbackModal;
