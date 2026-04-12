import React from 'react';

interface Stain {
  t?: string;
  l?: string;
  b?: string;
  ri?: string;
  s: string;
  c: string;
  r: string;
  op: number;
}

const stains: Stain[] = [
  // Cluster Superior Esquerdo
  { t: '5%', l: '2%', s: '40px', c: 'fill-primary-base', r: '15deg', op: 0.6 },
  { t: '12%', l: '8%', s: '25px', c: 'fill-violet-400', r: '-10deg', op: 0.4 },
  { t: '8%', l: '15%', s: '60px', c: 'fill-primary-dark', r: '45deg', op: 0.5 },

  // Cluster Superior Direito
  { t: '5%', ri: '5%', s: '120px', c: 'fill-primary-base', r: '-20deg', op: 0.4 },
  { t: '18%', ri: '12%', s: '35px', c: 'fill-fuchsia-600', r: '30deg', op: 0.6 },
  { t: '30%', ri: '15%', s: '60px', c: 'fill-violet-400', r: '-20deg', op: 0.4 },

  // Cluster Inferior Esquerdo
  { b: '10%', l: '5%', s: '80px', c: 'fill-primary-base', r: '15deg', op: 0.6 },
  { b: '5%', l: '15%', s: '30px', c: 'fill-violet-400', r: '200deg', op: 0.5 },

  // Cluster Inferior Direito
  { b: '15%', ri: '5%', s: '100px', c: 'fill-primary-base', r: '60deg', op: 0.5 },
  { b: '5%', ri: '15%', s: '45px', c: 'fill-violet-600', r: '15deg', op: 0.7 },

  // Espalhadas (Random)
  { t: '40%', l: '1%', s: '50px', c: 'fill-primary-dark', r: '180deg', op: 0.5 },
  { t: '45%', ri: '3%', s: '40px', c: 'fill-indigo-600', r: '75deg', op: 0.4 },
  { b: '40%', ri: '45%', s: '18px', c: 'fill-primary-dark', r: '110deg', op: 0.3 },
  { t: '30%', l: '35%', s: '20px', c: 'fill-primary-base', r: '0deg', op: 0.2 },
  { t: '70%', ri: '35%', s: '25px', c: 'fill-violet-500', r: '80deg', op: 0.2 },
  { t: '60%', ri: '25%', s: '300px', c: 'fill-primary-base', r: '-20deg', op: 0.2 },
];

const InkStains: React.FC = () => {
  const path1 = "M48,15 Q65,10 75,30 Q90,60 70,80 Q40,95 20,70 Q5,40 30,25 Z";
  const path2 = "M35,20 C45,5 65,5 75,20 C95,30 95,50 85,70 C75,90 60,95 40,90 C20,85 10,70 15,50 C20,30 25,10 35,20 Z";

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-30 lg:opacity-50">
      {stains.map(({ t, l, b, ri, s, c, r, op }, i) => {
        const chosenPath = i % 2 === 0 ? path1 : path2;

        return (
          <div
            key={`ink-${i}`}
            className="absolute pointer-events-none"
            style={{
              top: t,
              left: l,
              bottom: b,
              right: ri,
              width: s,
              height: s,
              transform: `rotate(${r})`,
              opacity: op,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Mancha principal orgânica e assimétrica */}
              <path d={chosenPath} className={c} />

              {/* Gotas satélites para realismo adicional */}
              <circle cx="15" cy="15" r="4" className={`${c} opacity-60`} />
              <circle cx="85" cy="85" r="3" className={`${c} opacity-40`} />
              <circle cx="20" cy="80" r="2" className={`${c} opacity-50`} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default InkStains;
