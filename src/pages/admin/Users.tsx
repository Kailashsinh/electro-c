import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const AdminUsers: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Users</h1>
      <p className="text-muted-foreground mt-1">Manage platform users</p>
    </div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
              User data will load from admin API
            </td></tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

export default AdminUsers;
