import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

const AdminRequests: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Service Requests</h1>
      <p className="text-muted-foreground mt-1">Monitor all service requests</p>
    </div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Technician</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
              <ClipboardList className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
              Request data will load from admin API
            </td></tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default AdminRequests;
