import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KPICards from './components/KPICards';
import SurveyTrend from './components/SurveyTrend';
import WaterSourceChart from './components/WaterSourceChart';
import WaterQualityChart from './components/WaterQualityChart';
import GeographicSummary from './components/GeographicSummary';
import SurveyMap from './components/SurveyMap';
import SurveyTable from './components/SurveyTable';
import SurveyDetailsModal from './components/SurveyDetailsModal';
import { waterSurveyService } from './services/waterSurveyService';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState({
    province: '',
    district: '',
    waterSource: '',
    status: ''
  });

  const loadData = async () => {
    setIsRefreshing(true);
    const { data, isConnected: connected } = await waterSurveyService.fetchSurveys(filters);
    setSurveys(data);
    setIsConnected(connected);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const availableOptions = useMemo(() => {
    const provinces = Array.from(new Set(surveys.map(s => s.province))).filter(Boolean);
    const districts = Array.from(new Set(surveys.map(s => s.district))).filter(Boolean);
    const waterSources = Array.from(new Set(surveys.map(s => s.water_source))).filter(Boolean);
    return { provinces, districts, waterSources };
  }, [surveys]);

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isConnected={isConnected} />
      
      <div className="main-wrapper">
        <Header onRefresh={loadData} isRefreshing={isRefreshing} />
        
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          availableOptions={availableOptions}
          onReset={() => setFilters({ province: '', district: '', waterSource: '', status: '' })}
        />

        <main className="dashboard-content">
          {/* Dashboard Tab: Show full overview */}
          {activeTab === 'dashboard' && (
            <>
              <KPICards data={surveys} />
              <div className="grid-two-col">
                <SurveyTrend data={surveys} />
                <WaterSourceChart data={surveys} />
              </div>
              <div className="grid-equal-col">
                <WaterQualityChart data={surveys} />
                <GeographicSummary data={surveys} />
              </div>
              <SurveyMap data={surveys} onSelectRecord={setSelectedRecord} />
              <SurveyTable data={surveys} onSelectRecord={setSelectedRecord} />
            </>
          )}

          {/* Survey Data Tab */}
          {activeTab === 'survey-data' && (
            <SurveyTable data={surveys} onSelectRecord={setSelectedRecord} />
          )}

          {/* GIS Map Tab */}
          {activeTab === 'gis-map' && (
            <SurveyMap data={surveys} onSelectRecord={setSelectedRecord} />
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <>
              <KPICards data={surveys} />
              <div className="grid-two-col">
                <SurveyTrend data={surveys} />
                <WaterSourceChart data={surveys} />
              </div>
              <div className="grid-equal-col">
                <WaterQualityChart data={surveys} />
                <GeographicSummary data={surveys} />
              </div>
            </>
          )}
        </main>
      </div>

      <SurveyDetailsModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}