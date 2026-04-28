import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ProductHistory = () => {
  const history = [
    { name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', date: '2026-03-15', status: 'Optimal', score: '92', type: 'Serum' },
    { name: 'Squalane Cleanser', brand: 'The Ordinary', date: '2026-03-10', status: 'Stable', score: '85', type: 'Cleanser' },
    { name: 'Retinol 0.5% in Squalane', brand: 'The Ordinary', date: '2026-04-01', status: 'Transitioning', score: '78', type: 'Treatment' },
    { name: 'Hyaluronic Acid 2% + B5', brand: 'The Ordinary', date: '2026-02-28', status: 'Critical', score: '45', type: 'Hydration' },
  ];

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="text-primary font-bold tracking-widest text-sm uppercase italic">Editorial Log</div>
          <h1 className="text-5xl font-extrabold tracking-tighter">Product <span className="text-primary italic">History</span></h1>
          <p className="text-on-surface-variant max-w-md">
            Review the clinical efficacy of your curated lineup. Track every drop of progress.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="secondary" className="px-6">Export Data</Button>
          <Button variant="primary" className="px-6 shadow-lg shadow-primary/20">Add Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {history.map((item, i) => (
          <Card key={i} tonal className="p-8 space-y-6 flex flex-col items-start transition-all hover:translate-y-[-4px] hover:shadow-xl group">
            <div className={`w-full h-1 bg-gradient-to-r ${item.score > 80 ? 'from-primary to-primary-container' : item.score > 60 ? 'from-secondary to-tertiary' : 'from-error to-error-container'} rounded-full`}></div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">{item.type}</span>
              <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="text-on-surface-variant text-sm">{item.brand}</p>
            </div>

            <div className="bg-surface-low w-full p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Score</div>
                <div className="text-2xl font-extrabold text-on-surface">{item.score}%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Status</div>
                <div className={`text-sm font-bold ${item.status === 'Optimal' ? 'text-primary' : 'text-on-surface'}`}>{item.status}</div>
              </div>
            </div>

            <div className="text-xs text-on-surface-variant pt-2 flex items-center justify-between w-full">
              <span>Logged: {item.date}</span>
              <button className="text-primary font-bold hover:underline italic">Details ⇢</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductHistory;
