import { useState } from 'react';
import { Building2, Search, Filter, Plus, Mail, Phone, MapPin, Edit2, MoreVertical, X, Check } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'CL-001',
      name: 'St. Jude Care Home',
      type: 'Care Home',
      contactPerson: 'Sarah Jenkins',
      email: 'sarah.j@stjudecare.com',
      phone: '020 7123 4567',
      address: '124 Willow Lane, London, NW1 4EP',
      status: 'Active',
    },
    {
      id: 'CL-002',
      name: 'Meadow View',
      type: 'Nursing Home',
      contactPerson: 'Mark Thompson',
      email: 'm.thompson@meadowview.co.uk',
      phone: '020 8987 6543',
      address: '45 Green Road, London, SE1 7PB',
      status: 'Active',
    },
    {
      id: 'CL-003',
      name: 'City Hospital',
      type: 'Hospital',
      contactPerson: 'Dr. Emily Chen',
      email: 'e.chen@cityhospital.nhs.uk',
      phone: '020 3333 4444',
      address: '1 High Street, London, EC1A 7BE',
      status: 'Inactive',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState<Partial<Client>>({});

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } as Client : c));
    } else {
      const newClient: Client = {
        ...formData,
        id: `CL-00${clients.length + 1}`,
      } as Client;
      setClients([...clients, newClient]);
    }
    handleCloseModal();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Client Management</h1>
          <p className="text-rr-text/60 text-sm font-medium">Manage agency clients, facilities, and contacts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-text/40" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-rr-accent/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/20 transition-shadow w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-rr-text text-rr-bg font-bold text-sm hover:bg-rr-text/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-3xl border border-rr-accent/20 p-6 shadow-sm hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => handleOpenModal(client)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-rr-bg text-rr-text/60 hover:text-rr-text opacity-0 group-hover:opacity-100 transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-rr-bg rounded-2xl text-rr-text">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg leading-tight">{client.name}</h3>
                <p className="text-xs font-medium text-rr-text/60">{client.type}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-rr-accent" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-rr-accent" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-rr-accent shrink-0 mt-0.5" />
                <span className="leading-snug">{client.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-rr-accent/10">
              <div className="text-xs font-bold uppercase tracking-widest text-rr-text/40">
                Contact: {client.contactPerson}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {client.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-rr-text">
                    {editingClient ? 'Edit Client' : 'Add New Client'}
                  </h2>
                  <p className="text-rr-text/60 font-medium">Enter the client facility details below.</p>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-rr-bg rounded-full transition-colors">
                  <X className="w-6 h-6 text-rr-text/40" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Facility Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Facility Type</label>
                    <input 
                      type="text" 
                      value={formData.type || ''}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Contact Person</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Email</label>
                    <input 
                      type="email" 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Phone</label>
                    <input 
                      type="text" 
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Address</label>
                  <textarea 
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-rr-text/40">Status</label>
                  <select 
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2 bg-rr-bg/50 border border-rr-accent/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rr-text/10"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleCloseModal}
                  className="flex-1 py-4 rounded-2xl font-bold text-sm border border-rr-accent/20 text-rr-text/60 hover:bg-rr-bg transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 rounded-2xl font-bold text-sm bg-rr-text text-rr-bg hover:bg-rr-text/90 shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
