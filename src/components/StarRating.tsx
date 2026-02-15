import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readonly = false, size = 24 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          disabled={readonly}
        >
          <Star
            size={size}
            className={`transition-all duration-200 ${star <= (hovered || value)
              ? 'fill-warning text-warning'
              : 'fill-transparent text-gray-300'
              }`}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default StarRating;
