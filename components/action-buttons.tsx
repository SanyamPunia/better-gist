import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Share, Check, Loader2 } from "lucide-react";
import { ActionButtonsProps } from "../types/editor";

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isReadOnly,
  onCopy,
  onShare,
  copyStatus,
  shareStatus,
}) => {
  return (
    <div className="flex justify-end p-2 gap-2">
      <motion.button
        onClick={onCopy}
        className="text-zinc-400 hover:text-zinc-200 focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {copyStatus === "idle" ? (
            <Copy key="copy" className="h-4 w-4" />
          ) : (
            <motion.div
              key="copied"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="h-4 w-4 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      {!isReadOnly && (
        <motion.button
          onClick={onShare}
          className="text-zinc-400 hover:text-zinc-200 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={shareStatus === "loading"}
        >
          <AnimatePresence mode="wait">
            {shareStatus === "idle" && (
              <Share key="share" className="h-4 w-4" />
            )}
            {shareStatus === "loading" && (
              <Loader2 key="loading" className="h-4 w-4 animate-spin" />
            )}
            {shareStatus === "shared" && (
              <motion.div
                key="shared"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  );
};
