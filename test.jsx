import React, { useState, useEffect, useRef } from 'react';
import { Video, Fan, X, Power, Gauge, Clock, AlertTriangle, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Генерация начальных данных для графиков
const generateInitialData = (points = 30, speed = 2000) => {
  const data = [];
  const now = Date.now();
  
  for (let i = points - 1; i >= 0; i--) {
    const temp = 22 + (3000 - speed) / 200 + (Math.random() - 0.5);
    const power = 40 + (speed / 3000) * 60 + (Math.random() - 0.5) * 5;
    
    data.push({
      time: new Date(now - i * 1000).toLocaleTimeString(),
      temperature: parseFloat(temp.toFixed(1)),
      speed: speed,
      power: parseFloat(power.toFixed(1))
    });
  }
  return data;
};

// Компонент анимированного вентилятора
const AnimatedFan = ({ status, speed, size = 40, color }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!status) {
      setRotation(0);
      return;
    }

    const rotationSpeed = speed / 100;
    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      setRotation(prev => (prev + rotationSpeed * delta) % 360);
      
      if (status) {
        requestAnimationFrame(animate);
      }
    };
    
    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [status, speed]);

  return (
    <div 
      style={{ 
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotation}deg)`,
        opacity: 0.7
      }}
    >
      <Fan size={size} color={color} strokeWidth={2.5}/>
    </div>
  );
};

// Компонент помещения 1 (производственный цех)
const Room1Schema = ({ fans, cameras, onFanClick, onCameraClick }) => {
  return (
    <svg width="700" height="500" viewBox="0 0 700 500" className="border border-gray-700 rounded-lg bg-gray-900">
      {/* Внешние стены */}
      <path d="M 50 50 L 650 50 L 650 450 L 50 450 Z" fill="#1f2937" stroke="#6b7280" strokeWidth="3"/>
      
      {/* Внутренние перегородки */}
      <line x1="350" y1="50" x2="350" y2="300" stroke="#4b5563" strokeWidth="2" strokeDasharray="5,5"/>
      <line x1="50" y1="250" x2="650" y2="250" stroke="#4b5563" strokeWidth="2" strokeDasharray="5,5"/>
      
      {/* Двери */}
      <rect x="320" y="448" width="60" height="4" fill="#9ca3af"/>
      <rect x="48" y="220" width="4" height="60" fill="#9ca3af"/>
      
      {/* Окна */}
      <rect x="520" y="48" width="80" height="4" fill="#3b82f6" opacity="0.6"/>
      <rect x="150" y="48" width="80" height="4" fill="#3b82f6" opacity="0.6"/>
      
      {/* Рабочие зоны */}
      <rect x="100" y="100" width="150" height="100" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1"/>
      <text x="175" y="155" textAnchor="middle" className="text-xs fill-amber-400">Зона 1</text>
      
      <rect x="450" y="100" width="150" height="100" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1"/>
      <text x="525" y="155" textAnchor="middle" className="text-xs fill-amber-400">Зона 2</text>
      
      <rect x="100" y="320" width="200" height="100" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1"/>
      <text x="200" y="375" textAnchor="middle" className="text-xs fill-blue-400">Складское помещение</text>
      
      {/* Вентиляторы */}
      {fans.map((fan, idx) => {
        const positions = [
          { x: 175, y: 150 },
          { x: 525, y: 150 },
          { x: 200, y: 370 }
        ];
        const pos = positions[idx];
        
        return (
          <g key={idx} onClick={() => onFanClick(fan)} className="cursor-pointer">
            <circle cx={pos.x} cy={pos.y} r="30" fill={fan.status ? '#10b981' : '#4b5563'} opacity="0.3"/>
            <foreignObject x={pos.x - 20} y={pos.y - 20} width="40" height="40">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                <AnimatedFan 
                  status={fan.status} 
                  speed={fan.speed} 
                  size={40} 
                  color={fan.status ? '#10b981' : '#6b7280'}
                />
              </div>
            </foreignObject>
            <text x={pos.x} y={pos.y + 45} textAnchor="middle" className="text-xs fill-gray-300 font-medium pointer-events-none">{fan.id}</text>
          </g>
        );
      })}
      
      {/* Камеры */}
      <g transform="translate(120, 80)" onClick={() => onCameraClick(cameras[0])} className="cursor-pointer">
        <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.2"/>
        <Video size={32} color="#60a5fa" strokeWidth={2}/>
        <circle cx="12" cy="-12" r="4" fill="#ef4444" className="animate-pulse"/>
      </g>
      
      <g transform="translate(580, 80)" onClick={() => onCameraClick(cameras[1])} className="cursor-pointer">
        <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.2"/>
        <Video size={32} color="#60a5fa" strokeWidth={2}/>
        <circle cx="12" cy="-12" r="4" fill="#ef4444" className="animate-pulse"/>
      </g>
    </svg>
  );
};

// Компонент помещения 2 (современный офис)
const Room2Schema = ({ fans, cameras, onFanClick, onCameraClick }) => {
  return (
    <svg width="700" height="500" viewBox="0 0 700 500" className="border border-gray-700 rounded-lg bg-gray-900">
      {/* Основное здание - L-образная форма */}
      <path d="M 80 80 L 620 80 L 620 280 L 400 280 L 400 420 L 80 420 Z" fill="#1f2937" stroke="#6b7280" strokeWidth="3"/>
      
      {/* Переговорная комната (стеклянная) */}
      <rect x="120" y="120" width="140" height="120" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="8,4"/>
      <rect x="125" y="125" width="130" height="110" fill="#3b82f6" opacity="0.1"/>
      <text x="190" y="185" textAnchor="middle" className="text-xs fill-blue-400 font-semibold">ПЕРЕГОВОРНАЯ</text>
      
      {/* Open Space */}
      <rect x="300" y="120" width="280" height="120" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1"/>
      <text x="440" y="160" textAnchor="middle" className="text-sm fill-green-400 font-semibold">OPEN SPACE</text>
      
      {/* Рабочие столы в Open Space */}
      <rect x="320" y="140" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="320" y="170" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="370" y="140" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="370" y="170" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="420" y="140" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="420" y="170" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="470" y="140" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="470" y="170" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="520" y="140" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      <rect x="520" y="170" width="35" height="20" fill="#6b7280" opacity="0.3"/>
      
      {/* Кухня */}
      <rect x="120" y="280" width="120" height="100" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
      <text x="180" y="320" textAnchor="middle" className="text-xs fill-amber-400 font-semibold">КУХНЯ</text>
      <circle cx="150" cy="340" r="12" fill="#9ca3af" opacity="0.3"/>
      <circle cx="210" cy="340" r="12" fill="#9ca3af" opacity="0.3"/>
      
      {/* Серверная (с особым обозначением) */}
      <rect x="280" y="280" width="100" height="100" fill="#475569" opacity="0.15" stroke="#64748b" strokeWidth="3"/>
      <text x="330" y="315" textAnchor="middle" className="text-xs fill-slate-400 font-bold">SERVER</text>
      <text x="330" y="330" textAnchor="middle" className="text-xs fill-slate-400 font-bold">ROOM</text>
      
      {/* Стеллажи в серверной */}
      <rect x="290" y="295" width="15" height="70" fill="#64748b" opacity="0.4"/>
      <rect x="310" y="295" width="15" height="70" fill="#64748b" opacity="0.4"/>
      <rect x="345" y="295" width="15" height="70" fill="#64748b" opacity="0.4"/>
      <rect x="365" y="295" width="15" height="70" fill="#64748b" opacity="0.4"/>
      
      {/* Санузел */}
      <rect x="120" y="390" width="80" height="20" fill="#6366f1" opacity="0.2" stroke="#818cf8" strokeWidth="1"/>
      <text x="160" y="403" textAnchor="middle" className="text-xs fill-indigo-400">WC</text>
      
      {/* Коридор */}
      <path d="M 260 120 L 280 120 L 280 380 L 120 380 L 120 260" fill="none" stroke="#4b5563" strokeWidth="2" strokeDasharray="4,4"/>
      
      {/* Двери */}
      <line x1="180" y1="120" x2="220" y2="120" stroke="#9ca3af" strokeWidth="4"/>
      <line x1="280" y1="180" x2="300" y2="180" stroke="#9ca3af" strokeWidth="4"/>
      <line x1="180" y1="280" x2="220" y2="280" stroke="#9ca3af" strokeWidth="4"/>
      <line x1="280" y1="330" x2="280" y2="360" stroke="#9ca3af" strokeWidth="4"/>
      
      {/* Окна (панорамные) */}
      <rect x="300" y="78" width="100" height="4" fill="#60a5fa" opacity="0.7"/>
      <rect x="450" y="78" width="100" height="4" fill="#60a5fa" opacity="0.7"/>
      <rect x="618" y="120" width="4" height="80" fill="#60a5fa" opacity="0.7"/>
      <rect x="618" y="220" width="4" height="40" fill="#60a5fa" opacity="0.7"/>
      
      {/* Растения (декор) */}
      <circle cx="270" cy="120" r="8" fill="#22c55e" opacity="0.4"/>
      <circle cx="270" cy="240" r="8" fill="#22c55e" opacity="0.4"/>
      <circle cx="390" cy="240" r="8" fill="#22c55e" opacity="0.4"/>
      
      {/* Вентиляторы */}
      {fans.map((fan, idx) => {
        const positions = [
          { x: 190, y: 185 },
          { x: 440, y: 180 },
          { x: 330, y: 330 }
        ];
        const pos = positions[idx];
        
        return (
          <g key={idx} onClick={() => onFanClick(fan)} className="cursor-pointer">
            <circle cx={pos.x} cy={pos.y} r="28" fill={fan.status ? '#10b981' : '#4b5563'} opacity="0.3"/>
            <foreignObject x={pos.x - 19} y={pos.y - 19} width="38" height="38">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px' }}>
                <AnimatedFan 
                  status={fan.status} 
                  speed={fan.speed} 
                  size={38} 
                  color={fan.status ? '#10b981' : '#6b7280'}
                />
              </div>
            </foreignObject>
            <text x={pos.x} y={pos.y + 45} textAnchor="middle" className="text-xs fill-gray-300 font-medium pointer-events-none">{fan.id}</text>
          </g>
        );
      })}
      
      {/* Камеры */}
      <g transform="translate(140, 100)" onClick={() => onCameraClick(cameras[0])} className="cursor-pointer">
        <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.2"/>
        <Video size={32} color="#60a5fa" strokeWidth={2}/>
        <circle cx="12" cy="-12" r="4" fill="#ef4444" className="animate-pulse"/>
      </g>
      
      <g transform="translate(580, 100)" onClick={() => onCameraClick(cameras[1])} className="cursor-pointer">
        <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.2"/>
        <Video size={32} color="#60a5fa" strokeWidth={2}/>
        <circle cx="12" cy="-12" r="4" fill="#ef4444" className="animate-pulse"/>
      </g>
    </svg>
  );
};

// Модальное окно с графиками и управлением
const FanModal = ({ fan, onClose, onToggle, onSpeedChange, logs, tempThreshold, onThresholdChange }) => {
  const [data, setData] = useState(() => generateInitialData(30, fan.speed));
  const [tempSpeed, setTempSpeed] = useState(fan.speed);
  const initialSpeedRef = useRef(fan.speed);
  const tempWarningRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        
        const targetTemp = 22 + (3000 - fan.speed) / 200;
        let newTemp = lastPoint.temperature + (targetTemp - lastPoint.temperature) * 0.1 + (Math.random() - 0.5) * 0.3;
        newTemp = Math.max(18, Math.min(35, newTemp));
        
        const targetPower = 40 + (fan.speed / 3000) * 60;
        let newPower = lastPoint.power + (targetPower - lastPoint.power) * 0.1 + (Math.random() - 0.5) * 2;
        newPower = Math.max(30, Math.min(120, newPower));
        
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          temperature: parseFloat(newTemp.toFixed(1)),
          speed: fan.speed,
          power: parseFloat(newPower.toFixed(1))
        };
        
        return [...prevData.slice(1), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fan.speed]);

  useEffect(() => {
    const lastPoint = data[data.length - 1];
    if (lastPoint && lastPoint.temperature > tempThreshold && !tempWarningRef.current) {
      tempWarningRef.current = true;
      onThresholdChange(fan.id, `Превышен порог температуры: ${lastPoint.temperature.toFixed(1)}°C > ${tempThreshold}°C`);
    } else if (lastPoint && lastPoint.temperature <= tempThreshold && tempWarningRef.current) {
      tempWarningRef.current = false;
      onThresholdChange(fan.id, `Температура вернулась в норму: ${lastPoint.temperature.toFixed(1)}°C`);
    }
  }, [data, tempThreshold, fan.id, onThresholdChange]);

  useEffect(() => {
    setTempSpeed(fan.speed);
    initialSpeedRef.current = fan.speed;
  }, [fan.speed]);

  const handleSpeedSliderChange = (e) => {
    setTempSpeed(parseInt(e.target.value));
  };

  const handleSpeedSliderRelease = () => {
    if (initialSpeedRef.current !== tempSpeed) {
      onSpeedChange(fan.id, `Скорость изменена: ${initialSpeedRef.current} → ${tempSpeed} об/мин`, tempSpeed);
      initialSpeedRef.current = tempSpeed;
    }
  };

  const fanLogs = logs.filter(log => log.fanId === fan.id).slice(0, 10);
  const currentTemp = data[data.length - 1]?.temperature || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">{fan.id}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Панель управления и логи */}
            <div className="space-y-4">
              {/* Управление */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Управление</h3>
                <div className="space-y-4">
                  <button
                    onClick={onToggle}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium ${
                      fan.status ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                  >
                    <Power size={20} />
                    {fan.status ? 'Выключить' : 'Включить'}
                  </button>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                      <Gauge size={18} />
                      Скорость: {Math.round(tempSpeed)} об/мин
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="3000"
                      value={tempSpeed}
                      onChange={handleSpeedSliderChange}
                      onMouseUp={handleSpeedSliderRelease}
                      onTouchEnd={handleSpeedSliderRelease}
                      disabled={!fan.status}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Настройки порога температуры */}
              <div className="bg-orange-950 rounded-lg p-4 border border-orange-800">
                <h3 className="text-lg font-semibold mb-3 text-orange-400 flex items-center gap-2">
                  <Settings size={18} />
                  Порог температуры
                </h3>
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <AlertTriangle size={18} className="text-orange-400" />
                    Максимум: {tempThreshold}°C
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="30"
                    step="0.5"
                    value={tempThreshold}
                    onChange={(e) => onThresholdChange(fan.id, null, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className={`mt-2 text-sm font-medium ${currentTemp > tempThreshold ? 'text-red-400' : 'text-green-400'}`}>
                    Текущая: {currentTemp.toFixed(1)}°C {currentTemp > tempThreshold ? '⚠️ Превышено' : '✓ Норма'}
                  </div>
                </div>
              </div>

              {/* Логи */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-200 flex items-center gap-2">
                  <Clock size={18} />
                  История событий
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {fanLogs.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Нет событий</p>
                  ) : (
                    fanLogs.map((log, idx) => (
                      <div key={idx} className={`text-xs bg-gray-800 p-2 rounded border-l-2 ${
                        log.action.includes('Превышен') ? 'border-red-500' : 
                        log.action.includes('норму') ? 'border-green-500' : 
                        'border-blue-500'
                      }`}>
                        <div className="font-medium text-gray-200">{log.action}</div>
                        <div className="text-gray-400">{log.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Графики */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Температура (°C)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
                    <YAxis domain={[15, 35]} tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }} />
                    <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Скорость вращения (об/мин)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
                    <YAxis domain={[500, 3500]} tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }} />
                    <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-200">Потребляемая мощность (Вт)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
                    <YAxis domain={[30, 120]} tick={{ fontSize: 11, fill: '#9ca3af' }} stroke="#4b5563" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }} />
                    <Line type="monotone" dataKey="power" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Модальное окно с камерами
const CameraModal = ({ onClose }) => {
  const [activeCamera, setActiveCamera] = useState(0);
  const cameras = ['Камера 1', 'Камера 2'];
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2
    }));
    setParticles(newParticles);
  }, [activeCamera]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full border border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-100">Видеонаблюдение</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {cameras.map((camera, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCamera(idx)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCamera === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {camera}
              </button>
            ))}
          </div>

          <div className="bg-gray-950 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden border border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 opacity-60"></div>
            
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full bg-white opacity-40"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animation: `float ${particle.duration}s ease-in-out infinite`
                }}
              />
            ))}
            
            <div className="relative z-10 text-center">
              <Video size={64} color="white" className="mx-auto mb-4 opacity-70" />
              <p className="text-white text-xl font-semibold">{cameras[activeCamera]}</p>
              <p className="text-gray-300 text-sm mt-2">Прямая трансляция</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">REC</span>
              </div>
            </div>
            
            <div className="absolute top-4 left-4 text-white text-sm font-mono bg-black bg-opacity-50 px-3 py-1 rounded">
              {new Date().toLocaleString()}
            </div>
            
            <div className="absolute bottom-4 right-4 flex gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
};

// Главный компонент
export default function VentilationSystem() {
  const [selectedObject, setSelectedObject] = useState(0);
  const [selectedFan, setSelectedFan] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [logs, setLogs] = useState([]);
  const [tempThresholds, setTempThresholds] = useState({
    'Вентилятор 1-1': 25,
    'Вентилятор 1-2': 25,
    'Вентилятор 1-3': 25,
    'Вентилятор 2-1': 25,
    'Вентилятор 2-2': 25,
    'Вентилятор 2-3': 25,
  });

  const [objects, setObjects] = useState([
    {
      id: 'Объект 1 - Производственный цех',
      fans: [
        { id: 'Вентилятор 1-1', status: true, speed: 2000 },
        { id: 'Вентилятор 1-2', status: false, speed: 1500 },
        { id: 'Вентилятор 1-3', status: true, speed: 2500 }
      ],
      cameras: [
        { id: 'Камера 1-1' },
        { id: 'Камера 1-2' }
      ]
    },
    {
      id: 'Объект 2 - Офисное помещение',
      fans: [
        { id: 'Вентилятор 2-1', status: true, speed: 1800 },
        { id: 'Вентилятор 2-2', status: true, speed: 2200 },
        { id: 'Вентилятор 2-3', status: false, speed: 1000 }
      ],
      cameras: [
        { id: 'Камера 2-1' },
        { id: 'Камера 2-2' }
      ]
    }
  ]);

  const addLog = (fanId, action) => {
    const newLog = {
      fanId,
      action,
      timestamp: new Date().toLocaleString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleFanToggle = () => {
    setObjects(prev => {
      const newObjects = [...prev];
      const fan = newObjects[selectedObject].fans.find(f => f.id === selectedFan.id);
      fan.status = !fan.status;
      addLog(fan.id, fan.status ? 'Вентилятор включен' : 'Вентилятор выключен');
      setSelectedFan({ ...fan });
      return newObjects;
    });
  };

  const handleSpeedChange = (fanId, logMessage, newSpeed) => {
    if (logMessage) {
      addLog(fanId, logMessage);
    }
    
    if (newSpeed !== undefined) {
      setObjects(prev => {
        const newObjects = [...prev];
        const fan = newObjects[selectedObject].fans.find(f => f.id === fanId);
        fan.speed = newSpeed;
        setSelectedFan({ ...fan });
        return newObjects;
      });
    }
  };

  const handleThresholdChange = (fanId, logMessage, newThreshold) => {
    if (logMessage) {
      addLog(fanId, logMessage);
    }
    
    if (newThreshold !== undefined) {
      setTempThresholds(prev => ({
        ...prev,
        [fanId]: newThreshold
      }));
    }
  };

  const currentObject = objects[selectedObject];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Система вентиляции и мониторинга</h1>

        <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-700">
          <div className="flex gap-2 flex-wrap">
            {objects.map((obj, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedObject(idx)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedObject === idx
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {obj.id}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">{currentObject.id}</h2>
          <div className="flex justify-center">
            {selectedObject === 0 ? (
              <Room1Schema
                fans={currentObject.fans}
                cameras={currentObject.cameras}
                onFanClick={setSelectedFan}
                onCameraClick={() => setShowCamera(true)}
              />
            ) : (
              <Room2Schema
                fans={currentObject.fans}
                cameras={currentObject.cameras}
                onFanClick={setSelectedFan}
                onCameraClick={() => setShowCamera(true)}
              />
            )}
          </div>
        </div>
      </div>

      {selectedFan && (
        <FanModal
          fan={selectedFan}
          onClose={() => setSelectedFan(null)}
          onToggle={handleFanToggle}
          onSpeedChange={handleSpeedChange}
          logs={logs}
          tempThreshold={tempThresholds[selectedFan.id]}
          onThresholdChange={handleThresholdChange}
        />
      )}

      {showCamera && <CameraModal onClose={() => setShowCamera(false)} />}
    </div>
  );
}
