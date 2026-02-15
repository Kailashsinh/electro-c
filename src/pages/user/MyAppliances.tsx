import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { applianceApi } from '@/api/appliances';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Wrench, Plus, X, Search, Filter, Cpu, Calendar, Hash, MapPin, Laptop, Smartphone, Tv, Snowflake, Wind, Droplets, Speaker, Headphones, Tablet, Watch, Camera, Gamepad2, Monitor, Printer, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const getApplianceIcon = (app: any) => {
  const categoryName = app.model?.brand_id?.category_id?.name;
  const modelName = app.model?.name || (typeof app.model === 'string' ? app.model : '');
  const brandName = app.model?.brand_id?.name;
  const searchText = `${categoryName || ''} ${modelName || ''} ${brandName || ''}`.toLowerCase();

  if (searchText.includes('phone') || searchText.includes('mobile') || searchText.includes('android') || searchText.includes('iphone')) return <Smartphone className="h-6 w-6" />;
  if (searchText.includes('laptop') || searchText.includes('macbook') || searchText.includes('notebook')) return <Laptop className="h-6 w-6" />;
  if (searchText.includes('computer') || searchText.includes('pc') || searchText.includes('desktop')) return <Monitor className="h-6 w-6" />;
  if (searchText.includes('tv') || searchText.includes('television') || searchText.includes('led') || searchText.includes('lcd')) return <Tv className="h-6 w-6" />;
  if (searchText.includes('fridge') || searchText.includes('refrigerator') || searchText.includes('freezer')) return <Snowflake className="h-6 w-6" />;
  if (searchText.includes('ac') || searchText.includes('air cond') || searchText.includes('cooler')) return <Wind className="h-6 w-6" />;
  if (searchText.includes('wash') || searchText.includes('laundry') || searchText.includes('dryer')) return <Droplets className="h-6 w-6" />;
  if (searchText.includes('speaker') || searchText.includes('audio') || searchText.includes('sound')) return <Speaker className="h-6 w-6" />;
  if (searchText.includes('headphone') || searchText.includes('earphone') || searchText.includes('headset')) return <Headphones className="h-6 w-6" />;
  if (searchText.includes('tablet') || searchText.includes('ipad') || searchText.includes('tab')) return <Tablet className="h-6 w-6" />;
  if (searchText.includes('watch') || searchText.includes('wearable')) return <Watch className="h-6 w-6" />;
  if (searchText.includes('camera') || searchText.includes('dslr') || searchText.includes('lens')) return <Camera className="h-6 w-6" />;
  if (searchText.includes('game') || searchText.includes('console') || searchText.includes('ps5') || searchText.includes('xbox')) return <Gamepad2 className="h-6 w-6" />;
  if (searchText.includes('printer') || searchText.includes('scanner')) return <Printer className="h-6 w-6" />;

  return <Cpu className="h-6 w-6" />;
};

const gradients = [
  'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-200 border-blue-200 shadow-blue-500/10',
  'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-200 border-amber-200 shadow-amber-500/10',
  'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-200 border-emerald-200 shadow-emerald-500/10',
  'bg-gradient-to-br from-purple-100 via-fuchsia-50 to-pink-200 border-purple-200 shadow-purple-500/10',
  'bg-gradient-to-br from-cyan-100 via-cyan-50 to-sky-200 border-cyan-200 shadow-cyan-500/10',
  'bg-gradient-to-br from-rose-100 via-rose-50 to-red-200 border-rose-200 shadow-rose-500/10',
];

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5, rotateX: 2, rotateY: 2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-[2rem] p-6 flex flex-col justify-between border transition-colors ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm pointer-events-none z-0" />
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const MyAppliances: React.FC = () => {
  const navigate = useNavigate();
  const [appliances, setAppliances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [form, setForm] = useState({
    category: '', brand: '', model: '', purchaseDate: '', serial_number: '', invoiceNumber: '',
  });

  const { toast } = useToast();

  const loadAppliances = async () => {
    try {
      const res = await applianceApi.getMyAppliances();
      setAppliances(res.data?.appliances || res.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadAppliances(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applianceApi.register(form);
      toast({ title: 'Success', description: 'Appliance registered successfully!' });
      setShowForm(false);
      setForm({ category: '', brand: '', model: '', purchaseDate: '', serial_number: '', invoiceNumber: '' });
      loadAppliances();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to register', variant: 'destructive' });
    } finally { setSubmitting(false); }
  };


  const categories = ['All', ...Array.from(new Set(appliances.map(a => a.model?.brand_id?.category_id?.name || 'Others')))];

  const filteredAppliances = appliances.filter(app => {
    const modelName = app.model?.name || app.model || '';
    const brandName = app.model?.brand_id?.name || '';
    const categoryName = app.model?.brand_id?.category_id?.name || 'Others';

    const matchesSearch = modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || categoryName === activeFilter;

    return matchesSearch && matchesFilter;
  });

  if (loading) return <LoadingSkeleton rows={3} />;

  return (
    <div className="space-y-8 relative min-h-[80vh]">
      { }
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      { }
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-600 tracking-tight">
            My Appliances
          </h1>
          <p className="text-gray-500 mt-3 text-base md:text-lg font-medium">Your premium device collection, reimagined.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 active:scale-95 w-full md:w-auto ${showForm
            ? 'bg-red-50 text-red-600 hover:bg-red-100 ring-2 ring-red-100'
            : 'bg-gray-900 text-white hover:bg-black hover:shadow-2xl hover:shadow-indigo-500/30 ring-2 ring-gray-900'
            }`}
        >
          {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          <span>{showForm ? 'Close Form' : 'Add Device'}</span>
        </button>
      </div>

      { }
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative bg-white/80 backdrop-blur-2xl border border-white/60 p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/10 mb-10 overflow-hidden ring-1 ring-white/50">
              { }
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                  <Plus className="h-5 w-5" />
                </div>
                New Appliance Registration
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                  <Combobox
                    value={form.category}
                    onChange={(val) => setForm({ ...form, category: val, brand: '', model: '' })}
                    onSearch={(q) => applianceApi.searchCategories(q).then(res => res.data)}
                    placeholder="e.g. Washing Machine"
                    allowCustom
                    className="bg-white/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Brand</label>
                  <Combobox
                    value={form.brand}
                    onChange={(val) => setForm({ ...form, brand: val, model: '' })}
                    onSearch={(q) => applianceApi.searchBrands(q, form.category).then(res => res.data)}
                    placeholder="e.g. LG, Samsung"
                    disabled={!form.category}
                    allowCustom
                    className="bg-white/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Model</label>
                  <Combobox
                    value={form.model}
                    onChange={(val) => setForm({ ...form, model: val })}
                    onSearch={(q) => applianceApi.searchModels(q, form.brand).then(res => res.data)}
                    placeholder="Select or enter model"
                    disabled={!form.brand}
                    allowCustom
                    className="bg-white/50 border-gray-200 focus:bg-white transition-all rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Serial Number</label>
                  <input
                    name="serial_number"
                    value={form.serial_number}
                    onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                    required
                    placeholder="Found on the back of device"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Purchase Date</label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Invoice Number</label>
                  <input
                    name="invoiceNumber"
                    value={form.invoiceNumber}
                    onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    placeholder="e.g. INV-2024-001"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>



                <div className="md:col-span-2 lg:col-span-3 pt-6 border-t border-gray-100 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Cpu className="h-5 w-5" />
                        Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      { }
      <div className="space-y-8">
        { }
        {appliances.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            { }
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${activeFilter === cat
                    ? 'bg-gray-900 text-white shadow-indigo-500/20 scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            { }
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by model or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {appliances.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white/40 border-2 border-dashed border-gray-300 rounded-[2.5rem]">
            <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Wrench className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No appliances found</h3>
            <p className="text-gray-500 mt-2 mb-8 max-w-sm text-lg">
              Start building your digital home inventory. Track warranties and book services instantly.
            </p>
            <button onClick={() => setShowForm(true)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all">
              Add Your First Device
            </button>
          </div>
        ) : filteredAppliances.length === 0 ? (
          <div className="text-center p-12 bg-gray-50/50 rounded-3xl border border-gray-100">
            <p className="text-gray-500 font-medium">No appliances match your search.</p>
            <button onClick={() => { setSearchTerm(''); setActiveFilter('All'); }} className="text-indigo-600 font-semibold mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAppliances.map((app: any, i: number) => {
              const brandName = app.model?.brand_id?.name || 'Unknown Brand';
              const modelName = app.model?.name || app.model || 'Unknown Model';
              const cardStyle = gradients[i % gradients.length];

              return (
                <motion.div key={app._id || i} variants={item}>
                  <TiltCard className={cardStyle}>
                    { }
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md text-gray-800 shadow-sm border border-white/60">
                          {getApplianceIcon(app)}
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-gray-500 tracking-widest uppercase mb-1">{brandName}</p>
                          <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-1 title-font">
                            {modelName}
                          </h3>
                        </div>
                      </div>
                    </div>

                    { }
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/50 hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Hash className="h-4 w-4 text-gray-500 opacity-70" />
                          <span className="font-semibold">Serial</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-gray-800 tracking-tight">{app.serial_number}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/50 hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-500 opacity-70" />
                          <span className="font-semibold">Purchased</span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {new Date(app.purchase_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/50 border border-white/50 hover:bg-white/60 transition-colors">
                        <MapPin className="h-4 w-4 text-gray-500 opacity-70 mt-0.5 shrink-0" />
                        <span className="text-xs font-medium text-gray-700 line-clamp-2 leading-relaxed">
                          {app.installation_address || 'No address provided'}
                        </span>
                      </div>
                    </div>

                    { }
                    <div className="pt-5 border-t border-black/5 mt-auto">
                      <button
                        onClick={() => navigate('/user/requests/new', { state: { applianceId: app._id } })}
                        className="w-full group/btn relative overflow-hidden flex items-center justify-between px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2.5">
                          <Wrench className="h-4 w-4" />
                          Book Service
                        </span>
                        <ArrowRight className="relative z-10 h-5 w-5 -translate-x-2 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                      </button>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyAppliances;
