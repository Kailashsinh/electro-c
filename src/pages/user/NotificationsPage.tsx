import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi } from '@/api/notifications';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Bell, Check, Clock, Calendar, CheckCircle2 } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi.getAll()
      .then((res) => setNotifications(res.data?.notifications || res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch { }
  };

  const markAllRead = async () => {
    
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await Promise.all(unreadIds.map(id => notificationApi.markAsRead(id)));
    } catch { }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="space-y-8 max-w-3xl mx-auto relative min-h-[80vh]">
      {}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-2 font-medium">Stay updated with your service requests.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 active:scale-95 w-full md:w-auto justify-center md:justify-start"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white/40 border-2 border-dashed border-gray-200 rounded-[2rem]">
          <div className="h-24 w-24 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Bell className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-2 max-w-xs">You have no new notifications at the moment.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <AnimatePresence>
            {notifications.map((n: any, i: number) => (
              <motion.div
                key={n._id || i}
                variants={item}
                layout
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${!n.read
                  ? 'bg-white border-indigo-100 shadow-md shadow-indigo-500/5'
                  : 'bg-white/40 border-gray-100'
                  }`}
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${!n.read ? 'bg-indigo-500' : 'bg-transparent'}`} />

                <div className="p-5 flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 transition-colors ${!n.read ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                    <Bell className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={`font-bold text-base ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        <Clock className="w-3 h-3" />
                        {new Date(n.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="mx-1 opacity-30">|</span>
                        <Calendar className="w-3 h-3" />
                        {new Date(n.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <p className={`mt-1 text-sm leading-relaxed ${!n.read ? 'text-gray-600' : 'text-gray-400'}`}>
                      {n.message}
                    </p>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="self-center p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationsPage;
